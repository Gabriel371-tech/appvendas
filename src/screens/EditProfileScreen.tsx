// EditProfileScreen.tsx
import { RootStackParamList } from '@/app/(tabs)'; // Ajuste o caminho conforme seu projeto
import { auth, db } from '@/src/services/connectionFirebase';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { get, ref, update } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';

type EditProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditProfile'>;

export default function EditProfileScreen() {
  const navigation = useNavigation<EditProfileScreenNavigationProp>();

  const [name, setName] = useState('');
  const [cidade, setCidade] = useState('');
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userRef = ref(db, `users/${user.uid}`);
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            const data = snapshot.val();
            setName(data.name || '');
            setCidade(data.cidade || '');
            setTelefone(data.telefone || '');
          } else {
            Alert.alert('Aviso', 'Nenhum dado encontrado para este usuário.');
          }
        }
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os dados.');
        console.error('Erro ao buscar dados para edição:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'O nome não pode ficar vazio.');
      return;
    }
    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = ref(db, `users/${user.uid}`);
        await update(userRef, { name, cidade, telefone });
        Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar os dados.');
      console.error('Erro ao atualizar dados:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Digite seu nome"
      />

      <Text style={styles.label}>Cidade</Text>
      <TextInput
        style={styles.input}
        value={cidade}
        onChangeText={setCidade}
        placeholder="Digite sua cidade"
      />

      <Text style={styles.label}>Telefone</Text>
      <TextInput
        style={styles.input}
        value={telefone}
        onChangeText={setTelefone}
        placeholder="Digite seu telefone"
        keyboardType="phone-pad"
      /><br />

      <Button title="Salvar" onPress={handleSave} /><br />
     <Button title="Voltar" onPress={() => navigation.navigate('Dash')} />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f8',
  },
  label: {
    fontSize: 16,
    marginTop: 15,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
  },
});
