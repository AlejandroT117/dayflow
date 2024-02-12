import React, { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { COLORS } from "../../variables/styles";

interface Props {
  children: ReactNode;
  style?: ViewStyle;
}
export const FlowHiglightView: React.FC<Props> = ({ children, style }) => {
  return <View style={{ ...view, ...style }}>{children}</View>;
};

const { view } = StyleSheet.create({
  view: {
    backgroundColor: COLORS.darkGray,
    borderRadius: 10,
    padding: 15,
  },
});
