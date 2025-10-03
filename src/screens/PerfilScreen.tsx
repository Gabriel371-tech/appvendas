import { StackNavigationProp } from '@react-navigation/stack';
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { RootStackParamList } from "../../app/(tabs)/index"; // <-- ajuste o caminho conforme sua estrutura




export default function PerfilScreen  (){
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data());
          } else {
            console.log("No such document!");
          }
        }
      } catch (error) {
        console.error("Erro ao buscar dados do usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.replace("Login");
    } catch (error) {
      console.error("Erro ao sair:", error);
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
          <Text style={styles.text}>Telefone: {userData.telefone}</Text>
          <Button title="Sair" onPress={handleLogout} color="#d9534f" />
        </View>
      ) : (
        <Text style={styles.text}>Nenhum dado encontrado.</Text>
      )}
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f4f8",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    alignItems: "center",
    margin: 20,
    width: "80%",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  loadingText: {
    fontSize: 18,
    color: "#666",
  },
});
