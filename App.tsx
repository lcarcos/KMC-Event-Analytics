import React, { useState, useMemo, useRef } from 'react';
import { CSV_DATA } from './constants';
import { parseCSVData, calculateMetrics } from './utils';
import { Dashboard } from './components/Dashboard';
import { OrderTable } from './components/OrderTable';
import { LayoutDashboard, Table as TableIcon, Download, Filter, Upload, RefreshCcw, Check } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'table'>('dashboard');
  const [customCSV, setCustomCSV] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  // Parse data
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
    <div className="min-h-screen bg-gray-50/50 flex transition-all">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".csv"
        className="hidden"
      />

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">EventAlytics</h1>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden text-gray-500 hover:bg-gray-100 p-1 rounded-md"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button
            onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === 'dashboard'
              ? 'bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
          >
            <LayoutDashboard size={20} />
            Dashboard General
          </button>
          <button
            onClick={() => { setActiveTab('table'); setIsMobileMenuOpen(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === 'table'
              ? 'bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
          >
            <TableIcon size={20} />
            Datos Detallados
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className={`rounded-xl p-4 border transition-colors ${customCSV ? 'bg-emerald-50 border-emerald-100' : 'bg-blue-50 border-blue-100'}`}>
            <h4 className={`text-sm font-semibold mb-1 flex items-center gap-2 ${customCSV ? 'text-emerald-800' : 'text-blue-800'}`}>
              {customCSV ? <Check size={14} /> : <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
              {customCSV ? 'Modo Personalizado' : 'Modo Demo'}
            </h4>
            <p className={`text-xs mb-2 leading-relaxed ${customCSV ? 'text-emerald-600' : 'text-blue-600'}`}>
              {customCSV
                ? 'Visualizando tus datos cargados.'
                : 'Explora con datos de prueba.'}
            </p>
            {customCSV && (
              <button
                onClick={handleResetData}
                className="w-full py-1.5 bg-white rounded-lg border border-emerald-200 text-xs font-medium text-emerald-700 hover:bg-emerald-50 flex items-center justify-center gap-2 transition-colors"
              >
                <RefreshCcw size={12} /> Restaurar Default
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 lg:p-10 md:ml-64 transition-all w-full overflow-hidden">
        {/* Header Mobile */}
        <div className="md:hidden flex items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-lg font-bold text-gray-900">EventAlytics</h1>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
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