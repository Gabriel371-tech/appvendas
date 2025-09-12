// DashboardScreen.tsx
import { signOut } from "firebase/auth";
import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { auth } from "../services/connectionFirebase";

export default function DashboardScreen({ navigation }) {
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login");
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>🎉 Bem-vindo à Dashboard!</Text>
        <Text style={styles.subtitle}>Você está logado com sucesso.</Text>
        <View style={styles.buttonContainer}>
          <Button title="Sair" onPress={handleLogout} color="#d9534f" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 30,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    alignItems: "center",
    width: "85%",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    marginTop: 10,
  },
});
