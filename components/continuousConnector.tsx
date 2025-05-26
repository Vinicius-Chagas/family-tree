import { X } from '@/constants/consts'; // Supondo que X seja um fator de escala numérico
import React from 'react';
import Svg, { Path, Text } from 'react-native-svg';
import { Connector } from 'relatives-tree/lib/types'; // Connector é [number, number, number, number]

interface Props {
  connectors: Array<Connector>;
}

// const linkIconPath = "M-6,0a3,3 0 1,0 12,0a3,3 0 1,0 -12,0M-2,0h4"; // Não utilizado no código fornecido
// const iconSize = 6; // Não utilizado no código fornecido

const COLORS = [
  '#e6194b', '#3cb44b', '#ffe119', '#4363d8', '#f58231',
  '#911eb4', '#46f0f0', '#f032e6', '#bcf60c', '#fabebe'
];

export default React.memo<Props>(function Connectors({ connectors }) {
    const r = 10; // Raio da curva (usado como referência no comentário, mas `pad` é usado nos cálculos)
    const pad = 20; // Padding para encurtar linhas antes/depois das curvas. Idealmente, pad = r.
    const curveIntensity = 15; // Intensidade da curva Bézier (quão "longe" os pontos de controle estão)

    const key = (x: number, y: number) => `${x},${y}`;

    // Mapas para encontrar conectores por seus pontos de início ou fim
    const startsMap: Map<string, Connector[]> = new Map();
    const endsMap: Map<string, Connector[]> = new Map();

    connectors.forEach((connector) => {
        const startK = key(connector[0], connector[1]);
        const endK = key(connector[2], connector[3]);
        if (!startsMap.has(startK)) startsMap.set(startK, []);
        if (!endsMap.has(endK)) endsMap.set(endK, []);
        startsMap.get(startK)!.push(connector);
        endsMap.get(endK)!.push(connector);
    });

    /**
     * Função para criar uma curva Bézier de um quarto de círculo (aproximada).
     * @param x0 - Coordenada X do ponto inicial da curva
     * @param y0 - Coordenada Y do ponto inicial da curva
     * @param x1 - Coordenada X do ponto final da curva
     * @param y1 - Coordenada Y do ponto final da curva
     * @param horizontalFirst - true: curva de H para V; false: curva de V para H
     * @returns String do caminho SVG para a curva Bézier
     */
    function quarterBezier(
        x0: number, y0: number,
        x1: number, y1: number,
        horizontalFirst: boolean
    ) {
        if (horizontalFirst) {
            // Curva H -> V: Ponto de controle 1 na horizontal, Ponto de controle 2 na vertical
            return `M ${x0},${y0} C ${x0 + Math.sign(x1 - x0) * curveIntensity},${y0} ${x1},${y1 - Math.sign(y1 - y0) * curveIntensity} ${x1},${y1}`;
        } else {
            // Curva V -> H: Ponto de controle 1 na vertical, Ponto de controle 2 na horizontal
            return `M ${x0},${y0} C ${x0},${y0 + Math.sign(y1 - y0) * curveIntensity} ${x1 - Math.sign(x1 - x0) * curveIntensity},${y1} ${x1},${y1}`;
        }
    }

    const processedConnectors = connectors.map((currentConnector, idx) => {
        const [x1, y1, x2, y2] = currentConnector; // Coordenadas lógicas do conector atual

        // Converter coordenadas lógicas para pixels
        const x1p = x1 * X, y1p = y1 * X; // Ponto inicial em pixels
        const x2p = x2 * X, y2p = y2 * X; // Ponto final em pixels

        // Coordenadas iniciais e finais da linha principal (podem ser ajustadas por arcos)
        let currentLineStartX = x1p;
        let currentLineStartY = y1p;
        let currentLineEndX = x2p;
        let currentLineEndY = y2p;

        let arcBeforePath: string | null = null;
        let arcAfterPath: string | null = null;

        // ===== PROCESSAR ARCO ANTES DA LINHA ATUAL (arcBeforePath) =====
        // Encontrar o conector que TERMINA no ponto inicial do conector atual
       
        // Get all connectors that start at (x1, y1), but not the current one
      
        // Prioritize true predecessors (connector ends where current starts)
        const truePreviousConnector = endsMap.get(key(x1, y1))?.filter(c => c !== currentConnector)?.[0];
        // Fallback to sibling (connector starts where current starts)
        const siblingAsPrevious = startsMap.get(key(x1, y1))?.filter(c => c !== currentConnector)?.[0];

        const previousConnector = truePreviousConnector ?? siblingAsPrevious;
        // Flag to identify if the chosen previousConnector is a sibling (shares start point with current)
        const previousConnectorIsSibling = !truePreviousConnector && (previousConnector === siblingAsPrevious);

         if (previousConnector) {
            const [prev_x1, prev_y1, prev_x2, prev_y2] = previousConnector; // Coords do conector anterior
            // prev_x2 é x1, prev_y2 é y1

            // CASO 1: Conector ANTERIOR é HORIZONTAL, conector ATUAL é VERTICAL
            if (prev_y1 === prev_y2 && x1 === x2) {

                const prevGoesRight = prev_x2 > prev_x1; // Anterior foi para a direita?
                const currGoesDown = y2 > y1;    // Atual vai para baixo?

                // Ponto final ajustado do conector anterior (início do arco)
                const arcStartX = (prev_x2 * X) + (prevGoesRight ? -pad : pad);
                const arcStartY = prev_y2 * X;

                // Ponto inicial ajustado do conector atual (fim do arco)
                const arcEndX = x1 * X;
                const arcEndY = (y1 * X) + (currGoesDown ? pad : -pad);
                
                if (previousConnectorIsSibling) {
                     arcBeforePath = null; 
                } else {
                arcBeforePath = quarterBezier(arcStartX, arcStartY, arcEndX, arcEndY, true);
                }
                // Atualizar o ponto inicial da linha atual para o final do arco
                currentLineStartX = arcEndX;
                currentLineStartY = arcEndY;
                
            }
            // CASO 2: Conector ANTERIOR é VERTICAL, conector ATUAL é HORIZONTAL
            else if (prev_x1 === prev_x2 && y1 === y2) {
                const prevGoesDown = prev_y2 > prev_y1; // Anterior foi para baixo?
                const currGoesRight = x2 > x1;   // Atual vai para a direita?

                // Ponto final ajustado do conector anterior (início do arco)
                const arcStartX = prev_x2 * X;
                const arcStartY = (prev_y2 * X) + (prevGoesDown ? -pad : pad);
                
                // Ponto inicial ajustado do conector atual (fim do arco)
                const arcEndX = (x1 * X) + (currGoesRight ? pad : -pad);
                const arcEndY = y1 * X;

                arcBeforePath = quarterBezier(arcStartX, arcStartY, arcEndX, arcEndY, false);
                
                currentLineStartX = arcEndX;
                currentLineStartY = arcEndY;
            }
        }

        // ===== PROCESSAR ARCO DEPOIS DA LINHA ATUAL (arcAfterPath) =====
        const trueNextConnector = startsMap.get(key(x2, y2))?.filter(c => c !== currentConnector)?.[0];
        // Sibling next: connector ENDS where current ENDS (converging T-junction or shared endpoint)
        const siblingAsNext = endsMap.get(key(x2, y2))?.filter(c => c !== currentConnector)?.[0];
        
        const nextConnector = trueNextConnector ?? siblingAsNext;
        // nextConnectorIsSibling is true if we chose siblingAsNext (i.e., trueNextConnector was null)
        const nextConnectorIsSibling = !trueNextConnector && (nextConnector === siblingAsNext);

        if (nextConnector) {
            const [next_x1, next_y1, next_x2, next_y2] = nextConnector; // Coords do próximo conector
            // next_x1 é x2, next_y1 é y2

            // CASO 1: Conector ATUAL é HORIZONTAL, PRÓXIMO conector é VERTICAL
            if (y1 === y2 && next_x1 === next_x2) {
                const currGoesRight = x2 > x1;    // Atual vai para a direita?
                const nextGoesDown = next_y2 > next_y1; // Próximo vai para baixo?

                // Ponto final ajustado do conector atual (início do arco)
                const arcStartX = (x2 * X) + (currGoesRight ? -pad : pad);
                const arcStartY = y2 * X;

                // Ponto inicial ajustado do próximo conector (fim do arco)
                const arcEndX = next_x1 * X;
                const arcEndY = (next_y1 * X) + (nextGoesDown ? pad : -pad);
                
                if (!nextConnectorIsSibling) {
                    // Current H (bar), Next (sibling, ends at same point) V (stem).
                    // Avoid arc from bar.end to stem.start.
                    arcAfterPath = null;
                    // Do NOT update currentLineEnd if no arc is drawn
                } else {
                arcAfterPath = quarterBezier(arcStartX, arcStartY, arcEndX, arcEndY, true);
                }
                // Atualizar o ponto final da linha atual para o início do arco
                currentLineEndX = arcStartX;
                currentLineEndY = arcStartY;
            }
            // CASO 2: Conector ATUAL é VERTICAL, PRÓXIMO conector é HORIZONTAL
            else if (x1 === x2 && next_y1 === next_y2) {
                const currGoesDown = y2 > y1;      // Atual vai para baixo?
                const nextGoesRight = next_x2 > next_x1;   // Próximo vai para a direita?

                // Ponto final ajustado do conector atual (início do arco)
                const arcStartX = x2 * X;
                const arcStartY = (y2 * X) + (currGoesDown ? -pad : pad);

                // Ponto inicial ajustado do próximo conector (fim do arco)
                const arcEndX = (next_x1 * X) + (nextGoesRight ? pad : -pad);
                const arcEndY = next_y1 * X;
                
                if (nextConnectorIsSibling) {
                    // Current H (bar), Next (sibling, ends at same point) V (stem).
                    // Avoid arc from bar.end to stem.start.
                    arcAfterPath = null;
                    // Do NOT update currentLineEnd if no arc is drawn
                } else {
                arcAfterPath = quarterBezier(arcStartX, arcStartY, arcEndX, arcEndY, false);
                }
                currentLineEndX = arcStartX;
                currentLineEndY = arcStartY;
            }
        }
        console.log(`Connector ${idx}:`, currentConnector)
        console.log(`Predecessor connector:`, previousConnector);
        console.log(`Successor connector:`, nextConnector);
        console.log( '\n\n\n');

        // Caminho da linha principal (pode ter sido encurtada pelos arcos)
        const linePath = `M ${currentLineStartX},${currentLineStartY} L ${currentLineEndX},${currentLineEndY}`;
        
        return {
            linePath,
            arcAfterPath,
            arcBeforePath,
            color: 'black',
            idx,

        };
    });

    return (
        <Svg
            style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
            }}
        >
            {processedConnectors.map(({ linePath, arcAfterPath, arcBeforePath, color, idx }) =>{
                console.log(`Rendering connector ${idx}:`,'\n'+ linePath,'\n'+ arcAfterPath,'\n'+ arcBeforePath);
                return (
                <React.Fragment key={`conn-group-${idx}`}>
                    {/* Linha principal do conector */}
                    <Path
                        d={linePath}
                        fill="none"
                        stroke={'black'}
                        strokeWidth={4}
                        strokeLinecap="round"
                    />
                    {/* Arco antes da linha (se existir) */}
                    {arcBeforePath && (
                        <Path
                            d={arcBeforePath}
                            fill="none"
                            stroke={'#ffe119'} // Mantido como no original, pode ser alterado para `color`
                            strokeWidth={4}
                            strokeLinecap="round"
                        />
                    )}
                    {/* Arco depois da linha (se existir) */}
                    {arcAfterPath && (
                        <Path
                            d={arcAfterPath}
                            fill="none"
                            stroke={'#bcf60c'} // Mantido como no original, pode ser alterado para `color`
                            strokeWidth={4}
                            strokeLinecap="round"
                        />
                    )}
                </React.Fragment>
            )})}
            
            {/* Renderizar números dos conectores */}
            {connectors.map((connector, idx) => {
                const [x1, y1, x2, y2] = connector;
                const x1p = x1 * X, y1p = y1 * X;
                const x2p = x2 * X, y2p = y2 * X;
                
                const midX = (x1p + x2p) / 2;
                const midY = (y1p + y2p) / 2;
                
                return (
                    <Text
                        key={`text-${idx}`}
                        x={midX}
                        y={midY - 5} 
                        fontSize="12"
                        fill={'red'}
                        textAnchor="middle"
                    >
                        {idx}
                    </Text>
                );
            })}
        </Svg>
    );
});