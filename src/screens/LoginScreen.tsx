import { RootStackParamList } from "@/app/(tabs)";
import { StackNavigationProp } from "@react-navigation/stack";
import { Dimensions, Text, View } from "react-native";

const {width} = Dimensions.get("window");
type NavProp = StackNavigationProp<RootStackParamList>;

export default function LoginScreen(){

    return(
       <View>
            <Text>TELA DE LOGIN</Text>
        </View>
    )
 

 
}