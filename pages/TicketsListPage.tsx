
import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import MainLayout from '../components/MainLayout';
import { Button, Input, Select, Badge } from '../components/ui';
import { PlusIcon } from '../components/icons';
import api from '../services/mockApi';
import { Ticket, TicketStatus, Prioridade, Page } from '../types';

const getPriorityBadgeColor = (priority: Prioridade) => {
    switch(priority) {
        case Prioridade.ALTA: return 'red';
        case Prioridade.MEDIA: return 'yellow';
        case Prioridade.BAIXA: return 'green';
        default: return 'gray';
    }
};

const getStatusBadgeColor = (status: TicketStatus) => {
    switch(status) {
        case TicketStatus.NOVO: return 'blue';
        case TicketStatus.EM_ATENDIMENTO: return 'yellow';
        case TicketStatus.AGUARDANDO_CLIENTE: return 'gray';
        case TicketStatus.RESOLVIDO: return 'green';
        case TicketStatus.FECHADO: return 'gray';
        default: return 'gray';
    }
}


const TicketsListPage: React.FC = () => {
    const { selectedClient, setCurrentPage, setTicketId } = useAppContext();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('');

    useEffect(() => {
        if (selectedClient) {
            setLoading(true);
            api.getTicketsByCliente(selectedClient.id).then(data => {
                setTickets(data.sort((a, b) => new Date(b.dataAbertura).getTime() - new Date(a.dataAbertura).getTime()));
                setLoading(false);
            });
        }
    }, [selectedClient]);

    const filteredTickets = useMemo(() => {
        return tickets.filter(ticket => {
            const searchMatch = searchTerm.toLowerCase() === '' || 
                                ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                ticket.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                ticket.solicitanteEmail.toLowerCase().includes(searchTerm.toLowerCase());
            const statusMatch = statusFilter === '' || ticket.status === statusFilter;
            const priorityMatch = priorityFilter === '' || ticket.prioridade === priorityFilter;
            return searchMatch && statusMatch && priorityMatch;
        });
    }, [tickets, searchTerm, statusFilter, priorityFilter]);

    const handleRowClick = (id: string) => {
        setTicketId(id);
        setCurrentPage(Page.TICKET_DETAIL);
    }
    
    return (
        <MainLayout title="Tickets">
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="w-full md:w-1/2 lg:w-1/3">
                        <Input 
                            placeholder="Buscar por ID, título ou e-mail..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4">
                         <Select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                            <option value="">Todos Status</option>
                            {Object.values(TicketStatus).map(s => <option key={s} value={s}>{s}</option>)}
                        </Select>
                        <Select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
                             <option value="">Todas Prioridades</option>
                             {Object.values(Prioridade).map(p => <option key={p} value={p}>{p}</option>)}
                        </Select>
                        <Button onClick={() => setCurrentPage(Page.NEW_TICKET)}>
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Novo Ticket
                        </Button>
                    </div>
                </div>

                <div className="bg-white shadow-sm rounded-lg overflow-x-auto">
                    <table className="w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {['ID', 'Título', 'Prioridade', 'Status', 'Responsável', 'Data Abertura', 'Atrasado?'].map(h => (
                                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan={7} className="text-center p-8">Carregando tickets...</td></tr>
                            ) : filteredTickets.map(ticket => {
                                const isAtrasado = new Date(ticket.dataLimite) < new Date() && ticket.status !== TicketStatus.FECHADO && ticket.status !== TicketStatus.RESOLVIDO;
                                return (
                                    <tr key={ticket.id} onClick={() => handleRowClick(ticket.id)} className="hover:bg-gray-50 cursor-pointer">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{ticket.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-xs truncate">{ticket.titulo}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><Badge color={getPriorityBadgeColor(ticket.prioridade)}>{ticket.prioridade}</Badge></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><Badge color={getStatusBadgeColor(ticket.status)}>{ticket.status}</Badge></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{ticket.responsavelEmail || 'Não atribuído'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(ticket.dataAbertura).toLocaleDateString()}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${isAtrasado ? 'text-red-600' : 'text-gray-500'}`}>{isAtrasado ? 'SIM' : 'NÃO'}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </MainLayout>
    );
};

export default TicketsListPage;
