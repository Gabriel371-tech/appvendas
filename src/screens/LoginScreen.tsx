import { RootStackParamList } from "@/app/(tabs)";
import { FontAwesome5 } from '@expo/vector-icons'; // Para ícones (se não tiver o pacote, instale com `expo install @expo/vector-icons`)
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { Alert, Dimensions, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const { width } = Dimensions.get("window");

type NavProp = StackNavigationProp<RootStackParamList>;

export default function LoginScreen({ navigation }: { navigation: NavProp }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email === "admin@barbearia.com" && password === "123456") {
      navigation.navigate("Home");
    } else {
      Alert.alert("Erro", "E-mail ou senha inválidos.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo à Barbearia</Text>

      {/* Campo de E-mail */}
      <View style={styles.inputContainer}>
        <FontAwesome5 name="envelope" size={20} color="#ccc" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      {/* Campo de Senha */}
      <View style={styles.inputContainer}>
        <FontAwesome5 name="lock" size={20} color="#ccc" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {/* Botão de Login */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      {/* Esqueci a Senha */}
      <TouchableOpacity onPress={() => Alert.alert("Recuperação de senha")} style={styles.forgotPassword}>
        <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#F4F4F9", // Fundo mais suave, com tom pastel
  },
  title: {
    fontSize: 28, // Aumentamos o título para torná-lo mais chamativo
    fontWeight: "bold",
    color: "#2C3E50", // Um tom de cinza escuro com um toque de azul
    marginBottom: 40,
  },
  inputContainer: {
    width: width - 40,
    height: 50,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5, // Elevação para dar um efeito de sombra sutil
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 15,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#2C3E50",
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 10, // Espaço entre o ícone e o texto
  },
  button: {
    width: width - 40,
    height: 50,
    backgroundColor: "#03090e", // Azul mais intenso e moderno
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  forgotPassword: {
    marginTop: 15,
  },
  forgotPasswordText: {
    color: "#4690ff", // Cor do link de "Esqueci minha senha"
    fontSize: 14,
  },
});
