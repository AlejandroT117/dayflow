import React, { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import uuid from "react-native-uuid";
import { ActivityTimer } from "../components/activity/ActivityTimer";
import { ActivityItem } from "../components/activity/ActivityItem";
import defaultItems from "../data/activities.json";
import { COLORS, SIZES } from "../variables/styles";
import { FlowRow, FlowText } from "../components/overrides";
import { Activity, AddActivity } from "../interfaces/activity.interface";
import { loadDayFlowItems, storeDayFlowItems } from "../storage";
import { ActivityItemCreator } from "../components/activity/ActivityItemCreator";
import { FlowButton } from "../components/overrides/FlowButton";
import { ActivityItemDetailed } from "../components/activity/ActivityItemDetailed";

interface Props {
  isStorageEnabled: boolean;
  onOpenTutorial: () => boolean;
}

export const ActivityHomeScreen: React.FC<Props> = ({
  isStorageEnabled,
  onOpenTutorial,
}) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentActivity, setCurrentActivity] = useState<Activity>();
  const [prevActivity, setPrevActivity] = useState<Activity>();
  const [startTime, setStartTime] = useState<number>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isScrollEnabled, setIsScrollEnabled] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState<Activity>();

  const getData = async () => {
    const items = await loadDayFlowItems();
    setActivities(items || defaultItems);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    activities && isStorageEnabled && storeDayFlowItems(activities);

    setCurrentActivity(activities.find((act) => act.isActive));

    if (selectedActivity?.id) {
      setSelectedActivity(
        activities.find((act) => act.id === selectedActivity.id)
      );
    }
  }, [activities, isStorageEnabled]);

  useEffect(() => {
    if (currentActivity && currentActivity?.id !== prevActivity?.id) {
      setStartTime(undefined);
      return;
    }
  }, [currentActivity, prevActivity]);

  useEffect(() => {
    if (currentActivity) {
      setPrevActivity(currentActivity);
      return;
    }
  }, [currentActivity]);

  useEffect(() => {
    if (startTime) {
      setPrevActivity((prev) => prev && { ...prev, time: startTime });
    }
  }, [startTime]);

  const handleTimeChange = useCallback((id: string, time: number) => {
    setActivities((activities) =>
      activities.map((act: Activity) =>
        act.id === id ? { ...act, time: time } : act
      )
    );
    setStartTime((s) => (s || 0) + 1);
  }, []);

  const checkActivity = useCallback((id: string, state: boolean) => {
    setActivities((activities) =>
      activities.map((act: Activity) =>
        act.id === id
          ? { ...act, isActive: state }
          : { ...act, isActive: false }
      )
    );
  }, []);

  const addActivity = useCallback(({ title, description }: AddActivity) => {
    const newActivity: Activity = {
      id: uuid.v4().toString(),
      description,
      title,
      isActive: false,
      time: 0,
    };

    setActivities((activities) => [...activities, newActivity]);
  }, []);

  const editActivity = useCallback(
    (act: Activity) => {
      const index = activities.findIndex((ac) => ac.id === act.id);

      if (index !== -1) {
        setActivities((acts) => acts.map((ac, i) => (i === index ? act : ac)));
      }
    },
    [activities]
  );

  const onCloseActivityDetailed = useCallback(() => {
    setSelectedActivity(undefined);
  }, []);

  const removeActivity = useCallback(
    (id: string) => {
      setActivities((acts) => acts.filter((acs) => acs.id !== id));
    },
    [onCloseActivityDetailed]
  );

  const openTutorial = useCallback(() => {
    onOpenTutorial();
  }, []);

  return (
    <View style={container}>
      <FlowRow>
        <FlowText>
          {new Date().toLocaleDateString("en", {
            weekday: "long",
            day: "numeric",
            dayPeriod: "short",
            month: "short",
            year: "numeric",
          })}
        </FlowText>
        <FlowButton handlePress={openTutorial}>
          <FlowText style={{ fontWeight: "bold", color: COLORS.brightBlue }}>
            Tutorial
          </FlowText>
        </FlowButton>
      </FlowRow>
      <ActivityItemDetailed
        activity={selectedActivity}
        onClose={onCloseActivityDetailed}
        onEdit={editActivity}
        onRemove={removeActivity}
        onChangeStatus={checkActivity}
      />
      <ActivityItemCreator
        isVisible={isModalVisible}
        onConfirmAddition={addActivity}
        onCancel={() => setIsModalVisible(false)}
      />
      <FlowRow style={{ ...headerContainer, justifyContent: "center" }}>
        <Text style={text}>
          {currentActivity ? "Current " : "Last "} Activity
        </Text>
      </FlowRow>
      <ActivityTimer
        activity={currentActivity || prevActivity}
        startTime={startTime}
      />
      <FlowRow style={headerContainer}>
        <Text style={text}>Activities</Text>
        <FlowButton handlePress={() => setIsModalVisible(true)}>
          <MaterialIcons
            name="playlist-add"
            size={24}
            color={COLORS.brightGreen}
          />
        </FlowButton>
      </FlowRow>
      <FlatList
        data={activities}
        scrollEnabled={isScrollEnabled}
        keyExtractor={({ id }) => id}
        renderItem={({ item }) => (
          <ActivityItem
            activity={item}
            onDoubleClick={setSelectedActivity}
            onMove={() => setIsScrollEnabled(false)}
            onRelease={() => setIsScrollEnabled(true)}
            onActivityChange={checkActivity}
            onTimeChange={handleTimeChange}
          />
        )}
        ListEmptyComponent={
          <FlowText>No activities found. Add one to start</FlowText>
        }
      />
    </View>
  );
};

const { container, headerContainer, text } = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    maxWidth: 500,
  },
  headerContainer: {
    paddingVertical: 10,
    textAlign: "center",
  },
  text: {
    fontSize: SIZES.fontMedium,
    fontWeight: "bold",
    color: COLORS.white,
  },
});
