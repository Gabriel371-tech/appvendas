import { RootStackParamList } from '@/app/(tabs)/index';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { onValue, push, ref, set, update } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Button,
    FlatList,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { auth, db } from '../services/connectionFirebase';

const horariosDisponiveis = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];

type Props = NativeStackScreenProps<RootStackParamList, 'Agendar'>;

const AgendarScreen: React.FC<Props> = ({ navigation }) => {
  const [nomeCliente, setNomeCliente] = useState('');
  const [nomeBarbeador, setNomeBarbeador] = useState('');
  const [nomeCorte, setNomeCorte] = useState('');
  const [data, setData] = useState(new Date());
  const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
  const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(null);
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [editandoId, setEditandoId] = useState<string | null>(null);

  // 🔄 Carregar agendamentos do Realtime Database em tempo real
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Erro', 'Usuário não autenticado!');
      return;
    }

    const agendamentosRef = ref(db, `agendamentos/${user.uid}`);
    const unsubscribe = onValue(agendamentosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const lista = Object.entries(data).map(([id, value]: any) => ({
          id,
          ...value,
        }));
        setAgendamentos(lista);
      } else {
        setAgendamentos([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // 📅 Alterar data
  const aoAlterarData = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || data;
    setMostrarDatePicker(Platform.OS === 'ios');
    setData(currentDate);
  };

  // 💾 Criar ou atualizar agendamento
  const agendar = async () => {
    if (!nomeCliente || !nomeBarbeador || !nomeCorte || !horarioSelecionado) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      Alert.alert('Erro', 'Usuário não autenticado!');
      return;
    }

    const agendamento = {
      nomeCliente,
      nomeBarbeador,
      nomeCorte,
      data: data.toISOString(),
      horario: horarioSelecionado,
    };

    try {
      const agendamentosRef = ref(db, `agendamentos/${user.uid}`);

      if (editandoId) {
        // Atualiza o agendamento existente
        const agendamentoRef = ref(db, `agendamentos/${user.uid}/${editandoId}`);
        await update(agendamentoRef, agendamento);
        Alert.alert('Sucesso', 'Agendamento atualizado com sucesso!');
      } else {
        // Cria novo agendamento
        const novoAgendamentoRef = push(agendamentosRef);
        await set(novoAgendamentoRef, agendamento);
        Alert.alert('Sucesso', 'Agendamento criado com sucesso!');
      }

      // Limpa os campos
      setNomeCliente('');
      setNomeBarbeador('');
      setNomeCorte('');
      setHorarioSelecionado(null);
      setData(new Date());
      setEditandoId(null);
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao salvar agendamento.');
    }
  };

  // ✏️ Editar agendamento
  const editarAgendamento = (item: any) => {
    setNomeCliente(item.nomeCliente);
    setNomeBarbeador(item.nomeBarbeador);
    setNomeCorte(item.nomeCorte);
    setData(new Date(item.data));
    setHorarioSelecionado(item.horario);
    setEditandoId(item.id);
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.agendamentoCard} onPress={() => editarAgendamento(item)}>
      <Text style={styles.agendamentoText}>👤 Cliente: {item.nomeCliente}</Text>
      <Text style={styles.agendamentoText}>💈 Barbeador: {item.nomeBarbeador}</Text>
      <Text style={styles.agendamentoText}>✂️ Corte: {item.nomeCorte}</Text>
      <Text style={styles.agendamentoText}>📅 Data: {new Date(item.data).toLocaleDateString()}</Text>
      <Text style={styles.agendamentoText}>🕒 Horário: {item.horario}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        {editandoId ? '✏️ Editar Agendamento' : 'Agendar Corte de Cabelo'}
      </Text>

      <Text style={styles.label}>Nome do Cliente:</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome do cliente"
        value={nomeCliente}
        onChangeText={setNomeCliente}
      />

      <Text style={styles.label}>Nome do Barbeador:</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome do barbeador"
        value={nomeBarbeador}
        onChangeText={setNomeBarbeador}
      />

      <Text style={styles.label}>Nome do Corte:</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome do corte"
        value={nomeCorte}
        onChangeText={setNomeCorte}
      />

      <Text style={styles.label}>Data:</Text>
      <TouchableOpacity onPress={() => setMostrarDatePicker(true)} style={styles.input}>
        <Text>{data.toLocaleDateString()}</Text>
      </TouchableOpacity>

      {mostrarDatePicker && (
        <DateTimePicker
          value={data}
          mode="date"
          display="default"
          onChange={aoAlterarData}
          minimumDate={new Date()}
        />
      )}

      <Text style={styles.label}>Horário:</Text>
      <View style={styles.horariosContainer}>
        {horariosDisponiveis.map((hora) => (
          <TouchableOpacity
            key={hora}
            style={[
              styles.horarioButton,
              horarioSelecionado === hora && styles.horarioSelecionado,
            ]}
            onPress={() => setHorarioSelecionado(hora)}
          >
            <Text
              style={[
                styles.horarioTexto,
                horarioSelecionado === hora && { color: '#fff' },
              ]}
            >
              {hora}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button
        title={editandoId ? 'Salvar Alterações' : 'Agendar'}
        onPress={agendar}
      />
      <Button title="Voltar" onPress={() => navigation.navigate('Dash')} color="#888" />

      <Text style={styles.titulo}>📋 Agendamentos Existentes</Text>
      <FlatList
        data={agendamentos}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { marginTop: 10, marginBottom: 4, fontSize: 16, fontWeight: '500' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  horariosContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 },
  horarioButton: {
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#007AFF',
    marginRight: 10,
    marginBottom: 10,
  },
  horarioSelecionado: { backgroundColor: '#007AFF' },
  horarioTexto: { color: '#007AFF', fontWeight: '500' },
  agendamentoCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  agendamentoText: { fontSize: 15, color: '#333' },
});

export default AgendarScreen;
