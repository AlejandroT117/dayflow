import React, { useCallback, useEffect, useState } from "react";
import { FlowModal } from "../overrides/FlowModal";
import { FontAwesome5 } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { FlowHiglightView, FlowRow, FlowText } from "../overrides";
import { FlowButton } from "../overrides/FlowButton";
import {
  Alert,
  GestureResponderEvent,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { formatTime } from "../../utils/formatTime";
import { COLORS, SIZES } from "../../variables/styles";
import { Activity } from "../../interfaces/activity.interface";

interface Props {
  activity?: Activity;
  onClose: () => void;
  onRemove: (id: string) => void;
  onEdit: (activity: Activity) => void;
  onChangeStatus: (id: string, state: boolean) => void;
}

export const ActivityItemDetailed: React.FC<Props> = ({
  activity,
  onClose,
  onEdit,
  onRemove,
  onChangeStatus,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMode, setEditingMode] = useState(false);
  const [updatedActivity, setUpdatedActivity] = useState(activity);

  useEffect(() => {
    setIsModalOpen(Boolean(activity));

    if (hasChanged()) {
      setUpdatedActivity(activity);
    }
  }, [activity]);

  const hasChanged = useCallback(() => {
    if (!activity || !updatedActivity) {
      return true;
    }

    for (const prop in activity) {
      if (Object.prototype.hasOwnProperty.call(activity, prop)) {
        const oldValue = activity[prop as keyof Activity];
        const newValue = updatedActivity[prop as keyof Activity];

        if (oldValue !== newValue) {
          return true;
        }
      }
    }
  }, [activity, updatedActivity]);

  useEffect(() => {
    if (!isModalOpen) {
      setEditingMode(false);
      onClose();
    }
  }, [isModalOpen]);

  const handleEdit = useCallback(() => {
    if (!updatedActivity) {
      return;
    }

    if (hasChanged()) {
      onEdit(updatedActivity);
    }
    setEditingMode(false);
  }, [updatedActivity, activity]);

  const handleRemove = useCallback(
    (e: GestureResponderEvent) => {
      removeConfirmation(activity);
    },
    [activity]
  );

  const handleResume = useCallback(() => {
    if (!activity) {
      return;
    }

    onChangeStatus(activity.id, !activity.isActive);
  }, [activity]);

  const removeConfirmation = useCallback((act?: Activity) => {
    Alert.alert(
      "Are you sure to remove this activity",
      "You can't undo this action",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            if (!act) {
              return;
            }
            onRemove(act.id);
            onClose();
          },
          style: "default",
        },
      ]
    );
  }, []);

  const EditRow = () => {
    if (activity?.isActive) {
      return (
        <FlowText style={{ color: COLORS.brightGreen }}>
          Pause activity to edit
        </FlowText>
      );
    }

    if (editingMode) {
      return (
        <FlowRow style={{ justifyContent: "flex-start", gap: 8 }}>
          <FlowButton text="Confirm" handlePress={handleEdit} />
          <FlowButton
            text="Cancel"
            handlePress={() => setEditingMode(false)}
            type="danger"
          />
        </FlowRow>
      );
    }

    return <FlowButton text="Edit" handlePress={() => setEditingMode(true)} />;
  };

  return (
    <FlowModal
      visible={isModalOpen}
      animationType="fade"
      fullScreen={true}
      contentStyles={{ backgroundColor: COLORS.black }}
    >
      <FlowButton
        text="Back"
        handlePress={() => setIsModalOpen(false)}
        style={backButton}
      />
      <FlowHiglightView style={{ gap: 8, marginVertical: 12 }}>
        <View>
          <FlowText style={timer}>{formatTime(activity?.time)}</FlowText>
        </View>
        <View>
          {editingMode ? (
            <TextInput
              placeholderTextColor={COLORS.white}
              style={{ ...title, ...input }}
              value={updatedActivity?.title}
              onChangeText={(t) =>
                updatedActivity &&
                setUpdatedActivity({ ...updatedActivity, title: t })
              }
            />
          ) : (
            <FlowText style={title}>{activity?.title}</FlowText>
          )}
        </View>
        <View>
          {editingMode ? (
            <TextInput
              placeholder={activity?.description || "Type the description"}
              placeholderTextColor={COLORS.white}
              style={{ ...input, ...multilineInput }}
              value={updatedActivity?.description}
              onChangeText={(t) =>
                updatedActivity &&
                setUpdatedActivity({ ...updatedActivity, description: t })
              }
              multiline
              numberOfLines={4}
            />
          ) : (
            <FlowText>{activity?.description}</FlowText>
          )}
        </View>
        <View style={{ marginTop: 16 }}>
          <EditRow />
        </View>
      </FlowHiglightView>
      <FlowRow style={{ gap: 8 }}>
        <View style={{ width: "48%" }}>
          <FlowButton
            handlePress={handleResume}
            isTransparent={false}
            style={button}
            type={activity?.isActive ? "secondary" : "primary"}
            children={
              activity?.isActive ? (
                <FontAwesome5
                  name="pause"
                  size={SIZES.fontMedium}
                  color="white"
                />
              ) : (
                <FontAwesome5
                  name="play"
                  size={SIZES.fontMedium}
                  color="white"
                />
              )
            }
          />
        </View>
        <View style={{ width: "48%" }}>
          <FlowButton
            handlePress={handleRemove}
            isTransparent={false}
            style={button}
            children={
              <Ionicons
                name="trash-outline"
                size={SIZES.fontMedium}
                color="white"
              />
            }
            type="danger"
          />
        </View>
      </FlowRow>
    </FlowModal>
  );
};

const { backButton, timer, title, button, input, multilineInput } =
  StyleSheet.create({
    backButton: {
      marginBottom: 8,
    },
    timer: {
      color: COLORS.brightGreen,
      marginBottom: 5,
      fontSize: SIZES.fontSmall,
    },
    title: {
      fontWeight: "bold",
      fontSize: SIZES.fontMedium,
    },
    button: {
      alignItems: "center",
      justifyContent: "center",
    },
    input: {
      color: COLORS.white,
      borderBottomWidth: 2,
      borderColor: COLORS.semiDarkGray,
      borderRadius: 5,
      padding: 1
    },
    multilineInput: {
      textAlignVertical: "center",
    },
  });
