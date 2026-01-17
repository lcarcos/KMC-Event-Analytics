import React, { useMemo } from 'react';
import { ProcessedOrder, DashboardMetrics } from '../types';
import { formatCurrency } from '../utils';
import { StatCard } from './StatCard';
import { 
  Euro, 
  ShoppingCart, 
  Users, 
  Languages, 
  CreditCard,
  MapPin,
  CalendarDays
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

interface DashboardProps {
  orders: ProcessedOrder[];
  metrics: DashboardMetrics;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const Dashboard: React.FC<DashboardProps> = ({ orders, metrics }) => {
  
  // Prepare Chart Data
  const cityData = useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach(order => {
      counts[order.city] = (counts[order.city] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Top 5 Cities
  }, [orders]);

  const paymentData = useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach(order => {
      // Simplify names
      let method = order.paymentMethod;
      if(method.includes("Tarjeta")) method = "Tarjeta";
      if(method.includes("Apple")) method = "Apple Pay";
      if(method.includes("Google")) method = "Google Pay";
      if(method === "Link" || method === "Enlace") method = "Enlace de Pago";
      
      counts[method] = (counts[method] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [orders]);

  const dateData = useMemo(() => {
    // Group by Day
    const grouped: Record<string, number> = {};
    orders.forEach(order => {
      const dateStr = order.date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
      grouped[dateStr] = (grouped[dateStr] || 0) + 1;
    });
    // Sort logic needs real dates, but for this string format DD/MM it roughly works for same year
    return Object.entries(grouped).map(([name, pedidos]) => ({ name, pedidos })).reverse();
  }, [orders]);

  const translationData = useMemo(() => {
    return [
      { name: 'Requiere Traducción', value: metrics.translationRequests },
      { name: 'No Requiere', value: metrics.totalOrders - metrics.translationRequests },
    ];
  }, [metrics]);

  return (
    <div className="space-y-6">
      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Ingresos Totales" 
          value={formatCurrency(metrics.totalRevenue)} 
          icon={Euro} 
          color="green"
        />
        <StatCard 
          title="Total Pedidos" 
          value={metrics.totalOrders} 
          icon={ShoppingCart} 
          color="blue"
        />
        <StatCard 
          title="Ticket Medio" 
          value={formatCurrency(metrics.averageOrderValue)} 
          icon={CreditCard} 
          color="purple"
        />
        <StatCard 
          title="Necesitan Traducción" 
          value={metrics.translationRequests} 
          subValue={`${((metrics.translationRequests / metrics.totalOrders) * 100).toFixed(1)}% del total`}
          icon={Languages} 
          color="orange"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-blue-500" />
              Evolución de Pedidos
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dateData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickMargin={10} />
                <YAxis allowDecimals={false} fontSize={12} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="pedidos" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-purple-500" />
              Métodos de Pago
            </h3>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="middle" align="right" layout="vertical" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-500" />
              Top Ciudades
            </h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cityData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} fontSize={12} />
                <Tooltip cursor={{ fill: '#f3f4f6' }} />
                <Bar dataKey="value" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-orange-500" />
              Logística Idiomas
            </h3>
          </div>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={translationData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  <Cell fill="#f97316" />
                  <Cell fill="#e5e7eb" />
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};