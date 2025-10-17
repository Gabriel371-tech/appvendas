// src/controllers/userController.ts
import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { get, ref, remove, set, update } from 'firebase/database';
import { User } from '../models/User';
import { auth, db } from '../services/connectionFirebase';

/**
 * Cadastra um novo usuário (autenticação + database)
 */
export const registerUser = async (user: User, password: string) => {
  const { email } = user;
  if (!email) throw new Error('Email é obrigatório');

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;

  // Salvando dados do usuário no Realtime Database
  await set(ref(db, `users/${uid}`), {
    ...user,
    uid,
  });
};

/**
 * Função handleUserRegister para ser usada no controller
 */
export const handleUserRegister = async (user: User, password: string): Promise<string | null> => {
  try {
    await registerUser(user, password);
    return null; // Sucesso, sem erro
  } catch (error: unknown) {
    // Tratar erro de forma segura
    if (error instanceof Error) {
      return error.message;
    }
    return 'Erro desconhecido';
  }
};

/**
 * Retorna dados do usuário atual
 */
export const getCurrentUserData = async (): Promise<User | null> => {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;

  const snapshot = await get(ref(db, `users/${currentUser.uid}`));
  return snapshot.exists() ? (snapshot.val() as User) : null;
};

/**
 * Atualiza os dados do usuário atual
 */
export const updateCurrentUser = async (updatedData: Partial<User>): Promise<void> => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error('Usuário não autenticado');

  await update(ref(db, `users/${currentUser.uid}`), updatedData);
};

/**
 * Exclui os dados do usuário (auth + database)
 */
export const deleteCurrentUser = async (): Promise<void> => {
  const user = auth.currentUser;
  if (!user) throw new Error('Usuário não autenticado');

  // Exclui os dados do usuário no Realtime Database
  await remove(ref(db, `users/${user.uid}`));
  // Exclui o usuário da autenticação
  await user.delete();
};

/**
 * Exclui os dados do usuário e o usuário em si (auth + database) 
 * @param uid O id do usuário a ser excluído
 */
