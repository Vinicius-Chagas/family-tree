type QuarterBezierProps = {
    arcStartX: number, 
    arcStartY: number,
    arcEndX: number, 
    arcEndY: number,
    horizontalFirst: boolean,
    curveIntensity?: number
}

/**
 * Função para criar uma curva Bézier de um quarto de círculo (aproximada).
 * @param arcStartX - Coordenada X do ponto inicial da curva
 * @param arcStartY - Coordenada Y do ponto inicial da curva
 * @param arcEndX - Coordenada X do ponto final da curva
 * @param arcEndY - Coordenada Y do ponto final da curva
 * @param horizontalFirst - true: curva de H para V; false: curva de V para H
 * @param curveIntensity - Intensidade da curva (padrão é 0.5)
 * @returns String do caminho SVG para a curva Bézier
 */
function quarterBezier(
    props:QuarterBezierProps   
) {
    const {arcStartX, arcStartY, arcEndX, arcEndY, horizontalFirst, curveIntensity = 0.5} = props;
    // Calcular a distância entre os pontos de início e fim
    const dx = arcEndX - arcStartX;
    const dy = arcEndY - arcStartY;

    // Usar a menor distância dos exitos para um quarto de curva
    const baseDistance = horizontalFirst ? Math.abs(dx) : Math.abs(dy);
    const intensity = baseDistance * curveIntensity;

    if (horizontalFirst) {
        return `M ${arcStartX},${arcStartY} C ${arcStartX + Math.sign(dx) * intensity},${arcStartY} ${arcEndX},${arcEndY - Math.sign(dy) * intensity} ${arcEndX},${arcEndY}`;
    } else {
        return `M ${arcStartX},${arcStartY} C ${arcStartX},${arcStartY + Math.sign(dy) * intensity} ${arcEndX - Math.sign(dx) * intensity},${arcEndY} ${arcEndX},${arcEndY}`;
    }
}

export { quarterBezier };
