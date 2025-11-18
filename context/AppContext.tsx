import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, Cliente, Page } from '../types';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  selectedClient: Cliente | null;
  setSelectedClient: (client: Cliente | null) => void;
  ticketId: string | null;
  setTicketId: (id: string | null) => void;
  sheetId: string | null;
  setSheetId: (id: string | null) => void;
  scriptUrl: string | null;
  setScriptUrl: (url: string | null) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>(Page.LOGIN);
  const [selectedClient, setSelectedClient] = useState<Cliente | null>(null);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [sheetId, setSheetId] = useState<string | null>(() => localStorage.getItem('sheetId') || '1V66h-VN4SLY6A9SnJCZfd8OD_Fdkzj6HMBOicLckO0M');
  const [scriptUrl, setScriptUrl] = useState<string | null>(() => localStorage.getItem('scriptUrl') || 'https://script.google.com/macros/s/AKfycbzSxsceCALBea_OTvcAbeA0GxMeBU1nJbDgNxropA0h8kkCNfqyrtLr--9xXFgZ8E2qUA/exec');


  useEffect(() => {
    if (sheetId) {
      localStorage.setItem('sheetId', sheetId);
    } else {
      localStorage.removeItem('sheetId');
    }
  }, [sheetId]);

  useEffect(() => {
    if (scriptUrl) {
      localStorage.setItem('scriptUrl', scriptUrl);
    } else {
      localStorage.removeItem('scriptUrl');
    }
  }, [scriptUrl]);

  const logout = () => {
    setUser(null);
    setSelectedClient(null);
    setCurrentPage(Page.LOGIN);
    setTicketId(null);
  };
  
  const value = { 
    user, 
    setUser, 
    currentPage, 
    setCurrentPage, 
    selectedClient, 
    setSelectedClient,
    ticketId,
    setTicketId,
    sheetId,
    setSheetId,
    scriptUrl,
    setScriptUrl,
    logout 
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};