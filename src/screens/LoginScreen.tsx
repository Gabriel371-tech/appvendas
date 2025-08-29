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

    // Função para validar o email(Usando REGEX)
  const isEmailValid = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  // Função para validar a senha (A senha tem que ter mais 6 caracter)
  const isPasswordValid = (password: string) => {
    return password.length >= 6;
  };

  const handleLogin = () => {
    if (!isEmailValid(email)) {
      Alert.alert("Erro", "Por favor, insira um e-mail válido.");
      return;
    }

    if (!isPasswordValid(password)) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    // Verifica se o e-mail e senha são válidos para login
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

      {/* Não tem conta? Crie uma*/}
      <TouchableOpacity onPress={() => Alert.alert("Recuperação de senha")} style={styles.haveAccount}>
        <Text style={styles.forgotPasswordText}>Não tem conta? Crie uma</Text>
      </TouchableOpacity>

    </View>

    
  
  );
}

const styles = StyleSheet.create({
// Container principal da tela
  container: {
    flex: 1, // Container principal da tela
    justifyContent: "center",  // Centraliza conteúdo verticalmente
    alignItems: "center", // Centraliza conteúdo horizontalmente
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
    backgroundColor: "#000000",
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
    color: "#3498DB",
    fontSize: 14,
  },
  haveAccount: {
    marginTop: 15,
  },
  haveAccountText: {
    color: "#3498DB",
    fontSize: 14,
  }
});

