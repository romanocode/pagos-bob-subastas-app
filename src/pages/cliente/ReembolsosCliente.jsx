import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { formatCurrency, formatDate } from "../../utils/formatters";
import reembolsoService from "../../services/reembolsoService";

export default function ReembolsosCliente() {
  const { currentUser } = useAuth();
  const [reembolsos, setReembolsos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedReembolso, setSelectedReembolso] = useState(null);
  const [selectedGarantia, setSelectedGarantia] = useState('');
  const [motivo, setMotivo] = useState('');
  const [filters, setFilters] = useState({ estado: '', fecha_desde: '', fecha_hasta: '' });

  useEffect(() => {
    cargarDatos();
  }, [currentUser]);

  const cargarDatos = async () => {
    setIsLoading(true);
    try {
      // Cargar reembolsos del cliente
      const reembolsosResponse = await reembolsoService.getByCliente(currentUser.id);
      const reembolsosValidados = reembolsosResponse.data.filter( reembolso => reembolso.validatedAt);

      const reembolsosFiltro = reembolsosValidados.filter(reembolso => {
        const reembolsoDate = new Date(reembolso.createdAt);
        const desde = filters.fecha_desde ? new Date(filters.fecha_desde) : null;
        const hasta = filters.fecha_hasta ? new Date(filters.fecha_hasta) : null;
        return (!desde || reembolsoDate >= desde) && (!hasta || reembolsoDate <= hasta);
      });

      setReembolsos(reembolsosFiltro);
    } catch (error) {
      toast.error('Error al cargar datos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerDetalles = (reembolso) => {
    setSelectedReembolso(reembolso);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReembolso(null);
  };

  if (isLoading) {
    return <div className="p-6 text-center">Cargando datos...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Reembolsos
        </h1>
      </div>

      {/* Filtros */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Filtros</h2>
        <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <div className="flex items-end">
            <button 
              type="button" 
              onClick={cargarDatos} 
              className="w-full px-4 py-2 bg-bob-primary text-white rounded-md hover:bg-bob-primary-dark focus:outline-none focus:ring-2 focus:ring-bob-primary"
            >
              Filtrar
            </button>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {reembolso.cliente?.nombreCompleto || 'Sin especificar'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                      -{formatCurrency(reembolso.monto)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleVerDetalles(reembolso)}
                          className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-xs"
                        >
                          Ver Detalles
                        </button>
                        {reembolso.archivoUrl && (
                          <button
                            onClick={() => window.open(reembolso.archivoUrl, '_blank')}
                            className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-xs"
                          >
                            Ver Archivo
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal visualizar el reembolso */}
      {showModal && selectedReembolso && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Detalles del Reembolso
              </h2>
              <button 
                type="button" 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cliente
                  </label>
                  <div className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 text-sm">
                    {selectedReembolso.cliente?.nombreCompleto || 'No especificado'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID Reembolso
                  </label>
                  <div className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 text-sm">
                    {selectedReembolso.id}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha
                  </label>
                  <div className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 text-sm">
                    {formatDate(selectedReembolso.createdAt)}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monto (USD)
                  </label>
                  <div className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 text-sm">
                    {formatCurrency(selectedReembolso.monto)}
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Motivo
                  </label>
                  <div className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 text-sm min-h-[60px]">
                    {selectedReembolso.motivo || 'Sin motivo especificado'}
                  </div>
                </div>
                {selectedReembolso.comentarios && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Comentarios
                    </label>
                    <div className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 text-sm min-h-[60px]">
                      {selectedReembolso.comentarios}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-3 mt-4 sticky bottom-0 bg-white pt-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}