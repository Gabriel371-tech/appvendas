import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { get, ref, remove } from "firebase/database";
import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { auth, db } from "../services/connectionFirebase";

interface Agendamento {
  id: string;
  nomeCliente: string;
  nomePet: string;
  servico: string;
  horario: string;
  data: string;
}

type RootStackParamList = {
  Agendamentos: undefined;
  Agendar: undefined;
  EditarAgendamento: { agendamento: Agendamento };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function AgendamentosScreen() {
  const navigation = useNavigation<NavigationProp>();

  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(false);

  // --------------------------
  // CARREGAR AGENDAMENTOS
  // --------------------------
  const carregarAgendamentos = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        setAgendamentos([]);
        setLoading(false);
        return;
      }

      const agendamentosRef = ref(db, `agendamentos/${user.uid}`);
      const snapshot = await get(agendamentosRef);

      if (snapshot.exists()) {
        const data = snapshot.val();

        const lista = Object.entries(data).map(([id, value]: any) => ({
          id: String(id),
          nomeCliente: value.nomeCliente,
          nomePet: value.nomePet || "",
          servico: value.servico,
          horario: value.horario,
          data: value.data,
        }));

        setAgendamentos(lista);
      } else {
        setAgendamentos([]);
      }
    } catch (error) {
      console.log("Erro ao carregar agendamentos:", error);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------
  // EXCLUIR AGENDAMENTO
  // --------------------------
  const excluirAgendamento = (id: string) => {
    const executarExclusao = async () => {
      setLoading(true);

      try {
        const user = auth.currentUser;
        if (!user) return;

        const path = `agendamentos/${user.uid}/${id}`;
        await remove(ref(db, path));

        setAgendamentos((prev) => prev.filter((a) => a.id !== id));
        Alert.alert("Sucesso", "Agendamento excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir:", error);
        Alert.alert("Erro", "Falha ao excluir agendamento.");
      } finally {
        setLoading(false);
      }
    };

    if (Platform.OS === "web") {
      if (window.confirm("Deseja realmente excluir este agendamento?")) {
        executarExclusao();
      }
      return;
    }

    Alert.alert(
      "Confirmar exclusão",
      "Deseja realmente excluir este agendamento?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: executarExclusao },
      ]
    );
  };

  useEffect(() => {
    carregarAgendamentos();
    const unsubscribe = navigation.addListener("focus", carregarAgendamentos);
    return unsubscribe;
  }, []);

  // --------------------------
  // EDITAR
  // --------------------------
  const editarAgendamento = (agendamento: Agendamento) => {
    navigation.navigate("EditarAgendamento", { agendamento });
  };

  // --------------------------
  // NOVO AGENDAMENTO
  // --------------------------
  const irParaAgendar = () => {
    navigation.navigate("Agendar");
  };

  // --------------------------
  // ITEM DA LISTA
  // --------------------------
  const renderAgendamento = ({ item }: { item: Agendamento }) => (
    <View style={styles.agendamentoCard}>
      <View style={styles.agendamentoInfo}>
        <Text style={styles.agendamentoNome}>
          Cliente: {item.nomeCliente}
        </Text>
        <Text style={styles.agendamentoPet}>
          Pet: {item.nomePet}
        </Text>
        <Text style={styles.agendamentoServico}>
          Serviço: {item.servico}
        </Text>
        <Text style={styles.agendamentoHora}>
          Horário: {item.horario}
        </Text>
        <Text style={styles.agendamentoHora}>
          Data: {item.data}
        </Text>
      </View>

      <View style={styles.agendamentoBotoes}>
        <TouchableOpacity
          style={[styles.botaoIcon, styles.botaoEditar]}
          onPress={() => editarAgendamento(item)}
        >
          <MaterialIcons name="edit" size={20} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.botaoIcon, styles.botaoExcluir]}
          onPress={() => excluirAgendamento(item.id)}
        >
          <MaterialIcons name="delete" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Agendamentos - PetShop</Text>

        <TouchableOpacity
          style={styles.botaoNovoAgendamento}
          onPress={irParaAgendar}
        >
          <MaterialIcons name="add" size={24} color="#fff" />
          <Text style={styles.botaoNovoTexto}>Novo Agendamento</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3572ff" />
        </View>
      ) : agendamentos.length === 0 ? (
        <View style={styles.vazioContainer}>
          <MaterialIcons name="pets" size={64} color="#666" />
          <Text style={styles.vazioTexto}>Nenhum agendamento encontrado</Text>
        </View>
      ) : (
        <FlatList
          data={agendamentos}
          keyExtractor={(item) => item.id}
          renderItem={renderAgendamento}
          contentContainerStyle={styles.listContainer}
          refreshing={loading}
          onRefresh={carregarAgendamentos}
        />
      )}
    </View>
  );
}

const { width } = Dimensions.get("window");

// ----------------------
// ESTILOS
// ----------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#3572ff",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
  },
  title: { fontSize: 22, fontWeight: "bold", color: "#fff", marginBottom: 15 },
  botaoNovoAgendamento: {
    flexDirection: "row",
    backgroundColor: "#0039e4",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoNovoTexto: { color: "#fff", fontWeight: "bold", marginLeft: 8 },
  listContainer: { padding: 15, paddingBottom: 30 },
  agendamentoCard: {
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderLeftWidth: 5,
    borderLeftColor: "#3572ff",
  },
  agendamentoInfo: { flex: 1, marginRight: 10 },
  agendamentoNome: { fontSize: 16, fontWeight: "bold", color: "#000" },
  agendamentoPet: { color: "#444", marginBottom: 4 },
  agendamentoServico: { color: "#555", marginBottom: 6 },
  agendamentoHora: { color: "#555" },
  agendamentoBotoes: { flexDirection: "row", gap: 8 },
  botaoIcon: {
    width: 36,
    height: 36,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoEditar: { backgroundColor: "#4CAF50" },
  botaoExcluir: { backgroundColor: "#f44336" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  vazioContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  vazioTexto: { color: "#666", marginTop: 15, fontSize: 18 },
});
