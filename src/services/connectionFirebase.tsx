// connectionFirebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyAP8fd4N7IxMzx-Q9Q8lMhf4ZgWx2oWw44",
  authDomain: "appvendas-e5a34.firebaseapp.com",
  projectId: "appvendas-e5a34",
  storageBucket: "appvendas-e5a34.firebasestorage.app",
  messagingSenderId: "595730493377",
  appId: "1:595730493377:web:7641022629bf43839e8940",
  measurementId: "G-EKZK8LDRB4"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);  // <- aqui está o Realtime Database

export default app;
