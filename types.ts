export enum PerfilAcesso {
  ADMIN_GERAL = 'ADMIN_GERAL',
  ADMIN_CLIENTE = 'ADMIN_CLIENTE',
  AGENTE = 'AGENTE',
  SOLICITANTE = 'SOLICITANTE',
}

export enum TicketStatus {
  NOVO = 'Novo',
  EM_ATENDIMENTO = 'Em atendimento',
  AGUARDANDO_CLIENTE = 'Aguardando cliente',
  RESOLVIDO = 'Resolvido',
  FECHADO = 'Fechado',
}

export enum Prioridade {
  BAIXA = 'Baixa',
  MEDIA = 'Média',
  ALTA = 'Alta',
}

export enum Page {
  LOGIN,
  CLIENT_SELECTION,
  DASHBOARD,
  TICKETS_LIST,
  TICKET_DETAIL,
  NEW_TICKET,
  USERS,
  SETTINGS,
  REPORTS,
  TICKET_SETTINGS,
  GOOGLE_SHEETS_SETTINGS,
}

export interface User {
  id: number;
  nome: string;
  email: string;
  perfil: PerfilAcesso;
  clientesVinculados: number[];
  ativo: boolean;
}

export interface Cliente {
  id: number;
  nome: string;
  status: 'ATIVO' | 'INATIVO';
}

export interface TipoTicket {
  id: number;
  idCliente: number | 'GLOBAL';
  nome: string;
  ativo: boolean;
}

export interface SLA {
  id: number;
  idCliente: number | 'GLOBAL';
  idTipoTicket: number | 'GLOBAL';
  prioridade: Prioridade;
  prazoHoras: number;
}

export interface Ticket {
  id: string;
  titulo: string;
  descricao: string;
  idCliente: number;
  idTipoTicket: number;
  prioridade: Prioridade;
  status: TicketStatus;
  responsavelEmail: string | null;
  solicitanteEmail: string;
  dataAbertura: string;
  dataLimite: string;
  dataFechamento: string | null;
  linksAnexos: string[];
}

export interface HistoricoTicket {
  id: number;
  idTicket: string;
  data: string;
  autorEmail: string;
  acao: string;
  detalhes: string;
}