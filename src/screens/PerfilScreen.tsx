import { RootStackParamList } from '@/app/(tabs)'; // Ajuste o caminho
import { auth, db } from '@/src/services/connectionFirebase';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { get, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type PerfilScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Perfil'>;

export default function PerfilScreen() {
  const navigation = useNavigation<PerfilScreenNavigationProp>();

  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userRef = ref(db, `users/${user.uid}`);
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            setUserData(snapshot.val());
          } else {
            console.log('Nenhum dado encontrado!');
          }
        }
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.replace('Login');
    } catch (error) {
      console.error('Erro ao sair:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {userData ? (
        <View style={styles.card}>
          <Text style={styles.title}>Informações do Usuário</Text>
          <Text style={styles.text}>Nome: {userData.name}</Text>
          <Text style={styles.text}>E-mail: {userData.email}</Text>
          <Text style={styles.text}>Cidade: {userData.cidade}</Text>
          <Text style={styles.text}>Telefone: {userData.telefone}</Text><br />
          <Button title="Sair" onPress={handleLogout} color="#d9534f" /><br />
          <Button title="Editar Perfil" onPress={() => navigation.navigate('EditProfile')} />

        </View>
      ) : (
        <Text style={styles.text}>Nenhum dado encontrado.</Text>
      )}

      <View style={styles.footer}>
        <TouchableOpacity onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={28} color="red" />
        </TouchableOpacity>
      </View>

    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    alignItems: 'center',
    margin: 20,
    width: '80%',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  footer: {
    position: 'absolute', // fixa no fundo
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 4,
  }
});
