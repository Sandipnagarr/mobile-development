import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AppNavigator from "./src/Navigation/AppNavigator.jsx";
import { useState } from "react";
import SplashIntro from "./src/Screen/SplashScreen.jsx";
  

export default function App() {
 const [showSplash, setShowSplash] = useState(true);
  if (showSplash) {
    return<SplashIntro onFinish={() => setShowSplash(false)} />;
  }
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
