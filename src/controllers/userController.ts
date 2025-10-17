// src/controllers/userController.ts
import { registerUser } from '../services/firebaseService';
import { User } from '../models/User';

export const handleUserRegister = async (user: User, password: string): Promise<string | null> => {
  try {
    await registerUser(user, password);
    return null; // sucesso, sem erro
  } catch (error: any) {
    return error.message || 'Erro desconhecido';
  }
};
