import { RootStackParamList } from '@/app/(tabs)'; // Ajuste o caminho
import { auth, db } from '@/src/services/connectionFirebase';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { get, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type PerfilScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Perfil'>;

export default function PerfilScreen() {
  const navigation = useNavigation<PerfilScreenNavigationProp>();

  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;

        // Verificando se o usuário está logado
        if (!user) {
          setError('Usuário não logado');
          setLoading(false);
          return;
        }

        const userRef = ref(db, `users/${user.uid}`);

        // Verificando a existência de dados do usuário
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
          setUserData(snapshot.val());
        } else {
          setError('Nenhum dado encontrado no Firebase');
        }
      } catch (error: any) {
        setError('Erro ao buscar dados: ' + error.message);
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

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {userData ? (
        <View style={styles.card}>
          <Text style={styles.title}>Informa��es do Usu�rio</Text>
          <Text style={styles.text}>Nome: {userData.name}</Text>
          <Text style={styles.text}>E-mail: {userData.email}</Text>
          <Text style={styles.text}>Cidade: {userData.cidade}</Text>
          <Text style={styles.text}>Telefone: {userData.telefone}</Text>
          
          <TouchableOpacity style={[styles.button, styles.buttonEditar]} onPress={() => navigation.navigate('EditProfile')}>
            <Text style={styles.buttonText}>Editar Perfil</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.button, styles.buttonSair]} onPress={handleLogout}>
            <Text style={styles.buttonText}>Sair</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.text}>Nenhum dado encontrado.</Text>
      )}

      <View style={styles.footer}>
        <TouchableOpacity onPress={handleLogout} style={styles.footerButton} >
          <Ionicons name="log-out-outline" size={28} color="blue" />
          <Text style={styles.footerText}>Sair</Text>
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
  errorText: {
    fontSize: 18,
    color: 'red',
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
  },
  button: {
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonEditar: {
    backgroundColor: '#007AFF',
  },
  buttonSair: {
    backgroundColor: '#d9534f',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
