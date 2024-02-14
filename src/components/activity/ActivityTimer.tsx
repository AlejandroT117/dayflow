import React from "react";
import { StyleSheet } from "react-native";
import { FlowHiglightView, FlowRow, FlowText } from "../overrides";
import { COLORS } from "../../variables/styles";
import { Activity } from "../../interfaces/activity.interface";

interface Props {
  activity?: Activity;
  startTime?: number;
}

export const ActivityTimer: React.FC<Props> = ({ activity, startTime }) => {
  return (
    <FlowHiglightView style={container}>
      <FlowRow style={row}>
        <FlowText style={{ fontWeight: activity?.isActive ? "bold" : "400" }}>
          {activity?.title || "No Current Activity"}
        </FlowText>
      </FlowRow>
      <FlowRow style={row}>
        <FlowText style={time}>
          {new Date(
            (startTime === undefined ? activity?.time || 0 : startTime || 0) *
              1000
          )
            .toISOString()
            .substring(11, 19)}
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
