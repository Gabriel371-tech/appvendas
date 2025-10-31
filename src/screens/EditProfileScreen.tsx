import { RootStackParamList } from '@/app/(tabs)'; // Ajuste o caminho conforme sua estrutura
import { auth, db } from '@/src/services/connectionFirebase';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { get, ref, update } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type EditProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditProfile'>;

export default function EditProfile() {
  const navigation = useNavigation<EditProfileScreenNavigationProp>();

  const [name, setName] = useState('');
  const [cidade, setCidade] = useState('');
  const [telefone, setTelefone] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          Alert.alert('Erro', 'Usuário não logado.');
          return;
        }

        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);

        if (snapshot.exists()) {
          const userData = snapshot.val();
          setName(userData.name || '');
          setCidade(userData.cidade || '');
          setTelefone(userData.telefone || '');
        } else {
          Alert.alert('Aviso', 'Dados do usuário não encontrados.');
        }
      } catch (error: any) {
        Alert.alert('Erro', error.message || 'Erro ao carregar dados.');
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert('Erro', 'Usuário não logado.');
        return;
      }

      const userRef = ref(db, `users/${user.uid}`);
      await update(userRef, { name, cidade, telefone });

      Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
      navigation.goBack(); // volta para a tela anterior (Perfil)
    } catch (error: any) {
      Alert.alert('Erro', error.message || 'Erro ao atualizar perfil.');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>

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

      <TouchableOpacity
        style={styles.botao}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.botaoText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
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
