
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Cliente, Page, PerfilAcesso } from '../types';
import api from '../services/mockApi';
import { Card } from '../components/ui';
import Header from '../components/Header';

const ClientSelectionPage: React.FC = () => {
  const { user, setSelectedClient, setCurrentPage } = useAppContext();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientes = async () => {
      if (user) {
        setLoading(true);
        let userClientes: Cliente[] = [];

        if (user.perfil === PerfilAcesso.ADMIN_GERAL) {
          const allClients = await api.getAllClientes();
          userClientes = allClients.filter(c => c.status === 'ATIVO');
        } else {
          userClientes = await api.getClientesByIds(user.clientesVinculados);
        }
        
        setClientes(userClientes);

        if (userClientes.length === 1) {
          // Auto-select and redirect if only one client
          setSelectedClient(userClientes[0]);
          setCurrentPage(Page.DASHBOARD);
        }
        setLoading(false);
      }
    };
    fetchClientes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSelectClient = (cliente: Cliente) => {
    setSelectedClient(cliente);
    setCurrentPage(Page.DASHBOARD);
  };

  if (loading) {
    return (
        <>
            <Header />
            <div className="flex justify-center items-center h-64">
                <p>Carregando clientes...</p>
            </div>
        </>
    )
  }

  if (clientes.length === 0) {
      return (
            <>
                <Header />
                <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 text-center">
                    <Card>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                          Nenhum cliente disponível
                        </h2>
                        <p className="text-gray-600">
                          Não há clientes ativos vinculados à sua conta no momento.
                          {user?.perfil === PerfilAcesso.ADMIN_GERAL ? " Verifique se existem clientes com status 'ATIVO' no cadastro. " : " Contate o administrador do sistema para obter acesso."}
                        </p>
                    </Card>
                </div>
            </>
      )
  }

  // This view is for users with multiple clients
  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Selecione um cliente para continuar
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clientes.map((cliente) => (
            <button
              key={cliente.id}
              onClick={() => handleSelectClient(cliente)}
              className="text-left"
            >
              <Card className="hover:shadow-md hover:border-green-500 transition-all duration-200 h-full">
                <h3 className="font-bold text-lg text-gray-900">{cliente.nome}</h3>
                <p className={`text-sm ${cliente.status === 'ATIVO' ? 'text-green-600' : 'text-red-600'}`}>
                  {cliente.status}
                </p>
              </Card>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default ClientSelectionPage;
