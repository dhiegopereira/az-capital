// Enumeração para os tipos de sala permitidos
export enum TipoSala {
    Reuniao,
    Conferencia,
    Auditorio
}

// Interface Sala
export interface Sala {
    nome: string;
    capacidade_maxima_pessoas: number;
    tipo_de_sala: TipoSala; // Usando a enumeração TipoSala para limitar os valores permitidos
    equipamentos?: string[];
    reservas?: Reserva[]; // Adicionando a propriedade reservas
}

// Array que armazena as salas cadastradas, já iniciada com valor vazio
export const listaDeSalasDisponiveis: Sala[] = [];

// Interface para a reserva
interface Reserva {
    data_inicio: Date;
    data_fim: Date;
}

// Função para cadastrar uma nova sala
function cadastrarSala(nome: string, capacidade_maxima_pessoas: number, tipo_de_sala: TipoSala, equipamentos?: string[]): Sala {
    // Verificar se o tipo_de_sala fornecido é válido
    if (!(tipo_de_sala in TipoSala)) {
        throw new Error("Tipo de sala inválido");
    }
    
    // Verificar se todos os parâmetros necessários são fornecidos
    if (!nome || !capacidade_maxima_pessoas) {
        throw new Error("Todos os parâmetros devem ser fornecidos");
    }

    // Verificar se o nome da sala já existe no array de salas cadastradas
    const salaExistente = listaDeSalasDisponiveis.find(sala => sala.nome === nome);
    if (salaExistente) {
        throw new Error("Nome de sala já existe");
    }

    // Criar uma nova sala com os valores fornecidos
    const novaSala: Sala = {
        nome: nome,
        capacidade_maxima_pessoas: capacidade_maxima_pessoas,
        tipo_de_sala: tipo_de_sala,
        reservas: [] // Inicializando o array de reservas vazio
    };

    // Verificar se foram fornecidos equipamentos e adicionar à sala, se houver
    if (equipamentos) {
        novaSala.equipamentos = equipamentos;
    }

    // Adicionar a nova sala ao array de salas cadastradas
    listaDeSalasDisponiveis.push(novaSala);

    // Retornar a nova sala cadastrada
    return novaSala;
}

// Função para realizar a reserva de uma sala
export function reservarSala(sala: Sala, dataInicio: Date, dataFim: Date): void {
    // Verificar se a data de término é posterior à data de início
    if (dataInicio >= dataFim) {
        throw new Error("A data de término deve ser posterior à data de início");
    }

    // Se sala.reservas for undefined, inicializá-lo como um array vazio
    if (!sala.reservas) {
        sala.reservas = [];
    }

    // Verificar se não há conflito de horário com outras reservas da sala
    for (const reserva of sala.reservas) {
        if ((dataInicio >= reserva.data_inicio && dataInicio < reserva.data_fim) ||
            (dataFim > reserva.data_inicio && dataFim <= reserva.data_fim) ||
            (dataInicio <= reserva.data_inicio && dataFim >= reserva.data_fim)) {
            throw new Error("Sala já reservada para este horário");
        }
    }

    // Se não houver conflito, adicionar a reserva à sala
    sala.reservas.push({ data_inicio: dataInicio, data_fim: dataFim });
}

// Função para converter o tipo de sala de enum para string
export function tipoSalaToString(tipoSala: TipoSala): string {
    switch (tipoSala) {
        case TipoSala.Reuniao:
            return "Reunião";
        case TipoSala.Conferencia:
            return "Conferência";
        case TipoSala.Auditorio:
            return "Auditório";
        default:
            throw new Error("Tipo de sala inválido");
    }
}

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

// Função para gerar um nome aleatório para a sala
function generateRandomName(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let randomName = '';
    for (let i = 0; i < 8; i++) {
        randomName += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `Sala_${randomName}`;
}

// Função para gerar um número aleatório dentro de um intervalo específico
function randomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Função para cadastrar uma sala com valores aleatórios
function cadastrarSalaAleatoria(): Sala {
    const nome = generateRandomName(); // Gera um nome aleatório
    const capacidadeMaximaPessoas = randomNumber(10, 50); // Capacidade varia de 10 a 50 pessoas
    const tipoSala = randomNumber(0, 2); // Tipo de sala: Reuniao (0), Conferencia (1), Auditorio (2)
    const equipamentos = ["Projetor", "Flipchart", "Microfone"]; // Equipamentos comuns

    return cadastrarSala(nome, capacidadeMaximaPessoas, tipoSala, equipamentos);
}

// Criar 10 salas aleatórias
for (let i = 0; i < 10; i++) {
    cadastrarSalaAleatoria();
}

// Simulando três reservas
reservarSala(listaDeSalasDisponiveis[0], new Date("2024-04-02T09:00:00"), new Date("2024-04-02T11:00:00"));
reservarSala(listaDeSalasDisponiveis[6], new Date("2024-04-03T13:00:00"), new Date("2024-04-03T15:00:00"));
reservarSala(listaDeSalasDisponiveis[9], new Date("2024-04-05T16:00:00"), new Date("2024-04-05T18:00:00"));
