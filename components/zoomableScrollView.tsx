import { applyBoundaryConstraints } from '@/hooks/bondaryConstraints';
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

const ZoomableScrollView = ({
  children,
  minScale = 1,
  maxScale = 2.5,
  contentWidth,
  contentHeight,
  containerStyle,
  wrapperStyle,
}: {children: ReactNode, contentWidth: number,
  contentHeight: number, minScale?: number, maxScale?: number, containerStyle?: ViewStyle, wrapperStyle?: ViewStyle}) => {

  const [{viewportWidth, viewportHeight}, setParentSize] = useState({ viewportWidth: 0, viewportHeight: 0 });

  const scale = useSharedValue(minScale);
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);

  const savedScale = useSharedValue(minScale);
  const savedTranslationX = useSharedValue(0);
  const savedTranslationY = useSharedValue(0);


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
      applyBoundaryConstraints(scale, contentWidth, contentHeight, viewportWidth, viewportHeight, translationX, translationY);
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
      style={[styles.container]}
      onLayout={event => {
        const { width, height } = event.nativeEvent.layout;
        setParentSize({ viewportWidth:width, viewportHeight:height });
      }}
    >
    <GestureDetector gesture={composedGesture}>
      <View style={[styles.container, containerStyle]}>
        <Animated.View style={[styles.content, animatedStyle]}>
            <View style={wrapperStyle ?? styles.contentWrapper}>
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
  contentWrapper: {
    flex: 1,

  },
});

export { ZoomableScrollView };
