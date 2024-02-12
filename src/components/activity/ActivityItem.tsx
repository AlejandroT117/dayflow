import React, { useEffect, useRef } from "react";
import { Animated, PanResponder, StyleSheet } from "react-native";
import { Activity } from "../../interfaces/activity.interface";
import { FlowHiglightView, FlowRow, FlowText } from "../overrides";
import { COLORS } from "../../variables/styles";

const TRESHOLD = 60;

interface Props {
  activity: Activity;
  onActivityChange: (id: string,state: boolean) => void;
  onTimeChange: (id: string,time: number) => void;
}
var id: number | undefined = undefined;
export const ActivityItem: React.FC<Props> = ({
  activity,
  onActivityChange,
  onTimeChange,
}) => {
  const { title, id: activityId, time, isActive } = activity;
  const pan = useRef(new Animated.ValueXY()).current;

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

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderMove: (e, gestState) => {
        console.log(gestState.dx);
        const currentX = gestState.dx;
        if (currentX > TRESHOLD) {
          onActivityChange(activityId, true);
        }

        if (currentX < -TRESHOLD) {
          onActivityChange(activityId, false);
        }

        Animated.event([null, { dx: pan.x, dy: pan.y }], {
          useNativeDriver: false,
        })(e, gestState);
      },
      onPanResponderRelease: () => {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={{ transform: [{ translateX: pan.x }] }}
    >
      <FlowHiglightView style={{ ...itemContainer }}>
        <FlowRow>
          <FlowText
            style={{
              userSelect: "none",
              fontWeight: isActive ? "bold" : "400",
            }}
          >
            {title}
          </FlowText>
          <FlowText style={{ ...timeText, userSelect: "none" }}>
            {new Date(time * 1000).toISOString().substring(11, 19)}
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
