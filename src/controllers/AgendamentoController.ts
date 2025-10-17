// src/controllers/AgendamentoController.ts
import { get, onValue, push, ref, remove, update } from 'firebase/database'; // Funções necessárias do Firebase
import { Agendamento } from '../models/Agendar';
import { auth, db } from '../services/connectionFirebase'; // Importe a conexão com Firebase

export class AgendamentoController {
    // Função para agendar o corte de cabelo
    static agendar(nomeCliente: string, nomeBarbeador: string, nomeCorte: string, data: Date, horario: string): Agendamento | null {
        if (!nomeCliente || !nomeBarbeador || !nomeCorte || !horario) {
            return null;
        }

        // Verifica se o usuário está autenticado
        const user = auth.currentUser;
        if (!user) {
            console.error('Usuário não autenticado!');
            return null;  // Retorna null caso o usuário não esteja autenticado
        }

        // Criando o objeto agendamento
        const agendamento: Agendamento = {
            data,
            nomeBarbeador,
            nomeCorte,
            horario,
            nomeCliente,
        };

        // Referência do Firebase Realtime Database
        const agendamentoRef = ref(db, 'agendamentos');

        // Salva o agendamento no Realtime Database com push
        push(agendamentoRef, agendamento)
            .then(() => {
                console.log('Agendamento criado no Firebase:', agendamento);
            })
            .catch((error) => {
                console.error('Erro ao criar agendamento no Firebase:', error);
            });

        return agendamento;
    }

    // Função para obter todos os agendamentos
    static async listarAgendamentos() {
        const agendamentosRef = ref(db, 'agendamentos');
        const snapshot = await get(agendamentosRef);

        if (snapshot.exists()) {
            return snapshot.val();  // Retorna todos os agendamentos
        } else {
            console.log('Nenhum agendamento encontrado');
            return null;
        }
    }

    // Função para excluir um agendamento
    static excluirAgendamento(agendamentoId: string) {
        const agendamentoRef = ref(db, `agendamentos/${agendamentoId}`);

        remove(agendamentoRef)
            .then(() => {
                console.log('Agendamento excluído com sucesso');
            })
            .catch((error) => {
                console.error('Erro ao excluir agendamento:', error);
            });
    }

    // Função para atualizar um agendamento
    static atualizarAgendamento(agendamentoId: string, novosDados: Partial<Agendamento>) {
        const agendamentoRef = ref(db, `agendamentos/${agendamentoId}`);

        update(agendamentoRef, novosDados)
            .then(() => {
                console.log('Agendamento atualizado com sucesso');
            })
            .catch((error) => {
                console.error('Erro ao atualizar agendamento:', error);
            });
    }

    // Função para ouvir os agendamentos em tempo real
    static ouvirAgendamentosEmTempoReal() {
        const agendamentosRef = ref(db, 'agendamentos');

        onValue(agendamentosRef, (snapshot) => {
            if (snapshot.exists()) {
                console.log('Agendamentos em tempo real:', snapshot.val());
            } else {
                console.log('Nenhum agendamento encontrado');
            }
        });
    }

    // Função para verificar se o usuário está autenticado
    static verificarAutenticacao(): boolean {
        const user = auth.currentUser;
        if (!user) {
            console.log('Usuário não autenticado');
            return false;
        }
        console.log('Usuário autenticado:', user.uid);
        return true;
    }
}
