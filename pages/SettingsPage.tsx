import React, { useState, useEffect, useCallback } from 'react';
import MainLayout from '../components/MainLayout';
import { Button, Modal, Input, Select, Badge } from '../components/ui';
import { PlusIcon, OfficeBuildingIcon, TagIcon, ClockIcon } from '../components/icons';
import api from '../services/mockApi';
import { Cliente, TipoTicket, SLA, Prioridade } from '../types';

// Client Components
const ClientForm: React.FC<{
    client: Partial<Cliente> | null;
    onSave: (client: Omit<Cliente, 'id'> | Cliente) => void;
    onClose: () => void;
}> = ({ client, onSave, onClose }) => {
    const [formData, setFormData] = useState(() => {
        const defaults = { nome: '', status: 'ATIVO' as 'ATIVO' | 'INATIVO' };
        return { ...defaults, ...(client || {}) };
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    }
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as Cliente);
    }
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Nome do Cliente" name="nome" value={formData.nome} onChange={handleChange} required/>
            <Select label="Status" name="status" value={formData.status} onChange={handleChange}>
                <option value="ATIVO">Ativo</option>
                <option value="INATIVO">Inativo</option>
            </Select>
             <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
                <Button type="submit">Salvar</Button>
            </div>
        </form>
    )
}

const ClientsManager = () => {
    const [clients, setClients] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState<Cliente | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.getAllClientes();
            setClients(data);
        } catch (error) {
            console.error("Failed to fetch clients", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpenModal = (client: Cliente | null = null) => {
        setEditingClient(client);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingClient(null);
    };
    
    const handleSaveClient = async (client: Omit<Cliente, 'id'> | Cliente) => {
        try {
            if ('id' in client) {
                await api.updateCliente(client);
            } else {
                await api.addCliente(client);
            }
            fetchData();
            handleCloseModal();
        } catch (error) {
            alert('Falha ao salvar cliente');
        }
    }
    
    return (
        <div className="space-y-4">
             <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-700">Gestão de Clientes</h2>
                <Button onClick={() => handleOpenModal()}>
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Novo Cliente
                </Button>
            </div>
            <div className="bg-white shadow-sm rounded-lg overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="relative px-6 py-3"><span className="sr-only">Editar</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                         {loading ? (
                            <tr><td colSpan={4} className="text-center p-8">Carregando...</td></tr>
                        ) : clients.map(client => (
                            <tr key={client.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.nome}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                     <Badge color={client.status === 'ATIVO' ? 'green' : 'red'}>{client.status}</Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleOpenModal(client)} className="text-green-600 hover:text-green-900">Editar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingClient ? 'Editar Cliente' : 'Novo Cliente'}>
                <ClientForm client={editingClient} onSave={handleSaveClient} onClose={handleCloseModal} />
            </Modal>
        </div>
    )
}

// Ticket Type Components
const TicketTypeForm: React.FC<{
    tipo: Partial<TipoTicket> | null;
    onSave: (tipo: Omit<TipoTicket, 'id'> | TipoTicket) => void;
    onClose: () => void;
    allClients: Cliente[];
}> = ({ tipo, onSave, onClose, allClients }) => {
    const [formData, setFormData] = useState(() => {
        const defaults = { nome: '', idCliente: 'GLOBAL' as 'GLOBAL' | number, ativo: true };
        return { ...defaults, ...(tipo || {}) };
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
         if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({...prev, [name]: value}));
        }
    }
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSave = { ...formData, idCliente: formData.idCliente === 'GLOBAL' ? 'GLOBAL' : Number(formData.idCliente) };
        onSave(dataToSave as Omit<TipoTicket, 'id'> | TipoTicket);
    }
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Nome do Tipo de Ticket" name="nome" value={formData.nome} onChange={handleChange} required/>
            <Select label="Cliente" name="idCliente" value={String(formData.idCliente)} onChange={handleChange}>
                <option value="GLOBAL">Global (Todos os Clientes)</option>
                {allClients.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </Select>
            <div className="flex items-center space-x-2">
                <input type="checkbox" name="ativo" id="tipo-ativo" checked={!!formData.ativo} onChange={handleChange} />
                <label htmlFor="tipo-ativo" className="text-sm text-gray-900">Ativo</label>
            </div>
             <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
                <Button type="submit">Salvar</Button>
            </div>
        </form>
    )
}

