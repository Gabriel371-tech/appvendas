// src/services/firebaseService.ts
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { User } from '../models/User';
import { auth, db } from '../services/connectionFirebase';

export const registerUser = async (user: User, password: string): Promise<void> => {
    const userCredential = await createUserWithEmailAndPassword(auth, user.email, password);
    const firebaseUser = userCredential.user;

    if (firebaseUser) {
        await set(ref(db, 'users/' + firebaseUser.uid), {
            uid: firebaseUser.uid,
            name: user.name,
            email: user.email,
            telefone: user.telefone,
            cidade: user.cidade,
            createdAt: new Date().toISOString(),
        });
    }
};
