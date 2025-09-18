import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { walletService } from "../../services/walletService";
import { toast } from "react-toastify";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { Wallet, Plus } from "lucide-react";

export default function ReembolsosCliente() {
  const { currentUser } = useAuth();
  const [garantias, setGarantias] = useState([]);
  const [reembolsos, setReembolsos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedGarantia, setSelectedGarantia] = useState('');
  const [motivo, setMotivo] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [filters, setFilters] = useState({ estado: '', fecha_desde: '', fecha_hasta: '' });

  useEffect(() => {
    cargarDatos();
  }, [currentUser, filters]);

  const cargarDatos = async () => {
    setIsLoading(true);
    try {
      // Cargar garantías validadas
      const garantiasResponse = await walletService.getTransactionsByUserId(currentUser.id, { tipo: 'GARANTIA', estado: 'VALIDADO' });
      setGarantias(garantiasResponse.data);

      // Cargar reembolsos del usuario
      const reembolsosResponse = await walletService.getTransactionsByUserId(currentUser.id, { tipo: 'REEMBOLSO' });
      setReembolsos(reembolsosResponse.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.error('Error al cargar datos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    try {
      await walletService.createTransaction({
        usuario_id: currentUser.id,
        tipo: 'REEMBOLSO',
        monto: garantias.find(g => g.id === selectedGarantia)?.monto || 0,
        estado: 'PENDIENTE',
        referencia_bancaria: garantias.find(g => g.id === selectedGarantia)?.referencia_bancaria,
        motivo
      });
      toast.success("Solicitud de reembolso enviada al admin");
      setShowModal(false);
      setSelectedGarantia('');
      setMotivo('');
      cargarDatos();
    } catch (error) {
      console.error('Error al crear reembolso:', error);
      toast.error('Error al crear reembolso');
    } finally {
      setEnviando(false);
    }
  };

  const renderEstadoReembolso = (estado) => {
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
    return <div className="p-6 text-center">Cargando datos...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Mis Reembolsos
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-bob-primary hover:bg-bob-primary-dark text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Plus size={18} />
          Nueva Solicitud
        </button>
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

      {/* Tabla de reembolsos */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referencia</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motivo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reembolsos.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No hay reembolsos para mostrar
                  </td>
                </tr>
              ) : (
                reembolsos.map((reembolso) => (
                  <tr key={reembolso.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reembolso.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                      -{formatCurrency(reembolso.monto)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reembolso.referencia_bancaria || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {reembolso.motivo || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderEstadoReembolso(reembolso.estado)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(reembolso.fecha_creacion)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para crear nueva solicitud de reembolso */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-xl font-bold mb-6">Nueva Solicitud de Reembolso</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Selecciona Garantía *
                  </label>
                  <select 
                    required 
                    value={selectedGarantia} 
                    onChange={e => setSelectedGarantia(e.target.value)} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
                  >
                    <option value="">-- Selecciona --</option>
                    {garantias.map(g => (
                      <option key={g.id} value={g.id}>
                        {g.referencia_bancaria} - Monto: {formatCurrency(g.monto)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Motivo *
                  </label>
                  <textarea 
                    required 
                    value={motivo} 
                    onChange={e => setMotivo(e.target.value)} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
                    placeholder="Motivo de la solicitud"
                    rows="3"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bob-primary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={enviando}
                  className="px-4 py-2 bg-bob-primary border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-bob-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bob-primary disabled:opacity-50"
                >
                  {enviando ? "Enviando..." : "Solicitar Reembolso"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}