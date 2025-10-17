// src/models/User.ts
export interface User {
    uid?: string;  // opcional porque só existe depois do cadastro
    name: string;
    email: string;
    telefone: string;
    cidade: string;
    createdAt?: string;
}
