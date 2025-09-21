// src/pages/xander/FacturacionXander.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Search, Edit, Eye, FileX, FileCheck, Plus, AlertTriangle, Download } from 'lucide-react';
import facturacionService from '../../services/facturacionService';
import clienteService from '../../services/clienteService';
import { MENSAJES } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';

const FacturacionXander = () => {
  const navigate = useNavigate();
  const [facturas, setFacturas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [currentFactura, setCurrentFactura] = useState(null);
  const [formMode, setFormMode] = useState('create'); // 'create' o 'edit'
  const [accionEstado, setAccionEstado] = useState(''); // 'validar' o 'revocar'

  // Formulario
  const [formData, setFormData] = useState({
    idCliente: '',
    idSubasta: '',
    monto: '',
    banco: '',
    numCuentaDeposito: '',
    docAdjunto: '',
    concepto: '',
    comentarios: ''
  });

  useEffect(() => {
    cargarFacturas();
    cargarClientes();
  }, []);

  // Datos de ejemplo para mostrar en la interfaz
  const facturasEjemplo = [
    {
      idFacturacion: 'FAC-001',
      idCliente: 'CLI-001',
      idSubasta: 'SUB-123',
      monto: 1500.00,
      banco: 'Banco de Crédito',
      numCuentaDeposito: '123-456-789',
      concepto: 'Pago por subasta de vehículo',
      comentarios: 'Pago realizado correctamente',
      createdAt: '2023-10-15T10:30:00Z',
      validatedAt: '2023-10-16T08:45:00Z',
      revokedAt: null
    },
    {
      idFacturacion: 'FAC-002',
      idCliente: 'CLI-002',
      idSubasta: 'SUB-456',
      monto: 2300.50,
      banco: 'BBVA',
      numCuentaDeposito: '987-654-321',
      concepto: 'Pago por subasta de arte',
      comentarios: 'Cliente solicitó factura con urgencia',
      createdAt: '2023-10-18T14:20:00Z',
      validatedAt: null,
      revokedAt: null
    },
    {
      idFacturacion: 'FAC-003',
      idCliente: 'CLI-003',
      idSubasta: 'SUB-789',
      monto: 850.75,
      banco: 'Interbank',
      numCuentaDeposito: '456-789-123',
      concepto: 'Pago por subasta de antigüedades',
      comentarios: 'Factura con datos de empresa',
      createdAt: '2023-10-20T09:15:00Z',
      validatedAt: '2023-10-21T11:30:00Z',
      revokedAt: '2023-10-22T16:45:00Z'
    }
  ];

  // Datos de ejemplo para clientes
  const clientesEjemplo = [
    {
      idCliente: 'CLI-001',
      nombreCompleto: 'Juan Pérez Rodríguez',
      correo: 'juan.perez@ejemplo.com',
      tipDocumento: 'DNI',
      numDocumento: '45678912',
      numCelular: '987654321',
      dtFacRazonSocial: 'Inversiones Pérez S.A.C.',
      dtFacRuc: '20123456789'
    },
    {
      idCliente: 'CLI-002',
      nombreCompleto: 'María García López',
      correo: 'maria.garcia@ejemplo.com',
      tipDocumento: 'CE',
      numDocumento: 'CE123456',
      numCelular: '987123456',
      dtFacRazonSocial: '',
      dtFacRuc: ''
    },
    {
      idCliente: 'CLI-003',
      nombreCompleto: 'Carlos Mendoza Torres',
      correo: 'carlos.mendoza@ejemplo.com',
      tipDocumento: 'RUC',
      numDocumento: '10456789012',
      numCelular: '912345678',
      dtFacRazonSocial: 'Mendoza Importaciones E.I.R.L.',
      dtFacRuc: '10456789012'
    }
  ];

  const cargarFacturas = async () => {
    setIsLoading(true);
    try {
      // Intentar cargar desde el servicio
      const response = await facturacionService.getAll();
      if (response.data && response.data.length > 0) {
        setFacturas(response.data);
      } else {
        // Si no hay datos o hay un error, usar los datos de ejemplo
        setFacturas(facturasEjemplo);
      }
    } catch (error) {
      console.error('Error al cargar facturas:', error);
      // Usar datos de ejemplo en caso de error
      setFacturas(facturasEjemplo);
      toast.info("Mostrando datos de ejemplo para visualización");
    } finally {
      setIsLoading(false);
    }
  };

  const cargarClientes = async () => {
    try {
      const response = await clienteService.getAll();
      if (response.data && response.data.length > 0) {
        setClientes(response.data);
      } else {
        setClientes(clientesEjemplo);
      }
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      setClientes(clientesEjemplo);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredFacturas = facturas.filter(factura => {
    const cliente = clientes.find(c => c.idCliente === factura.idCliente);
    if (!cliente) return false;
    
    return (
      cliente.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cliente.numDocumento.includes(searchTerm) ||
      factura.concepto.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const openCreateModal = () => {
    setFormData({
      idCliente: '',
      idSubasta: '',
      monto: '',
      banco: '',
      numCuentaDeposito: '',
      docAdjunto: '',
      concepto: '',
      comentarios: ''
    });
    setFormMode('create');
    setShowModal(true);
  };

  const openEditModal = (factura) => {
    setCurrentFactura(factura);
    setFormData({
      idCliente: factura.idCliente,
      idSubasta: factura.idSubasta,
      monto: factura.monto,
      banco: factura.banco,
      numCuentaDeposito: factura.numCuentaDeposito,
      docAdjunto: factura.docAdjunto || '',
      concepto: factura.concepto,
      comentarios: factura.comentarios || ''
    });
    setFormMode('edit');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentFactura(null);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setCurrentFactura(null);
  };
  
  const openDetalleModal = (factura) => {
    setCurrentFactura(factura);
    setShowDetalleModal(true);
  };
  
  const closeDetalleModal = () => {
    setShowDetalleModal(false);
    setCurrentFactura(null);
  };

  const openConfirmModal = (factura, accion) => {
    setCurrentFactura(factura);
    setAccionEstado(accion);
    setShowConfirmModal(true);
  };

  const cambiarEstadoFactura = async () => {
    try {
      if (accionEstado === 'validar') {
        await facturacionService.validate(currentFactura.idFacturacion);
        toast.success(MENSAJES.FACTURACION_VALIDADA);
      } else {
        await facturacionService.revoke(currentFactura.idFacturacion);
        toast.success(MENSAJES.FACTURACION_REVOCADA);
      }
      closeConfirmModal();
      cargarFacturas();
    } catch (error) {
      console.error('Error al cambiar estado de la factura:', error);
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
        await facturacionService.create(formData);
        toast.success(MENSAJES.FACTURACION_CREADA);
      } else {
        await facturacionService.update(currentFactura.idFacturacion, formData);
        toast.success(MENSAJES.FACTURACION_ACTUALIZADA);
      }
      closeModal();
      cargarFacturas();
    } catch (error) {
      console.error('Error:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(MENSAJES.ERROR_SERVIDOR);
      }
    }
  };

  const getClienteInfo = (idCliente) => {
    const cliente = clientes.find(c => c.idCliente === idCliente);
    return cliente || { nombreCompleto: 'Cliente no encontrado', correo: '', numDocumento: '', tipDocumento: '' };
  };

  const getEstadoFactura = (factura) => {
    if (factura.revokedAt) return 'Revocada';
    if (factura.validatedAt) return 'Validada';
    return 'Pendiente';
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Validada': return 'text-green-600';
      case 'Revocada': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Facturación</h1>
        <button
          onClick={openCreateModal}
          className="flex items-center px-4 py-2 bg-bob-primary text-white rounded-md hover:bg-bob-primary-dark"
        >
          <Plus size={18} className="mr-1" /> Nueva Factura
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center mb-4 relative">
          <Search size={20} className="absolute left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por cliente, correo, documento o concepto..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bob-primary"
          />
        </div>

        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-bob-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando facturas...</p>
          </div>
        ) : filteredFacturas.length === 0 ? (
          <div className="text-center py-8">
            <AlertTriangle size={48} className="mx-auto text-yellow-500 mb-2" />
            <p className="text-gray-600">No se encontraron facturas{searchTerm ? ' que coincidan con la búsqueda' : ''}.</p>
          </div>
        ) : (
          <div className="overflow-x-auto max-w-full">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">ID</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Nombre</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-36">Correo</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Tipo</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Núm Doc</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Razón Social</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Monto</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Estado</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFacturas.map((factura) => {
                  const cliente = getClienteInfo(factura.idCliente);
                  const estado = getEstadoFactura(factura);
                  const estadoColor = getEstadoColor(estado);
                  
                  return (
                    <tr key={factura.idFacturacion} className="hover:bg-gray-50">
                      <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-[80px]">
                        {factura.idFacturacion}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 truncate max-w-[120px]">
                        {cliente.nombreCompleto}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 truncate max-w-[150px]">
                        {cliente.correo}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 truncate max-w-[80px]">
                        {cliente.tipDocumento}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 truncate max-w-[100px]">
                        {cliente.numDocumento}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 truncate max-w-[120px]">
                        {cliente.razonSocial || "No especificada"}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 truncate max-w-[80px]">
                        {formatCurrency(factura.monto, 'USD')}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap max-w-[80px]">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${estadoColor} bg-opacity-10`}>
                          {estado}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm font-medium max-w-[100px]">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openDetalleModal(factura)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Ver detalles"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => openEditModal(factura)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Editar"
                          >
                            <Edit size={18} />
                          </button>
                          {estado === 'Pendiente' && (
                            <button
                              onClick={() => openConfirmModal(factura, 'validar')}
                              className="text-green-600 hover:text-green-900"
                              title="Validar"
                            >
                              <FileCheck size={18} />
                            </button>
                          )}
                          {estado === 'Validada' && (
                            <button
                              onClick={() => openConfirmModal(factura, 'revocar')}
                              className="text-red-600 hover:text-red-900"
                              title="Revocar"
                            >
                              <FileX size={18} />
                            </button>
                          )}
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            title="Descargar"
                          >
                            <Download size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal para crear/editar factura */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {formMode === 'create' ? 'Nueva Factura' : 'Editar Factura'}
              </h2>
              <button 
                type="button" 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cliente *
                  </label>
                  <select
                    name="idCliente"
                    value={formData.idCliente}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary text-sm"
                  >
                    <option value="">Seleccione un cliente</option>
                    {clientes.map(cliente => (
                      <option key={cliente.idCliente} value={cliente.idCliente}>
                        {cliente.nombreCompleto} - {cliente.numDocumento}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID Subasta *
                  </label>
                  <input
                    type="text"
                    name="idSubasta"
                    value={formData.idSubasta}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monto (USD) *
                  </label>
                  <input
                    type="number"
                    name="monto"
                    value={formData.monto}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary text-sm"
                  />
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
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Cuenta *
                  </label>
                  <input
                    type="text"
                    name="numCuentaDeposito"
                    value={formData.numCuentaDeposito}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Concepto *
                  </label>
                  <input
                    type="text"
                    name="concepto"
                    value={formData.concepto}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Comentarios
                  </label>
                  <textarea
                    name="comentarios"
                    value={formData.comentarios}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary text-sm"
                  ></textarea>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-4 sticky bottom-0 bg-white pt-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-bob-primary text-white rounded-md hover:bg-bob-primary-dark text-sm"
                >
                  {formMode === 'create' ? 'Crear' : 'Actualizar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmar acción</h3>
            <p className="text-sm text-gray-500 mb-6">
              {accionEstado === 'validar'
                ? '¿Está seguro que desea validar esta factura? Esta acción no se puede deshacer.'
                : '¿Está seguro que desea revocar esta factura? Esta acción no se puede deshacer.'}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={closeConfirmModal}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => cambiarEstadoFactura(currentFactura, accionEstado)}
                className={`px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white ${
                  accionEstado === 'validar' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {accionEstado === 'validar' ? 'Validar' : 'Revocar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalles de factura */}
      {showDetalleModal && currentFactura && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeDetalleModal}>
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Detalles de Factura #{currentFactura.numeroFactura}</h2>
              <button onClick={closeDetalleModal} className="text-gray-500 hover:text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Nombre Completo</p>
                <p className="font-medium">{currentFactura.nombreCompleto}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Correo</p>
                <p className="font-medium">{currentFactura.correo}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tipo Documento</p>
                <p className="font-medium">{currentFactura.tipoDocumento}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Número Documento</p>
                <p className="font-medium">{currentFactura.numeroDocumento}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Razón Social</p>
                <p className="font-medium">{currentFactura.razonSocial || "No especificada"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Monto</p>
                <p className="font-medium">{currentFactura.monto}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Estado</p>
                <p className={`font-medium ${getEstadoColor(currentFactura.estado)}`}>
                  {getEstadoFactura(currentFactura.estado)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fecha de Emisión</p>
                <p className="font-medium">{new Date(currentFactura.fechaEmision || Date.now()).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="mt-6 border-t pt-4">
              <h3 className="font-medium mb-2">Información de Pago</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">ID Subasta</p>
                  <p className="font-medium">{currentFactura.idSubasta || "No especificado"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Banco</p>
                  <p className="font-medium">{currentFactura.banco || "No especificado"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Número de Cuenta</p>
                  <p className="font-medium">{currentFactura.numeroCuenta || "No especificado"}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                onClick={closeDetalleModal}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacturacionXander;