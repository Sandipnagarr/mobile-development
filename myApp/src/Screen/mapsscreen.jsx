// import  { useRef, useState } from "react";
// import {
//   View,
//   StyleSheet,
//   TextInput,
//   TouchableOpacity,
//   Text,
//   ScrollView,
//   Pressable,
//   ToastAndroid,
//   Platform,
//   Alert,
// } from "react-native";
// import { WebView } from "react-native-webview";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import NetInfo from "@react-native-community/netinfo";
// import { useEffect } from "react";
// import * as ImagePicker from 'expo-image-picker';

// const MapScreen = () => {
//   const [storedLocations, setStoredLocations] = useState([]);
//   const [showTable, setShowTable] = useState(false);
//   const [imageURL, setImangeUrl] = useState(null);
//   const webViewRef = useRef(null);

// const mapHTML = `
// <!DOCTYPE html>
// <html>
// <head>
// <meta name="viewport" content="width=device-width, initial-scale=1.0">

// <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>

// <style>
// html, body {
//   margin: 0;
//   padding: 0;
//   height: 100%;
// }

// #map {
//   height: 100%;
// }
// </style>
// </head>

// <body>

// <div id="map"></div>

// <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

// <script>

// // Create map
// var map = L.map('map',{
//   zoomControl: false,
// }).setView([28.6139, 77.2090], 10)


// // Add tiles
// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//   attribution: '© OpenStreetMap contributors'
// }).addTo(map);

// // Popup
// var popup = L.popup();

// // Click event
// map.on('click', function(e) {
//   var lat = e.latlng.lat;
//   var lng = e.latlng.lng;

//   //  ADD THIS
//   window.currentLat = lat;
//   window.currentLng = lng;
//   window.selectedImage = "";

//   popup
//     .setLatLng(e.latlng)
//     .setContent(
//     "<table border='1' style='border-collapse: collapse; width:200px; text-align:center;'>" +
//   "<tr><th>Field</th><th>Value</th></tr>" +
//    "<tr>" +
//         "<td>Name</td>" +
//         "<td><input type='text' id='placeName' placeholder='Enter name' style='width:100px'/></td>" +
//       "</tr>" +
//     "<tr>" +
//         "<td>Image</td>" +
//         "<td><button id='uploadImageButton' onclick='uploadImage()'>Upload Image</button></td>" +
//       "</tr>" +
        
//     "<tr><td>Lat</td><td>" + lat.toFixed(6) + "</td></tr>" +
//     "<tr><td>Lng</td><td>" + lng.toFixed(6) + "</td></tr>" +
//     "<tr>" +
//       "<td colspan='2'>" +
//         "<button onclick='saveData()'>Save</button>" +
//       "</td>" +
//     "</tr>" +
//     "</table>"
//     )
//     .openOn(map);
// });

// //  ADD THIS FUNCTION
// function saveData() {
//   var input = document.getElementById("placeName");
//   var name = input ? input.value : "";

//   var data = {
//     type: "saveLocation",
//     name: name,
//     image: window.selectedImage || "",
//     lat: window.currentLat,
//     lng: window.currentLng
//   };

//   window.ReactNativeWebView.postMessage(JSON.stringify(data));
//   if (input) {
//     input.value = "";
//   }
//   popup.remove();
//   map.closePopup();
// }

// function uploadImage() {
//   window.ReactNativeWebView.postMessage(JSON.stringify({ type: "uploadImage" }));
// }

// function setSelectedImage(imageUri) {
//   window.selectedImage = imageUri || "";
//   var button = document.getElementById("uploadImageButton");
//   if (button) {
//     button.innerText = window.selectedImage ? "Image Selected" : "Upload Image";
//   }
// }
  

// </script>

// </body>
// </html>
// `;

//   const sendImageToWebView = (imageUri) => {
//     if (!webViewRef.current) {
//       return;
//     }

//     const safeImageUri = JSON.stringify(imageUri || "");
//     webViewRef.current.injectJavaScript(`
//       if (typeof setSelectedImage === 'function') {
//         setSelectedImage(${safeImageUri});
//       }
//       true;
//     `);
//   };

//   const pickImageFromGallery = async () => {
//     const permissionResult =
//       await ImagePicker.requestMediaLibraryPermissionsAsync();

//     if (!permissionResult.granted) {
//       Alert.alert("Permission needed", "Gallery permission is required.");
//       return;
//     }

