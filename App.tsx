import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import ClientSelectionPage from './pages/ClientSelectionPage';
import DashboardPage from './pages/DashboardPage';
import TicketsListPage from './pages/TicketsListPage';
import TicketDetailPage from './pages/TicketDetailPage';
import NewTicketPage from './pages/NewTicketPage';
import UsersPage from './pages/UsersPage';
import SettingsPage from './pages/SettingsPage';
import ReportsPage from './pages/ReportsPage';
import TicketSettingsPage from './pages/TicketSettingsPage';
import GoogleSheetsSettingsPage from './pages/GoogleSheetsSettingsPage';
import { Page } from './types';

const AppContent: React.FC = () => {
  const { user, currentPage, ticketId } = useAppContext();

  if (!user) {
    return <LoginPage />;
  }

  switch (currentPage) {
    case Page.CLIENT_SELECTION:
      return <ClientSelectionPage />;
    case Page.DASHBOARD:
      return <DashboardPage />;
    case Page.TICKETS_LIST:
      return <TicketsListPage />;
    case Page.TICKET_DETAIL:
      return ticketId ? <TicketDetailPage ticketId={ticketId} /> : <TicketsListPage />;
    case Page.NEW_TICKET:
      return <NewTicketPage />;
    case Page.SETTINGS:
      return <SettingsPage />;
    case Page.TICKET_SETTINGS:
      return <TicketSettingsPage />;
    case Page.REPORTS:
      return <ReportsPage />;
    case Page.GOOGLE_SHEETS_SETTINGS:
      return <GoogleSheetsSettingsPage />;
    default:
      return <ClientSelectionPage />;
  }
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <div className="bg-gray-50 min-h-screen font-sans">
        <AppContent />
      </div>
    </AppProvider>
  );
};

export default App;