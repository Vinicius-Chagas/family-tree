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
 * @returns String do caminho SVG para a curva Bézier
 */
function quarterBezier(
    props:QuarterBezierProps   
) {
    const {arcStartX, arcStartY, arcEndX, arcEndY, horizontalFirst, curveIntensity = 20} = props;
    if (horizontalFirst) {
        // Curva H -> V: Ponto de controle 1 na horizontal, Ponto de controle 2 na vertical
        return `M ${arcStartX},${arcStartY} C ${arcStartX + Math.sign(arcEndX - arcStartX) * curveIntensity},${arcStartY} ${arcEndX},${arcEndY - Math.sign(arcEndY - arcStartY) * curveIntensity} ${arcEndX},${arcEndY}`;
    } else {
        // Curva V -> H: Ponto de controle 1 na vertical, Ponto de controle 2 na horizontal
        return `M ${arcStartX},${arcStartY} C ${arcStartX},${arcStartY + Math.sign(arcEndY - arcStartY) * curveIntensity} ${arcEndX - Math.sign(arcEndX - arcStartX) * curveIntensity},${arcEndY} ${arcEndX},${arcEndY}`;
    }
}

export { quarterBezier };
