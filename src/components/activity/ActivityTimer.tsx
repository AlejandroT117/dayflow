import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { FlowHiglightView, FlowRow, FlowText } from "../overrides";
import { COLORS } from "../../variables/styles";

export const ActivityTimer = () => {
  return (
    <FlowHiglightView style={container}>
      <FlowRow style={row}>
        <FlowText>No Activity</FlowText>
      </FlowRow>
      <FlowRow style={row}>
        <FlowText style={time}>00:00:00</FlowText>
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
