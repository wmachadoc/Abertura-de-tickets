
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { LogoutIcon } from './icons';
import { Page, PerfilAcesso } from '../types';

interface HeaderProps {
    title?: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { user, selectedClient, logout, setCurrentPage, setSelectedClient } = useAppContext();
  
  const handleChangeClient = () => {
      setSelectedClient(null);
      setCurrentPage(Page.CLIENT_SELECTION);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-[#10734b]">Ative Tickets</h1>
            {selectedClient ? (
                <div className="hidden md:flex items-center space-x-2">
                    <span className="text-gray-500">| Cliente: {selectedClient.nome}</span>
                    <button onClick={handleChangeClient} className="text-xs text-green-600 hover:text-green-800 font-semibold">(Trocar)</button>
                </div>
            ) : (
                user && user.perfil !== PerfilAcesso.SOLICITANTE && (
                    <div className="hidden md:flex items-center">
                        <button onClick={handleChangeClient} className="text-sm text-green-700 hover:text-green-900 font-semibold ml-2 px-3 py-1 border border-green-600 rounded-md bg-green-50 hover:bg-green-100 transition-colors">
                            Selecionar Cliente
                        </button>
                    </div>
                )
            )}
            {title && <span className="text-gray-500 hidden md:block">| {title}</span>}
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">{user?.nome}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              aria-label="Sair"
            >
              <LogoutIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
