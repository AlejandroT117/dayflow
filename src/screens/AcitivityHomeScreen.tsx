import React, { useCallback, useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { ActivityTimer } from "../components/activity/ActivityTimer";
import { ActivityItem } from "../components/activity/ActivityItem";
import defaultItems from "../data/activities.json";
import { COLORS, SIZES } from "../variables/styles";
import { FlowRow } from "../components/overrides";
import { Activity } from "../interfaces/activity.interface";
import { loadDayFlowItems, storeDayFlowItems } from "../storage";

export const ActivityHomeScreen = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentActivity, setCurrentActivity] = useState<Activity>();

  const getData = async () => {
    const items = await loadDayFlowItems();
    setActivities(items || defaultItems);
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    activities && storeDayFlowItems(activities);

    setCurrentActivity(activities.find((act) => act.isActive));
  }, [activities]);

  const handleTimeChange = useCallback((id: string, time: number) => {
    setActivities((activities) =>
      activities.map((act: Activity) =>
        act.id === id ? { ...act, time: time } : act
      )
    );
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

  return (
    <View style={container}>
      <ActivityTimer activity={currentActivity} />
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
  },
  text: {
    fontSize: SIZES.fontMedium,
    fontWeight: "bold",
    color: COLORS.white,
  },
});
