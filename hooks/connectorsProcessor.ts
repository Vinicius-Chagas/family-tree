import { ConnectorMapsResult, NextConnectorResult, PreviousConnectorResult, ProcessedConnectorResult } from "@/types/connectorTypes";
import { Connector } from "relatives-tree/lib/types";
import { getArcHVCoordinates, getArcVHCoordinates } from "./arcCoordinates";
import { quarterBezier } from "./quarterBezier";

class ConnectorProcessor {
  private connectors: Connector[];
  private pad: number;
  private X: number;
  private startsMap: Map<string, Connector[]>;
  private endsMap: Map<string, Connector[]>;

  constructor(connectors: Connector[], pad: number = 20, X: number = 20) {
    this.connectors = connectors;
    this.pad = pad;
    this.X = X;
    const { startsMap, endsMap } = this.createConnectorMaps(connectors);
    this.startsMap = startsMap;
    this.endsMap = endsMap;
  }

  /**
   * Processa todos os conectores fornecidos, convertendo cada um em um caminho SVG composto por linha e possíveis arcos de ligação.
   * Para cada conector, determina se há um conector anterior ou posterior (e se são "irmãos"), processando os arcos de entrada e saída conforme necessário.
   * Retorna um array de objetos contendo os caminhos SVG resultantes e informações de cor.
   * 
   * @returns Um array de objetos com os caminhos SVG (linha, arco anterior, arco posterior) e cor.
   */
  public processConnectors(): ProcessedConnectorResult[] {
    return this.connectors.map((currentConnector, idx) => {
      const { previousConnector, previousConnectorIsSibling } = this.findPreviousConnector(currentConnector);
      const { arcBeforePath, startX, startY } = this.processArcBefore(
        currentConnector,
        previousConnector,
        previousConnectorIsSibling
      );

      const { nextConnector, nextConnectorIsSibling } = this.findNextConnector(currentConnector);
      const { arcAfterPath, endX, endY } = this.processArcAfter(
        currentConnector,
        nextConnector,
        nextConnectorIsSibling
      );

      const linePath = `M ${startX},${startY} L ${endX},${endY}`;

      this.logResults(idx, currentConnector, { previousConnector, previousConnectorIsSibling }, { nextConnector, nextConnectorIsSibling }, false);

      return {
        linePath,
        arcAfterPath,
        arcBeforePath,
        color: 'black',
        idx
      };
    });
  }

  /**
   * Busca o conector anterior ao conector atual, ou seja, aquele que termina no mesmo ponto onde o atual começa.
   * Se não encontrar, tenta buscar um "irmão" (outro conector que começa no mesmo ponto).
   * @param currentConnector - O conector atual
   * @returns Um objeto com o conector anterior (ou undefined) e se ele é um irmão
   */
  private findPreviousConnector(currentConnector: Connector): PreviousConnectorResult {
    const [x1, y1] = currentConnector;
    const k = this.key(x1, y1);

    const truePreviousConnector = this.endsMap.get(k)?.find(c => c !== currentConnector);
    const siblingAsPrevious = this.startsMap.get(k)?.find(c => c !== currentConnector);

    const previousConnector = truePreviousConnector ?? siblingAsPrevious;
    const previousConnectorIsSibling = !truePreviousConnector && (previousConnector === siblingAsPrevious);

    return { previousConnector, previousConnectorIsSibling };
  }

  /**
   * Busca o próximo conector ao conector atual, ou seja, aquele que começa no mesmo ponto onde o atual termina.
   * Se não encontrar, tenta buscar um "irmão" (outro conector que termina no mesmo ponto).
   * @param currentConnector - O conector atual
   * @returns Um objeto com o próximo conector (ou undefined) e se ele é um irmão
   */
  private findNextConnector(currentConnector: Connector): NextConnectorResult {
    const [,, x2, y2] = currentConnector;
    const k = this.key(x2, y2);

    const trueNextConnector = this.startsMap.get(k)?.find(c => c !== currentConnector);
    const siblingAsNext = this.endsMap.get(k)?.find(c => c !== currentConnector);

    const nextConnector = trueNextConnector ?? siblingAsNext;
    const nextConnectorIsSibling = !trueNextConnector && (nextConnector === siblingAsNext);

    return { nextConnector, nextConnectorIsSibling };
  }

  /**
   * Função utilitária para logar resultados de debug.
   */
  private logResults(
    idx: number,
    currentConnector: Connector,
    previousConnector: PreviousConnectorResult,
    nextConnector: NextConnectorResult,
    active: boolean = false
  ) {
    if (!active) return;
    console.log(`Current Connector ${idx}:`, currentConnector);
    console.log(`Previous Connector:`, previousConnector.previousConnector, `Is Sibling:`, previousConnector.previousConnectorIsSibling);
    console.log(`Next Connector:`, nextConnector.nextConnector, `Is Sibling:`, nextConnector.nextConnectorIsSibling);
    console.log('\n\n\n');
  }

  // Métodos privados utilitários e de processamento

  /**
   * Adiciona um conector a um mapa de conectores, agrupando por chave (string).
   * Se a chave já existir, adiciona ao array existente; caso contrário, cria um novo array.
   */
  private pushToMap(map: Map<string, Connector[]>, key: string, connector: Connector) {
    const arr = map.get(key);
    if (arr) {
      arr.push(connector);
    } else {
      map.set(key, [connector]);
    }
  }

