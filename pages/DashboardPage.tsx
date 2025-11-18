
import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import MainLayout from '../components/MainLayout';
import { Card, Select } from '../components/ui';
import api from '../services/mockApi';
import { Ticket, TicketStatus, Prioridade } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface SummaryCardProps {
    title: string;
    value: number | string;
    onClick?: () => void;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ title, value, onClick }) => (
    <Card className={onClick ? 'cursor-pointer hover:bg-gray-50' : ''} onClick={onClick}>
        <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
        <p className="mt-1 text-3xl font-semibold text-[#10734b]">{value}</p>
    </Card>
);

const DashboardPage: React.FC = () => {
    const { selectedClient } = useAppContext();
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (selectedClient) {
            setLoading(true);
            api.getTicketsByCliente(selectedClient.id).then(data => {
                setTickets(data);
                setLoading(false);
            });
        }
    }, [selectedClient]);

    const summaryData = useMemo(() => {
        const abertos = tickets.filter(t => [TicketStatus.NOVO, TicketStatus.EM_ATENDIMENTO, TicketStatus.AGUARDANDO_CLIENTE].includes(t.status)).length;
        const atrasados = tickets.filter(t => new Date(t.dataLimite) < new Date() && t.status !== TicketStatus.FECHADO && t.status !== TicketStatus.RESOLVIDO).length;
        const resolvidos = tickets.filter(t => t.status === TicketStatus.RESOLVIDO).length;
        const fechados = tickets.filter(t => t.status === TicketStatus.FECHADO).length;
        return { abertos, atrasados, resolvidos, fechados };
    }, [tickets]);

    const chartData = useMemo(() => {
        const data = tickets.reduce((acc, ticket) => {
            const status = ticket.status;
            if (!acc[status]) {
                acc[status] = { name: status, tickets: 0 };
            }
            acc[status].tickets += 1;
            return acc;
        }, {} as Record<string, {name: string, tickets: number}>);
        return Object.values(data);
    }, [tickets]);

    if (loading) {
        return <MainLayout title="Dashboard"><p>Carregando dashboard...</p></MainLayout>;
    }
    
    return (
        <MainLayout title="Dashboard">
            <div className="space-y-6">
                {/* Filters could be added here */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <SummaryCard title="Tickets Abertos" value={summaryData.abertos} />
                    <SummaryCard title="Tickets Atrasados" value={summaryData.atrasados} />
                    <SummaryCard title="Tickets Resolvidos" value={summaryData.resolvidos} />
                    <SummaryCard title="Tickets Fechados" value={summaryData.fechados} />
                </div>

                <Card>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Tickets por Status</h3>
                     <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="tickets" fill="#10734b" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </MainLayout>
    );
};

export default DashboardPage;