const TicketTypesManager = () => {
    const [tipos, setTipos] = useState<TipoTicket[]>([]);
    const [clients, setClients] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTipo, setEditingTipo] = useState<TipoTicket | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [tiposData, clientsData] = await Promise.all([
                api.getAllTiposTicket(),
                api.getAllClientes()
            ]);
            setTipos(tiposData);
            setClients(clientsData.filter(c => c.status === 'ATIVO'));
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpenModal = (tipo: TipoTicket | null = null) => {
        setEditingTipo(tipo);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTipo(null);
    };
    
    const handleSave = async (tipo: Omit<TipoTicket, 'id'> | TipoTicket) => {
        try {
            if ('id' in tipo) {
                await api.updateTipoTicket(tipo);
            } else {
                await api.addTipoTicket(tipo);
            }
            fetchData();
            handleCloseModal();
        } catch (error) {
            alert('Falha ao salvar tipo de ticket');
        }
    }

    const getClientName = (idCliente: number | 'GLOBAL') => {
        if (idCliente === 'GLOBAL') return 'Global';
        return clients.find(c => c.id === idCliente)?.nome || 'Desconhecido';
    };
    
    return (
        <div className="space-y-4">
             <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-700">Gestão de Tipos de Ticket</h2>
                <Button onClick={() => handleOpenModal()}>
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Novo Tipo
                </Button>
            </div>
            <div className="bg-white shadow-sm rounded-lg overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {['ID', 'Nome', 'Cliente', 'Status'].map(h => <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>)}
                            <th className="relative px-6 py-3"><span className="sr-only">Editar</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                         {loading ? (
                            <tr><td colSpan={5} className="text-center p-8">Carregando...</td></tr>
                        ) : tipos.map(tipo => (
                            <tr key={tipo.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tipo.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{tipo.nome}</td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getClientName(tipo.idCliente)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                     <Badge color={tipo.ativo ? 'green' : 'red'}>{tipo.ativo ? 'Ativo' : 'Inativo'}</Badge>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleOpenModal(tipo)} className="text-green-600 hover:text-green-900">Editar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingTipo ? 'Editar Tipo de Ticket' : 'Novo Tipo de Ticket'}>
                <TicketTypeForm tipo={editingTipo} onSave={handleSave} onClose={handleCloseModal} allClients={clients} />
            </Modal>
        </div>
    )
}


// SLA Components
const SLAForm: React.FC<{
    sla: Partial<SLA> | null;
    onSave: (sla: Omit<SLA, 'id'> | SLA) => void;
    onClose: () => void;
    allClients: Cliente[];
    allTipos: TipoTicket[];
}> = ({ sla, onSave, onClose, allClients, allTipos }) => {
    const [formData, setFormData] = useState(() => {
        const defaults = { idCliente: 'GLOBAL', idTipoTicket: 'GLOBAL', prioridade: Prioridade.BAIXA, prazoHoras: 24 };
        return { ...defaults, ...(sla || {}) };
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: name === 'prazoHoras' ? Number(value) : value }));
    }
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSave = { 
            ...formData, 
            idCliente: formData.idCliente === 'GLOBAL' ? 'GLOBAL' : Number(formData.idCliente),
            idTipoTicket: formData.idTipoTicket === 'GLOBAL' ? 'GLOBAL' : Number(formData.idTipoTicket),
        };
        onSave(dataToSave as Omit<SLA, 'id'> | SLA);
    }
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             <Select label="Cliente" name="idCliente" value={String(formData.idCliente)} onChange={handleChange}>
                <option value="GLOBAL">Global (Todos os Clientes)</option>
                {allClients.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </Select>
            <Select label="Tipo de Ticket" name="idTipoTicket" value={String(formData.idTipoTicket)} onChange={handleChange}>
                <option value="GLOBAL">Global (Todos os Tipos)</option>
                {allTipos.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
            </Select>
            <Select label="Prioridade" name="prioridade" value={formData.prioridade} onChange={handleChange}>
                {Object.values(Prioridade).map(p => <option key={p} value={p}>{p}</option>)}
            </Select>
            <Input label="Prazo (horas)" type="number" name="prazoHoras" value={formData.prazoHoras} onChange={handleChange} required min="1"/>
             <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
                <Button type="submit">Salvar</Button>
            </div>
        </form>
    )
}

