import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ScreenCapture from "expo-screen-capture";
import { useEffect } from "react";


export default function CategoryScreen() {
  const [startPoint, setStartPoint] = React.useState("");
  const [destinationPoint, setDestinationPoint] = React.useState("");

  const GetRoute = async () => {
    const origin = startPoint.trim();
    const destination = destinationPoint.trim();

    const routeUrl =
      `https://www.google.com/maps/dir/?api=1` +
      `&origin=${encodeURIComponent(origin)}` +
      `&destination=${encodeURIComponent(destination)}` +
      `&travelmode=driving`;

    try {
      await Linking.openURL(routeUrl);
    } catch (error) {
      console.log("Route open failed:", error);
      Alert.alert(
        "Unable to open Google Maps",
        "The route link could not be opened.",
      );
    }
  };
 

useEffect(() => {
  // Block screenshots
  ScreenCapture.preventScreenCaptureAsync();
  console.log("Screen capture disabled for this screen.");

  // Detect screenshot attempts
  const subscription = ScreenCapture.addScreenshotListener(() => {
    console.log(" Screenshot detected!");
  });

  return () => {
    ScreenCapture.allowScreenCaptureAsync();
    subscription.remove();
  };
}, []);



    return (
      <SafeAreaView style={styles.safeArea}>
        <View>
          <View style={styles.routePanel}>
            <TextInput
              placeholder="Enter starting point"
              placeholderTextColor="#666"
              style={styles.textInput}
              value={startPoint}
              onChangeText={setStartPoint}
            />
            <TextInput
              placeholder="Enter destination"
              placeholderTextColor="#666"
              style={styles.textInput}
              value={destinationPoint}
              onChangeText={setDestinationPoint}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={GetRoute}
            >
              <Text style={styles.buttonText}>Get Route</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },


   routePanel: {
    position: "absolute",
    top: 130,
    left: 20,
    right: 20,
    backgroundColor: "rgba(255,255,255,0.96)",
    borderRadius: 12,
    padding: 12,
    elevation: 6,
    gap: 10,
  },

  textInput: {
    height: 46,
    backgroundColor: "#f5f6f8",
    borderRadius: 8,
    paddingHorizontal: 14,
    color: "#222",
    borderWidth: 1,
    borderColor: "#d7dce2",
  },

  button: {
    backgroundColor: "#1f6feb",
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
});



/**
 * 
 1.   design a login screen with email and password fields, and a login button. and two different more cards
      create an api for register the new users and create an api for loging the users 
 i    mplememted loging button funtionlity implemeted funtions when click
 4.   fetch the api on frontend and bind that to working 
 5.   resolve the issue shwoing loging failed debugged     
      try to make build of new added funtionlity but three times 
 2.
 2.
 */