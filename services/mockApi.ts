import { User, Cliente, TipoTicket, SLA, Ticket, HistoricoTicket, PerfilAcesso, TicketStatus, Prioridade } from '../types';
import sheetApi from './sheetApi';

let users: User[] = [
  { id: 1, nome: 'Admin Geral', email: 'admin@ative.com', perfil: PerfilAcesso.ADMIN_GERAL, clientesVinculados: [101, 102], ativo: true },
  { id: 2, nome: 'Admin Cliente A', email: 'admin.a@cliente.com', perfil: PerfilAcesso.ADMIN_CLIENTE, clientesVinculados: [101], ativo: true },
  { id: 3, nome: 'Agente Cliente A', email: 'agente.a@cliente.com', perfil: PerfilAcesso.AGENTE, clientesVinculados: [101], ativo: true },
  { id: 4, nome: 'Solicitante A', email: 'solicitante.a@cliente.com', perfil: PerfilAcesso.SOLICITANTE, clientesVinculados: [101], ativo: true },
  { id: 5, nome: 'Agente Cliente B', email: 'agente.b@cliente.com', perfil: PerfilAcesso.AGENTE, clientesVinculados: [102], ativo: true },
  { id: 6, nome: 'Usuário Inativo', email: 'inativo@ative.com', perfil: PerfilAcesso.AGENTE, clientesVinculados: [101], ativo: false },
];

let clientes: Cliente[] = [
  { id: 101, nome: 'Empresa A', status: 'ATIVO' },
  { id: 102, nome: 'Empresa B', status: 'ATIVO' },
  { id: 103, nome: 'Empresa C', status: 'INATIVO' },
];

let tiposTicket: TipoTicket[] = [
  { id: 201, idCliente: 101, nome: 'Dúvida Financeira', ativo: true },
  { id: 202, idCliente: 101, nome: 'Problema Técnico', ativo: true },
  { id: 203, idCliente: 102, nome: 'Suporte de TI', ativo: true },
  { id: 204, idCliente: 'GLOBAL', nome: 'Sugestão de Melhoria', ativo: true },
];

let slas: SLA[] = [
  { id: 301, idCliente: 101, idTipoTicket: 202, prioridade: Prioridade.ALTA, prazoHoras: 4 },
  { id: 302, idCliente: 101, idTipoTicket: 202, prioridade: Prioridade.MEDIA, prazoHoras: 8 },
  { id: 303, idCliente: 'GLOBAL', idTipoTicket: 'GLOBAL', prioridade: Prioridade.BAIXA, prazoHoras: 24 },
];

let tickets: Ticket[] = [
    { id: 'T0001', titulo: 'Não consigo acessar o sistema', descricao: 'Ao tentar logar, recebo um erro de senha inválida, mas a senha está correta.', idCliente: 101, idTipoTicket: 202, prioridade: Prioridade.ALTA, status: TicketStatus.NOVO, responsavelEmail: null, solicitanteEmail: 'solicitante.a@cliente.com', dataAbertura: '2023-10-26T10:00:00Z', dataLimite: '2023-10-26T14:00:00Z', dataFechamento: null, linksAnexos: [] },
    { id: 'T0002', titulo: 'Dúvida sobre fatura', descricao: 'Gostaria de entender o item X da minha fatura de setembro.', idCliente: 101, idTipoTicket: 201, prioridade: Prioridade.MEDIA, status: TicketStatus.EM_ATENDIMENTO, responsavelEmail: 'agente.a@cliente.com', solicitanteEmail: 'solicitante.a@cliente.com', dataAbertura: '2023-10-25T15:30:00Z', dataLimite: '2023-10-26T15:30:00Z', dataFechamento: null, linksAnexos: [] },
    { id: 'T0003', titulo: 'Instalação de impressora', descricao: 'Preciso de ajuda para instalar a nova impressora no setor de marketing.', idCliente: 102, idTipoTicket: 203, prioridade: Prioridade.BAIXA, status: TicketStatus.RESOLVIDO, responsavelEmail: 'agente.b@cliente.com', solicitanteEmail: 'outro@cliente.com', dataAbertura: '2023-10-24T09:00:00Z', dataLimite: '2023-10-25T09:00:00Z', dataFechamento: '2023-10-24T18:00:00Z', linksAnexos: ['http://drive.google.com/link1'] },
    { id: 'T0004', titulo: 'Sistema lento hoje', descricao: 'O sistema CRM está muito lento hoje de manhã, afetando as vendas.', idCliente: 101, idTipoTicket: 202, prioridade: Prioridade.MEDIA, status: TicketStatus.AGUARDANDO_CLIENTE, responsavelEmail: 'agente.a@cliente.com', solicitanteEmail: 'solicitante.a@cliente.com', dataAbertura: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), dataLimite: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), dataFechamento: null, linksAnexos: [] },
    { id: 'T0005', titulo: 'Sugestão para novo relatório', descricao: 'Acho que seria útil ter um relatório de vendas por região.', idCliente: 101, idTipoTicket: 204, prioridade: Prioridade.BAIXA, status: TicketStatus.FECHADO, responsavelEmail: 'agente.a@cliente.com', solicitanteEmail: 'admin.a@cliente.com', dataAbertura: '2023-09-10T11:00:00Z', dataLimite: '2023-09-11T11:00:00Z', dataFechamento: '2023-09-12T11:00:00Z', linksAnexos: [] },
];

