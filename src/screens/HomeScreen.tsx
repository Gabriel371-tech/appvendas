import { RootStackParamList } from "@/app/(tabs)";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "expo-router";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";


const {width} = Dimensions.get("window");
type NavProp = StackNavigationProp<RootStackParamList>;

export default function HomeScreen() {

 const navigation = useNavigation<NavProp>();

  return (
    <View> 
      <View style={styles.Header}>
        <Image style={styles.logo} source={require('../../assets/images/logo.png')}/>
        <Text style={styles.texto}>Seja Bem vindo</Text>
        <TouchableOpacity style={styles.botao}>Agendar</TouchableOpacity>
        
        {/* Botao de navegação para o login */}
        <TouchableOpacity style={styles.botao} onPress={() => navigation.navigate("Login")}>Login</TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  Header: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 130,
    padding: 10,
    gap: 8,
  },
  logo: {
    width: 200,
    height: 200,

  },
  texto:{
    marginTop: 40,
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
   
  },
  botao:{
    marginTop: 50,
    backgroundColor: 'white',
    color: 'black',
    fontSize: 20,
    padding: 10,
    paddingHorizontal: 25,
    borderRadius: 25,
    fontWeight: '600',
  }
});
