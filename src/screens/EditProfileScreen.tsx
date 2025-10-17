// src/screens/EditProfile.tsx
import { useNavigation } from '@react-navigation/native'; // Importando o hook
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../../app/(tabs)/index'; // Certifique-se de importar o tipo correto de navegação
import { getCurrentUserData, updateCurrentUser } from '../controllers/userController';

// Tipando a navegação corretamente
type EditProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditProfile'>;

export default function EditProfile() {
  const navigation = useNavigation<EditProfileScreenNavigationProp>(); // Usando o hook de navegação tipado

  const [name, setName] = useState('');
  const [cidade, setCidade] = useState('');
  const [telefone, setTelefone] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const user = await getCurrentUserData();
      if (user) {
        setName(user.name);
        setCidade(user.cidade || '');
        setTelefone(user.telefone || '');
      }
    };
    loadData();
  }, []);

  const handleSave = async () => {
    try {
      await updateCurrentUser({ name, cidade, telefone });
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Erro ao atualizar perfil');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nome"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        placeholder="Cidade"
        style={styles.input}
        value={cidade}
        onChangeText={setCidade}
      />
      <TextInput
        placeholder="Telefone"
        style={styles.input}
        value={telefone}
        onChangeText={setTelefone}
        keyboardType="phone-pad"
      />
      <Button title="Salvar Alterações" onPress={handleSave} />

      {/* Corrigido para navegação correta */}
      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.navigate("Login")} // Navegando para a tela Login
      >
        <Text style={styles.botaoText}>Ir para Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  botao: {
    backgroundColor: '#3498DB',
    padding: 10,
    borderRadius: 6,
    marginTop: 20,
    alignItems: 'center',
  },
  botaoText: {
    color: '#fff',
    fontSize: 16,
  },
});
