import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ref, set } from "firebase/database";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { AgendamentoModel } from "../models/Agendar";
import { auth, db } from "../services/connectionFirebase";

type RootStackParamList = {
  Agendamentos: undefined;
  Agendar: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function AgendarScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [nomeCliente, setNomeCliente] = useState("");
  const [nomeBarbeador, setNomeBarbeador] = useState("");
  const [nomeCorte, setNomeCorte] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [loading, setLoading] = useState(false);

  const criarAgendamento = async () => {
    if (!nomeCliente || !nomeBarbeador || !nomeCorte || !data || !horario) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    try {
      setLoading(true);

      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Erro", "Usuario não autenticado.");
        return;
      }

      const id = Date.now().toString();
      const agendamento = new AgendamentoModel(
        nomeCliente,
        nomeBarbeador,
        nomeCorte,
        data.replace(/\//g, "-"),
        horario
      );

      const caminho = `agendamentos/${user.uid}/${id}`;
      await set(ref(db, caminho), agendamento);

      Alert.alert("Sucesso", "Agendamento criado com sucesso!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Agendamentos"),
        },
      ]);

    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possivel criar o agendamento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novo Agendamento</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do Cliente"
        placeholderTextColor="#777"
        onChangeText={setNomeCliente}
      />

      <TextInput
        style={styles.input}
        placeholder="Nome do Barbeiro"
        placeholderTextColor="#777"
        onChangeText={setNomeBarbeador}
      />

      <TextInput
        style={styles.input}
        placeholder="Servi�o (Corte, Barba...)"
        placeholderTextColor="#777"
        onChangeText={setNomeCorte}
      />

      <TextInput
        style={styles.input}
        placeholder="Data (20-11-2024)"
        placeholderTextColor="#777"
        onChangeText={setData}
      />

      <TextInput
        style={styles.input}
        placeholder="Horario (14:00)"
        placeholderTextColor="#777"
        onChangeText={setHorario}
      />

      <TouchableOpacity
        style={[styles.button, styles.buttonSalvar]}
        onPress={criarAgendamento}
        disabled={loading}
      >
        <MaterialIcons name="save" size={20} color="#fff" />
        <Text style={styles.buttonText}>{loading ? "Salvando..." : "Salvar Agendamento"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.buttonVer]}
        onPress={() => navigation.navigate("Agendamentos")}
      >
        <MaterialIcons name="list" size={20} color="#fff" />
        <Text style={styles.buttonText}>Ver meus agendamentos</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", color: "#000", marginBottom: 20 },
  input: {
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 8,
    color: "#fff",
    borderWidth: 1,
    borderColor: "#333",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#355dffff",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 10,
  },
  buttonSalvar: { backgroundColor: "#0039e4ff" },
  buttonVer: { backgroundColor: "#4A90E2" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
