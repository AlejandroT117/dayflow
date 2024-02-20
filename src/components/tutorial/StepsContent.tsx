import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Animated, Easing, View } from "react-native";
import { FlowText } from "../overrides";
import { ActivityItem, TRESHOLD } from "../activity/ActivityItem";
import { Activity } from "../../interfaces/activity.interface";
import uuid from "react-native-uuid";

interface Props {
  step: number;
}

const tutorialActivity: Activity = {
  id: uuid.v4().toString(),
  title: "Preview",
  description: "You can add a description for your activity",
  isActive: false,
  time: 0,
};

const demoAction = () => {};

export const StepsContent: React.FC<Props> = ({ step }) => {
  const directionPx = useMemo(() => ({ 0: 150, 1: -150, 2: 0 }[step]), [step]);
  const pan = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const [isActive, setIsActive] = useState(false);

  const animateSwipe = useCallback(() => {
    const swipping = Animated.timing(pan, {
      toValue: directionPx || 0,
      delay: 300,
      duration: 2000,
      easing: Easing.ease,
      useNativeDriver: false,
    });

    const reverse = Animated.timing(pan, {
      toValue: 0,
      delay: 200,
      duration: 400,
      easing: Easing.cubic,
      useNativeDriver: false,
    });

    const sequence = Animated.sequence([swipping, reverse]);

    const loop = Animated.loop(sequence);

    loop.start();

    return loop;
  }, [directionPx, pan]);

  const animateDoubleTap = useCallback(() => {
    const increase = Animated.timing(scale, {
      toValue: 1.05,
      duration: 200,
      useNativeDriver: false,
    });
    const decrease = Animated.timing(scale, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    });
    const sequence = Animated.sequence([
      Animated.delay(1000),
      increase,
      decrease,
      increase,
      decrease,
    ]);
    const loop = Animated.loop(sequence);

    return loop;
  }, []);

  useEffect(() => {
    const animation = animateSwipe();
    const scaling = animateDoubleTap();

    if (step !== 1) {
      setIsActive(false);
      scaling.reset();
    }

    if (step === 1) {
      setIsActive(true);
      scaling.reset();
    }

    if (step === 2) {
      scaling.start();
    }

    pan.addListener(({ value }) => {
      if (value > TRESHOLD) {
        setIsActive(true);
      }

      if (value < -TRESHOLD) {
        setIsActive(false);
      }

      if (!value) {
        setIsActive(step === 1);
      }
    });

    return () => {
      animation.reset();
      scaling.reset();
    };
  }, [step]);

  return (
    <View>
      <View style={{ marginVertical: 12 }}>
        {
          {
            0: <FlowText>To start tracking, swipe right.</FlowText>,
            1: <FlowText>To de-activate tracking, swipe left.</FlowText>,
            2: <FlowText>Double click to see detail.</FlowText>,
          }[step]
        }
      </View>
      <View style={{ marginVertical: 12 }}>
        <Animated.View
          style={{
            transform: [{ translateX: pan }, { scale }],
          }}
        >
          <ActivityItem
            controls={false}
            activity={{ ...tutorialActivity, isActive }}
            onActivityChange={demoAction}
            onDoubleClick={demoAction}
            onMove={demoAction}
            onRelease={demoAction}
            onTimeChange={demoAction}
          />
        </Animated.View>
      </View>
    </View>
  );
};
