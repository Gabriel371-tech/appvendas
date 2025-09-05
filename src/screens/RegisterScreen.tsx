import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
 
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from "../services/connectionFirebase";
 
import React, { useState } from "react";
 
import {
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { RootStackParamList } from "../../app/(tabs)/index";
 
const { width } = Dimensions.get("window");
type NavProp = StackNavigationProp<RootStackParamList>;
 
export default function RegisterScreen() {
  const navigation = useNavigation<NavProp>();
 
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Estado para a caixa de mensagem
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
 
  // Valida o email
  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
 
  // Função para exibir a mensagem na tela
  const showMessage = (msg: string, isErr: boolean = false) => {
    setMessage(msg);
    setIsError(isErr);
    setTimeout(() => setMessage(""), 3000); // Esconde a mensagem após 3 segundos
  };
 
  const handleRegister = async () => {
    // Limpa a mensagem anterior antes de começar
    setMessage("");
 
    if (!name || !email || !password) {
      showMessage("Preencha todos os campos!", true);
      return;
    }
 
    if (!isValidEmail(email)) {
      showMessage("Digite um e-mail válido!", true);
      return;
    }
 
    if (password.length < 6) {
      showMessage("A senha deve ter pelo menos 6 caracteres!", true);
      return;
    }
 
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
 
      if (user) {
        await set(ref(database, 'users/' + user.uid), {
          uid: user.uid,
          name: name,
          email: email,
          createdAt: new Date().toISOString(),
        });
      }
 
      // Exibe a mensagem de sucesso primeiro
      showMessage("Usuário cadastrado com sucesso!");
     
      // Adiciona um atraso de 1.5 segundos antes de navegar para a tela anterior
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
 
    } catch (error: any) {
      showMessage(`Erro ao cadastrar: ${error.message}`, true);
    }
  };
 
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>📝 Cadastro</Text>
 
        <TextInput
          style={styles.input}
          placeholder="Nome"
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={name}
          onChangeText={setName}
        />
 
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
 
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="rgba(255,255,255,0.6)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
 
        {/* Componente de caixa de mensagem */}
        {message ? (
          <View style={[styles.messageBox, isError ? styles.errorBox : styles.successBox]}>
            <Text style={styles.messageText}>{message}</Text>
          </View>
        ) : null}
 
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>👤 Cadastrar</Text>
        </TouchableOpacity>
 
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginTop: 15 }}
        >
          <Text style={styles.linkText}>Já tem conta? Faça login</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f0f",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: width * 0.85,
    padding: 30,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    color: "#fff",
    borderRadius: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  messageBox: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  errorBox: {
    backgroundColor: '#ff3b3b',
  },
  successBox: {
    backgroundColor: '#4cd964',
  },
  messageText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 20,
    backgroundColor: "#FF512F",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkText: {
    color: "#fff",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});