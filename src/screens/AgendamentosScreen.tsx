import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { get, ref, remove } from "firebase/database";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
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
        return;
      }

      const agendamentosRef = ref(db, `agendamentos/${user.uid}`);
      const snapshot = await get(agendamentosRef);

      if (snapshot.exists()) {
        const data = snapshot.val();

        const lista = Object.entries(data).map(([id, value]: any) => ({
          id,
          nomeCliente: value.nomeCliente,
          servico: value.nomeCorte,
          horario: value.horario,
          data: value.data,
        }));

        setAgendamentos(lista);
      } else {
        setAgendamentos([]);
      }
    } catch (error) {
      console.log("Erro ao carregar agendamentos:", error);
    }

    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      carregarAgendamentos();
    }, [])
  );

  // --------------------------
  // EXCLUIR
  // --------------------------
  const excluirAgendamento = (id: string) => {
    Alert.alert(
      "Confirmar exclusÆo",
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

              const caminho = `agendamentos/${user.uid}/${id}`;

              await remove(ref(db, caminho));

              setAgendamentos((prev) =>
                prev.filter((agendamento) => agendamento.id !== id)
              );

              Alert.alert("Sucesso", "Agendamento exclu¡do!");
            } catch (error) {
              console.log(error);
              Alert.alert("Erro", "NÆo foi poss¡vel excluir.");
            }
          },
        },
      ]
    );
  };

  // --------------------------
  // EDITAR
  // --------------------------
  const editarAgendamento = (agendamento: Agendamento) => {
    navigation.navigate("EditarAgendamento", { agendamento });
  };

  // --------------------------
  // IR PARA TELA AGENDAR
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
        <Text style={styles.agendamentoNome}>{item.nomeCliente}</Text>
        <Text style={styles.agendamentoServico}>{item.servico}</Text>
        <Text style={styles.agendamentoHora}>Hor rio: {item.horario}</Text>
        <Text style={styles.agendamentoHora}>Data: {item.data}</Text>
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
        <Text style={styles.title}>Meus Agendamentos</Text>

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
          <ActivityIndicator size="large" color="#FF6B35" />
        </View>
      ) : agendamentos.length === 0 ? (
        <View style={styles.vazioContainer}>
          <MaterialIcons name="event-busy" size={64} color="#666" />
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
  container: { flex: 1, backgroundColor: "#111" },
  header: {
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 15 },
  botaoNovoAgendamento: {
    flexDirection: "row",
    backgroundColor: "#FF6B35",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoNovoTexto: { color: "#fff", fontWeight: "bold", marginLeft: 8 },
  listContainer: { padding: 15, paddingBottom: 30 },
  agendamentoCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#FF6B35",
  },
  agendamentoInfo: { flex: 1, marginRight: 10 },
  agendamentoNome: { fontSize: 16, fontWeight: "bold", color: "#fff" },
  agendamentoServico: { color: "#ccc", marginBottom: 6 },
  agendamentoHora: { color: "#999" },
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
  vazioTexto: { color: "#fff", marginTop: 15, fontSize: 18 },
});
