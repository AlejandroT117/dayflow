import React, { useCallback, useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { ActivityTimer } from "../components/activity/ActivityTimer";
import { ActivityItem } from "../components/activity/ActivityItem";
import defaultItems from "../data/activities.json";
import { COLORS, SIZES } from "../variables/styles";
import { FlowRow } from "../components/overrides";
import { Activity } from "../interfaces/activity.interface";
import { loadDayFlowItems, storeDayFlowItems } from "../storage";

interface Props {
  isStorageEnabled: boolean;
}

export const ActivityHomeScreen: React.FC<Props> = ({ isStorageEnabled }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentActivity, setCurrentActivity] = useState<Activity>();
  const [prevActivity, setPrevActivity] = useState<Activity>();
  const [startTime, setStartTime] = useState<number>();

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
    if (currentActivity) {
      setPrevActivity(currentActivity);
      return;
    }
    setStartTime(undefined);
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
    if (state) {
      setStartTime(0);
    }
  }, []);

  return (
    <View style={container}>
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
        <Text style={text}>Add</Text>
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