//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: false,
//       quality: 1,
//     });

//     if (!result.canceled && result.assets?.length) {
//       const selectedUri = result.assets[0].uri;
//       setImangeUrl(selectedUri);
//       sendImageToWebView(selectedUri);
//     }
//   };

//   const pickImageFromCamera = async () => {
//     const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

//     if (!permissionResult.granted) {
//       Alert.alert("Permission needed", "Camera permission is required.");
//       return;
//     }

//     const result = await ImagePicker.launchCameraAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: false,
//       quality: 1,
//     });

//     if (!result.canceled && result.assets?.length) {
//       const selectedUri = result.assets[0].uri;
//       setImangeUrl(selectedUri);
//       sendImageToWebView(selectedUri);
//     }
//   };

//   const openImageOptions = () => {
//     Alert.alert("Upload Image", "Choose image source", [
//       {
//         text: "Camera",
//         onPress: pickImageFromCamera,
//       },
//       {
//         text: "Gallery",
//         onPress: pickImageFromGallery,
//       },
//       {
//         text: "Cancel",
//         style: "cancel",
//       },
//     ]);
//   };
 
//   const handleShowData = async () => {
//     // AsyncStorage.clear()
//     setShowTable(true);
  
//     const data = await AsyncStorage.getItem("locations");


//     if (data) {
//       const parsed = JSON.parse(data);
//       setStoredLocations(parsed);
     
//     } else {
//       setStoredLocations([]);
//       console.log("No data found");
//     }
//   };

//   let isSyncing = false;
//   const syncData = async () => {
//     if (isSyncing) {
//       return; // prevents duplicate runs
//     }

//     isSyncing = true; // LOCK START
//     try {
//       const data = await AsyncStorage.getItem("locations");
//       let locations = JSON.parse(data) || [];

//       const unsynced = locations.filter((item) => !item.synced);

//       if (unsynced.length === 0) return;

//       for (let item of unsynced) {
//         try {
//           const res = await fetch("https://mlinfomap.biz/mobileapi/api/locations", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify(item),
//           });

//           if (res.ok) {
//             // mark only this item
//             //  STEP 1: mark synced
//             locations = locations.map((loc) =>
//               loc.id === item.id ? { ...loc, synced: true } : loc,
//             );

//             // //  STEP 2: delete synced items
//             locations = locations.filter((loc) => !loc.synced);

//             await AsyncStorage.setItem("locations", JSON.stringify(locations));


//           } else {
//             throw new Error("Server error");
//           }
//         } catch (err) {
//           console.log("Sync failed:", item.id);
//           break; // stop if network breaks
//         }
//       }
//     } catch (e) {
//       console.log("Sync error", e);
//     }
//   };

//   useEffect(() => {
//     const unsubscribe = NetInfo.addEventListener((state) => {
//       if (state.isConnected) {
//         console.log("Internet ON → syncing");
//         syncData();
//       }
//     });

//     return () => unsubscribe();
//   }, []);

 

//   return (
//     <View style={styles.container}>
//       {/* Map */}
//       <WebView
//         ref={webViewRef}
//         source={{ html: mapHTML }}
//         style={styles.map}
//         javaScriptEnabled={true}
//         domStorageEnabled={true}
//         onMessage={async (event) => {
//           const message = JSON.parse(event.nativeEvent.data);

//           if (message.type === "uploadImage") {
//             openImageOptions();
//             return;
//           }

//           const newData = {
//             ...message,
//           };

//           delete newData.type;

//           const netState = await NetInfo.fetch();

//           if (netState.isConnected) {
//             try {
//               console.log("Sending data:", newData);

//               const res = await fetch(
//                 "https://mlinfomap.biz/mobileapi/api/locations",
//                 {
//                   method: "POST",
//                   headers: {
//                     "Content-Type": "application/json",
//                   },
//                   body: JSON.stringify(newData),
//                 },
//               );

//               console.log("Response status:", res.status);

//               const text = await res.text();
//               console.log("Response body:", text);

//               if (res.ok) {
//                 console.log("Saved directly to server");

//                 if (Platform.OS === "android") {
//                   ToastAndroid.show("Saved Online", ToastAndroid.SHORT);
//                 } else {
//                   Alert.alert("Success", "Saved Online");
//                 }

