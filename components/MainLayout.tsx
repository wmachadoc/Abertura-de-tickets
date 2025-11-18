import React, { ReactNode, useState } from 'react';
import Header from './Header';
import { useAppContext } from '../context/AppContext';
import { Page, PerfilAcesso } from '../types';
import { 
    DashboardIcon, 
    TicketIcon, 
    UsersIcon, 
    SettingsIcon, 
    ReportsIcon, 
    ChevronUpIcon, 
    ChevronDownIcon,
    TagIcon,
    GoogleSheetsIcon,
} from './icons';

interface MainLayoutProps {
  children: ReactNode;
  title: string;
}

const NavItem: React.FC<{ icon: React.ReactNode; label: string; page: Page; activePage: Page; onClick: (page: Page) => void; isSubItem?: boolean }> = ({ icon, label, page, activePage, onClick, isSubItem = false }) => {
  const isActive = page === activePage;
  return (
    <button
      onClick={() => onClick(page)}
      className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors duration-150 ${isSubItem ? 'pl-11' : ''} ${
        isActive
          ? 'bg-gray-700 text-white'
          : 'text-gray-300 hover:bg-gray-600 hover:text-white'
      }`}
    >
      <div className="mr-3">{icon}</div>
      {label}
    </button>
  );
};


const MainLayout: React.FC<MainLayoutProps> = ({ children, title }) => {
  const { user, currentPage, setCurrentPage } = useAppContext();
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(true);

  const mainNavItems = [
    { icon: <DashboardIcon className="w-5 h-5"/>, label: 'Dashboard', page: Page.DASHBOARD, profiles: [PerfilAcesso.ADMIN_GERAL, PerfilAcesso.ADMIN_CLIENTE, PerfilAcesso.AGENTE] },
    { icon: <TicketIcon className="w-5 h-5"/>, label: 'Tickets', page: Page.TICKETS_LIST, profiles: [PerfilAcesso.ADMIN_GERAL, PerfilAcesso.ADMIN_CLIENTE, PerfilAcesso.AGENTE, PerfilAcesso.SOLICITANTE] },
    { icon: <ReportsIcon className="w-5 h-5"/>, label: 'Relatórios', page: Page.REPORTS, profiles: [PerfilAcesso.ADMIN_GERAL, PerfilAcesso.ADMIN_CLIENTE] },
  ];
  
  const adminNavItems = [
    { icon: <SettingsIcon className="w-5 h-5"/>, label: 'Cadastros Clientes', page: Page.SETTINGS },
    { icon: <TagIcon className="w-5 h-5"/>, label: 'Cadastro de Tickets', page: Page.TICKET_SETTINGS },
    { icon: <GoogleSheetsIcon className="w-5 h-5"/>, label: 'Google Sheets', page: Page.GOOGLE_SHEETS_SETTINGS },
  ];
  
  const hasAdminAccess = user && [PerfilAcesso.ADMIN_GERAL, PerfilAcesso.ADMIN_CLIENTE].includes(user.perfil);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={title} />
      <div className="flex h-[calc(100vh-64px)]"> {/* Full height minus header */}
        <aside className="w-64 bg-[#2d3748] p-4 flex-shrink-0 hidden lg:flex lg:flex-col text-white">
          <nav className="space-y-1 flex-1">
            {mainNavItems.filter(item => user && item.profiles.includes(user.perfil)).map(item => (
                <NavItem 
                    key={item.page}
                    icon={item.icon}
                    label={item.label}
                    page={item.page}
                    activePage={currentPage}
                    onClick={setCurrentPage}
                />
            ))}
            
            {hasAdminAccess && (
              <div className="pt-2">
                <button
                  onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  <div className="flex items-center">
                    <SettingsIcon className="w-5 h-5 mr-3"/>
                    <span>Administração</span>
                  </div>
                  {isAdminMenuOpen ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
                </button>
                {isAdminMenuOpen && (
                  <div className="mt-1 space-y-1">
                    {adminNavItems.map(item => (
                       <NavItem 
                          key={item.label}
                          icon={item.icon}
                          label={item.label}
                          page={item.page}
                          activePage={currentPage}
                          onClick={setCurrentPage}
                          isSubItem={true}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </nav>
        </aside>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;