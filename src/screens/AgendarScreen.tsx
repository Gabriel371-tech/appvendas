// src/screens/AgendarScreen.tsx

import { RootStackParamList } from '@/app/(tabs)/index';
import DateTimePicker from '@react-native-community/datetimepicker';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Alert, Button, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AgendamentoController } from '../controllers/AgendamentoController';

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

    const aoAlterarData = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate || data;
        setMostrarDatePicker(Platform.OS === 'ios');
        setData(currentDate);
    };

    const agendar = () => {
        // Usando o AgendamentoController para criar o agendamento
        const agendamento = AgendamentoController.agendar(nomeCliente, nomeBarbeador, nomeCorte, data, horarioSelecionado || '');

        if (!agendamento) {
            Alert.alert('Erro', 'Por favor, preencha todos os campos.');
            return;
        }

        Alert.alert(
            'Agendamento Confirmado',
            `Cliente: ${agendamento.nomeCliente}\nCorte: ${agendamento.nomeCorte}\nBarbeador: ${agendamento.nomeBarbeador}\nData: ${agendamento.data.toLocaleDateString()}\nHorário: ${agendamento.horario}`
        );

        // Aqui você pode realizar ações adicionais, como enviar para uma API ou salvar em um banco de dados.
    };

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

            <Button title="Agendar" onPress={agendar} /><br />
            <Button title="Voltar" onPress={() => navigation.navigate('Dash')} />
        </View>
    );
};

export default AgendarScreen;

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
});