//                 return;
//               } else {
//                 throw new Error("Server error");
//               }
//             } catch (err) {
//               console.log("Online save failed:", err.message);
//             }
//           }

//           const old = await AsyncStorage.getItem("locations");
//           let locations = old ? JSON.parse(old) : [];

//           locations.push({
//             id: Date.now(),
//             ...newData,
//             synced: false,
//           });

//           await AsyncStorage.setItem("locations", JSON.stringify(locations));

//           if (showTable) {
//             setStoredLocations(locations);
//           }

//           if (Platform.OS === "android") {
//             ToastAndroid.show("Saved Offline", ToastAndroid.SHORT);
//           } else {
//             Alert.alert("Saved Offline");
//           }

//           console.log("Saved locally:", locations);
//         }}
//       />
//       <TouchableOpacity style={styles.showButton} onPress={handleShowData}>
//         <Text style={styles.showButtonText}>Show Data</Text>
//       </TouchableOpacity>

//       <TextInput
//         placeholder="Search location"
//         placeholderTextColor="#888"
//         style={styles.search}
//       />

//       {showTable && storedLocations.length > 0 && (
//         <View style={styles.tableWrapper}>
//           <View style={styles.tableTopBar}>
//             <Text style={styles.tableTitle}>Stored Locations</Text>
//             <Pressable
//               style={styles.closeButton}
//               onPress={() => setShowTable(false)}
//             >
//               <Text style={styles.closeButtonText}>X</Text>
//             </Pressable>
//           </View>

//           <View style={styles.tableHeader}>
//             <Text style={[styles.tableCell, styles.headerCell]}>Name</Text>
//             <Text style={[styles.tableCell, styles.headerCell]}>Lat</Text>
//             <Text style={[styles.tableCell, styles.headerCell]}>Lng</Text>
//           </View>

//           <ScrollView style={styles.tableBody}>
//             {storedLocations.map((item, index) => (
//               <View key={index} style={styles.tableRow}>
//                 <Text style={styles.tableCell}>{item.name || "-"}</Text>
//                 <Text style={styles.tableCell}>
//                   {typeof item.lat === "number" ? item.lat.toFixed(6) : "-"}
//                 </Text>
//                 <Text style={styles.tableCell}>
//                   {typeof item.lng === "number" ? item.lng.toFixed(6) : "-"}
//                 </Text>
//               </View>
//             ))}
//           </ScrollView>
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
 

//   // Search bar overlay
//   search: {
//     position: "absolute",
//     top: 20,
//     left: 20,
//     right: 20,
//     height: 45,
//     backgroundColor: "white",
//     borderRadius: 8,
//     paddingHorizontal: 15,
//     elevation: 5, // Android shadow
//   },

//   showButton: {
//     position: "absolute",
//     top: 70,
//     right: 20,
//     backgroundColor: "#2877ee",
//     paddingVertical: 12,
//     paddingHorizontal: 18,
//     borderRadius: 8,
//     elevation: 5,
//   },

//   showButtonText: {
//     color: "white",
//     fontWeight: "600",
//   },

//   tableWrapper: {
//     position: "absolute",
//     left: 20,
//     right: 20,
//     bottom: 30,
//     maxHeight: 260,
//     backgroundColor: "rgba(255,255,255,0.97)",
//     borderRadius: 10,
//     padding: 12,
//     elevation: 6,
//   },

//   tableTitle: {
//     fontSize: 16,
//     fontWeight: "700",
//     color: "#222",
//   },

//   tableTopBar: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     marginBottom: 10,
//   },

//   tableHeader: {
//     flexDirection: "row",
//     backgroundColor: "#e8f0ff",
//     borderWidth: 1,
//     borderColor: "#cfd8e3",
//   },

//   tableBody: {
//     borderLeftWidth: 1,
//     borderRightWidth: 1,
//     borderBottomWidth: 1,
//     borderColor: "#cfd8e3",
//   },

//   tableRow: {
//     flexDirection: "row",
//     borderBottomWidth: 1,
//     borderBottomColor: "#cfd8e3",
//   },

//   tableCell: {
//     flex: 1,
//     textAlign: "center",
//     paddingVertical: 10,
//     paddingHorizontal: 6,
//     color: "#222",
//     fontSize: 13,
//   },

//   headerCell: {
//     fontWeight: "700",
//   },

