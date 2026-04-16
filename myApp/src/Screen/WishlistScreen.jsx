// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   ScrollView,
//   TouchableOpacity,
//   Pressable,
// } from "react-native";
// import { io } from "socket.io-client";
// import { Audio } from "expo-av";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import { useContext } from "react";
// import { ThemeContext } from "./ThemeContext";

// const socket = io("http://192.168.1.32:5000");

// export default function WishlistScreen() {
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [currentUser, setCurrentUser] = useState("User A");
//   const [recording, setRecording] = useState(null);
//   const { isDark, setIsDark } = useContext(ThemeContext);

//   useEffect(() => {
//     socket.on("message", (data) => {
//       setMessages((prev) => [...prev, data]);
//     });

//     return () => socket.off("message");
//   }, []);

//   // Send text message
//   const sendMessage = () => {
//     if (!message.trim()) return;

//     socket.emit("message", {
//       user: currentUser,
//       type: "text",
//       text: message,
//     });

//     setMessage("");
//   };

//   // 🎙 Start recording (on hold)
//   const startRecording = async () => {
//     try {
//       await Audio.requestPermissionsAsync();

//       const { recording } = await Audio.Recording.createAsync(
//         Audio.RecordingOptionsPresets.HIGH_QUALITY,
//       );

//       setRecording(recording);
//       console.log("Recording started");
//     } catch (err) {
//       console.log("Error:", err);
//     }
//   };

//   // ⏹ Stop recording (on release)
//   const stopRecording = async () => {
//     try {
//       if (!recording) return;

//       await recording.stopAndUnloadAsync();
//       const uri = recording.getURI();

//       setRecording(null);

//       socket.emit("message", {
//         user: currentUser,
//         type: "audio",
//         audio: uri,
//       });

//       console.log("Audio sent:", uri);
//     } catch (err) {
//       console.log("Error stopping recording", err);
//     }
//   };

//   return (
//     <View style={{ flex: 1, padding: 10, marginTop: 40 }}>
//       {/* Switch User */}
//       <TouchableOpacity
//         onPress={() =>
//           setCurrentUser(currentUser === "User A" ? "User B" : "User A")
//         }
//         style={{
//           padding: 10,
//           backgroundColor: "#007AFF",
//           borderRadius: 10,
//           marginBottom: 10,
//         }}
//       >
//         <Text style={{ color: "#fff", textAlign: "center" }}>
//           Switch to {currentUser === "User A" ? "User B" : "User A"}
//         </Text>
//       </TouchableOpacity>

//       <Text style={{ textAlign: "center", marginBottom: 10 }}>
//         Current: {currentUser}
//       </Text>

//       {/* Chat Messages */}
//       <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 10 }}>
//         {messages.map((msg, i) => {
//           const isMe = msg.user === currentUser;

//           return (
//             <View
//               key={i}
//               style={{
//                 alignSelf: isMe ? "flex-end" : "flex-start",
//                 backgroundColor: isMe ? "#007AFF" : "#E5E5EA",
//                 padding: 10,
//                 borderRadius: 10,
//                 marginVertical: 5,
//                 maxWidth: "70%",
//               }}
//             >
//               {msg.type === "text" ? (
//                 <Text style={{ color: isMe ? "#fff" : "#000" }}>
//                   {msg.text}
//                 </Text>
//               ) : (
//                 <TouchableOpacity
//                   onPress={async () => {
//                     const { sound } = await Audio.Sound.createAsync({
//                       uri: msg.audio,
//                     });
//                     await sound.playAsync();
//                   }}
//                 >
//                   <Ionicons
//                     name="play"
//                     size={20}
//                     color={isMe ? "#fff" : "#000"}
//                   />
//                 </TouchableOpacity>
//               )}
//             </View>
//           );
//         })}
//       </ScrollView>

//       {/* Input + Mic */}
//       <View style={{ flexDirection: "row", alignItems: "center" }}>
//         <TextInput
//           placeholder="Type message"
//           value={message}
//           onChangeText={setMessage}
//           style={{
//             flex: 1,
//             borderWidth: 1,
//             borderRadius: 20,
//             padding: 10,
//             marginRight: 10,
//           }}
//         />

