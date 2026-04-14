import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, ScrollView } from "react-native";
import { io } from "socket.io-client";

const socket = io("http://192.168.1.32:5000");

export default function WishlistScreen() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [currentUser, setCurrentUser] = useState("User A");

  useEffect(() => {
    //receive the messeage
    socket.on("message", (data) => {

      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("message");
  }, []);

  // this send the message//
  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("message", {  //emit is used to send data from one side to another (client ↔ server)
      user: currentUser,
      text: message,
    });

    setMessage("");
  };

  return (
    <View style={{ flex: 1, padding: 10, marginTop: 40 }}>
      {/* Switch User */}
      <Button
        title={`Switch to ${currentUser === "User A" ? "User B" : "User A"}`}
        onPress={() =>
          setCurrentUser(currentUser === "User A" ? "User B" : "User A")
        }
      />

      <Text style={{ marginVertical: 10, textAlign: "center" }}>
        Current: {currentUser}
      </Text>

      {/* Chat */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 10 }}>
        {messages.map((msg, i) => {
          const isMe = msg.user === currentUser;

          return (
            <View
              key={i}
              style={{
                alignSelf: isMe ? "flex-end" : "flex-start",
                backgroundColor: isMe ? "#007AFF" : "#E5E5EA",
                padding: 10,
                borderRadius: 10,
                marginVertical: 5,
                maxWidth: "70%",
              }}
            >
              <Text style={{ color: isMe ? "#fff" : "#000" }}>{msg.text}</Text>

              <Text
                style={{
                  fontSize: 10,
                  color: isMe ? "#ddd" : "#555",
                  marginTop: 5,
                }}
              >
                {/* {msg.user} */}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      {/* Input Area */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <TextInput
          placeholder="Type message"
          value={message}
          onChangeText={setMessage}
          style={{
            flex: 1,
            borderWidth: 1,
            borderRadius: 20,
            padding: 10,
            marginRight: 10,
          }}
        />

        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
}
// import React, { useEffect, useState } from "react";
// import { View, Text, TextInput, Button, ScrollView } from "react-native";
// import { io } from "socket.io-client";
// import { Audio } from "expo-av";

// const socket = io("http://192.168.1.32:5000");

// export default function WishlistScreen() {
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [currentUser, setCurrentUser] = useState("User A");

//   const [recording, setRecording] = useState(null);

//   useEffect(() => {
//     socket.on("message", (data) => {
//       setMessages((prev) => [...prev, data]);
//     });

//     return () => socket.off("message");
//   }, []);

//   // 🔹 Send text message
//   const sendMessage = () => {
//     if (!message.trim()) return;

//     socket.emit("message", {
//       user: currentUser,
//       type: "text",
//       text: message,
//     });

//     setMessage("");
//   };

//   // 🔹 Start recording
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

//   // 🔹 Stop recording & send
//   const stopRecording = async () => {
//     try {
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
//       <Button
//         title={`Switch to ${currentUser === "User A" ? "User B" : "User A"}`}
//         onPress={() =>
//           setCurrentUser(currentUser === "User A" ? "User B" : "User A")
//         }
//       />

//       <Text style={{ marginVertical: 10, textAlign: "center" }}>
//         Current: {currentUser}
//       </Text>

//       {/* Chat */}
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
//                 <Button
//                   title="▶ Play Audio"
//                   onPress={async () => {
//                     const { sound } = await Audio.Sound.createAsync({
//                       uri: msg.audio,
//                     });
//                     await sound.playAsync();
//                   }}
//                 />
//               )}
//             </View>
//           );
//         })}
//       </ScrollView>

//       {/* Input Area */}
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

//         <Button title="Send" onPress={sendMessage} />
//       </View>

//       {/* Voice Controls */}
//       <View style={{ marginTop: 10 }}>
//         <Button title="🎙 Start Recording" onPress={startRecording} />
//         <Button title="⏹ Stop & Send" onPress={stopRecording} />
//       </View>
//     </View>
//   );
// }