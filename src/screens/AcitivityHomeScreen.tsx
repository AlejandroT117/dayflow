import React, { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import uuid from "react-native-uuid";
import { ActivityTimer } from "../components/activity/ActivityTimer";
import { ActivityItem } from "../components/activity/ActivityItem";
import defaultItems from "../data/activities.json";
import { COLORS, SIZES } from "../variables/styles";
import { FlowRow } from "../components/overrides";
import { Activity, AddActivity } from "../interfaces/activity.interface";
import { loadDayFlowItems, storeDayFlowItems } from "../storage";
import { ActivityItemCreator } from "../components/activity/ActivityItemCreator";

interface Props {
  isStorageEnabled: boolean;
}

export const ActivityHomeScreen: React.FC<Props> = ({ isStorageEnabled }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentActivity, setCurrentActivity] = useState<Activity>();
  const [prevActivity, setPrevActivity] = useState<Activity>();
  const [startTime, setStartTime] = useState<number>();
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  return (
    <View style={container}>
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
        <Text style={text} onPress={() => setIsModalVisible(true)}>
          Add
        </Text>
      </FlowRow>
      <FlatList
        data={activities}
        keyExtractor={({ id }) => id}
        renderItem={({ item }) => (
          <ActivityItem
            activity={item}
            onActivityChange={checkActivity}
            onTimeChange={handleTimeChange}
          />
        )}
      />
    </View>
  );
};

const { container, headerContainer, text } = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
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
