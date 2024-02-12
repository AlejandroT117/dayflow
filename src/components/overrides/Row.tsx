import React, { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

interface Props {
  children: ReactNode;
  style?: ViewStyle;
}
export const FlowRow: React.FC<Props> = ({ children, style }) => {
  return (
    <View style={{ justifyContent: "space-between", ...row, ...style }}>
      {children}
    </View>
  );
};

const { row } = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});
