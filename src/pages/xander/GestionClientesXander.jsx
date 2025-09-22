// src/pages/xander/GestionClientesXander.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Search, Edit, Eye, UserX, UserCheck, Plus, AlertTriangle } from 'lucide-react';
import clienteService from '../../services/clienteService';
import { MENSAJES } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';

const GestionClientesXander = () => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentCliente, setCurrentCliente] = useState(null);
  const [formMode, setFormMode] = useState('create'); // 'create' o 'edit'
  const [accionEstado, setAccionEstado] = useState(''); // 'activar' o 'inactivar'

  // Formulario
  const [formData, setFormData] = useState({
    correo: '',
    nombreCompleto: '',
    tipDocumento: 'DNI',
    numDocumento: '',
    numCelular: ''
  });

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    setIsLoading(true);
    try {
      const response = await clienteService.getAll();
      setClientes(response.data || []);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      toast.error(MENSAJES.ERROR_SERVIDOR);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredClientes = clientes.filter(cliente => 
    cliente.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.numDocumento.includes(searchTerm)
  );

  const openCreateModal = () => {
    setFormData({
      correo: '',
      nombreCompleto: '',
      tipDocumento: 'DNI',
      numDocumento: '',
      numCelular: ''
    });
    setFormMode('create');
    setShowModal(true);
  };

  const openEditModal = (cliente) => {
    setCurrentCliente(cliente);
    setFormData({
      correo: cliente.correo,
      nombreCompleto: cliente.nombreCompleto,
      tipDocumento: cliente.tipDocumento,
      numDocumento: cliente.numDocumento,
      numCelular: cliente.numCelular
    });
    setFormMode('edit');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentCliente(null);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setCurrentCliente(null);
  };

  const openConfirmModal = (cliente, accion) => {
    setCurrentCliente(cliente);
    setAccionEstado(accion);
    setShowConfirmModal(true);
  };

  const cambiarEstadoCliente = async () => {
    try {
      const nuevoEstado = accionEstado === 'activar';
      await clienteService.patch(currentCliente.id, { ...currentCliente, activo: nuevoEstado });
      toast.success(nuevoEstado ? MENSAJES.CLIENTE_ACTIVADO : MENSAJES.CLIENTE_INACTIVADO);
      closeConfirmModal();
      cargarClientes();
    } catch (error) {
      console.error('Error al cambiar estado del cliente:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(MENSAJES.ERROR_SERVIDOR);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formMode === 'create') {
        await clienteService.create(formData);
        toast.success(MENSAJES.CLIENTE_CREADO);
      } else {
        await clienteService.update(currentCliente.id, formData);
        toast.success(MENSAJES.CLIENTE_ACTUALIZADO);
      }
      closeModal();
      cargarClientes();
    } catch (error) {
      console.error('Error:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(MENSAJES.ERROR_SERVIDOR);
      }
    }
  };

  const verGarantias = (clienteId, nombreCliente) => {
    // Navegar a la vista de garantías del cliente
    navigate(`/xander/clientes/${clienteId}/garantias`);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Lista de Clientes</h1>
        <button
          onClick={openCreateModal}
          className="bg-bob-primary hover:bg-bob-primary-dark text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Plus size={18} />
          Nuevo Cliente
        </button>
      </div>

      {/* Buscador */}
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar por nombre, correo o documento..."
          className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-bob-primary focus:border-transparent"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      {/* Tabla de clientes */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre Completo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo Documento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número Documento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número Celular</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                    Cargando clientes...
                  </td>
                </tr>
              ) : filteredClientes.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-sm text-gray-500">
                    No se encontraron clientes
                  </td>
                </tr>
              ) : (
                filteredClientes.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {cliente.nombreCompleto}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cliente.correo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cliente.tipDocumento}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cliente.numDocumento}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cliente.numCelular}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(cliente.saldoTotalDolar, 'USD')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${cliente.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {cliente.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditModal(cliente)}
                          className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                          title='Editar Cliente'
                        >
                          <Edit size={16} />
                          {/* Editar */}
                        </button>
                        <button
                          onClick={() => verGarantias(cliente.id, cliente.nombreCompleto)}
                          className="text-green-600 hover:text-green-900 flex items-center gap-1"
                          title='Ver Garantías Cliente'
                        >
                          <Eye size={16} />
                          {/* Ver garantías */}
                        </button>
                        {cliente.activo ? (
                          <button
                            onClick={() => openConfirmModal(cliente, 'inactivar')}
                            className="text-red-600 hover:text-red-900 flex items-center gap-1"
                            title='Inactivar Cliente'
                          >
                            <UserX size={16} />
                            {/* Inactivar */}
                          </button>
                        ) : (
                          <button
                            onClick={() => openConfirmModal(cliente, 'activar')}
                            className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                            title='Activar Cliente'
                          >
                            <UserCheck size={16} />
                            {/* Activar */}
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

      {/* Modal para crear/editar cliente */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6">
              {formMode === 'create' ? 'Nuevo Cliente' : 'Editar Cliente'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    name="nombreCompleto"
                    value={formData.nombreCompleto}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo Electrónico *
                  </label>
                  <input
                    type="email"
                    name="correo"
                    value={formData.correo}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Documento *
                  </label>
                  <select
                    name="tipDocumento"
                    value={formData.tipDocumento}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
                  >
                    <option value="DNI">DNI</option>
                    <option value="RUC">RUC</option>
                    <option value="CE">Carné de Extranjería</option>
                    <option value="PAS">Pasaporte</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Documento *
                  </label>
                  <input
                    type="text"
                    name="numDocumento"
                    value={formData.numDocumento}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Celular *
                  </label>
                  <input
                    type="text"
                    name="numCelular"
                    value={formData.numCelular}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bob-primary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-bob-primary border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-bob-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bob-primary"
                >
                  {formMode === 'create' ? 'Crear Cliente' : 'Actualizar Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación para activar/inactivar cliente */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {accionEstado === 'activar' ? 'Activar' : 'Inactivar'} Cliente
            </h2>
            <p className="mb-6">
              ¿Está seguro que desea {accionEstado === 'activar' ? 'activar' : 'inactivar'} al cliente {currentCliente?.nombreCompleto}?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeConfirmModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              >
                Cancelar
              </button>
              <button
                onClick={cambiarEstadoCliente}
                className={`px-4 py-2 rounded-md text-white ${accionEstado === 'activar' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionClientesXander;