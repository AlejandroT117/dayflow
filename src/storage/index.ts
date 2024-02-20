import AsyncStorage from "@react-native-async-storage/async-storage";
import { Activity } from "../interfaces/activity.interface";

const DAYFLOWKEY = "dayFlowItems";
const TUTORIAL_WATCHED = "dayFlowItemsTutorial";

const storeData = async (key: string, value: any) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e: any) {
    console.error(`Error storing data:`, e);
    return false;
  }
};

const loadData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (e: any) {
    console.error(`Error loading data`, e);
    return false;
  }
};

const storeDayFlowItems = (data: Activity[]) => storeData(DAYFLOWKEY, data);

const loadDayFlowItems = async () => await loadData(DAYFLOWKEY);

const storeTutorialWatched = (data: { isWatched: boolean }) =>
  storeData(TUTORIAL_WATCHED, data);

const loadTutorialWatch = async () => await loadData(TUTORIAL_WATCHED);

const checkStorageStatus = async () => {
  try {
    await AsyncStorage.setItem("flowTestKey", "test");
    await AsyncStorage.getItem("flowTestKey");
    return true;
  } catch (e: any) {
    console.error(`Storage is not enabled`, e);
    return false;
  }
};

export {
  storeData,
  loadData,
  storeDayFlowItems,
  loadDayFlowItems,
  storeTutorialWatched,
  loadTutorialWatch,
  checkStorageStatus,
};
