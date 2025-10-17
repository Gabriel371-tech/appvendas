export interface Agendamento {
    nomeCliente: string;
    nomeBarbeador: string;
    nomeCorte: string;
    data: string;
    horario: string;
}

export class AgendamentoModel {
    nomeCliente: string;
    nomeBarbeador: string;
    nomeCorte: string;
    data: string;
    horario: string;

    constructor(
        nomeCliente: string,
        nomeBarbeador: string,
        nomeCorte: string,
        data: string,
        horario: string
    ) {
        this.nomeCliente = nomeCliente;
        this.nomeBarbeador = nomeBarbeador;
        this.nomeCorte = nomeCorte;
        this.data = data;
        this.horario = horario;
    }
}