//         {message.trim() ? (
//           <TouchableOpacity onPress={sendMessage}>
//             <Ionicons name="send" size={26} color="#007AFF" />
//           </TouchableOpacity>
//         ) : (
//           <TouchableOpacity
//             onPressIn={startRecording}
//             onPressOut={stopRecording}
//             style={{
//               backgroundColor: recording ? "red" : "#25D366",
//               width: 50,
//               height: 50,
//               borderRadius: 25,
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//           >
//             <Ionicons name="mic" size={24} color="#fff" />
//           </TouchableOpacity>
//         )}
//         <Pressable onPress={() => setIsDark(!isDark)}>
//   <Text>{isDark ? "Light" : "Dark"}</Text>
// </Pressable>
//       </View>
//     </View>
//   );
// }
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { io } from "socket.io-client";
import { Audio } from "expo-av";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ThemeContext } from "./ThemeContext";

const socket = io("http://192.168.1.32:5000");

export default function WishlistScreen() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState("User A");
  const [recording, setRecording] = useState(null);
  const { isDark, setIsDark } = useContext(ThemeContext);

  useEffect(() => {
    socket.on("message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("message");
  }, []);

  // Send text message
  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("message", {
      user: currentUser,
      type: "text",
      text: message,
    });

    setMessage("");
  };

  // 🎙 Start recording
  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
      );

      setRecording(recording);
    } catch (err) {
      console.log("Error:", err);
    }
  };

  // ⏹ Stop recording
  const stopRecording = async () => {
    try {
      if (!recording) return;

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      setRecording(null);

      socket.emit("message", {
        user: currentUser,
        type: "audio",
        audio: uri,
      });
    } catch (err) {
      console.log("Error stopping recording", err);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 10,
        marginTop: 40,
        backgroundColor: isDark ? "#121212" : "#fff", // ✅ FIX
      }}
    >
      {/* Switch User */}
      <TouchableOpacity
        onPress={() =>
          setCurrentUser(currentUser === "User A" ? "User B" : "User A")
        }
        style={{
          padding: 10,
          backgroundColor: "#007AFF",
          borderRadius: 10,
          marginBottom: 10,
        }}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>
          Switch to {currentUser === "User A" ? "User B" : "User A"}
        </Text>
      </TouchableOpacity>

      <Text
        style={{
          textAlign: "center",
          marginBottom: 10,
          color: isDark ? "#fff" : "#000", // ✅ FIX
        }}
      >
        Current: {currentUser}
      </Text>

      {/* Chat Messages */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 10 }}>
        {messages.map((msg, i) => {
          const isMe = msg.user === currentUser;

          return (
            <View
              key={i}
              style={{
                alignSelf: isMe ? "flex-end" : "flex-start",
                backgroundColor: isMe ? "#007AFF" : isDark ? "#333" : "#E5E5EA", // ✅ FIX
                padding: 10,
                borderRadius: 10,
                marginVertical: 5,
                maxWidth: "70%",
              }}
            >
              {msg.type === "text" ? (
                <Text
                  style={{
                    color: isMe ? "#fff" : isDark ? "#fff" : "#000", // ✅ FIX
                  }}
                >
                  {msg.text}
                </Text>
              ) : (
                <TouchableOpacity
                  onPress={async () => {
                    const { sound } = await Audio.Sound.createAsync({
                      uri: msg.audio,
                    });
                    await sound.playAsync();
                  }}
                >
                  <Ionicons
                    name="play"
                    size={20}
                    color={isMe ? "#fff" : isDark ? "#fff" : "#000"} // ✅ FIX
                  />
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Input + Mic */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TextInput
          placeholder="Type message"
          placeholderTextColor={isDark ? "#aaa" : "#555"} // ✅ FIX
          value={message}
          onChangeText={setMessage}
          style={{
            flex: 1,
            borderWidth: 1,
            borderRadius: 20,
            padding: 10,
            marginRight: 10,
            backgroundColor: isDark ? "#2a2a2a" : "#fff", // ✅ FIX
            color: isDark ? "#fff" : "#000", // ✅ FIX
          }}
        />

        {message.trim() ? (
          <TouchableOpacity onPress={sendMessage}>
            <Ionicons name="send" size={26} color="#007AFF" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPressIn={startRecording}
            onPressOut={stopRecording}
            style={{
              backgroundColor: recording ? "red" : "#25D366",
              width: 50,
              height: 50,
              borderRadius: 25,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="mic" size={24} color="#fff" />
          </TouchableOpacity>
        )}

        {/* Theme Toggle */}
        <Pressable onPress={() => setIsDark(!isDark)}>
          <Text style={{ marginLeft: 10, color: isDark ? "#fff" : "#000" }}>
            {isDark ? "Light" : "Dark"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}