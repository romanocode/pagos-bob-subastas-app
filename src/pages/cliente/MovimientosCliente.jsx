import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { walletService } from "../../services/walletService";
import { formatCurrency, formatDate, getStatusColor } from "../../utils/formatters";
import { ArrowUpCircle, ArrowDownCircle, Clock, CheckCircle, XCircle, Wallet } from "lucide-react";

export default function MovimientosCliente() {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({ estado: '', fecha_desde: '', fecha_hasta: '' });

  useEffect(() => {
    cargarMovimientos();
  }, [currentUser, filters]);

  const cargarMovimientos = async () => {
    setIsLoading(true);
    try {
      const response = await walletService.getTransactionsByUserId(currentUser.id, filters);
      setTransactions(response.data);
    } catch (error) {
      console.error('Error al cargar movimientos:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const renderEstadoMovimiento = (estado) => {
    let displayText = '';
    let badgeClass = '';

    switch (estado) {
      case 'PENDIENTE':
        displayText = 'Pendiente';
        badgeClass = 'bg-yellow-100 text-yellow-800';
        break;
      case 'VALIDADO':
        displayText = 'Validado';
        badgeClass = 'bg-green-100 text-green-800';
        break;
      case 'RECHAZADO':
        displayText = 'Rechazado';
        badgeClass = 'bg-red-100 text-red-800';
        break;
      case 'PROCESADO':
        displayText = 'Procesado';
        badgeClass = 'bg-blue-100 text-blue-800';
        break;
      default:
        displayText = estado;
        badgeClass = 'bg-gray-100 text-gray-800';
    }

    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badgeClass}`}>
        {displayText}
      </span>
    );
  };

  if (isLoading) {
    return <div className="p-6 text-center">Cargando movimientos...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Mis Garantias
        </h1>
      </div>

      {/* SALDO del Cliente */}
      <div className="bg-blue-600 rounded-lg p-6 mb-6 shadow-lg">
        <div className="flex items-center">
          <div className="flex items-center">
            <Wallet className="h-6 w-6 text-white mr-3" />
            <div>
              <h2 className="text-white font-bold text-lg">Saldo del Cliente</h2>
              <p className="text-blue-100 text-sm">Saldo Total</p>
              <p className="text-white text-3xl font-bold">
                {formatCurrency(currentUser.saldoTotalDolar || currentUser.saldo || 0, 'USD')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Filtros</h2>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select 
              value={filters.estado} 
              onChange={e => setFilters(f => ({ ...f, estado: e.target.value }))} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
            >
              <option value="">Todos</option>
              <option value="PENDIENTE">Pendiente</option>
              <option value="VALIDADO">Validado</option>
              <option value="RECHAZADO">Rechazado</option>
              <option value="PROCESADO">Procesado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
            <input 
              type="date" 
              value={filters.fecha_desde} 
              onChange={e => setFilters(f => ({ ...f, fecha_desde: e.target.value }))} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
            <input 
              type="date" 
              value={filters.fecha_hasta} 
              onChange={e => setFilters(f => ({ ...f, fecha_hasta: e.target.value }))} 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
            />
          </div>
        </form>
      </div>

      {/* Tabla de movimientos */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referencia</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No hay movimientos para mostrar
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => {
                  const Icon = getTransactionIcon(transaction.tipo, transaction.estado);
                  return (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`mr-3 ${
                            transaction.estado === 'PENDIENTE' ? 'text-yellow-600' :
                            transaction.estado === 'RECHAZADO' ? 'text-red-600' :
                            transaction.estado === 'VALIDADO' || transaction.estado === 'PROCESADO' ? 'text-green-600' :
                            'text-gray-600'
                          }`}>
                            <Icon size={20} />
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {getTipoDisplay(transaction.tipo)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={
                          transaction.tipo === 'DEPOSITO' || transaction.tipo === 'GARANTIA' 
                            ? 'text-green-600' 
                            : 'text-red-600'
                        }>
                          {transaction.tipo === 'DEPOSITO' || transaction.tipo === 'GARANTIA' ? '+' : '-'}
                          {formatCurrency(Math.abs(transaction.monto))}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {transaction.referencia_bancaria || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {transaction.descripcion || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderEstadoMovimiento(transaction.estado)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(transaction.fecha_creacion)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}