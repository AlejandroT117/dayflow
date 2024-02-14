import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
  EasingStatic,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FlowRow } from "../overrides";
import { COLORS } from "../../variables/styles";

const DOTS_NUMBER = 3;
const SHOWING_INTERVAL = 700;
const HIDING_INTERVAL = 500;

const createAnimation = (
  opacity: Animated.Value,
  toValue: number,
  duration: number,
  easing: (val: number) => number = Easing.ease
) =>
  Animated.timing(opacity, {
    toValue,
    duration,
    easing,
    useNativeDriver: false,
  });

export const LoadingDots = () => {
  const dot1Opacity = useRef(new Animated.Value(0)).current;
  const dot2Opacity = useRef(new Animated.Value(0)).current;
  const dot3Opacity = useRef(new Animated.Value(0)).current;

  const dotsOpacityHash: { [id: number]: Animated.Value } = useMemo(
    () => ({ 1: dot1Opacity, 2: dot2Opacity, 3: dot3Opacity }),
    [dot1Opacity, dot2Opacity, dot3Opacity]
  );

  useEffect(() => {
    const dotShowAnimations = Array.from({ length: DOTS_NUMBER }, (_, i) =>
      createAnimation(dotsOpacityHash[i + 1], 1, SHOWING_INTERVAL)
    );
    const dotHideAnimations = Array.from({ length: DOTS_NUMBER }, (_, i) =>
      createAnimation(dotsOpacityHash[i + 1], 0, HIDING_INTERVAL)
    );

    const sequence = Animated.sequence([
      Animated.stagger(250, dotShowAnimations),
      Animated.delay(300),
      Animated.parallel(dotHideAnimations),
    ]);

    const loop = Animated.loop(sequence);
    loop.start();

    return () => loop.stop();
  }, []);

  return (
    <FlowRow>
      {Array.from({ length: DOTS_NUMBER }, (_, i) => ({
        id: i,
      })).map((val, i) => {
        return (
          <Animated.View
            key={val.id}
            style={{ ...dot, opacity: dotsOpacityHash[i + 1] }}
          />
        );
      })}
    </FlowRow>
  );
};

const { dot } = StyleSheet.create({
  dot: {
    width: 10,
    height: 10,
    borderRadius: 50,
    marginHorizontal: 5,
    backgroundColor: COLORS.white,
  },
});
