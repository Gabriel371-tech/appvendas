import { RootStackParamList } from "@/app/(tabs)";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../services/connectionFirebase"; // Ajuste o caminho conforme seu projeto

const { width } = Dimensions.get("window");

type NavProp = StackNavigationProp<RootStackParamList, "Login">;

export default function LoginScreen() {
  const navigation = useNavigation<NavProp>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isEmailValid = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const isPasswordValid = (password: string) => {
    return password.length >= 6;
  };

  const handleLogin = async () => {
    if (!isEmailValid(email)) {
      Alert.alert("Erro", "Por favor, insira um e-mail válido.");
      return;
    }

    if (!isPasswordValid(password)) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate("Dash"); // Navega para tela Home após login
    } catch (error: any) {
      console.error(error);
      Alert.alert("Erro", "E-mail ou senha incorretos.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo à Barbearia</Text>

      {/* E-mail */}
      <View style={styles.inputContainer}>
        <FontAwesome5 name="envelope" size={20} color="#ccc" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Senha */}
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

      {/* Botão de login */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      {/* Esqueci minha senha */}
      <TouchableOpacity onPress={() => Alert.alert("Recuperação de senha em breve")}>
        <Text style={styles.forgotPasswordText}>Esqueci minha senha</Text>
      </TouchableOpacity>

      {/* Criar conta */}
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.forgotPasswordText}>Não tem conta? Crie uma</Text>
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
    backgroundColor: "#F4F4F9",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 40,
  },
  inputContainer: {
    width: width - 50,
    height: 50,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
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
    marginRight: 10,
  },
  button: {
    width: width - 50,
    height: 50,
    backgroundColor: "#000",
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
  forgotPasswordText: {
    color: "#3498DB",
    fontSize: 14,
    marginTop: 15,
  },
});
