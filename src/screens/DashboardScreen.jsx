// DashboardScreen.tsx
import { signOut } from "firebase/auth";
import { Button, Text, View } from "react-native";
import { auth } from "../services/connectionFirebase";

export default function DashboardScreen({ navigation }) {
  const handleLogout = async () => {
    await signOut(auth);
    navigation.replace("Login");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Bem-vindo à Dashboard!</Text>
      <Button title="Sair" onPress={handleLogout} />
    </View>
  );
}
