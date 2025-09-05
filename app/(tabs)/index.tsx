import RegisterScreen from "@/src/screens/RegisterScreen";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import DashboardScreen from "../../src/screens/DashBoardScreen";
import HomeScreen from "../../src/screens/HomeScreen";
import LoginScreen from "../../src/screens/LoginScreen";
 
export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Dash: undefined;

};
 
const Stack = createStackNavigator<RootStackParamList>();
 
export default function RootStack() {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Dash" component={DashboardScreen} />
    </Stack.Navigator>
  );
}