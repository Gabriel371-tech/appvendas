// Importa funções específicas do SDK modular
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // Exemplo para autenticação
import { getDatabase } from 'firebase/database'; // Exemplo para o Realtime Database
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAP8fd4N7IxMzx-Q9Q8lMhf4ZgWx2oWw44",
  authDomain: "appvendas-e5a34.firebaseapp.com",
  projectId: "appvendas-e5a34",
  storageBucket: "appvendas-e5a34.firebasestorage.app",
  messagingSenderId: "595730493377",
  appId: "1:595730493377:web:7641022629bf43839e8940",
  measurementId: "G-EKZK8LDRB4"
};
 
// Inicializa o Firebase
const app = initializeApp(firebaseConfig);


const db = getFirestore(app);

 
// Inicializa e exporta serviços
export const auth = getAuth(app);
export const database = getDatabase(app);


// Se precisar do app em outro lugar, pode exportá-lo também
export default app;

