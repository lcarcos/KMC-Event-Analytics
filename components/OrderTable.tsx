import React from 'react';
import { ProcessedOrder } from '../types';
import { formatCurrency } from '../utils';
import { Check, X, MessageCircle, Mail } from 'lucide-react';

interface OrderTableProps {
  orders: ProcessedOrder[];
}

export const OrderTable: React.FC<OrderTableProps> = ({ orders }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800">Detalle de Pedidos</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium">
            <tr>
              <th className="px-6 py-3">ID Pedido</th>
              <th className="px-6 py-3">Fecha</th>
              <th className="px-6 py-3">Cliente</th>
              <th className="px-6 py-3">Ciudad</th>
              <th className="px-6 py-3 text-center">Traducción</th>
              <th className="px-6 py-3">Consentimiento</th>
              <th className="px-6 py-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-mono text-gray-500">#{order.id}</td>
                <td className="px-6 py-4 text-gray-600">
                  {order.date.toLocaleDateString('es-ES')}
                  <div className="text-xs text-gray-400">{order.date.toLocaleTimeString('es-ES', {hour: '2-digit', minute:'2-digit'})}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{order.customerName}</div>
                  <div className="text-xs text-gray-400">{order.email}</div>
                </td>
                <td className="px-6 py-4 text-gray-600">{order.city}</td>
                <td className="px-6 py-4 text-center">
                  {order.needsTranslation ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      Sí
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  <div className="flex items-center gap-1">
                    {order.marketingConsent.includes("WhatsApp") && <MessageCircle size={14} className="text-green-500" />}
                    {order.marketingConsent.includes("Email") && <Mail size={14} className="text-blue-500" />}
                    <span className="text-xs ml-1">{order.marketingConsent}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-medium text-gray-900">
                  {formatCurrency(order.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};