const SLAManager = () => {
    const [slas, setSlas] = useState<SLA[]>([]);
    const [clients, setClients] = useState<Cliente[]>([]);
    const [tipos, setTipos] = useState<TipoTicket[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSLA, setEditingSLA] = useState<SLA | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [slasData, clientsData, tiposData] = await Promise.all([
                api.getAllSLAs(),
                api.getAllClientes(),
                api.getAllTiposTicket()
            ]);
            setSlas(slasData);
            setClients(clientsData.filter(c => c.status === 'ATIVO'));
            setTipos(tiposData.filter(t => t.ativo));
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);
    
    const handleOpenModal = (sla: SLA | null = null) => {
        setEditingSLA(sla);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingSLA(null);
    };

    const handleSave = async (sla: Omit<SLA, 'id'> | SLA) => {
        try {
            if ('id' in sla) {
                await api.updateSLA(sla);
            } else {
                await api.addSLA(sla);
            }
            fetchData();
            handleCloseModal();
        } catch (error) {
            alert('Falha ao salvar SLA');
        }
    };
    
    const getClientName = (idCliente: number | 'GLOBAL') => (idCliente === 'GLOBAL' ? 'Global' : clients.find(c => c.id === idCliente)?.nome || 'N/A');
    const getTypeName = (idTipoTicket: number | 'GLOBAL') => (idTipoTicket === 'GLOBAL' ? 'Global' : tipos.find(t => t.id === idTipoTicket)?.nome || 'N/A');

    return (
        <div className="space-y-4">
             <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-700">Gestão de SLA Simplificado</h2>
                <Button onClick={() => handleOpenModal()}>
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Nova Regra SLA
                </Button>
            </div>
            <div className="bg-white shadow-sm rounded-lg overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                     <thead className="bg-gray-50">
                        <tr>
                            {['ID', 'Cliente', 'Tipo de Ticket', 'Prioridade', 'Prazo (Horas)'].map(h => <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>)}
                            <th className="relative px-6 py-3"><span className="sr-only">Editar</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loading ? (
                           <tr><td colSpan={6} className="text-center p-8">Carregando...</td></tr>
                        ) : slas.map(sla => (
                            <tr key={sla.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sla.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{getClientName(sla.idCliente)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getTypeName(sla.idTipoTicket)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sla.prioridade}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sla.prazoHoras}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleOpenModal(sla)} className="text-green-600 hover:text-green-900">Editar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingSLA ? 'Editar Regra de SLA' : 'Nova Regra de SLA'}>
                <SLAForm sla={editingSLA} onSave={handleSave} onClose={handleCloseModal} allClients={clients} allTipos={tipos}/>
            </Modal>
        </div>
    );
}


const SettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('clientes');

    const tabs = [
        { id: 'clientes', label: 'Clientes', icon: <OfficeBuildingIcon className="w-5 h-5 mr-2" /> },
        { id: 'tipos', label: 'Tipos de Ticket', icon: <TagIcon className="w-5 h-5 mr-2" /> },
        { id: 'sla', label: 'SLA Simplificado', icon: <ClockIcon className="w-5 h-5 mr-2" /> },
    ];
    
    return (
        <MainLayout title="Cadastros">
            <div className="bg-white p-6 rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Cadastros Básicos</h1>
                
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`${
                                    activeTab === tab.id
                                    ? 'border-green-600 text-green-700'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="py-6">
                    {activeTab === 'clientes' && <ClientsManager />}
                    {activeTab === 'tipos' && <TicketTypesManager />}
                    {activeTab === 'sla' && <SLAManager />}
                </div>

            </div>
        </MainLayout>
    );
};

export default SettingsPage;