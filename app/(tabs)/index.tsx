import EditProfileScreen from "@/src/screens/EditProfileScreen";
import PerfilScreen from "@/src/screens/PerfilScreen";
import RegisterScreen from "@/src/screens/RegisterScreen";
import { createStackNavigator } from "@react-navigation/stack";
import AgendarScreen from "../../src/screens/AgendarScreen";
import DashboardScreen from "../../src/screens/DashBoardScreen";
import HomeScreen from "../../src/screens/HomeScreen";
import LoginScreen from "../../src/screens/LoginScreen";
export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  Dash: undefined;
  Perfil: undefined;
  EditProfile: undefined;
  Agendar: undefined;
};
 
const Stack = createStackNavigator<RootStackParamList>();
 
export default function RootStack() {
  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Dash" component={DashboardScreen} />
      <Stack.Screen name="Perfil" component={PerfilScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Agendar" component={AgendarScreen} />
    </Stack.Navigator>
  );
}