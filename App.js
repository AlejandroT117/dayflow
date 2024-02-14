import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { ActivityHomeScreen } from "./src/screens/AcitivityHomeScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SafeAreaScreen } from "./src/layout/SafeAreaScreen";
import { checkStorageStatus } from "./src/storage";
import { FlowText } from "./src/components/overrides";

export default function App() {
  const [isStorageEnabled, setIsStorageEnabled] = useState(false);

  const checkStorage = async () => {
    setIsStorageEnabled(await checkStorageStatus());
  };

  useEffect(() => {
    checkStorage();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaScreen>
        <ActivityHomeScreen isStorageEnabled={isStorageEnabled} />
        <StatusBar style="light" />
      </SafeAreaScreen>
    </SafeAreaProvider>
  );
}
