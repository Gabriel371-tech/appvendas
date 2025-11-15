import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { get, ref, remove } from "firebase/database";
import React, { useEffect, useState } from "react";

import { ActivityIndicator, Alert, Dimensions, FlatList, Platform, StyleSheet, Text, TouchableOpacity, View, } from "react-native";

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
 // ...existing code...
  const carregarAgendamentos = async () => {
    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) {
        setAgendamentos([]);
        console.log("carregarAgendamentos: sem usuário autenticado");
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
          servico: value.servico ?? value.nomeCorte ?? "",
          horario: value.horario,
          data: value.data,
        }));

        console.log("Agendamentos carregados (ids):", lista.map((a) => a.id));
        setAgendamentos(lista);
      } else {
        console.log("carregarAgendamentos: snapshot vazio para", user.uid);
        setAgendamentos([]);
      }
    } catch (error) {
      console.log("Erro ao carregar agendamentos:", error);
    } finally {
      setLoading(false);
    }
  };
// ...existing code...

// ...existing code...
  const excluirAgendamento = (id: string) => {
    console.log("excluirAgendamento chamado para id:", id);

    const executarExclusao = async () => {
      setLoading(true);
      try {
        const user = auth.currentUser;
        console.log("excluirAgendamento -> user:", user?.uid);
        if (!user) {
          console.warn("Usuário não autenticado");
          return;
        }

        const parentPath = `agendamentos/${user.uid}`;
        const nodePath = `${parentPath}/${id}`;
        const nodeRef = ref(db, nodePath);
        const parentRef = ref(db, parentPath);

        const beforeParent = await get(parentRef);
        console.log("Antes - filhos em", parentPath, ":", Object.keys(beforeParent.val() || {}));

        const snap = await get(nodeRef);
        console.log("Antes - nó:", nodePath, "exists:", snap.exists(), "val:", snap.val());

        if (snap.exists()) {
          await remove(nodeRef);
          console.log("remove() chamado para:", nodePath);
        } else {
          // fallback por campos (nomeCliente+data+horario)
          const agLocal = agendamentos.find((a) => a.id === id);
          const parentVal = beforeParent.val() || {};
          let foundKey: string | null = null;
          for (const [key, value] of Object.entries(parentVal)) {
            const v: any = value;
            if (
              agLocal &&
              v.nomeCliente === agLocal.nomeCliente &&
              v.data === agLocal.data &&
              v.horario === agLocal.horario
            ) {
              foundKey = key;
              break;
            }
          }
          if (foundKey) {
            await remove(ref(db, `${parentPath}/${foundKey}`));
            console.log("Removido via fallback:", `${parentPath}/${foundKey}`);
          } else {
            console.warn("Fallback não encontrou nó correspondente.");
            Alert.alert("Aviso", "Não foi possível localizar o agendamento no servidor para exclusão.");
            return;
          }
        }

        const afterParent = await get(parentRef);
        console.log("Depois - filhos em", parentPath, ":", Object.keys(afterParent.val() || {}));

        setAgendamentos((prev) => prev.filter((a) => a.id !== id));
        await carregarAgendamentos();
        Alert.alert("Sucesso", "Agendamento excluído (se encontrado).");
      } catch (error: any) {
        console.error("Erro ao excluir agendamento:", error);
        Alert.alert("Erro", String(error?.message ?? error));
      } finally {
        setLoading(false);
      }
    };

    // fallback no web (Alert.alert pode não abrir no navegador)
    if (Platform.OS === "web") {
      console.log("Usando confirm() no web");
      if (window.confirm("Tem certeza que deseja excluir este agendamento?")) {
        executarExclusao();
      } else {
        console.log("Exclusão cancelada (web)");
      }
      return;
    }

    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir este agendamento?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: executarExclusao },
      ],
      { cancelable: true }
    );
  };
// ...existing code...

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
        <Text style={styles.agendamentoHora}>Hor�rio: {item.horario}</Text>
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
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#c7c7c7ff",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 15 },
  botaoNovoAgendamento: {
    flexDirection: "row",
    backgroundColor: "#3572ffff",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoNovoTexto: { color: "#fff", fontWeight: "bold", marginLeft: 8 },
  listContainer: { padding: 15, paddingBottom: 30 },
  agendamentoCard: {
    backgroundColor: "#e1ccccff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#000000ff",
  },
  agendamentoInfo: { flex: 1, marginRight: 10 },
  agendamentoNome: { fontSize: 16, fontWeight: "bold", color: "#000" },
  agendamentoServico: { color: "#000", marginBottom: 6 },
  agendamentoHora: { color: "#000" },
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
