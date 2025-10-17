import { RootStackParamList } from '@/app/(tabs)/index';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { onValue, ref } from 'firebase/database'; // Importando do Firebase
import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AgendamentoController } from '../controllers/AgendamentoController';
import { AgendamentoModel } from '../models/Agendar';
import { auth, db } from '../services/connectionFirebase';

const horariosDisponiveis = [
    '09:00',
    '10:00',
    '11:00',
    '14:00',
    '15:00',
    '16:00',
];

type Props = NativeStackScreenProps<RootStackParamList, 'Agendar'>;

const AgendarScreen: React.FC<Props> = ({ navigation }) => {
    const [nomeCliente, setNomeCliente] = useState('');
    const [nomeBarbeador, setNomeBarbeador] = useState('');
    const [nomeCorte, setNomeCorte] = useState('');
    const [data, setData] = useState(new Date());
    const [mostrarDatePicker, setMostrarDatePicker] = useState(false);
    const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(null);
    const [agendamentos, setAgendamentos] = useState<any[]>([]);  // Estado para armazenar agendamentos

    // Puxa os agendamentos do banco de dados assim que o componente é montado
    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            const agendamentosRef = ref(db, `agendamentos/${user.uid}`);
            onValue(agendamentosRef, (snapshot) => {
                const data = snapshot.val();
                const agendamentosList = data ? Object.values(data) : [];
                setAgendamentos(agendamentosList);  // Atualiza o estado com os agendamentos
            });
        }
    }, []);

    const aoAlterarData = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || data;
        setMostrarDatePicker(Platform.OS === 'ios');
        setData(currentDate);
    };

    const agendar = async () => {
        if (!nomeCliente || !nomeBarbeador || !nomeCorte || !horarioSelecionado) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        const user = auth.currentUser;
        if (user) {
            const agendamento = new AgendamentoModel(
                nomeCliente,
                nomeBarbeador,
                nomeCorte,
                data.toISOString(),
                horarioSelecionado
            );

            // Criando agendamento usando o controller
            await AgendamentoController.criarAgendamento(agendamento, user.uid);

            Alert.alert('Agendamento Confirmado', `Agendamento para ${nomeCliente} foi confirmado!`);
            setNomeCliente('');
            setNomeBarbeador('');
            setNomeCorte('');
            setHorarioSelecionado(null);
            setData(new Date());
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.agendamentoCard}>
            <Text style={styles.agendamentoText}>Cliente: {item.nomeCliente}</Text>
            <Text style={styles.agendamentoText}>Barbeador: {item.nomeBarbeador}</Text>
            <Text style={styles.agendamentoText}>Corte: {item.nomeCorte}</Text>
            <Text style={styles.agendamentoText}>Data: {new Date(item.data).toLocaleDateString()}</Text>
            <Text style={styles.agendamentoText}>Horário: {item.horario}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Agendar Corte de Cabelo</Text>

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
            <TouchableOpacity
                onPress={() => setMostrarDatePicker(true)}
                style={styles.input}
            >
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
                        style={[styles.horarioButton, horarioSelecionado === hora && styles.horarioSelecionado]}
                        onPress={() => setHorarioSelecionado(hora)}
                    >
                        <Text
                            style={[styles.horarioTexto, horarioSelecionado === hora && { color: '#fff' }]}
                        >
                            {hora}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Button title="Agendar" onPress={agendar} />
            <Button title="Voltar" onPress={() => navigation.navigate('Dash')} />

            {/* Exibindo os agendamentos existentes */}
            <Text style={styles.titulo}>Agendamentos Existentes</Text>
            <FlatList
                data={agendamentos}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        marginTop: 10,
        marginBottom: 4,
        fontSize: 16,
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 6,
        marginBottom: 10,
    },
    horariosContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    horarioButton: {
        padding: 10,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#007AFF',
        marginRight: 10,
        marginBottom: 10,
    },
    horarioSelecionado: {
        backgroundColor: '#007AFF',
    },
    horarioTexto: {
        color: '#007AFF',
        fontWeight: '500',
    },
    agendamentoCard: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        marginVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    agendamentoText: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 5,
    },
});

export default AgendarScreen;
