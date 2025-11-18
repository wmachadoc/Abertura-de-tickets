
import React, { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import MainLayout from '../components/MainLayout';
import { Card, Select, Button, Badge, TextArea } from '../components/ui';
import { ArrowLeftIcon } from '../components/icons';
import api from '../services/mockApi';
import { Ticket, HistoricoTicket, Page, User, TicketStatus, Prioridade } from '../types';

const getPriorityBadgeColor = (priority: Prioridade) => {
    switch(priority) {
        case Prioridade.ALTA: return 'red';
        case Prioridade.MEDIA: return 'yellow';
        case Prioridade.BAIXA: return 'green';
        default: return 'gray';
    }
};

const InfoItem: React.FC<{label: string; children: React.ReactNode}> = ({label, children}) => (
    <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <div className="mt-1 text-sm text-gray-900">{children}</div>
    </div>
);

const TicketDetailPage: React.FC<{ ticketId: string }> = ({ ticketId }) => {
    const { user, selectedClient, setCurrentPage } = useAppContext();
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [history, setHistory] = useState<HistoricoTicket[]>([]);
    const [agents, setAgents] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [newComment, setNewComment] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    
    const [editableStatus, setEditableStatus] = useState<TicketStatus | ''>('');
    const [editableResponsavel, setEditableResponsavel] = useState<string | null>('');

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const ticketData = await api.getTicketById(ticketId);
            const historyData = await api.getHistoricoByTicketId(ticketId);
            if (ticketData) {
              setTicket(ticketData);
              setEditableStatus(ticketData.status);
              setEditableResponsavel(ticketData.responsavelEmail);
            }
            if (selectedClient) {
              const agentData = await api.getUsersByCliente(selectedClient.id);
              setAgents(agentData.filter(u => u.perfil !== 'SOLICITANTE'));
            }
            setHistory(historyData);
        } catch(error) {
            console.error("Failed to fetch ticket details", error);
        } finally {
            setLoading(false);
        }
    }, [ticketId, selectedClient]);


    useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    const handleSaveChanges = async () => {
        if (!ticket || !user) return;
        setIsSaving(true);

        const updates: Partial<Ticket> = {};
        if (editableStatus && editableStatus !== ticket.status) updates.status = editableStatus;
        if (editableResponsavel !== ticket.responsavelEmail) updates.responsavelEmail = editableResponsavel;

        if (Object.keys(updates).length > 0) {
            try {
                await api.updateTicket(ticket.id, updates, user);
                fetchData(); // Refresh data
            } catch (error) {
                alert("Falha ao salvar alterações");
            }
        }
        setIsSaving(false);
    };

    const handleAddComment = async () => {
        if (!ticket || !user || !newComment.trim()) return;
        setIsSaving(true);
        try {
            await api.addComment(ticket.id, newComment, user);
            setNewComment('');
            fetchData(); // Refresh data
        } catch (error) {
            alert("Falha ao adicionar comentário");
        }
        setIsSaving(false);
    }
    
    if (loading) {
        return <MainLayout title="Detalhe do Ticket"><p>Carregando...</p></MainLayout>;
    }
    
    if (!ticket) {
        return <MainLayout title="Erro"><p>Ticket não encontrado.</p></MainLayout>;
    }

    const isDirty = editableStatus !== ticket.status || editableResponsavel !== ticket.responsavelEmail;

    return (
        <MainLayout title={`Ticket ${ticket.id}`}>
             <div className="mb-4">
                <button onClick={() => setCurrentPage(Page.TICKETS_LIST)} className="flex items-center text-sm text-gray-600 hover:text-gray-900 font-medium">
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Voltar para lista
                </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-gray-800">{ticket.titulo} <span className="font-normal text-gray-500">#{ticket.id}</span></h2>
                             <InfoItem label="Prioridade">
                                <Badge color={getPriorityBadgeColor(ticket.prioridade)}>{ticket.prioridade}</Badge>
                            </InfoItem>
                            <InfoItem label="Status">
                                <Select value={editableStatus} onChange={e => setEditableStatus(e.target.value as TicketStatus)}>
                                    {Object.values(TicketStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                </Select>
                            </InfoItem>
                             <InfoItem label="Responsável">
                                <Select value={editableResponsavel || ''} onChange={e => setEditableResponsavel(e.target.value)}>
                                    <option value="">Não atribuído</option>
                                    {agents.map(agent => <option key={agent.id} value={agent.email}>{agent.nome}</option>)}
                                </Select>
                            </InfoItem>
                             <InfoItem label="Solicitante">{ticket.solicitanteEmail}</InfoItem>
                             <InfoItem label="Data Abertura">{new Date(ticket.dataAbertura).toLocaleString()}</InfoItem>
                             <InfoItem label="Data Limite">{new Date(ticket.dataLimite).toLocaleString()}</InfoItem>
                        </div>
                    </Card>
                    <Card>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Descrição</h3>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{ticket.descricao}</p>
                    </Card>
                </div>
                {/* Right Column */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Histórico e Comentários</h3>
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            {history.map(h => (
                                <div key={h.id} className="flex gap-3">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-600">{h.autorEmail.substring(0, 1).toUpperCase()}</div>
                                    <div>
                                        <p className="text-sm">
                                            <span className="font-semibold text-gray-800">{h.autorEmail}</span>
                                            <span className="text-gray-500"> - {new Date(h.data).toLocaleString()}</span>
                                        </p>
                                        <p className={`mt-1 text-sm ${h.acao === 'Novo comentário' ? 'text-gray-700' : 'text-gray-500 italic'}`}>{h.detalhes}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-4 border-t">
                            <TextArea 
                                label="Adicionar comentário" 
                                value={newComment} 
                                onChange={e => setNewComment(e.target.value)}
                                placeholder="Digite seu comentário aqui..."
                            />
                            <div className="mt-2 flex justify-end">
                                <Button onClick={handleAddComment} disabled={isSaving || !newComment.trim()}>Adicionar</Button>
                            </div>
                        </div>
                    </Card>
                    <div className="flex justify-end">
                         <Button onClick={handleSaveChanges} disabled={!isDirty || isSaving}>
                           {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                         </Button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default TicketDetailPage;
