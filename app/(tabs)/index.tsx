import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import HomeScreen from "../../src/screens/HomeScreen";
import LoginScreen from "../../src/screens/LoginScreen";
 
export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
};
 
const Stack = createStackNavigator<RootStackParamList>();
 
export default function RootStack() {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}