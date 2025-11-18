
import React, { useState } from 'react';
import { Card, Input, Button } from '../components/ui';
import { useAppContext } from '../context/AppContext';
import api from '../services/mockApi';
import { Page, PerfilAcesso } from '../types';

const LoginPage: React.FC = () => {
  const { setUser, setCurrentPage } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await api.login(email, password);
      setUser(user);

      if (user.perfil === PerfilAcesso.ADMIN_GERAL) {
        // Para administradores, ir direto para a tela de cadastros.
        setCurrentPage(Page.SETTINGS);
      } else {
        // Para outros perfis, ir para a seleção de cliente.
        setCurrentPage(Page.CLIENT_SELECTION);
      }
      
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-[#10734b]">Ative Tickets</h1>
        <p className="text-gray-500 mt-2">
          Sistema de chamados simplificado integrado ao Google Sheets.
        </p>
      </div>
      <Card variant="highlight" className="w-full max-w-md">
        <form onSubmit={handleLogin} className="space-y-6">
          <Input
            id="email"
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="seu@email.com"
          />
          <Input
            id="password"
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="********"
          />
          {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md">{error}</p>}
          <Button type="submit" className="w-full !bg-green-700" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
          <div className="text-center">
            <a href="#" className="text-sm text-gray-600 underline hover:text-gray-800">
              Esqueci minha senha
            </a>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default LoginPage;
