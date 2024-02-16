import { ReactNode } from "react";
import { Modal, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { COLORS } from "../../variables/styles";

interface Props {
  children: ReactNode;
  animationType?: "fade" | "none" | "slide";
  visible: boolean;
  contentStyles?: ViewStyle;
  onDismiss?: () => void;
}
export const FlowModal: React.FC<Props> = ({
  children,
  animationType,
  visible,
  contentStyles,
  onDismiss,
}) => {
  return (
    <Modal
      transparent
      animationType={animationType}
      visible={visible}
      onDismiss={onDismiss}
    >
      <View style={{ ...container }}>
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
    minWidth: 350,
    padding: 20,
    borderRadius: 10,
    backgroundColor: COLORS.darkGray,
  },
});
