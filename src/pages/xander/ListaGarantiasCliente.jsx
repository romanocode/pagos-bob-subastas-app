// src/pages/xander/ListaGarantiasCliente.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Plus, ArrowLeft, Edit, Wallet, RefreshCw, CreditCard, FileText } from 'lucide-react';
import clienteService from '../../services/clienteService';
import garantiaService from '../../services/garantiaService';
import { MENSAJES, GARANTIA_ESTADOS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';

const ListaGarantiasCliente = () => {
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
    descripcion: '',
    tipo: 'ingreso',
    fechaSubasta: '',
    placaVehiculo: '',
    empresaVehiculo: '',
    numCuentaDeposito: '',
    docAdjunto: ''
  });
  const [currentGarantia, setCurrentGarantia] = useState(null);
  const [formMode, setFormMode] = useState('create'); // 'create' o 'edit'

  useEffect(() => {
    cargarDatos();
  }, [clienteId]);

  const cargarDatos = async () => {
    setIsLoading(true);
    try {
      // Cargar datos del cliente
      const clienteResponse = await clienteService.getById(clienteId);
      setCliente(clienteResponse.data);

      // Cargar garantías del cliente usando el nuevo endpoint
      const garantiasResponse = await garantiaService.getByCliente(clienteId);
      setGarantias(garantiasResponse.data);
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

  const openCreateModal = () => {
    setFormMode('create');
    setFormData({
      monto: '',
      moneda: 'USD',
      banco: '',
      descripcion: '',
      tipo: 'ingreso',
      fechaSubasta: new Date().toISOString().split('T')[0],
      placaVehiculo: '',
      empresaVehiculo: '',
      numCuentaDeposito: '',
      docAdjunto: ''
    });
    setShowModal(true);
  };

  const openEditModal = (garantia) => {
    setFormMode('edit');
    setCurrentGarantia(garantia);
    setFormData({
      monto: garantia.monto,
      moneda: garantia.moneda,
      banco: garantia.banco,
      descripcion: garantia.descripcion,
      tipo: 'ingreso', // Siempre ingreso por defecto
      fechaSubasta: garantia.fechaSubasta || new Date().toISOString().split('T')[0],
      placaVehiculo: garantia.placaVehiculo || '',
      empresaVehiculo: garantia.empresaVehiculo || '',
      numCuentaDeposito: garantia.numCuentaDeposito || '',
      docAdjunto: garantia.docAdjunto || ''
    });
    setShowModal(true);
  };

  const verDocumento = (docAdjunto) => {
    // En un entorno real, aquí se abriría el documento en una nueva ventana o modal
    // Por ahora, solo mostramos un mensaje con el nombre del documento
    toast.info(`Visualizando documento: ${docAdjunto}`);
    // Ejemplo de implementación real (comentado):
    // window.open(`/documentos/${docAdjunto}`, '_blank');
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentGarantia(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formMode === 'create') {
        const nuevaGarantia = {
          ...formData,
          clienteId: parseInt(clienteId),
          estado: GARANTIA_ESTADOS.PENDIENTE_VALIDACION,
          fechaCreacion: new Date().toISOString()
        };

        await garantiaService.create(nuevaGarantia);
        toast.success(MENSAJES.GARANTIA_CREADA);
      } else {
        await garantiaService.update(currentGarantia.id, {
          ...currentGarantia,
          ...formData
        });
        toast.success(MENSAJES.GARANTIA_ACTUALIZADA);
      }
      closeModal();
      cargarDatos();
    } catch (error) {
      console.error('Error:', error);
      toast.error(MENSAJES.ERROR_SERVIDOR);
    }
  };

  const renderEstadoGarantia = (estado) => {
    switch (estado) {
      case GARANTIA_ESTADOS.PENDIENTE_VALIDACION:
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Pendiente Validación
          </span>
        );
      case GARANTIA_ESTADOS.VALIDADO:
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Validado
          </span>
        );
      default:
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            {estado}
          </span>
        );
    }
  };

  const volver = () => {
    navigate('/xander/clientes');
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-2">
        <button
          onClick={volver}
          className="mr-4 text-gray-600 hover:text-gray-900 flex items-center"
        >
          <ArrowLeft size={18} />
          <span className="ml-1">Volver</span>
        </button>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Lista de Garantías del Cliente: {cliente?.nombreCompleto || 'Cargando...'}
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Card de Saldo */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg text-white p-4 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Wallet size={20} />
                <h2 className="text-lg font-semibold">Saldo del Cliente</h2>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <div className="text-blue-200 text-sm">Saldo Total</div>
                <div className="text-2xl font-bold">
                  {cliente ? formatCurrency(cliente.saldoTotalDolar, 'USD') : '...'}
                </div>
              </div>
            </div>
          </div>
          
          {/* Card de Acciones */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
              <CreditCard size={20} className="mr-2" />
              Acciones
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={openCreateModal}
                className="bg-bob-primary hover:bg-bob-primary-dark text-white px-3 py-2 rounded-md flex items-center gap-1 text-sm"
              >
                <Plus size={16} />
                Nueva Garantía
              </button>
              <button
                onClick={() => toast.info('Funcionalidad en desarrollo')}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md flex items-center gap-1 text-sm"
              >
                <RefreshCw size={16} />
                Nuevo Reembolso
              </button>
              <button
                onClick={() => toast.info('Funcionalidad en desarrollo')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md flex items-center gap-1 text-sm"
              >
                <CreditCard size={16} />
                Nuevo Pago
              </button>
            </div>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título Subasta</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Subasta</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Moneda</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    Cargando garantías...
                  </td>
                </tr>
              ) : garantias.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    No se encontraron garantías para este cliente
                  </td>
                </tr>
              ) : (
                garantias.map((garantia) => (
                  <tr key={garantia.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {garantia.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {garantia.empresaVehiculo || 'No especificado'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {garantia.fechaSubasta ? new Date(garantia.fechaSubasta).toLocaleDateString() : 'No especificado'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {garantia.moneda}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(garantia.monto, garantia.moneda)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderEstadoGarantia(garantia.estado)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center space-x-2">
                      <button
                        onClick={() => openEditModal(garantia)}
                        className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                        title='Editar Garantía'
                      >
                        <Edit size={16} />
                      </button>
                      {garantia.docAdjunto && (
                        <button
                          onClick={() => verDocumento(garantia.docAdjunto)}
                          className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                          title='Ver Documento'
                        >
                          <FileText size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para crear/editar garantía */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6">
              {formMode === 'create' ? 'Nueva Garantía' : 'Editar Garantía'}
            </h2>
            <form onSubmit={handleSubmit}>
              {/* Campo Tipo de Garantía oculto (valor por defecto: ingreso) */}
              <input
                type="hidden"
                name="tipo"
                value="ingreso"
              />
              
              {/* Campos para información del vehículo - siempre visibles */}
              {true && (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Placa del Vehículo
                    </label>
                    <input
                      type="text"
                      name="placaVehiculo"
                      value={formData.placaVehiculo}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bob-primary"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Empresa del Vehículo
                    </label>
                    <input
                      type="text"
                      name="empresaVehiculo"
                      value={formData.empresaVehiculo}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bob-primary"
                    />
                  </div>
                </>
              )}
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Subasta *
                </label>
                <input
                  type="date"
                  name="fechaSubasta"
                  value={formData.fechaSubasta}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bob-primary"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monto *
                </label>
                <div className="flex">
                  <select
                    name="moneda"
                    value={formData.moneda}
                    onChange={handleInputChange}
                    className="mr-2 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bob-primary"
                    required
                  >
                    <option value="USD">USD</option>
                    <option value="PEN">PEN</option>
                  </select>
                  <input
                    type="number"
                    name="monto"
                    value={formData.monto}
                    onChange={handleInputChange}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bob-primary"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Banco *
                </label>
                <input
                  type="text"
                  name="banco"
                  value={formData.banco}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bob-primary"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Depósito del Pago *
                </label>
                <input
                  type="text"
                  name="numCuentaDeposito"
                  value={formData.numCuentaDeposito}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bob-primary"
                  required
                />
              </div>
              

              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comprobante de Pago (Imagen o PDF) *
                </label>
                <input
                  type="text"
                  name="docAdjunto"
                  value={formData.docAdjunto}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bob-primary"
                  placeholder="nombre_archivo.pdf o nombre_archivo.jpg"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Ingrese el nombre del archivo que contiene el comprobante de pago</p>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-bob-primary"
                  rows="3"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-bob-primary text-white rounded-md hover:bg-bob-primary-dark"
                >
                  {formMode === 'create' ? 'Crear' : 'Actualizar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListaGarantiasCliente;