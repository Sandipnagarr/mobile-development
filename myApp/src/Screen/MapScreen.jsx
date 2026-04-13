
import { useRef, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  Pressable,
  ToastAndroid,
  Platform,
  Alert,
  Image,
  Modal,
} from "react-native";
import { WebView } from "react-native-webview";

import styles from "../Style/mapScreenStyle";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { useEffect } from "react";
import * as ImagePicker from 'expo-image-picker';

import { Linking } from "react-native";
import * as Location from "expo-location";
const MapScreen = () => {
  const [storedLocations, setStoredLocations] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [imageURL, setImangeUrl] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const webViewRef = useRef(null);
  const apiUrl = "http://192.168.1.32:5000/api/locations";

const mapHTML = `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
}

#map {
  height: 100%;
}
</style>
</head>

<body>

<div id="map"></div>

<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<script>

// Create map
var map = L.map('map',{
  zoomControl: false,
}).setView([28.6139, 77.2090], 10)

var currentLocationMarker = null;


// Add tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Popup
var popup = L.popup();

// Click event
map.on('click', function(e) {
  var lat = e.latlng.lat;
  var lng = e.latlng.lng;

  //  ADD THIS
  window.currentLat = lat;
  window.currentLng = lng;
  window.selectedImage = "";

  popup
    .setLatLng(e.latlng)
    .setContent(
    "<table border='1' style='border-collapse: collapse; width:200px; text-align:center;'>" +
  "<tr><th>Field</th><th>Value</th></tr>" +
   "<tr>" +
        "<td>Name</td>" +
        "<td><input type='text' id='placeName' placeholder='Enter name' style='width:100px'/></td>" +
      "</tr>" +
    "<tr>" +
        "<td>Image</td>" +
        "<td><button id='uploadImageButton' onclick='uploadImage()'>Upload Image</button></td>" +
      "</tr>" +
        
    "<tr><td>Lat</td><td>" + lat.toFixed(6) + "</td></tr>" +
    "<tr><td>Lng</td><td>" + lng.toFixed(6) + "</td></tr>" +
    "<tr>" +
      "<td colspan='2'>" +
        "<button onclick='saveData()'>Save</button>" +
      "</td>" +
    "</tr>" +
    "</table>"
    )
    .openOn(map);
});

//  ADD THIS FUNCTION
function saveData() {
  var input = document.getElementById("placeName");
  var name = input ? input.value : "";

  var data = {
    type: "saveLocation",
    name: name,
    image: window.selectedImage || "",
    lat: window.currentLat,
    lng: window.currentLng
  };

  window.ReactNativeWebView.postMessage(JSON.stringify(data));
  if (input) {
    input.value = "";
  }
  popup.remove();
  map.closePopup();
}

function uploadImage() {
  window.ReactNativeWebView.postMessage(JSON.stringify({ type: "uploadImage" }));
}

function setSelectedImage(imageUri) {
  window.selectedImage = imageUri || "";
  var button = document.getElementById("uploadImageButton");
  if (button) {
    button.innerText = window.selectedImage ? "Image Selected" : "Upload Image";
  }
}

function updateCurrentLocation(lat, lng) {
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    return;
  }

  map.setView([lat, lng], 15);

  if (currentLocationMarker) {
    currentLocationMarker.setLatLng([lat, lng]);
  } else {
    currentLocationMarker = L.marker([lat, lng]).addTo(map);
  }

  currentLocationMarker.bindPopup('My current location');
}
  

</script>

</body>
</html>
`;

  const sendCurrentLocationToWebView = (location) => {
    if (!webViewRef.current || !location) {
      return;
    }

    webViewRef.current.injectJavaScript(`
      if (typeof updateCurrentLocation === 'function') {
        updateCurrentLocation(${location.lat}, ${location.lng});
      }
      true;
    `);
  };

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission denied", "Location permission is required.");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const lat = location.coords.latitude;
      const lng = location.coords.longitude;
      const nextLocation = { lat, lng };

      console.log("My Location:", lat, lng);

      setCurrentLocation(nextLocation);
      sendCurrentLocationToWebView(nextLocation);
    } catch (error) {
      console.log("Location fetch failed:", error);
      Alert.alert("Location error", "Unable to get your current location.");
    }
  };
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const sendImageToWebView = (imageUri) => {
    if (!webViewRef.current) {
      return;
    }

    const safeImageUri = JSON.stringify(imageUri || "");
    webViewRef.current.injectJavaScript(`
      if (typeof setSelectedImage === 'function') {
        setSelectedImage(${safeImageUri});
      }
      true;
    `);
  };

  const pickImageFromGallery = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission needed", "Gallery permission is required.");
      return;
    }

    
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length) {
      const selectedUri = result.assets[0].uri;
      setImangeUrl(selectedUri);
      sendImageToWebView(selectedUri);
    }
  };

  const pickImageFromCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission needed", "Camera permission is required.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length) {
      const selectedUri = result.assets[0].uri;
      setImangeUrl(selectedUri);
      sendImageToWebView(selectedUri);
    }
  };

  const openImageOptions = () => {
    Alert.alert("Upload Image", "Choose image source", [
      {
        text: "Camera",
        onPress: pickImageFromCamera,
      },
      {
        text: "Gallery",
        onPress: pickImageFromGallery,
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  const getImageFileName = (uri) => {
    if (!uri) {
      return `location-${Date.now()}.jpg`;
    }

    const parts = uri.split("/");
    return parts[parts.length - 1] || `location-${Date.now()}.jpg`;
  };

  const getImageMimeType = (uri) => {
    const extension = uri?.split(".").pop()?.toLowerCase();

    if (extension === "png") {
      return "image/png";
    }

    if (extension === "webp") {
      return "image/webp";
    }

    return "image/jpeg";
  };

  const createLocationRequestOptions = (location) => {
    const imageUri = location.image;

    if (imageUri?.startsWith("file://") || imageUri?.startsWith("content://")) {
      const formData = new FormData();
      formData.append("name", location.name || "");
      formData.append("lat", String(location.lat ?? ""));
      formData.append("lng", String(location.lng ?? ""));
      formData.append("image", {
        uri: imageUri,
        name: getImageFileName(imageUri),
        type: getImageMimeType(imageUri),
      });

      return {
        method: "POST",
        body: formData,
      };
    }

    return {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(location),
    };
  };

  const submitLocation = async (location) => {
    const response = await fetch(apiUrl, createLocationRequestOptions(location));
    const responseText = await response.text();

    return {
      response,
      responseText,
    };
  };
 
  const handleShowData = async () => {
    // AsyncStorage.clear()
    setShowTable(true);
    console.log("My Location:", currentLocation?.lat, currentLocation?.lng);
  
    const data = await AsyncStorage.getItem("locations");


    if (data) {
      const parsed = JSON.parse(data);
      setStoredLocations(parsed);
     
    } else {
      setStoredLocations([]);
      console.log("No data found");
    }
  };

  let isSyncing = false;
  const syncData = async () => {
    if (isSyncing) {
      return; // prevents duplicate runs
    }

    isSyncing = true; // LOCK START
    try {
      const data = await AsyncStorage.getItem("locations");
      let locations = JSON.parse(data) || [];

      const unsynced = locations.filter((item) => !item.synced);

      if (unsynced.length === 0) return;

      for (let item of unsynced) {
        try {
          const { response, responseText } = await submitLocation(item);

          console.log("Sync response status:", response.status);
          console.log("Sync response body:", responseText);

          if (response.ok) {
            // mark only this item
            //  STEP 1: mark synced
            locations = locations.map((loc) =>
              loc.id === item.id ? { ...loc, synced: true } : loc,
            );

            // //  STEP 2: delete synced items
            locations = locations.filter((loc) => !loc.synced);

            await AsyncStorage.setItem("locations", JSON.stringify(locations));


          } else {
            throw new Error("Server error");
          }
        } catch (err) {
          console.log("Sync failed:", item.id);
          break; // stop if network breaks
        }
      }
    } catch (e) {
      console.log("Sync error", e);
    }
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        console.log("Internet ON → syncing");
        syncData();
      }
    });

    return () => unsubscribe();
  }, []);

 const openYoutubeApp = async () => {
   const appUrl = "youtube://";
   const webUrl = "https://www.youtube.com";

   const supported = await Linking.canOpenURL(appUrl);

   if (supported) {
     await Linking.openURL(appUrl);
   } else {
     await Linking.openURL(webUrl);
   }
 };


