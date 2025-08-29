import { RootStackParamList } from "@/app/(tabs)";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "expo-router";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
type NavProp = StackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavProp>();

  return (
      <View style={styles.container}>
        <View style={styles.Header}>
          <Image style={styles.logo} source={require("../../assets/images/logo.png")}/>
          <Text style={styles.texto}>Seja Bem vindo</Text>
          <TouchableOpacity style={styles.botao}>Agendar</TouchableOpacity>

          {/* Botao de navegação para o login */}
          <TouchableOpacity
            style={styles.botao}
            onPress={() => navigation.navigate("Login")}
          >
            Login
          </TouchableOpacity>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa 100% da altura da tela
    justifyContent: "center", // Centraliza conteúdo verticalmente
    alignItems: "center", // Centraliza conteúdo horizontalmente
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
  },

  Header: {
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    gap: 8,
  },
  logo: {
    width: 200,
    height: 200,
  },
  texto: {
    marginTop: 40,
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
  },
  botao: {
    marginTop: 50,
    backgroundColor: "black",
    color: "white",
    fontSize: 20,
    padding: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
    fontWeight: "600",
  },
});
