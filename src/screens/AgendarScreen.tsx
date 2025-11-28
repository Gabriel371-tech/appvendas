import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ref, set } from "firebase/database";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { auth, db } from "../services/connectionFirebase";

type RootStackParamList = {
  Agendamentos: undefined;
  Agendar: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function AgendarScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [nomeCliente, setNomeCliente] = useState("");
  const [nomePet, setNomePet] = useState("");
  const [servico, setServico] = useState("");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [loading, setLoading] = useState(false);

  const criarAgendamento = async () => {
    if (!nomeCliente || !nomePet || !servico || !data || !horario) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    try {
      setLoading(true);

      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      const id = Date.now().toString();

      const agendamento = {
        nomeCliente,
        nomePet,
        servico,
        data: data.replace(/\//g, "-"),
        horario,
        criadoEm: new Date().toISOString(),
      };

      const caminho = `agendamentos/${user.uid}/${id}`;
      await set(ref(db, caminho), agendamento);

      Alert.alert("Sucesso", "Agendamento do pet criado com sucesso!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Agendamentos"),
        },
      ]);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível criar o agendamento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novo Agendamento - PetShop</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do Cliente"
        placeholderTextColor="#777"
        value={nomeCliente}
        onChangeText={setNomeCliente}
      />

      <TextInput
        style={styles.input}
        placeholder="Nome do Pet"
        placeholderTextColor="#777"
        value={nomePet}
        onChangeText={setNomePet}
      />

      <TextInput
        style={styles.input}
        placeholder="Serviço (Banho, Tosa, Consulta...)"
        placeholderTextColor="#777"
        value={servico}
        onChangeText={setServico}
      />

      <TextInput
        style={styles.input}
        placeholder="Data (20-11-2025)"
        placeholderTextColor="#777"
        value={data}
        onChangeText={setData}
      />

      <TextInput
        style={styles.input}
        placeholder="Horário (14:00)"
        placeholderTextColor="#777"
        value={horario}
        onChangeText={setHorario}
      />

      <TouchableOpacity
        style={[styles.button, styles.buttonSalvar]}
        onPress={criarAgendamento}
        disabled={loading}
      >
        <MaterialIcons name="save" size={20} color="#fff" />
        <Text style={styles.buttonText}>
          {loading ? "Salvando..." : "Salvar Agendamento"}
        </Text>
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },
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
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 10,
  },
  buttonSalvar: {
    backgroundColor: "#0039e4ff",
  },
  buttonVer: {
    backgroundColor: "#4A90E2",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
