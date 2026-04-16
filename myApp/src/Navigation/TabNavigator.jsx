import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Pressable } from "react-native";

import HomeStack from "./HomeStack";
import CategoryScreen from "../Screen/CategoryScreen";
import WishlistScreen from "../Screen/WishlistScreen";
import ProfileScreen from "../Screen/ProfileScreen";
import MapScreen from "../Screen/MapScreen";
import Fontisto from "react-native-vector-icons/Fontisto";

const Tab = createBottomTabNavigator();

function BackToHomeButton({ navigation }) {
  return (
    <Pressable
      onPress={() => navigation.navigate("HomeTab")}
      style={{ marginLeft: 4 }}
    >
      <Ionicons name="arrow-back" size={24} color="black" />
    </Pressable>
  );
}

export default function TabNavigator({ onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerTintColor: "black",

        unmountOnBlur: true,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={{
          headerShown: false,
          title: "Home",
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Categories"
        component={CategoryScreen}
        options={({ navigation }) => ({
          title: "Route",
          headerLeft: () => <BackToHomeButton navigation={navigation} />,
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="grid" size={size} color={color} />
          ),
        })}
      />

      <Tab.Screen
        name="Chat"
        component={WishlistScreen}
        options={({ navigation }) => ({
          title: "Messege",
          headerLeft: () => <BackToHomeButton navigation={navigation} />,
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="chatbubble-outline" size={size} color={color} />
          ),
        })}
      />

      <Tab.Screen
        name="map"
        component={MapScreen}
        options={({ navigation }) => ({
          title: "map",
          headerLeft: () => <BackToHomeButton navigation={navigation} />,
          tabBarIcon: ({ size, color }) => (
            <Fontisto name="map" size={size} color={color} />
          ),
        })}
      />
      <Tab.Screen
        name="Profile"
        options={({ navigation }) => ({
          title: "Profile",
          headerLeft: () => <BackToHomeButton navigation={navigation} />,
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        })}
      >
        {(props) => <ProfileScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}
