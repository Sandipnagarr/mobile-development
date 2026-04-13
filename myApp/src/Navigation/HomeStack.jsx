import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../Screen/HomeScreen";
import ProductScreen from "../Screen/ProductScreen";

const Stack = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Product" component={ProductScreen} />
    </Stack.Navigator>
  );
}
