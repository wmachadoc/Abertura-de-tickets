import React, { useState } from 'react';
import MainLayout from '../components/MainLayout';
import { Button, Input, Card } from '../components/ui';
import { useAppContext } from '../context/AppContext';

const GoogleSheetsSettingsPage: React.FC = () => {
    const { sheetId, setSheetId, scriptUrl, setScriptUrl } = useAppContext();
    const [currentSheetId, setCurrentSheetId] = useState(sheetId || '');
    const [currentScriptUrl, setCurrentScriptUrl] = useState(scriptUrl || '');
    const [message, setMessage] = useState('');

    const handleSave = () => {
        setSheetId(currentSheetId);
        setScriptUrl(currentScriptUrl);
        setMessage('Configurações salvas com sucesso! A página será recarregada para aplicar as alterações.');
        setTimeout(() => {
             window.location.reload();
        }, 2000);
    };

    const handleClear = () => {
        setSheetId(null);
        setScriptUrl(null);
        setCurrentSheetId('');
        setCurrentScriptUrl('');
        setMessage('Configuração removida. A aplicação voltará a usar os dados de simulação. A página será recarregada.');
         setTimeout(() => {
             window.location.reload();
        }, 2000);
    }

    return (
        <MainLayout title="Configurações do Google Sheets">
            <div className="max-w-2xl mx-auto">
                <Card>
                    <div className="space-y-6">
                         <h1 className="text-2xl font-bold text-gray-800">Conexão com Google Sheets</h1>
                         <p className="text-sm text-gray-600">
                           Para usar uma planilha do Google Sheets como banco de dados, preencha os campos abaixo.
                           Isso permitirá que os dados sejam lidos e gravados diretamente na sua planilha.
                         </p>
                        
                        <div>
                            <Input
                                label="Google Sheet ID"
                                placeholder="Ex: 1ABCdeFGHIJKLmnoPQRSTuvwXYZ1234567890"
                                value={currentSheetId}
                                onChange={(e) => setCurrentSheetId(e.target.value)}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                O ID está na URL da sua planilha, entre "/d/" e "/edit".
                            </p>
                        </div>
                        
                        <div>
                            <Input
                                label="URL do App da Web (Google Apps Script)"
                                placeholder="https://script.google.com/macros/s/..."
                                value={currentScriptUrl}
                                onChange={(e) => setCurrentScriptUrl(e.target.value)}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Esta URL é gerada ao implantar o Apps Script e é necessária para a leitura e escrita de dados.
                            </p>
                        </div>
                        
                         {message && <p className="text-sm text-green-700 bg-green-100 p-3 rounded-md">{message}</p>}

                        <div className="flex justify-end gap-4 pt-4">
                            <Button variant="danger" onClick={handleClear} disabled={!sheetId && !scriptUrl}>
                                Usar Dados Mock
                            </Button>
                            <Button onClick={handleSave} disabled={!currentSheetId || !currentScriptUrl}>
                                Salvar e Recarregar
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </MainLayout>
    );
};

export default GoogleSheetsSettingsPage;