// src/controllers/AgendamentoController.ts
import { Agendamento } from '../models/Agendar';

export class AgendamentoController {
    static agendar(nomeCliente: string, nomeBarbeador: string, nomeCorte: string, data: Date, horario: string): Agendamento | null {
        if (!nomeCliente || !nomeBarbeador || !nomeCorte || !horario) {
            return null;
        }

        const agendamento: Agendamento = {
            data,
            nomeBarbeador,
            nomeCorte,
            horario,
            nomeCliente,
        };

        console.log('Agendamento Criado:', agendamento);

        return agendamento;
    }
}
