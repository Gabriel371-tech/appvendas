import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { RootStackParamList } from "../../app/(tabs)/index";
import { auth, database } from "../services/connectionFirebase";

type NavProp = StackNavigationProp<RootStackParamList>;

export default function RegisterScreen() {
  const navigation = useNavigation<NavProp>();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cidade, setCidade] = useState(""); // Novo campo de cidade

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const showMessage = (msg: string, isErr: boolean = false) => {
    setMessage(msg);
    setIsError(isErr);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleRegister = async () => {
    setMessage("");

    if (!name || !email || !password || !telefone || !cidade) {  // Verificação de campos obrigatórios
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
          telefone: telefone,  // Adicionando telefone
          cidade: cidade,      // Adicionando cidade
          createdAt: new Date().toISOString(),
        });
      }

      showMessage("Usuário cadastrado com sucesso!");

      setTimeout(() => {
        navigation.goBack();
      }, 1500);

    } catch (error: any) {
      showMessage(`Erro ao cadastrar: ${error.message}`, true);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#EAF2F8" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.title}>📝 Cadastro</Text>

          <TextInput
            style={styles.input}
            placeholder="Nome"
            placeholderTextColor="rgba(0,0,0,0.4)"
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={styles.input}
            placeholder="E-mail"
            placeholderTextColor="rgba(0,0,0,0.4)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={styles.input}
            placeholder="Senha"
            placeholderTextColor="rgba(0,0,0,0.4)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TextInput
            style={styles.input}
            placeholder="Telefone"
            placeholderTextColor="rgba(0,0,0,0.4)"
            value={telefone}
            onChangeText={setTelefone}
            keyboardType="phone-pad"
          />

          <TextInput
            style={styles.input}
            placeholder="Cidade"
            placeholderTextColor="rgba(0,0,0,0.4)"
            value={cidade}
            onChangeText={setCidade}
          />

          {message ? (
            <View style={[styles.messageBox, isError ? styles.errorBox : styles.successBox]}>
              <Text style={styles.messageText}>{message}</Text>
            </View>
          ) : null}

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>👤 Cadastrar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 15 }}>
            <Text style={styles.linkText}>Já tem conta? Faça login</Text>
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
  },
  card: {
    width: "85%",
    padding: 30,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    alignSelf: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: "#F0F0F0",
    color: "#333",
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
    backgroundColor: '#F56262',
  },
  successBox: {
    backgroundColor: '#34C759',
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
    backgroundColor: "#007AFF",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  linkText: {
    color: "#007AFF",
    fontSize: 14,
    textDecorationLine: "underline",
    textAlign: "center",
  },
});