let historico: HistoricoTicket[] = [
    { id: 1, idTicket: 'T0001', data: '2023-10-26T10:00:00Z', autorEmail: 'solicitante.a@cliente.com', acao: 'Criação', detalhes: 'Ticket criado com status "Novo".' },
    { id: 2, idTicket: 'T0002', data: '2023-10-25T15:30:00Z', autorEmail: 'solicitante.a@cliente.com', acao: 'Criação', detalhes: 'Ticket criado com status "Novo".' },
    { id: 3, idTicket: 'T0002', data: '2023-10-25T16:00:00Z', autorEmail: 'agente.a@cliente.com', acao: 'Mudança de status', detalhes: 'Status alterado de "Novo" para "Em atendimento".' },
];

const useSheet = () => !!localStorage.getItem('scriptUrl');
const getScriptUrl = () => localStorage.getItem('scriptUrl') || '';

const api = {
  login: async (email: string, pass: string): Promise<User> => {
    const dataSource = useSheet() ? await sheetApi.getUsers(getScriptUrl()) : users;
    return new Promise((resolve, reject) => {
        const user = dataSource.find(u => u.email === email && u.ativo);
        if (user) {
          resolve(user);
        } else {
          reject(new Error('Usuário não encontrado ou inativo.'));
        }
    });
  },

  getClientesByIds: async (ids: number[]): Promise<Cliente[]> => {
    const dataSource = useSheet() ? await sheetApi.getClientes(getScriptUrl()) : clientes;
    return dataSource.filter(c => ids.includes(c.id) && c.status === 'ATIVO');
  },
  
  getAllClientes: async (): Promise<Cliente[]> => {
    const dataSource = useSheet() ? await sheetApi.getClientes(getScriptUrl()) : clientes;
    return [...dataSource];
  },
  
  getTicketsByCliente: async (clienteId: number): Promise<Ticket[]> => {
     const dataSource = useSheet() ? await sheetApi.getTickets(getScriptUrl()) : tickets;
     return dataSource.filter(t => t.idCliente === clienteId);
  },

  getTicketById: async (ticketId: string): Promise<Ticket | undefined> => {
    const dataSource = useSheet() ? await sheetApi.getTickets(getScriptUrl()) : tickets;
    return dataSource.find(t => t.id === ticketId);
  },

  getHistoricoByTicketId: async (ticketId: string): Promise<HistoricoTicket[]> => {
    const dataSource = useSheet() ? await sheetApi.getHistorico(getScriptUrl()) : historico;
    return dataSource.filter(h => h.idTicket === ticketId).sort((a,b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  },
  
  getTiposTicketByCliente: async (clienteId: number): Promise<TipoTicket[]> => {
    const tiposDataSource = useSheet() ? await sheetApi.getTiposTicket(getScriptUrl()) : tiposTicket;
    return tiposDataSource.filter(tt => (tt.idCliente === clienteId || tt.idCliente === 'GLOBAL') && tt.ativo);
  },

  createTicket: async (newTicketData: Omit<Ticket, 'id' | 'dataAbertura' | 'dataLimite'>, user: User): Promise<Ticket> => {
    const id = `T${String(Date.now()).slice(-6)}`;
    const dataAbertura = new Date().toISOString();
    
    const slaDataSource = useSheet() ? await sheetApi.getSLAs(getScriptUrl()) : slas;
    const sla = slaDataSource.find(s => s.idCliente === newTicketData.idCliente && s.prioridade === newTicketData.prioridade) 
                || slaDataSource.find(s => s.idCliente === 'GLOBAL' && s.prioridade === newTicketData.prioridade);
    const prazoHoras = sla ? sla.prazoHoras : 24;
    const dataLimite = new Date(new Date(dataAbertura).getTime() + prazoHoras * 60 * 60 * 1000).toISOString();

    const ticket: Ticket = {
        ...newTicketData,
        id,
        dataAbertura,
        dataLimite,
        status: TicketStatus.NOVO
    };
    
    const historyEntry: HistoricoTicket = {
        id: Date.now(),
        idTicket: id,
        data: dataAbertura,
        autorEmail: user.email,
        acao: 'Criação',
        detalhes: `Ticket criado com status "${TicketStatus.NOVO}".`
    };

    if (useSheet()) {
        await sheetApi.createTicket(getScriptUrl(), { ticket, historyEntry });
    } else {
        tickets.push(ticket);
        historico.push(historyEntry);
    }
    return ticket;
  },

  updateTicket: async (ticketId: string, updates: Partial<Ticket>, user: User): Promise<Ticket> => {
    const originalTicketSource = useSheet() ? await sheetApi.getTickets(getScriptUrl()) : tickets;
    const originalTicket = originalTicketSource.find(t => t.id === ticketId);
    if (!originalTicket) throw new Error('Ticket não encontrado.');

    const historyEntries: HistoricoTicket[] = [];
    if (updates.status && updates.status !== originalTicket.status) {
        historyEntries.push({
          id: Date.now(),
          idTicket: ticketId,
          data: new Date().toISOString(),
          autorEmail: user.email,
          acao: 'Mudança de status',
          detalhes: `Status alterado de "${originalTicket.status}" para "${updates.status}".`
        });
    }
    if (updates.responsavelEmail !== undefined && updates.responsavelEmail !== originalTicket.responsavelEmail) {
         historyEntries.push({
          id: Date.now() + 1,
          idTicket: ticketId,
          data: new Date().toISOString(),
          autorEmail: user.email,
          acao: 'Mudança de responsável',
          detalhes: `Responsável alterado de "${originalTicket.responsavelEmail || 'Nenhum'}" para "${updates.responsavelEmail || 'Nenhum'}".`
        });
    }
    
    if (useSheet()) {
        await sheetApi.updateTicket(getScriptUrl(), { ticketId, updates, historyEntries });
    } else {
        const ticketIndex = tickets.findIndex(t => t.id === ticketId);
        if (ticketIndex !== -1) {
            tickets[ticketIndex] = { ...tickets[ticketIndex], ...updates };
            historico.push(...historyEntries);
        }
    }
    return { ...originalTicket, ...updates };
  },

  addComment: async (ticketId: string, comentario: string, user: User): Promise<HistoricoTicket> => {
    const newComment: HistoricoTicket = {
      id: Date.now(),
      idTicket: ticketId,
      data: new Date().toISOString(),
      autorEmail: user.email,
      acao: 'Novo comentário',
      detalhes: comentario,
    };

    if (useSheet()) {
      await sheetApi.addComment(getScriptUrl(), { historyEntry: newComment });
    } else {
      if (!tickets.some(t => t.id === ticketId)) {
        throw new Error('Ticket não encontrado');
      }
      historico.push(newComment);
    }
    return newComment;
  },

  getUsersByCliente: async (clienteId?: number): Promise<User[]> => {
    const dataSource = useSheet() ? await sheetApi.getUsers(getScriptUrl()) : users;
    if(clienteId) {
        return dataSource.filter(u => u.clientesVinculados.includes(clienteId));
    }
    return [...dataSource];
  },

  addUser: async (userData: Omit<User, 'id'>): Promise<User> => {
    if (useSheet()) {
      return sheetApi.addUser(getScriptUrl(), { userData });
    }
    await new Promise(res => setTimeout(res, 500));
    const newUser: User = {
      ...userData,
      id: Math.max(...users.map(u => u.id), 0) + 1,
    };
    users.push(newUser);
    return newUser;
  },
  
  updateUser: async (updatedUser: User): Promise<User> => {
    if (useSheet()) {
      return sheetApi.updateUser(getScriptUrl(), { updatedUser });
    }
    await new Promise(res => setTimeout(res, 500));
    const userIndex = users.findIndex(u => u.id === updatedUser.id);
    if (userIndex === -1) {
      throw new Error('Usuário não encontrado.');
    }
    users[userIndex] = updatedUser;
    return updatedUser;
  },

  addCliente: async (clientData: Omit<Cliente, 'id'>): Promise<Cliente> => {
    if (useSheet()) {
      return sheetApi.addClient(getScriptUrl(), { clientData });
    }
    await new Promise(res => setTimeout(res, 500));
    const newClient: Cliente = {
      ...clientData,
      id: Math.max(...clientes.map(c => c.id), 0) + 1,
    };
    clientes.push(newClient);
    return newClient;
  },

  updateCliente: async (updatedClient: Cliente): Promise<Cliente> => {
    if (useSheet()) {
      return sheetApi.updateClient(getScriptUrl(), { updatedClient });
    }
    await new Promise(res => setTimeout(res, 500));
    const clientIndex = clientes.findIndex(c => c.id === updatedClient.id);
    if (clientIndex === -1) {
      throw new Error('Cliente não encontrado.');
    }
    clientes[clientIndex] = updatedClient;
    return updatedClient;
  },

  getAllTiposTicket: async (): Promise<TipoTicket[]> => {
     if (useSheet()) {
        return sheetApi.getTiposTicket(getScriptUrl());
    }
    return [...tiposTicket];
  },

  addTipoTicket: async (tipoTicketData: Omit<TipoTicket, 'id'>): Promise<TipoTicket> => {
     if (useSheet()) {
      return sheetApi.addTipoTicket(getScriptUrl(), { tipoTicketData });
    }
    await new Promise(res => setTimeout(res, 500));
    const newTipoTicket: TipoTicket = {
      ...tipoTicketData,
      id: Math.max(...tiposTicket.map(t => t.id), 0) + 1,
    };
    tiposTicket.push(newTipoTicket);
    return newTipoTicket;
  },

  updateTipoTicket: async (updatedTipoTicket: TipoTicket): Promise<TipoTicket> => {
    if (useSheet()) {
      return sheetApi.updateTipoTicket(getScriptUrl(), { updatedTipoTicket });
    }
    await new Promise(res => setTimeout(res, 500));
    const index = tiposTicket.findIndex(t => t.id === updatedTipoTicket.id);
    if (index === -1) {
      throw new Error('Tipo de Ticket não encontrado.');
    }
    tiposTicket[index] = updatedTipoTicket;
    return updatedTipoTicket;
  },

  getAllSLAs: async (): Promise<SLA[]> => {
    if (useSheet()) {
        return sheetApi.getSLAs(getScriptUrl());
    }
    return [...slas];
  },

  addSLA: async (slaData: Omit<SLA, 'id'>): Promise<SLA> => {
    if (useSheet()) {
        return sheetApi.addSLA(getScriptUrl(), { slaData });
    }
    await new Promise(res => setTimeout(res, 500));
    const newSLA: SLA = {
      ...slaData,
      id: Math.max(...slas.map(s => s.id), 0) + 1,
    };
    slas.push(newSLA);
    return newSLA;
  },

  updateSLA: async (updatedSLA: SLA): Promise<SLA> => {
    if (useSheet()) {
        return sheetApi.updateSLA(getScriptUrl(), { updatedSLA });
    }
    await new Promise(res => setTimeout(res, 500));
    const index = slas.findIndex(s => s.id === updatedSLA.id);
    if (index === -1) {
      throw new Error('SLA não encontrado.');
    }
    slas[index] = updatedSLA;
    return updatedSLA;
  },
};

export default api;