// const payNow = async () => {
//   const upiUrl =
//     `upi://pay?pa=${encodeURIComponent("test@upi")}` +
//     `&pn=${encodeURIComponent("MyStore")}` +
//     `&am=${encodeURIComponent("100")}` +
//     `&cu=${encodeURIComponent("INR")}` +
//     `&tn=${encodeURIComponent("Order Payment")}` +
//     `&url=${encodeURIComponent("myapp://payment-success")}`;

//   try {
//     const supported = await Linking.canOpenURL(upiUrl);

//     if (supported) {
//       await Linking.openURL(upiUrl);
//       return;
//     }

//     Alert.alert("No UPI app found", "No app on this device can handle the UPI payment link.");
//   } catch (error) {
//     console.log("UPI open failed:", error);
//     Alert.alert("Invalid UPI URL", "The payment link could not be opened.");
  //   }
  


  //   };
  
  
  
  
  
  

  return (
    <View style={styles.container}>
      {/* Map */}
      <WebView
        ref={webViewRef}
        source={{ html: mapHTML }}
        style={styles.map}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        onLoadEnd={() => sendCurrentLocationToWebView(currentLocation)}
        onMessage={async (event) => {
          const message = JSON.parse(event.nativeEvent.data);

          if (message.type === "uploadImage") {
            openImageOptions();
            return;
          }

          const newData = {
            ...message,
          };

          delete newData.type;

          const netState = await NetInfo.fetch();

          if (netState) {
            try {
              console.log("Sending data:", newData);

              const { response, responseText } = await submitLocation(newData);

              console.log("Response status:", response.status);
              console.log("Response body:", responseText);

              if (response.ok) {
                console.log("Saved directly to server");

                if (Platform.OS === "android") {
                  ToastAndroid.show("Saved Online", ToastAndroid.SHORT);
                } else {
                  Alert.alert("Success", "Saved Online");
                }

                return;
              } else {
                throw new Error("Server error");
              }
            } catch (err) {
              console.log("Online save failed:", err.message);
            }
          }

          const old = await AsyncStorage.getItem("locations");
          let locations = old ? JSON.parse(old) : [];
loca
          locations.push({
            id: Date.now(),
            ...newData,
            synced: false,
          });

          await AsyncStorage.setItem("locations", JSON.stringify(locations));

          if (showTable) {
            setStoredLocations(locations);
          }

          if (Platform.OS === "android") {
            ToastAndroid.show("Saved Offline", ToastAndroid.SHORT);
          } else {
            Alert.alert("Saved Offline");
          }

          console.log("Saved locally:", locations);
        }}
      />
      <TouchableOpacity style={styles.showButton} onPress={handleShowData}>
        <Text style={styles.showButtonText}>Show Data</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.showButtonyoutube}
        onPress={openYoutubeApp}
      >
        <Text style={styles.showButtonText}>Pay Now</Text>
      </TouchableOpacity>

      <TextInput
        placeholder="Search location"
        placeholderTextColor="#888"
        style={styles.search}
      />

      <Modal
        visible={!!previewImage}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPreviewImage(null)}
      >
        <Pressable
          style={styles.previewOverlay}
          onPress={() => setPreviewImage(null)}
        >
          {previewImage ? (
            <Image
              source={{ uri: previewImage }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          ) : null}
        </Pressable>
      </Modal>

      {showTable && storedLocations.length > 0 && (
        <View style={styles.tableWrapper}>
          <View style={styles.tableTopBar}>
            <Text style={styles.tableTitle}>Stored Locations</Text>
            <Pressable
              style={styles.closeButton}
              onPress={() => setShowTable(false)}
            >
              <Text style={styles.closeButtonText}>X</Text>
            </Pressable>
          </View>

          <View style={styles.tableHeader}>
            <Text style={[styles.tableCell, styles.headerCell]}>Name</Text>
            <Text style={[styles.tableCell, styles.headerCell]}>Lat</Text>
            <Text style={[styles.tableCell, styles.headerCell]}>Lng</Text>
            <Text style={[styles.tableCell, styles.headerCell]}>Image</Text>
          </View>

          <ScrollView style={styles.tableBody}>
            {storedLocations.map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.name || "-"}</Text>
                <Text style={styles.tableCell}>
                  {typeof item.lat === "number" ? item.lat.toFixed(6) : "-"}
                </Text>
                <Text style={styles.tableCell}>
                  {typeof item.lng === "number" ? item.lng.toFixed(6) : "-"}
                </Text>
                <View style={styles.tableCell}>
                  {item.image ? (
                    <Pressable onPress={() => setPreviewImage(item.image)}>
                      <Image
                        source={{ uri: item.image }}
                        style={styles.locationImage}
                        resizeMode="cover"
                      />
                    </Pressable>
                  ) : (
                    <Text style={styles.imagePlaceholder}>-</Text>
                  )}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default MapScreen;
