import { SharedValue, withSpring } from "react-native-reanimated";

/**
 * Calcula os limites de translação (panning) para um eixo (X ou Y),
 * garantindo que o conteúdo não ultrapasse excessivamente as bordas do viewport,
 * mesmo durante o zoom.
 *
 * @param scaledContentDim Dimensão do conteúdo já escalado (largura ou altura)
 * @param viewportDim Dimensão do viewport (largura ou altura)
 * @param currentTranslationValue Valor atual da translação (X ou Y)
 * @param currentScaleValue Valor atual do zoom (escala)
 * @returns O valor de translação ajustado para respeitar os limites
 */
function calculateAxisBoundary(
  scaledContentDim: number,
  viewportDim: number,
  currentTranslationValue: number,
  currentScaleValue: number,
) {
  'worklet';
  // Tolerância visual base (10% do viewport)
  const baseVisualTolerance = viewportDim * 0.1;
  // Multiplicador máximo de tolerância
  const userBaseToleranceMultiplier = 1.5;
  // Fator dinâmico baseado na razão entre conteúdo e viewport
  const dynamicFactor = Math.max(1.0, scaledContentDim / viewportDim);
  // Fator final de tolerância (limitado pelo multiplicador)
  const finalToleranceFactor = Math.min(userBaseToleranceMultiplier, dynamicFactor);
  // Tolerância visual efetiva
  const effectiveVisualTolerance = baseVisualTolerance * finalToleranceFactor;
  // Fator de estabilização para suavizar o movimento durante o zoom
  const userStabilizationFactor = Math.max(1, ((currentScaleValue / 10) + 0.9));

  let minT, maxT;
  if (scaledContentDim <= viewportDim) {
    // Se o conteúdo for menor que o viewport, permite um leve deslocamento
    minT = -effectiveVisualTolerance / currentScaleValue;
    maxT = (viewportDim - scaledContentDim + effectiveVisualTolerance) / currentScaleValue;
  } else {
    // Se o conteúdo for maior, limita o quanto pode ser arrastado para fora
    minT = (viewportDim - scaledContentDim - effectiveVisualTolerance) / (currentScaleValue * userStabilizationFactor);
    maxT = effectiveVisualTolerance * currentScaleValue;
  }
  // Garante que a translação fique dentro dos limites calculados
  return Math.max(minT, Math.min(maxT, currentTranslationValue));
}

/**
 * Aplica as restrições de limite (boundary constraints) nos valores de translação X e Y,
 * utilizando animação com spring caso estejam fora dos limites.
 *
 * @param scale Valor compartilhado da escala (zoom)
 * @param contentWidth Largura do conteúdo original
 * @param contentHeight Altura do conteúdo original
 * @param viewportWidth Largura do viewport
 * @param viewportHeight Altura do viewport
 * @param translationX Valor compartilhado da translação X
 * @param translationY Valor compartilhado da translação Y
 */
function applyBoundaryConstraints(
  scale: SharedValue<number>,
  contentWidth: number,
  contentHeight: number,
  viewportWidth: number,
  viewportHeight: number,
  translationX: SharedValue<number>,
  translationY: SharedValue<number>
) {
    'worklet';
    // Calcula a escala atual e as dimensões do conteúdo já escalado
    const currentScale = scale.value;
    const scaledContentWidth = contentWidth * currentScale;
    const scaledContentHeight = contentHeight * currentScale;

    // Calcula o valor de translação X ajustado
    const targetX = calculateAxisBoundary(
        scaledContentWidth,
        viewportWidth,
        translationX.value,
        currentScale,
    );

    // Calcula o valor de translação Y ajustado
    const targetY = calculateAxisBoundary(
        scaledContentHeight,
        viewportHeight,
        translationY.value,
        currentScale,
    );

    // Se necessário, aplica animação para ajustar X dentro dos limites
    if (targetX !== translationX.value) {
        translationX.value = withSpring(targetX, { damping: 20, stiffness: 150 });
    }
    // Se necessário, aplica animação para ajustar Y dentro dos limites
    if (targetY !== translationY.value) {
        translationY.value = withSpring(targetY, { damping: 20, stiffness: 150 });
    }
};

export { applyBoundaryConstraints };
