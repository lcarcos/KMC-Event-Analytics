import React, { useState, useMemo, useRef } from 'react';
import { CSV_DATA } from './constants';
import { parseCSVData, calculateMetrics } from './utils';
import { Dashboard } from './components/Dashboard';
import { OrderTable } from './components/OrderTable';
import { LayoutDashboard, Table as TableIcon, Download, Filter, Upload, RefreshCcw } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'table'>('dashboard');
  const [customCSV, setCustomCSV] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Handler for file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === 'string') {
        setCustomCSV(text);
        // Reset file input so same file can be selected again if needed
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleResetData = () => {
    setCustomCSV(null);
  };
  
  // Parse data: prioritize custom upload, fallback to static constant
  const processedData = useMemo(() => {
    try {
      return parseCSVData(customCSV || CSV_DATA);
    } catch (error) {
      console.error("Error parsing CSV", error);
      return [];
    }
  }, [customCSV]);

  const metrics = useMemo(() => calculateMetrics(processedData), [processedData]);

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept=".csv" 
        className="hidden" 
      />

      {/* Sidebar Navigation */}
      <aside className="fixed top-0 left-0 w-64 h-full bg-white border-r border-gray-200 hidden md:flex flex-col z-10">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
               <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
               </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">EventAlytics</h1>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'dashboard' 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <LayoutDashboard size={20} />
            Dashboard General
          </button>
          <button
             onClick={() => setActiveTab('table')}
             className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              activeTab === 'table' 
                ? 'bg-indigo-50 text-indigo-700' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <TableIcon size={20} />
            Datos Detallados
          </button>
        </nav>
        
        <div className="p-4 border-t border-gray-100">
           <div className={`rounded-lg p-4 ${customCSV ? 'bg-emerald-50' : 'bg-blue-50'}`}>
              <h4 className={`text-sm font-semibold mb-1 ${customCSV ? 'text-emerald-800' : 'text-blue-800'}`}>
                {customCSV ? 'Datos Personalizados' : 'Datos de Ejemplo'}
              </h4>
              <p className={`text-xs ${customCSV ? 'text-emerald-600' : 'text-blue-600'}`}>
                {customCSV 
                  ? 'Visualizando archivo subido por el usuario.' 
                  : 'Datos extraídos del CSV de demostración.'}
              </p>
              {customCSV && (
                <button 
                  onClick={handleResetData}
                  className="mt-2 text-xs font-medium text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                >
                  <RefreshCcw size={12} /> Restaurar ejemplo
                </button>
              )}
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 p-6 lg:p-10">
        {/* Header Mobile */}
        <div className="md:hidden flex items-center justify-between mb-6">
           <h1 className="text-xl font-bold text-gray-900">EventAlytics</h1>
        </div>

        {/* Top Header */}
        <header className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {activeTab === 'dashboard' ? 'Visión General' : 'Listado de Pedidos'}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Análisis de ventas, logística y comportamiento de clientes.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
             <button 
                onClick={handleTriggerUpload}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-indigo-300 transition-all shadow-sm group"
             >
                <Upload size={16} className="text-gray-400 group-hover:text-indigo-600 transition-colors" />
                Subir CSV
             </button>
             
             <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm">
                <Filter size={16} />
                Filtrar
             </button>
             <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-colors">
                <Download size={16} />
                Exportar Informe
             </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="animate-fade-in">
          {processedData.length > 0 ? (
            activeTab === 'dashboard' ? (
              <Dashboard orders={processedData} metrics={metrics} />
            ) : (
              <OrderTable orders={processedData} />
            )
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
              <Upload size={48} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No hay datos para mostrar</h3>
              <p className="text-gray-500 mb-6">El archivo CSV parece estar vacío o tiene un formato incorrecto.</p>
              <button 
                onClick={handleResetData}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200"
              >
                Restaurar datos de ejemplo
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;