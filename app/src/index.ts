
//Importação das funções auxiliares para o teste

import {
    Sala, // Interface da sala, usado para criar uma sala
    TipoSala, // Enumeador do tipo de salas, usado para escolher o tipo de sala
    listaDeSalasDisponiveis, // Lista com as salas disponíveis para pesquisar
    tipoSalaToString // usado para converter o tipo da sala e exibir para o usuário, pois é um enumerador
} from './geradorDeSalas';

// Função para verificar salas disponíveis para reserva
function salasDisponiveis(salas: Sala[], tipoSala: TipoSala, numPessoas: number, dataInicio: Date, dataFim: Date): Sala[] {
    // Verificar se a data de término é posterior à data de início
    if (dataInicio >= dataFim) {
        throw new Error("A data de término deve ser posterior à data de início");
    }

    // Filtrar as salas pelo tipo de sala e capacidade
    let salasFiltradas = salas.filter(sala => sala.tipo_de_sala === tipoSala && sala.capacidade_maxima_pessoas >= numPessoas);

    // Filtrar as salas que estão disponíveis no horário desejado
    salasFiltradas = salasFiltradas.filter(sala => {
        // Verificar se não há reservas conflitantes
        for (const reserva of sala.reservas || []) {
            if ((dataInicio >= reserva.data_inicio && dataInicio < reserva.data_fim) ||
                (dataFim > reserva.data_inicio && dataFim <= reserva.data_fim) ||
                (dataInicio <= reserva.data_inicio && dataFim >= reserva.data_fim)) {
                return false; // Sala ocupada no horário desejado
            }
        }
        return true; // Sala disponível no horário desejado
    });

    return salasFiltradas;
}

// Verificando reserva
const salasDisponiveisParaReserva = salasDisponiveis(listaDeSalasDisponiveis, TipoSala.Reuniao, 25, new Date("2024-04-02T09:00:00"), new Date("2024-04-02T13:00:00"));

// Converter o tipo de sala para string antes de exibir
const salasDisponiveisFormatadas = salasDisponiveisParaReserva.map(sala => ({
    ...sala,
    tipo_de_sala: tipoSalaToString(sala.tipo_de_sala)
}));

console.log(salasDisponiveisFormatadas);