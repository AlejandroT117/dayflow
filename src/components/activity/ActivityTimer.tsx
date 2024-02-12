import React from "react";
import { StyleSheet } from "react-native";
import { FlowHiglightView, FlowRow, FlowText } from "../overrides";
import { COLORS } from "../../variables/styles";
import { Activity } from "../../interfaces/activity.interface";

interface Props {
  activity?: Activity;
}

export const ActivityTimer: React.FC<Props> = ({ activity }) => {
  console.log(activity);
  return (
    <FlowHiglightView style={container}>
      <FlowRow style={row}>
        <FlowText>{activity?.title || "No Activity"}</FlowText>
      </FlowRow>
      <FlowRow style={row}>
        <FlowText style={time}>
          {new Date((activity?.time || 0) * 1000).toISOString().substring(11, 19)}
        </FlowText>
      </FlowRow>
    </FlowHiglightView>
  );
};

const { container, row, time } = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  row: {
    justifyContent: "center",
  },
  time: {
    color: COLORS.brightGreen,
  },
});
