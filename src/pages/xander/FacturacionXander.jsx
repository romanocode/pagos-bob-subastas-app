import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Search, Edit, Eye, FileX, FileCheck, Plus, AlertTriangle, Download, Upload, MessageSquare, Filter } from 'lucide-react';
import facturacionService from '../../services/facturacionService';
import clienteService from '../../services/clienteService';
import garantiaService from '../../services/garantiaService';
import reembolsoService from '../../services/reembolsoService';
import { MENSAJES } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';

const FacturacionXander = () => {
  const [facturas, setFacturas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroFechaInicio, setFiltroFechaInicio] = useState('');
  const [filtroFechaFin, setFiltroFechaFin] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [filtrosAplicados, setFiltrosAplicados] = useState({
    fechaInicio: '',
    fechaFin: '',
    estado: ''
  });
  const [showFiltros, setShowFiltros] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [currentFactura, setCurrentFactura] = useState(null);
  const [formMode, setFormMode] = useState('create'); // 'create', 'edit' o 'view'
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


  const cargarFacturas = async () => {
    setIsLoading(true);
    try {
      // Intentar cargar desde el servicio
      const response = await facturacionService.getAll();
      if (response.data && response.data.length > 0) {
        setFacturas(response.data);
      }
    } catch (error) {
      console.error('Error al cargar facturas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const cargarClientes = async () => {
    try {
      const response = await clienteService.getAll();
      if (response.data && response.data.length > 0) {
        setClientes(response.data);
      }
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const getEstadoFactura = (factura) => {
    if (factura.validatedAt) return "Informado a Cliente";
    return "Pendiente a Informar";
  };

  // Mostrar todas las facturas, solo filtrar por término de búsqueda si existe
  const filteredFacturas = facturas
    .filter(factura => {
      // Filtro por término de búsqueda
      if (searchTerm) {
        const cliente = clientes.find(c => c.id === factura.idCliente);
        if (!cliente) return false;
        const matchesSearch = 
          cliente.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (factura.concepto && factura.concepto.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (factura.monto && factura.monto.toString().includes(searchTerm));
        
        if (!matchesSearch) return false;
      }

      

      // Filtro por estado
      if (filtrosAplicados.estado) {
        const estado = getEstadoFactura(factura);
        if (filtrosAplicados.estado === 'pendiente' && estado !== 'Pendiente a Informar') return false;
        if (filtrosAplicados.estado === 'informado' && estado !== 'Informado a Cliente') return false;
      }
      
      // Filtro por fecha
      if (filtrosAplicados.fechaInicio || filtrosAplicados.fechaFin) {
        const fechaFactura = new Date(factura.createdAt);
        
        if (filtrosAplicados.fechaInicio) {
          const fechaInicio = new Date(filtrosAplicados.fechaInicio);
          if (fechaFactura < fechaInicio) return false;
        }
        
        if (filtrosAplicados.fechaFin) {
          const fechaFin = new Date(filtrosAplicados.fechaFin);
          fechaFin.setHours(23, 59, 59, 999); // Final del día
          if (fechaFactura > fechaFin) return false;
        }
      }
      
      return true;
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

  const openViewModal = (factura) => {
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
    setFormMode('view');
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
  
  const closeDetalleModal = () => {
    setShowDetalleModal(false);
    setCurrentFactura(null);
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

  // Estado para controlar el error de monto
  const [montoError, setMontoError] = useState('');
  
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Si se selecciona un cliente, actualizar el saldo
    if (name === 'idCliente' && value) {
      const clienteSeleccionado = clientes.find(cliente => cliente.id === Number(value));
      if (clienteSeleccionado) {
        setFormData(prevData => ({
          ...prevData,
          saldoCliente: clienteSeleccionado ? clienteSeleccionado.saldoTotalDolar : 0
        }));
        
        // Validar el monto si ya existe
        if (formData.monto) {
          validarMonto(formData.monto, clienteSeleccionado.saldoTotalDolar || 0);
        }
      }
    }
    
    // Si se cambia el monto, validar que no sea mayor al saldo
    if (name === 'monto' && value && formData.saldoCliente) {
      validarMonto(value, formData.saldoCliente);
    }
  };
  
  // Función para validar que el monto no supere el saldo
  const validarMonto = (monto, saldo) => {
    if (parseFloat(monto) > parseFloat(saldo)) {
      setMontoError('El monto no puede ser mayor al saldo del cliente');
    } else {
      setMontoError('');
    }
  };

  const handleFacturaFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        docAdjunto: file,
        docAdjuntoNombre: file.name
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formMode === 'create') {
        formData.docAdjunto = formData.docAdjuntoNombre || '';
        await facturacionService.create(formData);
        toast.success(MENSAJES.FACTURACION_CREADA);
      } else {
        // 
        if(formData.docAdjunto instanceof File) {
          formData.docAdjunto = formData.docAdjuntoNombre || '';
        }
        await facturacionService.update(currentFactura.id, formData);
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
    const cliente = clientes.find(c => c.id === idCliente);
    return cliente || { nombreCompleto: 'Cliente no encontrado', correo: '', numDocumento: '', tipDocumento: '' };
  };

  // Función para calcular el saldo total del cliente
  const calcularSaldoTotal = async (clienteId) => {
    try {
      // Obtener garantías validadas
      const garantiasResponse = await garantiaService.getByCliente(clienteId);
      const sumaGarantias = garantiasResponse.data
        .filter(garantia => garantia.validatedAt && !garantia.revokedAt)
        .reduce((total, garantia) => total + parseFloat(garantia.montoGarantia || 0), 0);
      
      // Obtener facturas validadas
      const facturasResponse = await facturacionService.getByCliente(clienteId);
      const sumaFacturas = facturasResponse.data
        .filter(factura => factura.validatedAt && !factura.revokedAt)
        .reduce((total, factura) => total + parseFloat(factura.monto || 0), 0);
      
      // Obtener reembolsos validados
      const reembolsosResponse = await reembolsoService.getByCliente(clienteId);
      const sumaReembolsos = reembolsosResponse.data
        .filter(reembolso => reembolso.validatedAt && !reembolso.revokedAt)
        .reduce((total, reembolso) => total + parseFloat(reembolso.monto || 0), 0);
      
      // Calcular saldo total
      return sumaGarantias - (sumaFacturas + sumaReembolsos);
    } catch (error) {
      console.error("Error al calcular saldo total:", error);
      return 0;
    }
  };

  // Función para enviar mensaje de WhatsApp
  const enviarWhatsApp = async (factura) => {
    try {
      // Validar la facturación
      await facturacionService.validate(factura.id);
      
      // Obtener cliente y enviar mensaje
      const cliente = getClienteInfo(factura.idCliente);
      const mensaje = `Hola ${cliente.nombreCompleto}, te informamos que ya se realizó la facturación por un monto de ${formatCurrency(factura.monto, 'USD')} bajo el concepto por ${factura.concepto}`;
      window.open(`https://wa.me/${cliente.numCelular}?text=${encodeURIComponent(mensaje)}`, '_blank');
      
      // Calcular y actualizar el saldo total del cliente
      const saldoTotal = await calcularSaldoTotal(factura.idCliente);
      await clienteService.update(factura.idCliente, { saldoTotalDolar: saldoTotal });
      
      // Actualizar la lista de facturas
      toast.success('Factura validada y mensaje enviado correctamente');
      cargarFacturas();
    } catch (error) {
      console.error('Error al validar la factura:', error);
      toast.error('Error al validar la factura');
    }
  };

  

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Informado a Cliente': return 'text-green-600';
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
          <button 
            onClick={() => setShowFiltros(!showFiltros)}
            className="ml-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center"
          >
            <Filter size={18} className="mr-1" /> Filtros
          </button>
        </div>

        {showFiltros && (
          <div className="bg-gray-50 p-4 rounded-md mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Desde</label>
              <input
                type="date"
                value={filtroFechaInicio}
                onChange={(e) => setFiltroFechaInicio(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bob-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Hasta</label>
              <input
                type="date"
                value={filtroFechaFin}
                onChange={(e) => setFiltroFechaFin(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bob-primary"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bob-primary"
              >
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendiente a Informar</option>
                <option value="informado">Informado a Cliente</option>
              </select>
            </div>
            
            <div className="flex items-end space-x-2">
              <button
                onClick={() => {
                  setFiltrosAplicados({
                    fechaInicio: filtroFechaInicio,
                    fechaFin: filtroFechaFin,
                    estado: filtroEstado
                  });
                }}
                className="px-4 py-2 bg-bob-primary text-white rounded-md hover:bg-bob-primary-dark"
              >
                Aplicar filtros
              </button>
              <button
                onClick={() => {
                  setFiltroFechaInicio('');
                  setFiltroFechaFin('');
                  setFiltroEstado('');
                  setFiltrosAplicados({
                    cliente: '',
                    fechaInicio: '',
                    fechaFin: '',
                    estado: ''
                  });
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        )}

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
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Cliente</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Concepto</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Monto</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Estado</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFacturas.map((factura) => {
                  const cliente = getClienteInfo(factura.idCliente);
                  const estado = getEstadoFactura(factura);
                  
                  return (
                    <tr key={factura.idFacturacion} className="hover:bg-gray-50">
                      <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-[80px]">
                        {factura.id}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 truncate max-w-[120px]">
                        {cliente.nombreCompleto}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 truncate max-w-[100px]">
                        {factura.concepto}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 truncate max-w-[80px]">
                        {formatCurrency(factura.monto, 'USD')}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap max-w-[120px]">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          estado === 'Informado a Cliente' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {estado}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm font-medium max-w-[100px]">
                        <div className="flex space-x-2">
                          {estado === 'Pendiente a Informar' ? (
                            <>
                              <button
                                onClick={() => openEditModal(factura)}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="Editar"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => window.open(factura.docAdjunto, '_blank')}
                                className="text-blue-600 hover:text-blue-900"
                                title="Ver documento"
                              >
                                <FileCheck size={18} />
                              </button>
                              <button
                                onClick={() => enviarWhatsApp(factura)}
                                className="text-green-600 hover:text-green-900"
                                title="Enviar a WhatsApp"
                              >
                                <MessageSquare size={18} />
                              </button>
                            </>
                          ) : (
                            <>
                            <button
                              onClick={() => window.open(factura.docAdjunto, '_blank')}
                              className="text-blue-600 hover:text-blue-900 mr-2"
                              title="Ver documento"
                            >
                              <FileCheck size={18} />
                            </button>
                            <button
                              onClick={() => openViewModal(factura)}
                              className="text-green-600 hover:text-green-900"
                              title="Ver detalles"
                            >
                              <Eye size={18} />
                            </button>
                            </>
                          )}
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
                {formMode === 'create' ? 'Nueva Factura' : formMode === 'edit' ? 'Editar Factura' : 'Detalles de Factura'}
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
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cliente *
                  </label>
                  <select
                    name="idCliente"
                    value={formData.idCliente}
                    onChange={handleInputChange}
                    required
                    disabled={formMode === 'view'}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary text-sm"
                  >
                    <option value="">Seleccione un cliente</option>
                    {clientes.map(cliente => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nombreCompleto} - {cliente.numDocumento}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Saldo de Cliente
                  </label>
                  <input
                    type="number"
                    name="saldoCliente"
                    value={formData.saldoCliente}
                    onChange={handleInputChange}
                    min="0"
                    step="0.01"
                    disabled={true}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Concepto *
                  </label>
                  <select
                    name="concepto"
                    value={formData.concepto}
                    onChange={handleInputChange}
                    required
                    disabled={formMode === 'view'}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary text-sm"
                  >
                    <option value="">Seleccione un concepto</option>
                    <option value="Ganador">Ganador</option>
                    <option value="Penalidad">Penalidad</option>
                  </select>
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
                    disabled={formMode === 'view'}
                    className={`w-full px-3 py-1.5 border ${montoError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary text-sm`}
                  />
                  {montoError && (
                    <p className="text-red-500 text-xs mt-1">{montoError}</p>
                  )}
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
                    disabled={formMode === 'view'}
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
                    disabled={formMode === 'view'}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary text-sm"
                  />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Documento Adjunto
                </label>
                <div className="flex items-center space-x-2">
                  {formMode !== 'view' ? (
                    <>
                      <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-md flex items-center">
                        <Upload size={16} className="mr-2" />
                        <span>Subir archivo</span>
                        <input
                          type="file"
                          onChange={handleFacturaFileChange}
                          className="hidden"
                        />
                      </label>
                      {formData.docAdjuntoNombre && (
                        <span className="text-sm text-gray-600">
                          {formData.docAdjuntoNombre}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-sm text-gray-600">
                      {formData.docAdjunto ? "Documento adjunto disponible" : "Sin documento adjunto"}
                    </span>
                  )}
                </div>
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
                    disabled={formMode === 'view'}
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
                  {formMode === 'view' ? 'Cerrar' : 'Cancelar'}
                </button>
                {formMode !== 'view' && (
                  <button
                    type="submit"
                    disabled={!!montoError}
                    className={`px-3 py-1.5 ${montoError ? 'bg-gray-400 cursor-not-allowed' : 'bg-bob-primary hover:bg-bob-primary-dark'} text-white rounded-md text-sm`}
                  >
                    {formMode === 'create' ? 'Crear' : 'Actualizar'}
                  </button>
                )}
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