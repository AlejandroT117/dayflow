import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { ActivityTimer } from "../components/activity/ActivityTimer";
import { ActivityItem } from "../components/activity/ActivityItem";
import data from "../data/activities.json";
import { COLORS, SIZES } from "../variables/styles";
import { FlowRow } from "../components/overrides";

export const ActivityHomeScreen = () => {
  return (
    <View style={container}>
      <ActivityTimer />
      <FlowRow style={headerContainer}>
        <Text style={text}>Activities</Text>
        <Text style={text}>Add</Text>
      </FlowRow>
      <FlatList
        data={data}
        keyExtractor={({ id }) => id}
        renderItem={({ item }) => <ActivityItem {...item} />}
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
