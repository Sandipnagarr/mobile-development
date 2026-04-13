import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Loginscreen from "../Screen/Loginscreen.jsx";
import TabNavigator from "./TabNavigator.jsx";

export default function AppNavigator() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        if (isMounted && token) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.log("Auth restore error:", error);
      } finally {
        if (isMounted) {
          setIsCheckingAuth(false);
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isCheckingAuth) {
    return null;
  }

  return isLoggedIn ? (
    <TabNavigator />
  ) : (
    <Loginscreen onLogin={() => setIsLoggedIn(true)} />
  );
}
