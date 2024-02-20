import { ReactNode, useMemo } from "react";
import {
  Modal,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { COLORS } from "../../variables/styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  children: ReactNode;
  animationType?: "fade" | "none" | "slide";
  visible: boolean;
  contentStyles?: ViewStyle;
  onDismiss?: () => void;
  fullScreen?: boolean;
}
export const FlowModal: React.FC<Props> = ({
  children,
  animationType = "fade",
  visible,
  contentStyles,
  onDismiss,
  fullScreen = false,
}) => {
  const insets = useSafeAreaInsets();
  const fullScreenStyles: ViewStyle = useMemo(
    () => ({
      height: "100%",
      backgroundColor: COLORS.black,
      paddingTop: insets.top,
      alignItems: "center",
    }),
    [insets]
  );

  return (
    <Modal
      transparent
      animationType={animationType}
      visible={visible}
      onDismiss={onDismiss}
    >
      <View style={fullScreen ? fullScreenStyles : container}>
        <View style={{ ...content, ...contentStyles }}>{children}</View>
      </View>
    </Modal>
  );
};

const { container, content } = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.8)",
  },
  content: {
    width: "100%",
    maxWidth: 500,
    padding: 20,
    borderRadius: 10,
    backgroundColor: COLORS.darkGray,
  },
});
