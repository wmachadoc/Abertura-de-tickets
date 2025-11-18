import { User, Cliente, TipoTicket, SLA, Ticket, HistoricoTicket } from '../types';

const makeRequest = async <T>(scriptUrl: string, action: string, payload: any): Promise<T> => {
    if (!scriptUrl) throw new Error("Google Apps Script URL is not configured.");

    // The entire request payload is stringified and sent as a single form parameter.
    // This is a common and robust workaround for CORS/redirect issues with Google Apps Script.
    const requestBody = JSON.stringify({ action, payload });

    try {
        const response = await fetch(scriptUrl, {
            method: 'POST',
            mode: 'cors', // Explicitly set mode
            redirect: 'follow', // Explicitly set redirect behavior
            headers: {
                // We use 'application/x-www-form-urlencoded' to avoid browser pre-flight (OPTIONS) requests.
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            // The body is a URL-encoded string, not raw JSON.
            body: `payload=${encodeURIComponent(requestBody)}`,
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }

        const result = await response.json();

        if (!result.success) {
            console.error('Apps Script Error:', result.error);
            throw new Error(`API Error for action '${action}': ${result.error || 'Unknown error'}`);
        }

        return result.data as T;

    } catch (error) {
        console.error(`Failed to execute action '${action}':`, error);
        // Re-throw the error so the calling function can handle it (e.g., show an error message to the user).
        throw error;
    }
};

const sheetApi = {
    // READ operations
    getUsers: (scriptUrl: string) => makeRequest<User[]>(scriptUrl, 'readSheet', { sheetName: 'users' }),
    getClientes: (scriptUrl: string) => makeRequest<Cliente[]>(scriptUrl, 'readSheet', { sheetName: 'clientes' }),
    getTiposTicket: (scriptUrl: string) => makeRequest<TipoTicket[]>(scriptUrl, 'readSheet', { sheetName: 'tipos_ticket' }),
    getSLAs: (scriptUrl: string) => makeRequest<SLA[]>(scriptUrl, 'readSheet', { sheetName: 'slas' }),
    getTickets: (scriptUrl: string) => makeRequest<Ticket[]>(scriptUrl, 'readSheet', { sheetName: 'tickets' }),
    getHistorico: (scriptUrl: string) => makeRequest<HistoricoTicket[]>(scriptUrl, 'readSheet', { sheetName: 'historico' }),

    // WRITE operations
    createTicket: (scriptUrl: string, payload: { ticket: Ticket, historyEntry: HistoricoTicket }) => {
        return makeRequest<{ ticket: Ticket, historyEntry: HistoricoTicket }>(scriptUrl, 'createTicket', payload);
    },
    updateTicket: (scriptUrl: string, payload: { ticketId: string; updates: Partial<Ticket>; historyEntries: HistoricoTicket[] }) => {
        return makeRequest(scriptUrl, 'updateTicket', payload);
    },
    addComment: (scriptUrl: string, payload: { historyEntry: HistoricoTicket }) => {
        return makeRequest<{ historyEntry: HistoricoTicket }>(scriptUrl, 'addComment', payload);
    },
    addUser: (scriptUrl: string, payload: { userData: Omit<User, 'id'> }) => {
        return makeRequest<User>(scriptUrl, 'addUser', payload);
    },
    updateUser: (scriptUrl: string, payload: { updatedUser: User }) => {
        return makeRequest<User>(scriptUrl, 'updateUser', payload);
    },
    addClient: (scriptUrl: string, payload: { clientData: Omit<Cliente, 'id'> }) => {
        return makeRequest<Cliente>(scriptUrl, 'addClient', payload);
    },
    updateClient: (scriptUrl: string, payload: { updatedClient: Cliente }) => {
        return makeRequest<Cliente>(scriptUrl, 'updateClient', payload);
    },
    addTipoTicket: (scriptUrl: string, payload: { tipoTicketData: Omit<TipoTicket, 'id'> }) => {
        return makeRequest<TipoTicket>(scriptUrl, 'addTipoTicket', payload);
    },
    updateTipoTicket: (scriptUrl: string, payload: { updatedTipoTicket: TipoTicket }) => {
        return makeRequest<TipoTicket>(scriptUrl, 'updateTipoTicket', payload);
    },
    addSLA: (scriptUrl: string, payload: { slaData: Omit<SLA, 'id'> }) => {
        return makeRequest<SLA>(scriptUrl, 'addSLA', payload);
    },
    updateSLA: (scriptUrl: string, payload: { updatedSLA: SLA }) => {
        return makeRequest<SLA>(scriptUrl, 'updateSLA', payload);
    },
};

export default sheetApi;