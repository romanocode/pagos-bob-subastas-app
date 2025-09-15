// src/components/cliente/MovimientosList.jsx
import React from 'react';
import { formatCurrency, formatDate, getStatusColor } from '../../utils/formatters';
import { ArrowUpCircle, ArrowDownCircle, Clock, CheckCircle, XCircle } from 'lucide-react';

const MovimientosList = ({ transactions = [] }) => {
  const getTransactionIcon = (tipo, estado) => {
    if (estado === 'PENDIENTE') return Clock;
    if (estado === 'RECHAZADO') return XCircle;
    if (estado === 'VALIDADO' || estado === 'PROCESADO') return CheckCircle;
    
    switch (tipo) {
      case 'DEPOSITO':
      case 'GARANTIA':
        return ArrowDownCircle;
      case 'REEMBOLSO':
      case 'PENALIDAD':
        return ArrowUpCircle;
      default:
        return Clock;
    }
  };

  const getTransactionColor = (tipo, estado) => {
    if (estado === 'PENDIENTE') return 'text-yellow-600';
    if (estado === 'RECHAZADO') return 'text-red-600';
    if (estado === 'VALIDADO' || estado === 'PROCESADO') return 'text-green-600';
    
    return 'text-gray-600';
  };

  const getTipoDisplay = (tipo) => {
    const tipos = {
      DEPOSITO: 'Depósito',
      GARANTIA: 'Garantía',
      REEMBOLSO: 'Reembolso',
      PENALIDAD: 'Penalidad',
      PAGO_FINAL: 'Pago Final'
    };
    return tipos[tipo] || tipo;
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Clock className="mx-auto h-12 w-12 mb-4 opacity-50" />
        <p>No hay movimientos para mostrar</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="space-y-4">
        {transactions.map((transaction) => {
          const Icon = getTransactionIcon(transaction.tipo, transaction.estado);
          const iconColor = getTransactionColor(transaction.tipo, transaction.estado);
          
          return (
            <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-4">
                <div className={`${iconColor}`}>
                  <Icon size={24} />
                </div>
                
                <div>
                  <div className="font-medium text-gray-900">
                    {getTipoDisplay(transaction.tipo)}
                  </div>
                  <div className="text-sm text-gray-600">
                    {formatDate(transaction.fecha_creacion)}
                  </div>
                  {transaction.referencia_bancaria && (
                    <div className="text-xs text-gray-500">
                      Ref: {transaction.referencia_bancaria}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <div className={`font-semibold ${
                  transaction.tipo === 'DEPOSITO' || transaction.tipo === 'GARANTIA' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                }`}>
                  {transaction.tipo === 'DEPOSITO' || transaction.tipo === 'GARANTIA' ? '+' : '-'}
                  {formatCurrency(Math.abs(transaction.monto))}
                </div>
                
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(transaction.estado)}`}>
                  {transaction.estado}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MovimientosList;