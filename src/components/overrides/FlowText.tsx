import React, { ReactNode } from "react";
import { StyleSheet, Text, TextStyle } from "react-native";
import { COLORS } from "../../variables/styles";

interface Props {
  children: ReactNode;
  style?: TextStyle;
}
export const FlowText: React.FC<Props> = ({ children, style }) => {
  return <Text style={{ ...text, ...style }}>{children}</Text>;
};

const { text } = StyleSheet.create({
  text: {
    color: COLORS.white,
  },
});
