import React, { ReactNode, useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import {
    Gesture,
    GestureDetector
} from 'react-native-gesture-handler';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';

const MIN_SCALE = 1;
const MAX_SCALE = 3;

const ZoomableScrollView = ({
  children,
  minScale = MIN_SCALE,
  maxScale = MAX_SCALE,
  contentWidth,
  contentHeight,
  style = {},
  scrollContainerStyle = {},
  verticalScrollContainerStyle = {},
}: {children: ReactNode, contentWidth: number,
  contentHeight: number, minScale?: number, maxScale?: number, style?: ViewStyle, scrollContainerStyle?: ViewStyle, verticalScrollContainerStyle?: ViewStyle}) => {
      const [{viewportWidth, viewportHeight}, setParentSize] = useState({ viewportWidth: 0, viewportHeight: 0 });

  // Shared values for scale and translation
  const scale = useSharedValue(minScale);
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);

  // Store the starting scale and translation for calculations during gestures
  const savedScale = useSharedValue(minScale);
  const savedTranslationX = useSharedValue(0);
  const savedTranslationY = useSharedValue(0);

    const applyBoundaryConstraints = () => {
    'worklet';
    const scaledContentWidth = contentWidth * scale.value;
    const scaledContentHeight = contentHeight * scale.value;

    console.log('scaledContentWidth', scaledContentWidth, 'scaledContentHeight', scaledContentHeight);
    console.log('viewportWidth', viewportWidth, 'viewportHeight', viewportHeight);

    let targetX = translationX.value;
    let targetY = translationY.value;

    const xTolerance = viewportWidth * 0.1;
    const yTolerance = viewportHeight * 0.1;

    let minTx, maxTx;
    if (scaledContentWidth <= viewportWidth) {
      console.log('scaled content width smaller than viewport width');
      minTx = -xTolerance;
      maxTx = viewportWidth - scaledContentWidth + xTolerance;
    } else {
      console.log('scaled content width bigger than viewport width');
      minTx = viewportWidth - scaledContentWidth - xTolerance;
      // max translation: left edge of content can go xTolerance beyond viewport's left edge
      maxTx = xTolerance;
    }
    targetX = Math.max(minTx, Math.min(maxTx, translationX.value));

    let minTy, maxTy;
    if (scaledContentHeight <= viewportHeight) {
    console.log('scaled content height smaller than viewport height');
      minTy = -yTolerance;
      maxTy = viewportHeight - scaledContentHeight + yTolerance;
      console.log('minTy', minTy, 'maxTy', maxTy);
    } else {
    console.log('scalled content width bigger than viewport width');
      minTy = viewportHeight - scaledContentHeight - yTolerance;
      maxTy = yTolerance;
    }
    targetY = Math.max(minTy, Math.min(maxTy, translationY.value));

    // Spring to target if different from current
    if (targetX !== translationX.value) {
      translationX.value = withSpring(targetX, { damping: 20, stiffness: 150 });
    }
    if (targetY !== translationY.value) {
      translationY.value = withSpring(targetY, { damping: 20, stiffness: 150 });
    }
  };

  const pinchGesture = Gesture.Pinch()
    .onBegin(() => {
      savedScale.value = scale.value;
    })
    .onUpdate((event) => {
      const newScale = savedScale.value * event.scale;
      scale.value = Math.min(maxScale, Math.max(minScale, newScale));
    })
    .onEnd(() => {
      if (scale.value < minScale) {
        scale.value = withSpring(minScale);
      }
      else if (scale.value > maxScale) {
        scale.value = withSpring(maxScale);
      }
    });

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      savedTranslationX.value = translationX.value;
      savedTranslationY.value = translationY.value;
    })
    .onUpdate((event) => {
      translationX.value = savedTranslationX.value + event.translationX;
      translationY.value = savedTranslationY.value + event.translationY;
    })
    .onEnd(() => {
      // Apply boundaries after pan ends
      applyBoundaryConstraints();
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translationX.value },
      { translateY: translationY.value },
    ],
  }));

  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  return (
    <View
      style={[styles.container, style]}
      onLayout={event => {
        const { width, height } = event.nativeEvent.layout;
        setParentSize({ viewportWidth:width, viewportHeight:height });
      }}
    >
    // Outermost container, applying styles passed via props and default container styles
    <GestureDetector gesture={composedGesture}>
      {/* Outermost container, applying styles passed via props and default container styles. This is the viewport. */}
      <View style={[styles.container, style]}>
        {/* This Animated.View is the "canvas" that is transformed (scaled and panned).
            Its size is determined by its children. */}
        <Animated.View style={[styles.content, animatedStyle]}>

            <View style={styles.contentWrapper}>
            {children}
            </View>
        </Animated.View>
      </View>
    </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  verticalScrollContainer: {
    flex: 1,
  },
  contentWrapper: {
    flex: 1,

  },
});

export { ZoomableScrollView };
