import { get, ref, set } from "firebase/database"; // Firebase Modular Imports
import { AgendamentoModel } from "../models/Agendar"; // Certifique-se de ter a model do agendamento
import { db } from "../services/connectionFirebase"; // Importando o banco de dados configurado

export class AgendamentoController {
    // Função para criar um agendamento
    static async criarAgendamento(agendamento: AgendamentoModel, userId: string): Promise<void> {
        try {
            const agendamentosRef = ref(db, `agendamentos/${userId}`);  // Referência para o nó 'agendamentos'
            const agendamentoId = Date.now().toString();  // Gerar um ID único para o agendamento
            await set(ref(agendamentosRef, agendamentoId), {
                nomeCliente: agendamento.nomeCliente,
                nomeBarbeador: agendamento.nomeBarbeador,
                nomeCorte: agendamento.nomeCorte,
                data: agendamento.data.toISOString(),  // Salvar a data no formato ISO
                horario: agendamento.horario,
            });
            console.log("Agendamento criado com sucesso!");
        } catch (error) {
            console.error("Erro ao criar agendamento:", error);
        }
    }

    // Função para obter os agendamentos
    static async obterAgendamentos(userId: string): Promise<AgendamentoModel[]> {
        const agendamentosRef = ref(db, `agendamentos/${userId}`);
        const snapshot = await get(agendamentosRef);  // Usando get para obter os dados
        const data = snapshot.val();
        return data ? Object.values(data) : [];  // Retorna os agendamentos como um array
    }
}