//   closeButton: {
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     backgroundColor: "#292727",
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   closeButtonText: {
//     color: "white",
//     fontWeight: "700",
//     fontSize: 14,
//   },
// });

// export default MapScreen;


// export default MapScreen;
import  { useRef, useState } from "react";
import {
  View,
  StyleSheet,
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { useEffect } from "react";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from "expo-file-system/legacy";

const MapScreen = () => {
  const [storedLocations, setStoredLocations] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [imageURL, setImangeUrl] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const webViewRef = useRef(null);
  const apiUrl = "http://192.168.1.32:5000/api/locations";

  const ensureOfflineImageDir = async () => {
    const directory = `${FileSystem.documentDirectory}location-images/`;
    const directoryInfo = await FileSystem.getInfoAsync(directory);

    if (!directoryInfo.exists) {
      await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
    }

    return directory;
  };

  const getOfflineImageExtension = (uri) => {
    const cleanUri = uri?.split("?")[0] || "";
    const extension = cleanUri.split(".").pop()?.toLowerCase();

    if (extension && extension.length <= 5) {
      return extension;
    }

    return "jpg";
  };

  const persistImageLocally = async (sourceUri) => {
    if (!sourceUri) {
      return "";
    }

    const directory = await ensureOfflineImageDir();
    const extension = getOfflineImageExtension(sourceUri);
    const destinationUri = `${directory}${Date.now()}.${extension}`;

    await FileSystem.copyAsync({
      from: sourceUri,
      to: destinationUri,
    });

    return destinationUri;
  };

  const deleteOfflineImage = async (imageUri) => {
    if (!imageUri?.startsWith(FileSystem.documentDirectory || "")) {
      console.log("Offline image cleanup skipped:", imageUri);
      return;
    }

    try {
      const fileInfo = await FileSystem.getInfoAsync(imageUri);

      if (fileInfo.exists) {
        await FileSystem.deleteAsync(imageUri, { idempotent: true });
        console.log("Offline image deleted:", imageUri);
      } else {
        console.log("Offline image already missing:", imageUri);
      }
    } catch (error) {
      console.log("Offline image cleanup failed:", error);
    }
  };

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
  

</script>

</body>
</html>
`;

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
            await deleteOfflineImage(item.image);

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

 

  return (
    <View style={styles.container}>
      {/* Map */}
      <WebView
        ref={webViewRef}
        source={{ html: mapHTML }}
        style={styles.map}
        javaScriptEnabled={true}
        domStorageEnabled={true}
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

          if (newData.image) {
            try {
              newData.image = await persistImageLocally(newData.image);
            } catch (error) {
              console.log("Image save failed:", error);
              Alert.alert(
                "Image Save Failed",
                "The image could not be saved for offline use.",
              );
              return;
            }
          }

          const netState = await NetInfo.fetch();

          if (netState.isConnected) {
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
 

  // Search bar overlay
  search: {
    position: "absolute",
    top: 20,
    left: 20,
    right: 20,
    height: 45,
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 15,
    elevation: 5, // Android shadow
  },

  showButton: {
    position: "absolute",
    top: 70,
    right: 20,
    backgroundColor: "#2877ee",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    elevation: 5,
  },

  showButtonText: {
    color: "white",
    fontWeight: "600",
  },

  tableWrapper: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 30,
    maxHeight: 260,
    backgroundColor: "rgba(255,255,255,0.97)",
    borderRadius: 10,
    padding: 12,
    elevation: 6,
  },

  tableTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
  },

  tableTopBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#e8f0ff",
    borderWidth: 1,
    borderColor: "#cfd8e3",
  },

  tableBody: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#cfd8e3",
  },

  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#cfd8e3",
  },

  tableCell: {
    flex: 1,
    textAlign: "center",
    paddingVertical: 10,
    paddingHorizontal: 6,
    color: "#222",
    fontSize: 13,
  },

  headerCell: {
    fontWeight: "700",
  },

  locationImage: {
    width: 44,
    height: 44,
    borderRadius: 6,
    alignSelf: "center",
  },

  imagePlaceholder: {
    textAlign: "center",
    color: "#222",
    fontSize: 13,
  },

  previewOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.82)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  previewImage: {
    width: "100%",
    height: "75%",
  },

  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#292727",
    alignItems: "center",
    justifyContent: "center",
  },

  closeButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 14,
  },
});

export default MapScreen;
