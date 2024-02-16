import React, { useMemo } from "react";
import { GestureResponderEvent, Pressable, StyleSheet } from "react-native";
import { FlowText } from "./FlowText";
import { COLORS } from "../../variables/styles";

interface Props {
  text: string;
  isDisabled?: boolean;
  isTransparent?: boolean;
  type?: "primary" | "secondary" | "danger" | "warning";
  handlePress: (e: GestureResponderEvent) => void;
}

export const FlowButton: React.FC<Props> = ({
  text,
  isDisabled = false,
  isTransparent = true,
  type = "primary",
  handlePress,
}) => {
  const flowTextColor: {
    color: string;
    fontWeight:
      | "400"
      | "bold"
      | "normal"
      | "100"
      | "200"
      | "300"
      | "500"
      | "600"
      | "700"
      | "800"
      | "900"
      | undefined;
  } = useMemo(() => {
    if (isTransparent && isDisabled) {
      return { color: COLORS.lightGray, fontWeight: "400" };
    }
    if (isTransparent) {
      return { ...styles[type], fontWeight: "400" };
    }

    return {
      color: COLORS.semiDarkGray,
      fontWeight: "bold",
    };
  }, [isDisabled, isTransparent]);

  const flowButton = useMemo(() => {
    if (!isTransparent && isDisabled) {
      return { backgroundColor: COLORS.semiDarkGray };
    }

    if (isTransparent) {
      return { backgroundColor: "transparent" };
    }

    return { ...styles.button, backgroundColor: styles[type].color };
  }, [isDisabled, isTransparent]);

  return (
    <Pressable onPress={handlePress} style={flowButton}>
      <FlowText style={flowTextColor}>{text}</FlowText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
  },
  primary: {
    color: COLORS.normalGreen,
  },
  secondary: {
    color: COLORS.brightBlue,
  },
  danger: {
    color: COLORS.brightRed,
  },
  warning: {
    color: COLORS.brightYellow,
  },
});
