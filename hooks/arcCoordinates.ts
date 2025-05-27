import { Connector } from "relatives-tree/lib/types";

/**
 * Tipo que representa as coordenadas calculadas para o início e fim de um arco de transição entre conectores.
 *
 * - arcStartX: Coordenada X do ponto inicial do arco (normalmente o final do conector anterior)
 * - arcStartY: Coordenada Y do ponto inicial do arco (normalmente o final do conector anterior)
 * - arcEndX: Coordenada X do ponto final do arco (normalmente o início do conector atual)
 * - arcEndY: Coordenada Y do ponto final do arco (normalmente o início do conector atual)
 */
type ArchCoordinatesResult = {
    arcStartX: number;
    arcStartY: number;
    arcEndX: number;
    arcEndY: number;
}

/**
 * Calcula as coordenadas dos pontos inicial e final de um arco de transição
 * entre um conector horizontal (anterior) e um vertical (atual).
 *
 * @param curr - Conector atual (normalmente vertical)
 * @param rel - Conector relacionado (normalmente horizontal, anterior)
 * @param X - Fator de escala para converter coordenadas lógicas em pixels (padrão: 20)
 * @param pad - Espaço de padding para afastar o início/fim do arco dos nós (padrão: 20)
 * @returns ArchCoordinatesResult - Objeto com as coordenadas do início e fim do arco
 *
 */
function getArcHVCoordinates(
    curr: Connector,
    rel: Connector,
    X: number = 20,
    pad: number = 20
): ArchCoordinatesResult {
    const [curr_x1, curr_y1,, curr_y2] = curr;
    const [rel_x1,, rel_x2, rel_y2] = rel;

    // true se o conector anterior vai para a direita
    const relGoesRight = rel_x2 > rel_x1;

    // true se o conector atual vai para baixo
    const currGoesDown = curr_y2 > curr_y1;

    // X do final do conector anterior, ajustado pelo padding
    const arcStartX = (rel_x2 * X) + (relGoesRight ? -pad : pad);

    // Y do final do conector anterior
    const arcStartY = rel_y2 * X;

    // X do início do conector atual
    const arcEndX = curr_x1 * X;

    // Y do início do conector atual, ajustado pelo padding
    const arcEndY = (curr_y1 * X) + (currGoesDown ? pad : -pad);

    return {
        arcStartX,
        arcStartY,
        arcEndX,
        arcEndY
    }
}

/**
 * Calcula as coordenadas dos pontos inicial e final de um arco de transição
 * entre um conector vertical (anterior) e um horizontal (atual).
 *
 * @param curr - Conector atual (normalmente horizontal)
 * @param rel - Conector relacionado (normalmente vertical, anterior)
 * @param X - Fator de escala para converter coordenadas lógicas em pixels (padrão: 20)
 * @param pad - Espaço de padding para afastar o início/fim do arco dos nós (padrão: 20)
 * @returns ArchCoordinatesResult - Objeto com as coordenadas do início e fim do arco
 *
 */
function getArcVHCoordinates(
    curr: Connector,
    rel: Connector,
    X: number = 20,
    pad: number = 20
): ArchCoordinatesResult {
    const [curr_x1, curr_y1, curr_x2] = curr;
    const [, rel_y1, rel_x2, rel_y2] = rel;

    // true se o conector anterior vai para baixo
    const relGoesDown = rel_y2 > rel_y1;

    // true se o conector atual vai para a direita
    const currGoesRight = curr_x2 > curr_x1;

    // X do final do conector anterior
    const arcStartX = rel_x2 * X;

    // Y do final do conector anterior, ajustado pelo padding
    const arcStartY = (rel_y2 * X) + (relGoesDown ? -pad : pad);

    // X do início do conector atual, ajustado pelo padding
    const arcEndX = (curr_x1 * X) + (currGoesRight ? pad : -pad);

    // Y do início do conector atual
    const arcEndY = curr_y1 * X;

    return {
        arcStartX,
        arcStartY,
        arcEndX,
        arcEndY
    }
}

export { getArcHVCoordinates, getArcVHCoordinates };
