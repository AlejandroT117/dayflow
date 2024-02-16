import React, { useCallback, useState } from "react";
import { FlowModal } from "../overrides/FlowModal";
import { FlowRow, FlowText } from "../overrides";
import {
  Alert,
  GestureResponderEvent,
  StyleSheet,
  TextInput,
} from "react-native";
import { COLORS } from "../../variables/styles";
import { FlowButton } from "../overrides/FlowButton";
import { AddActivity } from "../../interfaces/activity.interface";

interface Props {
  isVisible: boolean;
  onConfirmAddition: (args: AddActivity) => void;
  onCancel: () => void;
}

const defaultValues = {
  title: "",
  description: "",
};

export const ActivityItemCreator: React.FC<Props> = ({
  isVisible,
  onConfirmAddition,
  onCancel,
}) => {
  const [values, setValues] = useState<AddActivity>(defaultValues);
  const { title, description } = values;

  const handleConfirm = useCallback(
    (e: GestureResponderEvent) => {
      if (!values.title) {
        Alert.alert("You need to type the name");
        return;
      }
      if (!values.description) {
        Alert.alert("You need to add a description");
        return;
      }
      onConfirmAddition(values);
      setValues(defaultValues);
      onCancel();
    },
    [values]
  );

  const handleCancel = useCallback((e: GestureResponderEvent) => {
    onCancel();
  }, []);

  return (
    <FlowModal visible={isVisible} animationType="fade" onDismiss={onCancel}>
      <FlowText>Type the name of the activity</FlowText>
      <TextInput
        placeholder="Learn C#"
        placeholderTextColor={COLORS.semiDarkGray}
        style={input}
        value={title}
        onChangeText={(t) => setValues({ ...values, title: t })}
      />
      <FlowText>What's the activity about</FlowText>
      <TextInput
        placeholder="Go to Udemy course to learn c#"
        placeholderTextColor={COLORS.semiDarkGray}
        style={input}
        value={description}
        onChangeText={(d) => setValues({ ...values, description: d })}
      />
      <FlowRow style={{ justifyContent: "space-around", gap: 8, marginTop: 8 }}>
        <FlowButton
          text="Confirm"
          isDisabled={!values.title || !values.description}
          handlePress={handleConfirm}
        />
        <FlowButton text="Cancel" type="danger" handlePress={handleCancel} />
      </FlowRow>
    </FlowModal>
  );
};

const { input } = StyleSheet.create({
  input: {
    padding: 10,
    color: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.semiDarkGray,
    borderRadius: 5,
    marginVertical: 10,
  },
});