  /**
   * Cria e retorna dois mapas a partir da lista de conectores:
   * - startsMap: conecta cada ponto inicial (x, y) a todos os conectores que começam nesse ponto.
   * - endsMap: conecta cada ponto final (x, y) a todos os conectores que terminam nesse ponto.
   * 
   * Esses mapas permitem buscas rápidas para encontrar conectores que compartilham pontos de início ou fim,
   * facilitando a identificação de conexões e "irmãos" em estruturas de árvore.
   * 
   * @param connectors Lista de conectores a serem mapeados.
   * @returns Um objeto contendo startsMap e endsMap.
   */
  private createConnectorMaps(connectors: Connector[]): ConnectorMapsResult {
    const startsMap: Map<string, Connector[]> = new Map();
    const endsMap: Map<string, Connector[]> = new Map();

    connectors.forEach((connector) => {
      this.pushToMap(startsMap, this.key(connector[0], connector[1]), connector);
      this.pushToMap(endsMap, this.key(connector[2], connector[3]), connector);
    });

    return { startsMap, endsMap };
  }

  /**
   * Gera uma chave string a partir de coordenadas x, y.
   */
  private key(x: number, y: number): string {
    return `${x},${y}`;
  }

  /**
   * Processa o arco de entrada (antes) de um conector, determinando se deve ser desenhado um arco de ligação entre o conector anterior e o atual.
   * O tipo de arco (horizontal-vertical ou vertical-horizontal) e o ponto inicial do caminho dependem da relação entre os conectores e se são "irmãos".
   * 
   * @param currentConnector O conector atual a ser processado.
   * @param previousConnector O conector anterior, se houver.
   * @param previousConnectorIsSibling Indica se o conector anterior é um "irmão".
   * @returns Um objeto contendo o caminho SVG do arco (ou null) e as coordenadas iniciais do segmento de linha.
   */
  private processArcBefore(
    currentConnector: Connector,
    previousConnector: Connector | undefined,
    previousConnectorIsSibling: boolean
  ): {
    arcBeforePath: string | null;
    startX: number;
    startY: number;
  } {
    let arcBeforePath: string | null = null;
    let [x1, y1] = currentConnector;
    let startX = x1 * this.X;
    let startY = y1 * this.X;

    if (previousConnector) {
      if (previousConnector[1] === previousConnector[3] && x1 === currentConnector[2]) {
        const HVCoordinates = getArcHVCoordinates(currentConnector, previousConnector, this.X, this.pad);
        if (!previousConnectorIsSibling) {
          arcBeforePath = quarterBezier({ ...HVCoordinates, horizontalFirst: true });
        }
        startX = HVCoordinates.arcEndX;
        startY = HVCoordinates.arcEndY;
      } else if (previousConnector[0] === previousConnector[2] && y1 === currentConnector[3]) {
        const VHCoordinates = getArcVHCoordinates(currentConnector, previousConnector, this.X, this.pad);
        if (previousConnectorIsSibling) {
          arcBeforePath = quarterBezier({ ...VHCoordinates, horizontalFirst: false });
        }
        startX = VHCoordinates.arcEndX;
        startY = VHCoordinates.arcEndY;
      }
    }

    return { arcBeforePath, startX, startY };
  }

  /**
   * Processa o arco de saída (após) de um conector, determinando se deve ser desenhado um arco de ligação entre o conector atual e o próximo.
   * O tipo de arco (horizontal-vertical ou vertical-horizontal) e o ponto final do caminho dependem da relação entre os conectores e se são "irmãos".
   * 
   * @param currentConnector O conector atual a ser processado.
   * @param nextConnector O próximo conector, se houver.
   * @param nextConnectorIsSibling Indica se o próximo conector é um "irmão".
   * @returns Um objeto contendo o caminho SVG do arco (ou null) e as coordenadas finais do segmento de linha.
   */
  private processArcAfter(
    currentConnector: Connector,
    nextConnector: Connector | undefined,
    nextConnectorIsSibling: boolean
  ): {
    arcAfterPath: string | null;
    endX: number;
    endY: number;
  } {
    let [x1, y1, x2, y2] = currentConnector;
    let endX = x2 * this.X;
    let endY = y2 * this.X;
    let arcAfterPath: string | null = null;

    if (nextConnector) {
      if (y1 === y2 && nextConnector[0] === nextConnector[2]) {
        const HVCoordinates = getArcHVCoordinates(nextConnector, currentConnector, this.X, this.pad);
        if (nextConnectorIsSibling) {
          arcAfterPath = quarterBezier({ ...HVCoordinates, horizontalFirst: true });
        }
        endX = HVCoordinates.arcStartX;
        endY = HVCoordinates.arcStartY;
      } else if (x1 === x2 && nextConnector[1] === nextConnector[3]) {
        const VHCoordinates = getArcVHCoordinates(nextConnector, currentConnector, this.X, this.pad);
        if (!nextConnectorIsSibling) {
          arcAfterPath = quarterBezier({ ...VHCoordinates, horizontalFirst: false });
        }
        endX = VHCoordinates.arcStartX;
        endY = VHCoordinates.arcStartY;
      }
    }

    return { arcAfterPath, endX, endY };
  }
}

export { ConnectorProcessor };

