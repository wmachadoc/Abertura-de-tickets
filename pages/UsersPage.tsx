import React, { useState, useEffect, useMemo, useCallback } from 'react';
import MainLayout from '../components/MainLayout';
import { Button, Input, Select, Modal, Badge } from '../components/ui';
import { PlusIcon } from '../components/icons';
import api from '../services/mockApi';
import { User, PerfilAcesso, Cliente } from '../types';
import { useAppContext } from '../context/AppContext';

const UserForm: React.FC<{
    user: Partial<User> | null;
    onSave: (user: Omit<User, 'id'> | User) => void;
    onClose: () => void;
    allClients: Cliente[];
    currentUser: User;
}> = ({ user, onSave, onClose, allClients, currentUser }) => {
    const [formData, setFormData] = useState<Partial<User>>({
        nome: '', email: '', perfil: PerfilAcesso.SOLICITANTE, clientesVinculados: [], ativo: true, ...(user || {})
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleClientChange = (clientId: number) => {
        setFormData(prev => {
            const currentClients = prev.clientesVinculados || [];
            const newClients = currentClients.includes(clientId)
                ? currentClients.filter(id => id !== clientId)
                : [...currentClients, clientId];
            return { ...prev, clientesVinculados: newClients };
        });
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as User);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Nome" name="nome" value={formData.nome} onChange={handleChange} required />
            <Input label="E-mail" name="email" type="email" value={formData.email} onChange={handleChange} required />
            <Select label="Perfil de Acesso" name="perfil" value={formData.perfil} onChange={handleChange} required>
                {Object.values(PerfilAcesso).map(p => (
                    <option key={p} value={p} disabled={p === PerfilAcesso.ADMIN_GERAL && currentUser.perfil !== PerfilAcesso.ADMIN_GERAL}>
                        {p}
                    </option>
                ))}
            </Select>
            
            {formData.perfil !== PerfilAcesso.ADMIN_GERAL && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Clientes Vinculados</label>
                    <div className="grid grid-cols-2 gap-2 p-2 border rounded-md max-h-40 overflow-y-auto">
                        {allClients.map(client => (
                            <label key={client.id} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={formData.clientesVinculados?.includes(client.id)}
                                    onChange={() => handleClientChange(client.id)}
                                />
                                <span className="text-sm text-gray-900">{client.nome}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex items-center space-x-2">
                <input type="checkbox" name="ativo" id="ativo" checked={!!formData.ativo} onChange={handleChange} />
                <label htmlFor="ativo" className="text-sm text-gray-900">Ativo</label>
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
                <Button type="submit">Salvar</Button>
            </div>
        </form>
    );
};


const UsersPage: React.FC = () => {
    const { user: currentUser, selectedClient } = useAppContext();
    const [users, setUsers] = useState<User[]>([]);
    const [allClients, setAllClients] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [profileFilter, setProfileFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    
    const fetchData = useCallback(async () => {
        if (!currentUser) return;
        setLoading(true);
        try {
            const canSeeAllUsers = currentUser.perfil === PerfilAcesso.ADMIN_GERAL;
            const userList = await api.getUsersByCliente(canSeeAllUsers ? undefined : selectedClient?.id);
            setUsers(userList);

            if (canSeeAllUsers) {
                const clientList = await api.getAllClientes();
                setAllClients(clientList.filter(c => c.status === 'ATIVO'));
            } else if (selectedClient) {
                setAllClients([selectedClient]);
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
        setLoading(false);
    }, [currentUser, selectedClient]);


    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleOpenModal = (user: User | null = null) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleSaveUser = async (user: Omit<User, 'id'> | User) => {
        try {
            if ('id' in user) {
                await api.updateUser(user);
            } else {
                await api.addUser(user);
            }
            fetchData();
            handleCloseModal();
        } catch (error) {
            alert('Falha ao salvar usuário.');
        }
    };
    
    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const searchMatch = searchTerm === '' ||
                user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const profileMatch = profileFilter === '' || user.perfil === profileFilter;
            return searchMatch && profileMatch;
        });
    }, [users, searchTerm, profileFilter]);


    return (
        <MainLayout title="Gestão de Usuários">
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                     <h1 className="text-2xl font-bold text-gray-800">Usuários e Níveis de Acesso</h1>
                     <div className="flex items-center gap-2">
                        <Input placeholder="Buscar por nome ou e-mail..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        <Select value={profileFilter} onChange={e => setProfileFilter(e.target.value)}>
                            <option value="">Todos Perfis</option>
                            {Object.values(PerfilAcesso).map(p => <option key={p} value={p}>{p}</option>)}
                        </Select>
                        <Button onClick={() => handleOpenModal()}>
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Novo Usuário
                        </Button>
                     </div>
                </div>

                <div className="bg-white shadow-sm rounded-lg overflow-x-auto">
                    <table className="w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                             <tr>
                                {['Nome', 'Email', 'Perfil', 'Clientes Vinculados', 'Status'].map(h => (
                                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                                ))}
                                <th className="relative px-6 py-3"><span className="sr-only">Editar</span></th>
                            </tr>
                        </thead>
                         <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan={6} className="text-center p-8">Carregando...</td></tr>
                            ) : filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.nome}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.perfil}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.clientesVinculados.join(', ')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <Badge color={user.ativo ? 'green' : 'red'}>{user.ativo ? 'Ativo' : 'Inativo'}</Badge>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => handleOpenModal(user)} className="text-green-600 hover:text-green-900">Editar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingUser ? 'Editar Usuário' : 'Novo Usuário'}>
                {currentUser && <UserForm 
                    user={editingUser} 
                    onSave={handleSaveUser} 
                    onClose={handleCloseModal}
                    allClients={allClients}
                    currentUser={currentUser}
                />}
            </Modal>
        </MainLayout>
    );
};

export default UsersPage;