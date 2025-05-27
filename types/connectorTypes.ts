import { Connector } from "relatives-tree/lib/types";

/**
 * Tipo que representa o resultado da busca por um conector anterior.
 * - previousConnector: O conector anterior encontrado (ou undefined se não houver).
 * - previousConnectorIsSibling: Indica se o conector anterior é um "irmão" (compartilha o mesmo ponto inicial).
 */
type PreviousConnectorResult = {
  previousConnector: Connector | undefined;
  previousConnectorIsSibling: boolean;
};

/**
 * Tipo que representa o resultado da busca por um conector seguinte.
 * - nextConnector: O próximo conector encontrado (ou undefined se não houver).
 * - nextConnectorIsSibling: Indica se o próximo conector é um "irmão" (compartilha o mesmo ponto final).
 */
type NextConnectorResult = {
  nextConnector: Connector | undefined;
  nextConnectorIsSibling: boolean;
};

/**
 * Tipo que representa os mapas de conectores por ponto inicial e final.
 * - startsMap: Mapa de conectores indexados pelo ponto inicial.
 * - endsMap: Mapa de conectores indexados pelo ponto final.
 */
type ConnectorMapsResult = {
  startsMap: Map<string, Connector[]>;
  endsMap: Map<string, Connector[]>;
};

/**
 * Tipo que representa o resultado do processamento de todos os conectores.
 * - linePath: Caminho da linha resultante.
 * - archAfterPath: Arco de Bezier após a linha (pode ser null se não houver).
 * - arcBeforePath: Arco de Bezier antes da linha (pode ser null se não houver).
 * - color: Cor do conector.
 */
type ProcessedConnectorResult = {
  linePath: string;
  arcAfterPath: string | null;
  arcBeforePath: string | null;
  color: string;
  idx: number;
};

export type {
    ConnectorMapsResult, NextConnectorResult, PreviousConnectorResult, ProcessedConnectorResult
};
