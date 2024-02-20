import React, { ReactNode, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../variables/styles";

interface Props {
  children: ReactNode;
}
export const SafeAreaScreen: React.FC<Props> = ({ children }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ ...container, paddingTop: insets.top }}>{children}</View>
  );
};

const { container } = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.black,
  },
});
