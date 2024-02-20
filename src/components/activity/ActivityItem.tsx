import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Animated, PanResponder, Pressable, StyleSheet } from "react-native";
import { Activity } from "../../interfaces/activity.interface";
import { FlowHiglightView, FlowRow, FlowText } from "../overrides";
import { COLORS } from "../../variables/styles";
import { LoadingDots } from "../common/LoadingDots";
import { formatTime } from "../../utils/formatTime";

export const TRESHOLD = 40;
const TAP_DELAY = 350;

interface Props {
  activity: Activity;
  onActivityChange: (id: string, state: boolean) => void;
  onTimeChange: (id: string, time: number) => void;
  onMove: () => void;
  onRelease: () => void;
  onDoubleClick: (activity: Activity) => void;
  controls?: boolean;
}

var id: number | undefined = undefined;

export const ActivityItem: React.FC<Props> = ({
  activity,
  onActivityChange,
  onTimeChange,
  onMove,
  onRelease,
  onDoubleClick,
  controls = true,
}) => {
  const { title, id: activityId, time, isActive } = activity;
  const pan = useRef(new Animated.ValueXY()).current;
  const [currentState, setCurrentState] = useState(isActive);
  const [lastTimePressed, setLastTimePressed] = useState(0);

  useEffect(() => {
    id && clearTimeout(id);
    if (!isActive) {
      id = undefined;
      return;
    }

    id = setTimeout(() => {
      id = undefined;
      onTimeChange(activityId, time + 1);
    }, 1000);
  }, [isActive, time]);

  const panResponder = useMemo(() => {
    if (!controls) {
      return PanResponder.create({});
    }
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (e, gestState) => {
        const currentX = gestState.dx;
        if (Math.abs(currentX) > TRESHOLD / 4) {
          onMove();
        }
        if (currentX > TRESHOLD) {
          setCurrentState(true);
        }

        if (currentX < -TRESHOLD) {
          setCurrentState(false);
        }

        Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        })(e, gestState);
      },
      onPanResponderRelease: () => {
        onRelease();
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
        }).start();
      },
    });
  }, [controls]);

  useEffect(() => {
    if (currentState) {
      onActivityChange(activityId, true);
      return;
    }
    onActivityChange(activityId, false);
  }, [currentState]);

  const itemBg = useMemo(
    () => (isActive ? { backgroundColor: COLORS.semiDarkGray } : {}),
    [isActive]
  );

  const handlePress = useCallback(() => {
    const now = Date.now();
    if (now - lastTimePressed <= TAP_DELAY) {
      onDoubleClick(activity);
    }
    setLastTimePressed(now);
  }, [activity, lastTimePressed]);

  return (
    <Animated.View
      onPointerDown={handlePress}
      onTouchStart={handlePress}
      {...panResponder.panHandlers}
      style={{ transform: [{ translateX: pan.x }] }}
    >
      <FlowHiglightView style={{ ...itemContainer, ...itemBg }}>
        <FlowRow>
          <FlowText
            style={{
              userSelect: "none",
              fontWeight: isActive ? "bold" : "400",
            }}
          >
            {title}
          </FlowText>
          <FlowText
            style={{
              ...timeText,
              userSelect: "none",
              fontVariant: ["tabular-nums"],
            }}
          >
            {isActive ? <LoadingDots /> : formatTime(time)}
          </FlowText>
        </FlowRow>
      </FlowHiglightView>
    </Animated.View>
  );
};
const { itemContainer, timeText } = StyleSheet.create({
  itemContainer: {
    marginBottom: 6,
    paddingVertical: 19,
  },
  timeText: {
    color: COLORS.brightGreen,
  },
});
