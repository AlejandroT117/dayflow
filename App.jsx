import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { ActivityHomeScreen } from "./src/screens/AcitivityHomeScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SafeAreaScreen } from "./src/layout/SafeAreaScreen";
import {
  checkStorageStatus,
  loadTutorialWatch,
  storeTutorialWatched,
} from "./src/storage";
import { TutorialScreen } from "./src/screens/TutorialScreen";

export default function App() {
  const [isStorageEnabled, setIsStorageEnabled] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  const checkStorage = async () => {
    setIsStorageEnabled(await checkStorageStatus());
  };

  useEffect(() => {
    checkStorage();
  }, []);

  const checkTutorial = async () => {
    const hasBeenWatched = await loadTutorialWatch();

    setIsTutorialOpen(!Boolean(hasBeenWatched.isWatched));
  };

  useEffect(() => {
    if (!isStorageEnabled) {
      return;
    }
    checkTutorial();
  }, [isStorageEnabled]);

  useEffect(() => {
    if (isTutorialOpen) {
      return;
    }
    storeTutorialWatched({ isWatched: true });
  }, [isTutorialOpen]);

  return (
    <SafeAreaProvider>
      <SafeAreaScreen>
        <TutorialScreen
          visible={isTutorialOpen}
          onClose={() => setIsTutorialOpen(false)}
        />
        <ActivityHomeScreen
          isStorageEnabled={isStorageEnabled}
          onOpenTutorial={() => setIsTutorialOpen(true)}
        />
        <StatusBar style="light" />
      </SafeAreaScreen>
    </SafeAreaProvider>
  );
}
