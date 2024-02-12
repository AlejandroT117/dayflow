import React from "react";
import { StyleSheet } from "react-native";
import { Activity } from "../../interfaces/activity.interface";
import { FlowHiglightView, FlowRow, FlowText } from "../overrides";
import { COLORS } from "../../variables/styles";

export const ActivityItem: React.FC<Activity> = ({ title, time }) => {
  return (
    <FlowHiglightView style={itemContainer}>
      <FlowRow>
        <FlowText>{title}</FlowText>
        <FlowText style={timeText}>{time}</FlowText>
      </FlowRow>
    </FlowHiglightView>
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
