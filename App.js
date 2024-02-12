import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { ActivityHomeScreen } from "./src/screens/AcitivityHomeScreen";
import {
  SafeAreaView,
  SafeAreaProvider,
  SafeAreaInsetsContext,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { SafeAreaScreen } from "./src/layout/SafeAreaScreen";

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaScreen>
        <ActivityHomeScreen />
        <StatusBar style="light" />
      </SafeAreaScreen>
    </SafeAreaProvider>
  );
}
