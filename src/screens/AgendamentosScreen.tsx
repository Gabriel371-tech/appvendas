import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
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

interface Agendamento {
  id: string;
  nome: string;
  servico: string;
  hora: string;
  dataCriacao: string;
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
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Carrega os agendamentos quando a tela ganha foco
  useFocusEffect(
    useCallback(() => {
      carregarAgendamentos();
    }, [])
  );

  const carregarAgendamentos = async () => {
    setLoading(true);
    try {
      // TODO: Carregar do Firebase ou AsyncStorage
      // Por enquanto, usando dados mockados
      const dados: Agendamento[] = [
        // Exemplo de dados
      ];
      setAgendamentos(dados);
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar agendamentos");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const excluirAgendamento = (id: string) => {
    Alert.alert(
      "Confirmar exclusÆo",
      "Tem certeza que deseja excluir este agendamento?",
      [
        { text: "Cancelar", onPress: () => {}, style: "cancel" },
        {
          text: "Excluir",
          onPress: () => {
            try {
              // TODO: Excluir do Firebase ou AsyncStorage
              setAgendamentos(agendamentos.filter((item) => item.id !== id));
              Alert.alert("Sucesso", "Agendamento exclu¡do com sucesso!");
            } catch (error) {
              Alert.alert("Erro", "Falha ao excluir agendamento");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const editarAgendamento = (agendamento: Agendamento) => {
    // Navegar para tela de edi‡Æo passando os dados
    navigation.navigate("EditarAgendamento", { agendamento });
  };

  const irParaAgendar = () => {
    navigation.navigate("Agendar");
  };

  const renderAgendamento = ({ item }: { item: Agendamento }) => (
    <View style={styles.agendamentoCard}>
      <View style={styles.agendamentoInfo}>
        <Text style={styles.agendamentoNome}>{item.nome}</Text>
        <Text style={styles.agendamentoServico}>{item.servico}</Text>
        <Text style={styles.agendamentoHora}>?? {item.hora}</Text>
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
          <Text style={styles.vazioTexto}>Nenhum agendamento</Text>
          <Text style={styles.vazioSubtexto}>
            Clique em "Novo Agendamento" para criar um
          </Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
  },
  header: {
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  botaoNovoAgendamento: {
    flexDirection: "row",
    backgroundColor: "#FF6B35",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoNovoTexto: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
    fontSize: 14,
  },
  listContainer: {
    padding: 15,
    paddingBottom: 30,
  },
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
  agendamentoInfo: {
    flex: 1,
    marginRight: 10,
  },
  agendamentoNome: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  agendamentoServico: {
    fontSize: 14,
    color: "#ccc",
    marginBottom: 6,
  },
  agendamentoHora: {
    fontSize: 13,
    color: "#999",
  },
  agendamentoBotoes: {
    flexDirection: "row",
    gap: 8,
  },
  botaoIcon: {
    width: 36,
    height: 36,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoEditar: {
    backgroundColor: "#4CAF50",
  },
  botaoExcluir: {
    backgroundColor: "#f44336",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  vazioContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  vazioTexto: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 15,
  },
  vazioSubtexto: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
});
