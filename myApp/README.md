
## important component react native (Tags)

-----------------------------------------------------------------------------------------------------
<View></View>{
This is used for layout and grouping components in React Native.
It is similar to <div> in web development.
}

<Text></Text>{
This is used to display text in React Native.
It is similar to text elements in web like:
[p, span, h1-h6]
}

<TextInput />{

This is used to take input from the user.
It is similar to <input /> in web development.

Example (Web):
<input onChange={(e)=> console.log(e.target.value)} />

Example (React Native):
<TextInput onChangeText={(text) => console.log(text)} />
}


<Image />{
This is used to display images in React Native.
It is similar to <img /> in web development.

Example:
<Image source={{uri: ""}} 
style={{width:100,height:100}} />
}



<ImageBackground>
</ImageBackground>{
This is used to display a background image with content on top of it.
It is similar to using background-image in CSS in web development.
}


<Button />{

This is used to create a basic button.
It is similar to <button> in web development.

Example:
<Button title="Submit" onPress={() => console.log("Button Pressed")} />
}


<Pressable>
</Pressable>
{

This is used to detect press interactions like click or touch.
It is similar to clickable elements in web like <button> or clickable <div>.
}


<TouchableOpacity>
</TouchableOpacity>
This is used to create pressable components with opacity effect when pressed.
It is commonly used for custom buttons.


<ScrollView>
</ScrollView>
This is used to create a scrollable container when content is larger than the screen.
It is similar to CSS overflow scroll in web.


<FlatList />
This is used to efficiently render large lists of data.
It is similar to rendering lists using map() in ReactJS.


<SectionList />
This is used to render grouped lists with sections.
Example: contacts grouped by alphabet.


<Modal>
</Modal>
This is used to display content in a popup layer above the screen.
It is similar to modals or dialogs in web applications.


<ActivityIndicator />
This is used to show a loading spinner.
It is similar to loading spinners in web applications.


<SafeAreaView>
</SafeAreaView>
This ensures content stays inside the safe area of the device screen
and does not overlap with notches or system UI.

<KeyboardAvoidingView>
</KeyboardAvoidingView>
This is used to adjust layout when the keyboard appears,
so input fields are not hidden by the keyboard.

------------------------------------------------------------------------------------------------------
## Styling in React Native

React Native uses JavaScript objects to style components.
Styles are usually created using `StyleSheet.create()`.

Example:

import { View, Text, StyleSheet } from "react-native";

const App = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello React Native</Text>
    </View>
  );
};
## JavaScript objects to style components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2"
  },

  text: {
    fontSize: 20,
    color: "blue",
    fontWeight: "bold"
  }
});



------------------------------------------------------------------------------------------------------

### Setup Using Expo

Expo is the easiest way to start a React Native project.

#### Install Node.js
Download and install Node.js.

#### Install Expo CLI

npm install -g expo-cli

#### Create a new project

npx create-expo-app myApp

#### Go to project folder

cd myApp

#### Start the project

npx expo start

You can run the app using:
- Android Emulator
- Expo Go app on mobile

-----------------------------------------------------------------------------------------
### Setup Using React Native CLI

React Native CLI gives full control over the native Android/iOS environment.

#### Install Node.js

Download and install Node.js.

#### Install Android Studio
Install Android Studio and setup Android SDK.

#### Create a new React Native project

npx react-native init myApp

#### Go to project folder

cd myApp

#### Install dependencies

npm install

#### Run the Android app

npx react-native run-android

------------------------------------------------------------------------------------------------------------------------------------------------------
## navigation in the apps

1.Navigation System

Navigation in this application is implemented using React Navigation, which provides a flexible and scalable way to manage screen transitions and user flow.

2.The app follows a modular navigation architecture consisting of

Root Navigator – Controls the overall app flow
Stack Navigator – Handles screen transitions (forward/back)
Tab Navigator – Manages switching between main sections

3.Navigation Flow
     App Start
     ↓
     AppNavigator (Root)
     ↓
     TabNavigator (Main Sections)
     ├── Home
     ├── Profile
     ↓
     StackNavigator (Inside Tabs)
     ↓
     Screens (Home → Details)
       Key Concepts
1. NavigationContainer
Wraps the entire application
Manages navigation state
2. Stack Navigation
Used for hierarchical navigation
Screens are pushed and popped like a stack
Automatically provides a back button

Example:
Home → Details → Back

3. Tab Navigation
Used for top-level navigation
Allows switching between main sections
Does not include back navigation
---------------------------------------------------------------------------------------------------------------
## AsyncStorage Example
AsyncStorage – Simple async key-value storage
Use for: small data, basic apps
MMKV (react-native-mmkv) – Fast, synchronous storage
Use for: high performance, frequent access
Redux Persist (redux-persist) – Persists Redux state
Use for: saving global app state
### Example of async storage

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Store data
const saveUser = async () => {
  const user = { name: "Sandip", age: 25 };
  await AsyncStorage.setItem("user", JSON.stringify(user));
};

// Get data
const getUser = async () => {
  const data = await AsyncStorage.getItem("user");
  return data ? JSON.parse(data) : null;
};
```

---

### Explanation

* `"user"` → key (must be a string)
* `user` object → converted to string using `JSON.stringify()`
* Stored as key-value pair in device storage
* Retrieved data is converted back using `JSON.parse()`


### Summary

* Key → string
* Value → string (use JSON.stringify)
* `await` ensures proper execution of async storage operations





---------------------------------------------------------------------------------------------------------------
## how to upload image in app ## Image Upload Implementation
Image upload allows users to select or capture images and use them within the application.



### Installation
npm install expo-image-picker

### Import
import * as ImagePicker from 'expo-image-picker';

### Implementation

#### Select Image (Gallery)

```javascript
const pickImage = async () => {
  await ImagePicker.requestCameraPermissionsAsync(); await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!result.canceled) {
    return result.assets[0].uri;
  }
};


#### Capture Image (Camera)

const takePhoto = async () => {
   const result = await ImagePicker.launchImageLibraryAsync();
  const result = await ImagePicker.launchCameraAsync();

  if (!result.canceled) {
    return result.assets[0].uri;
  }
};
```

---

#### Permissions
await ImagePicker.requestCameraPermissionsAsync();
await ImagePicker.requestMediaLibraryPermissionsAsync();


### Usage

* Get image URI from picker
* Store URI in state or local storage
* Display using Image component
* Send URI to backend if required

