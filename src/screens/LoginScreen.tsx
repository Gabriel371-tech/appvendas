// src/screens/LoginScreen.tsx
import { RootStackParamList } from "@/app/(tabs)/index";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth } from "../services/connectionFirebase";

const { width } = Dimensions.get("window");

type NavProp = NativeStackNavigationProp<RootStackParamList, "Login">;

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
      navigation.navigate("Dash");
    } catch (error: any) {
      console.error(error);
      Alert.alert("Erro", "E-mail ou senha incorretos.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
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

          {/* Voltar */}
          <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Text style={styles.forgotPasswordText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: "#F4F4F9",
  },
  container: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 40,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    height: 50,
    marginBottom: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#2C3E50",
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    elevation: 5,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
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
    textAlign: "center",
  },
});
