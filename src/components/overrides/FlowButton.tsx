import React, { Children, ReactNode, useMemo } from "react";
import {
  GestureResponderEvent,
  Pressable,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { FlowText } from "./FlowText";
import { COLORS } from "../../variables/styles";

interface Props {
  text?: string;
  children?: ReactNode;
  isDisabled?: boolean;
  isTransparent?: boolean;
  type?: "primary" | "secondary" | "danger" | "warning";
  handlePress: (e: GestureResponderEvent) => void;
  style?: ViewStyle;
}

export const FlowButton: React.FC<Props> = ({
  text,
  isDisabled = false,
  isTransparent = true,
  type = "primary",
  handlePress,
  children,
  style,
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
      color: COLORS.white,
      fontWeight: "bold",
    };
  }, [isDisabled, isTransparent, type]);

  const flowButtonStyle = useMemo(() => {
    if (!isTransparent && isDisabled) {
      return { backgroundColor: COLORS.semiDarkGray };
    }

    if (isTransparent) {
      return { backgroundColor: "transparent" };
    }

    return { ...styles.button, backgroundColor: styles[type].color };
  }, [isDisabled, isTransparent, type]);

  return (
    <Pressable
      onPress={handlePress}
      style={{ ...flowButtonStyle, ...style }}
      hitSlop={{ bottom: 10, top: 10, right: 5, left: 5 }}
    >
      {text && <FlowText style={flowTextColor}>{text}</FlowText>}
      {children}
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
