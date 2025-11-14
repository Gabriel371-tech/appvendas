import { MaterialIcons } from "@expo/vector-icons";
import type { RouteProp } from "@react-navigation/native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
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

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "EditarAgendamento">;
type RoutePropType = RouteProp<RootStackParamList, "EditarAgendamento">;

export default function EditarAgendamentoScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const { agendamento } = route.params;

  const [nome, setNome] = useState(agendamento?.nome || "");
  const [servico, setServico] = useState(agendamento?.servico || "");
  const [hora, setHora] = useState(agendamento?.hora || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      title: "Editar Agendamento",
    });
  }, [navigation]);

  const salvarAlteracoes = async () => {
    if (!nome || !servico || !hora) {
      Alert.alert("Erro", "Por favor, preencha todos os campos!");
      return;
    }

    setLoading(true);
    try {
      const agendamentoAtualizado = {
        ...agendamento,
        nome,
        servico,
        hora,
      };

      // TODO: Atualizar no Firebase ou AsyncStorage
      console.log("Agendamento atualizado:", agendamentoAtualizado);

      Alert.alert("Sucesso", "Agendamento atualizado com sucesso!", [
        {
          text: "OK",
          onPress: () => {
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Erro", "Falha ao atualizar agendamento");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const excluirAgendamento = () => {
    Alert.alert(
      "Confirmar exclusÆo",
      "Tem certeza que deseja excluir este agendamento?",
      [
        { text: "Cancelar", onPress: () => {}, style: "cancel" },
        {
          text: "Excluir",
          onPress: async () => {
            setLoading(true);
            try {
              // TODO: Excluir do Firebase ou AsyncStorage
              console.log("Agendamento exclu¡do:", agendamento.id);
              Alert.alert("Sucesso", "Agendamento exclu¡do com sucesso!", [
                {
                  text: "OK",
                  onPress: () => {
                    navigation.navigate("Agendamentos");
                  },
                },
              ]);
            } catch (error) {
              Alert.alert("Erro", "Falha ao excluir agendamento");
              console.error(error);
            } finally {
              setLoading(false);
            }
          },
          style: "destructive",
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
          <Text style={styles.label}>Nome do cliente</Text>
          <TextInput
            style={styles.input}
            value={nome}
            onChangeText={setNome}
            placeholder="JoÆo Silva"
            placeholderTextColor="#666"
            editable={!loading}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Servi‡o</Text>
          <TextInput
            style={styles.input}
            value={servico}
            onChangeText={setServico}
            placeholder="Ex: Corte, Barba e cabelo"
            placeholderTextColor="#666"
            editable={!loading}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Data e hora</Text>
          <TextInput
            style={styles.input}
            value={hora}
            onChangeText={setHora}
            placeholder="10:00 AM"
            placeholderTextColor="#666"
            editable={!loading}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, styles.buttonSalvar]}
          onPress={salvarAlteracoes}
          disabled={loading}
        >
          {loading ? (
            <Text style={styles.buttonText}>Salvando...</Text>
          ) : (
            <>
              <MaterialIcons name="save" size={20} color="#fff" />
              <Text style={styles.buttonText}>Salvar Altera‡äes</Text>
            </>
          )}
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
  },
  content: {
    padding: 20,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    color: "#ccc",
    marginBottom: 8,
    fontWeight: "600",
    fontSize: 14,
  },
  input: {
    backgroundColor: "#222",
    color: "#fff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
  },
  button: {
    flexDirection: "row",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    gap: 8,
  },
  buttonSalvar: {
    backgroundColor: "#4CAF50",
  },
  buttonExcluir: {
    backgroundColor: "#f44336",
  },
  buttonCancelar: {
    backgroundColor: "#666",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
