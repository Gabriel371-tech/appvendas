import { MaterialIcons } from "@expo/vector-icons";
import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ref, remove, update } from "firebase/database";
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "../services/connectionFirebase";

interface Agendamento {
  id: string;
  nomeCliente: string;
  servico: string;
  horario: string;
  data: string;
}

type RootStackParamList = {
  Agendamentos: undefined;
  Agendar: undefined;
  EditarAgendamento: { agendamento: Agendamento };
};

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "EditarAgendamento"
>;
type RoutePropType = RouteProp<RootStackParamList, "EditarAgendamento">;

export default function EditarAgendamentoScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const { agendamento } = route.params;

  const [nomeCliente, setNomeCliente] = useState(agendamento?.nomeCliente || "");
  const [servico, setServico] = useState(agendamento?.servico || "");
  const [horario, setHorario] = useState(agendamento?.horario || "");
  const [data, setData] = useState(agendamento?.data || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: "Editar Agendamento",
    });
  }, [navigation]);

  // -------------------------
  // SALVAR ALTERA��ES
  // -------------------------
  const salvarAlteracoes = async () => {
    if (!nomeCliente || !servico || !horario || !data) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    setLoading(true);

    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Erro", "Usu�rio n�o autenticado");
        return;
      }

      const caminho = `agendamentos/${user.uid}/${agendamento.id}`;
      const agendamentoRef = ref(db, caminho);

      await update(agendamentoRef, {
        nomeCliente,
        nomeCorte: servico,
        horario,
        data: data.replace(/\//g, "-"),
      });

      Alert.alert("Sucesso", "Agendamento atualizado!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Falha ao atualizar agendamento");
    }

    setLoading(false);
  };

  // -------------------------
  // EXCLUIR AGENDAMENTO
  // -------------------------
  const excluirAgendamento = () => {
    Alert.alert(
      "Confirmar exclus�o",
      "Tem certeza que deseja excluir este agendamento?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              const user = auth.currentUser;
              if (!user) return;

              const caminho = `agendamentos/${user.uid}/${agendamento.id}`;
              await remove(ref(db, caminho));

              Alert.alert("Sucesso", "Agendamento exclu�do!", [
                { text: "OK", onPress: () => navigation.goBack() },
              ]);
            } catch (error) {
              console.log(error);
              Alert.alert("Erro", "N�o foi poss�vel excluir");
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Editar Agendamento</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.field}>
          <Text style={styles.label}>Nome do Cliente</Text>
          <TextInput
            style={styles.input}
            value={nomeCliente}
            onChangeText={setNomeCliente}
            placeholder="Jo�o Silva"
            placeholderTextColor="#666"
            editable={!loading}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Servi�o</Text>
          <TextInput
            style={styles.input}
            value={servico}
            onChangeText={setServico}
            placeholder="Corte, Barba..."
            placeholderTextColor="#666"
            editable={!loading}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Data</Text>
          <TextInput
            style={styles.input}
            value={data}
            onChangeText={setData}
            placeholder="20-11-2024"
            placeholderTextColor="#666"
            editable={!loading}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Hor�rio</Text>
          <TextInput
            style={styles.input}
            value={horario}
            onChangeText={setHorario}
            placeholder="14:00"
            placeholderTextColor="#666"
            editable={!loading}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, styles.buttonSalvar]}
          onPress={salvarAlteracoes}
          disabled={loading}
        >
          <MaterialIcons name="save" size={20} color="#fff" />
          <Text style={styles.buttonText}>
            {loading ? "Salvando..." : "Salvar Altera��es"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonExcluir]}
          onPress={excluirAgendamento}
          disabled={loading}
        >
          <MaterialIcons name="delete" size={20} color="#fff" />
          <Text style={styles.buttonText}>Excluir Agendamento</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.buttonCancelar]}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <MaterialIcons name="arrow-back" size={20} color="#fff" />
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  content: { padding: 20 },
  field: { marginBottom: 20 },
  label: { color: "#ccc", marginBottom: 8, fontSize: 14 },
  input: {
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 8,
    color: "#fff",
    borderWidth: 1,
    borderColor: "#333",
  },
  button: {
    flexDirection: "row",
    gap: 8,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  buttonSalvar: { backgroundColor: "#4CAF50" },
  buttonExcluir: { backgroundColor: "#f44336" },
  buttonCancelar: { backgroundColor: "#666" },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
