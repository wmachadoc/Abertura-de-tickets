
import React from 'react';
import MainLayout from '../components/MainLayout';

const ReportsPage: React.FC = () => {
    return (
        <MainLayout title="Relatórios">
            <div className="bg-white p-8 rounded-lg shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800">Relatórios e Exportação</h1>
                <p className="mt-4 text-gray-600">
                    Esta funcionalidade está em desenvolvimento. Esta tela permitirá a visualização de estatísticas avançadas e a exportação de dados.
                </p>
                <div className="mt-6 p-4 border-l-4 border-yellow-400 bg-yellow-50">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M8.257 3.099c.636-1.21 2.272-1.21 2.908 0l6.847 13.049c.636 1.21-.23 2.852-1.454 2.852H2.864c-1.224 0-2.09-1.642-1.454-2.852L8.257 3.099zM10 12a1 1 0 110-2 1 1 0 010 2zm-1-4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                                Em breve: Filtros por período e cliente, métricas de SLA, gráficos de desempenho e um botão para exportar os dados para CSV/Excel.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default ReportsPage;
