import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import MainLayout from '../components/MainLayout';
import { Card, Input, TextArea, Select, Button, Modal } from '../components/ui';
import { FolderIcon, FileIcon } from '../components/icons';
import { Page, Prioridade, TipoTicket, TicketStatus } from '../types';
import api from '../services/mockApi';

const NewTicketPage: React.FC = () => {
    const { user, selectedClient, setCurrentPage, setTicketId } = useAppContext();
    const [tiposTicket, setTiposTicket] = useState<TipoTicket[]>([]);
    const [loading, setLoading] = useState(false);
    const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
    
    const [formData, setFormData] = useState({
        titulo: '',
        descricao: '',
        idTipoTicket: '',
        prioridade: Prioridade.BAIXA,
        solicitanteEmail: user?.email || '',
        linksAnexos: '',
    });

    useEffect(() => {
        if (selectedClient) {
            api.getTiposTicketByCliente(selectedClient.id).then(setTiposTicket);
        }
    }, [selectedClient]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const mockDriveFiles = [
        { name: 'Relatorio_Vendas_Q3.pdf', link: 'http://drive.google.com/mock/sales_report_q3.pdf' },
        { name: 'Screenshot_Erro_Login.png', link: 'http://drive.google.com/mock/login_error.png' },
        { name: 'Proposta_Comercial_ABC.docx', link: 'http://drive.google.com/mock/proposal_abc.docx' },
        { name: 'Video_Demonstracao.mp4', link: 'http://drive.google.com/mock/demo_video.mp4' },
    ];

    const handleSelectDriveFile = (file: {name: string, link: string}) => {
        setFormData(prev => {
            const existingLinks = prev.linksAnexos.trim();
            const newLinks = existingLinks ? `${existingLinks}; ${file.link}` : file.link;
            return { ...prev, linksAnexos: newLinks };
        });
        setIsDriveModalOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !selectedClient || !formData.idTipoTicket) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        setLoading(true);
        try {
            const newTicketData = {
                titulo: formData.titulo,
                descricao: formData.descricao,
                idCliente: selectedClient.id,
                idTipoTicket: parseInt(formData.idTipoTicket),
                prioridade: formData.prioridade,
                solicitanteEmail: formData.solicitanteEmail,
                responsavelEmail: null,
                status: TicketStatus.NOVO,
                dataFechamento: null,
                linksAnexos: formData.linksAnexos.split(';').map(link => link.trim()).filter(Boolean),
            };
            const createdTicket = await api.createTicket(newTicketData, user);
            alert(`Ticket criado com sucesso! ID: ${createdTicket.id}`);
            setTicketId(createdTicket.id);
            setCurrentPage(Page.TICKET_DETAIL);

        } catch (error) {
            alert('Falha ao criar ticket.');
            setLoading(false);
        }
    };
    
    return (
        <MainLayout title="Novo Ticket">
            <div className="max-w-2xl mx-auto">
                <Card>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Abrir novo ticket</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input label="Cliente" value={selectedClient?.nome || ''} disabled />
                        <Select label="Tipo de ticket" name="idTipoTicket" value={formData.idTipoTicket} onChange={handleChange} required>
                            <option value="" disabled>Selecione um tipo...</option>
                            {tiposTicket.map(tipo => (
                                <option key={tipo.id} value={tipo.id}>{tipo.nome}</option>
                            ))}
                        </Select>
                        <Select label="Prioridade" name="prioridade" value={formData.prioridade} onChange={handleChange} required>
                            {Object.values(Prioridade).map(p => <option key={p} value={p}>{p}</option>)}
                        </Select>
                        <Input label="Título do ticket" name="titulo" value={formData.titulo} onChange={handleChange} required />
                        <TextArea label="Descrição detalhada" name="descricao" value={formData.descricao} onChange={handleChange} required />
                        <Input label="E-mail do solicitante" name="solicitanteEmail" type="email" value={formData.solicitanteEmail} onChange={handleChange} required />
                        <div>
                             <label htmlFor="linksAnexos" className="block text-sm font-medium text-gray-700 mb-1">Links de anexos</label>
                             <div className="flex items-center gap-2">
                                <input
                                    id="linksAnexos"
                                    name="linksAnexos"
                                    value={formData.linksAnexos}
                                    onChange={handleChange}
                                    className="w-full flex-grow px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm text-gray-900 bg-white"
                                    placeholder="https://drive.google.com/..."
                                />
                                <Button type="button" variant="secondary" onClick={() => setIsDriveModalOpen(true)} className="flex-shrink-0">
                                    <FolderIcon className="w-5 h-5 mr-2" />
                                    Google Drive
                                </Button>
                             </div>
                             <p className="text-xs text-gray-500 mt-1">Cole links ou selecione do Google Drive. Separe múltiplos links com ponto e vírgula (;).</p>
                        </div>
                        <div className="flex justify-end gap-4 pt-4">
                            <Button type="button" variant="secondary" onClick={() => setCurrentPage(Page.TICKETS_LIST)} disabled={loading}>Cancelar</Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Salvando...' : 'Salvar ticket'}
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
            <Modal isOpen={isDriveModalOpen} onClose={() => setIsDriveModalOpen(false)} title="Selecione um arquivo do Google Drive (Simulação)">
                <div className="space-y-2">
                    {mockDriveFiles.map(file => (
                        <button 
                            key={file.name} 
                            onClick={() => handleSelectDriveFile(file)}
                            className="w-full text-left p-2 rounded-md hover:bg-gray-100 flex items-center gap-3"
                        >
                            <FileIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                            <span className="text-gray-800">{file.name}</span>
                        </button>
                    ))}
                </div>
            </Modal>
        </MainLayout>
    );
};

export default NewTicketPage;