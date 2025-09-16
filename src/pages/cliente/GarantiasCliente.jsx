// src/pages/cliente/GarantiasCliente.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import garantiaService from '../../services/garantiaService';
import { GARANTIAS_DEMO } from '../../data/mockData';
import { MENSAJES, GARANTIA_ESTADOS } from '../../utils/constants';

const GarantiasCliente = () => {
  const [garantias, setGarantias] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    cargarGarantias();
  }, []);

  const cargarGarantias = async () => {
    setIsLoading(true);
    try {
      // En un entorno real, esto sería:
      // const data = await garantiaService.getAll();
      // const garantiasCliente = data.filter(g => g.cliente_id === currentUser.id);
      // setGarantias(garantiasCliente);
      
      // Para demo, usamos datos de prueba
      setTimeout(() => {
        const garantiasCliente = GARANTIAS_DEMO.filter(
          g => g.cliente_id === currentUser.id
        );
        setGarantias(garantiasCliente);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error al cargar garantías:', error);
      toast.error(MENSAJES.ERROR_SERVIDOR);
      setIsLoading(false);
    }
  };

  const getEstadoLabel = (estado) => {
    switch (estado) {
      case GARANTIA_ESTADOS.PENDIENTE_VALIDACION:
        return 'Pendiente de validación';
      case GARANTIA_ESTADOS.VALIDADO:
        return 'Validada';
      default:
        return 'Desconocido';
    }
  };

  const getEstadoClass = (estado) => {
    switch (estado) {
      case GARANTIA_ESTADOS.PENDIENTE_VALIDACION:
        return 'bg-yellow-100 text-yellow-800';
      case GARANTIA_ESTADOS.VALIDADO:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mis Garantías</h1>
        <Link 
          to="/cliente/registrar-garantia" 
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
        >
          Registrar Nueva Garantía
        </Link>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">Cargando garantías...</div>
      ) : garantias.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600 mb-4">No tienes garantías registradas.</p>
          <Link 
            to="/cliente/registrar-garantia" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Registrar tu primera garantía
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {garantias.map((garantia) => (
                <tr key={garantia.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {garantia.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {garantia.tipo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {garantia.moneda} {garantia.monto.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoClass(garantia.estado)}`}>
                      {getEstadoLabel(garantia.estado)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(garantia.fecha_creacion).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      onClick={() => {}}
                    >
                      Ver detalles
                    </button>
                    {garantia.estado === GARANTIA_ESTADOS.VALIDADO && (
                      <Link 
                        to="/cliente/solicitar-reembolso" 
                        className="text-green-600 hover:text-green-900"
                      >
                        Solicitar reembolso
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GarantiasCliente;