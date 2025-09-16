// src/pages/xander/GarantiasClienteXander.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Plus, ArrowLeft } from 'lucide-react';
import clienteService from '../../services/clienteService';
import garantiaService from '../../services/garantiaService';
import { MENSAJES, GARANTIA_ESTADOS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';

const GarantiasClienteXander = () => {
  const { clienteId } = useParams();
  const navigate = useNavigate();
  
  const [cliente, setCliente] = useState(null);
  const [garantias, setGarantias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    monto: '',
    moneda: 'USD',
    banco: '',
    referenciaBancaria: '',
    descripcion: ''
  });

  useEffect(() => {
    cargarDatos();
  }, [clienteId]);

  const cargarDatos = async () => {
    setIsLoading(true);
    try {
      // Cargar datos del cliente
      const clienteResponse = await clienteService.getById(clienteId);
      setCliente(clienteResponse.data);

      // Cargar garantías del cliente
      const garantiasResponse = await garantiaService.getAll();
      // Filtrar garantías por cliente
      const garantiasCliente = garantiasResponse.data.filter(
        garantia => garantia.clienteId === parseInt(clienteId)
      );
      setGarantias(garantiasCliente);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      toast.error(MENSAJES.ERROR_SERVIDOR);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const nuevaGarantia = {
        ...formData,
        clienteId: parseInt(clienteId),
        estado: GARANTIA_ESTADOS.PENDIENTE_VALIDACION,
        fechaCreacion: new Date().toISOString()
      };

      await garantiaService.create(nuevaGarantia);
      toast.success(MENSAJES.GARANTIA_CREADA);
      setShowModal(false);
      cargarDatos();
    } catch (error) {
      console.error('Error al crear garantía:', error);
      toast.error(MENSAJES.ERROR_SERVIDOR);
    }
  };

  const renderEstadoGarantia = (estado) => {
    let displayText = '';
    let badgeClass = '';

    if (estado === GARANTIA_ESTADOS.PENDIENTE_VALIDACION) {
      displayText = 'Pendiente de Validación';
      badgeClass = 'bg-yellow-100 text-yellow-800';
    } else if (estado === GARANTIA_ESTADOS.VALIDADO) {
      displayText = 'Validada';
      badgeClass = 'bg-green-100 text-green-800';
    }

    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badgeClass}`}>
        {displayText}
      </span>
    );
  };

  const volver = () => {
    navigate('/xander/clientes');
  };

  if (isLoading) {
    return <div className="p-6 text-center">Cargando datos...</div>;
  }

  if (!cliente) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Cliente no encontrado</p>
        <button 
          onClick={volver}
          className="mt-4 bg-bob-primary text-white px-4 py-2 rounded-md flex items-center gap-2 mx-auto"
        >
          <ArrowLeft size={18} />
          Volver a la lista de clientes
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-2">
        <button 
          onClick={volver}
          className="text-bob-primary hover:text-bob-primary-dark flex items-center gap-1"
        >
          <ArrowLeft size={18} />
          Volver a clientes
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Lista de Garantías del Cliente: {cliente.nombreCompleto}
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-bob-primary hover:bg-bob-primary-dark text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Plus size={18} />
          Nueva Garantía
        </button>
      </div>

      {/* Información del cliente */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Información del Cliente</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Nombre</p>
            <p className="font-medium">{cliente.nombreCompleto}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Correo</p>
            <p className="font-medium">{cliente.correo}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Documento</p>
            <p className="font-medium">{cliente.tipDocumento}: {cliente.numDocumento}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Celular</p>
            <p className="font-medium">{cliente.numCelular}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Saldo Total</p>
            <p className="font-medium">{formatCurrency(cliente.saldoTotalDolar, 'USD')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Estado</p>
            <p className="font-medium">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${cliente.estado ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {cliente.estado ? 'Activo' : 'Inactivo'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Tabla de garantías */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Banco</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Referencia</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {garantias.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    No hay garantías registradas para este cliente
                  </td>
                </tr>
              ) : (
                garantias.map((garantia) => (
                  <tr key={garantia.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {garantia.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(garantia.monto, garantia.moneda)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {garantia.banco}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {garantia.referenciaBancaria}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {garantia.descripcion}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderEstadoGarantia(garantia.estado)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(garantia.fechaCreacion).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para crear nueva garantía */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-xl font-bold mb-6">Nueva Garantía</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monto *
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      name="monto"
                      value={formData.monto}
                      onChange={handleInputChange}
                      required
                      step="0.01"
                      min="0"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
                    />
                    <select
                      name="moneda"
                      value={formData.moneda}
                      onChange={handleInputChange}
                      className="px-3 py-2 border border-gray-300 border-l-0 rounded-r-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
                    >
                      <option value="USD">USD</option>
                      <option value="PEN">PEN</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Banco *
                  </label>
                  <input
                    type="text"
                    name="banco"
                    value={formData.banco}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Referencia Bancaria *
                  </label>
                  <input
                    type="text"
                    name="referenciaBancaria"
                    value={formData.referenciaBancaria}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
                  ></textarea>
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
                  className="px-4 py-2 bg-bob-primary border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-bob-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bob-primary"
                >
                  Crear Garantía
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GarantiasClienteXander;