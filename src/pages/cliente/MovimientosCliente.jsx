import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { walletService } from "../../services/walletService";
import MovimientosList from "../../components/cliente/MovimientosList";

export default function MovimientosCliente() {
  const { currentUser } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({ estado: '', fecha_desde: '', fecha_hasta: '' });

  useEffect(() => {
    walletService.getTransactionsByUserId(currentUser.id, filters).then(res => setTransactions(res.data));
  }, [currentUser, filters]);

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-bob-primary mb-6">Movimientos</h2>
      <form className="mb-6 flex gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select value={filters.estado} onChange={e => setFilters(f => ({ ...f, estado: e.target.value }))} className="border border-gray-300 rounded px-3 py-2">
            <option value="">Todos</option>
            <option value="PENDIENTE">Pendiente</option>
            <option value="VALIDADO">Validado</option>
            <option value="RECHAZADO">Rechazado</option>
            <option value="PROCESADO">Procesado</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
          <input type="date" value={filters.fecha_desde} onChange={e => setFilters(f => ({ ...f, fecha_desde: e.target.value }))} className="border border-gray-300 rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
          <input type="date" value={filters.fecha_hasta} onChange={e => setFilters(f => ({ ...f, fecha_hasta: e.target.value }))} className="border border-gray-300 rounded px-3 py-2" />
        </div>
      </form>
      <MovimientosList transactions={transactions} />
    </div>
  );
}