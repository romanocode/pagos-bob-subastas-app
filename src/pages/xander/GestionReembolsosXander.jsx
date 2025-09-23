// src/pages/xander/GestionReembolsosXander.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Search, Edit, Eye, FileX, FileCheck, Plus, AlertTriangle, Download, Upload, MessageSquare, Filter } from 'lucide-react';
import reembolsoService from '../../services/reembolsoService';
import clienteService from '../../services/clienteService';
import { MENSAJES, REEMBOLSO_ESTADOS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import facturacionService from '../../services/facturacionService';

const GestionReembolsosXander = () => {
  const [reembolsos, setReembolsos] = useState([]);
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
  const [currentReembolso, setCurrentReembolso] = useState(null);
  const [formMode, setFormMode] = useState('create'); // 'create', 'edit' o 'view'
  const [accionEstado, setAccionEstado] = useState(''); // 'aprobar', 'rechazar' o 'procesar'

  // Formulario
  const [formData, setFormData] = useState({
    idCliente: '',
    monto: '',
    banco: '',
    numCuentaDeposito: '',
    archivoUrl: '',
    comentarios: ''
  });

  useEffect(() => {
    cargarReembolsos();
    cargarClientes();
  }, []);

  const cargarReembolsos = async () => {
    setIsLoading(true);
    try {
      // Intentar cargar desde el servicio
      const response = await reembolsoService.getAll();
      if (response.data && response.data.length > 0) {
        setReembolsos(response.data);
      }
    } catch (error) {
      console.error('Error al cargar reembolsos:', error);
      toast.error('Error al cargar reembolsos');
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

  const getEstadoReembolso = (reembolso) => {
    if (reembolso.createdAt && !reembolso.validatedAt) return "Pendiente a Informar";
    if (reembolso.createdAt && reembolso.validatedAt) return "Informado a Cliente";
    return "Pendiente";
  };

  // Mostrar todos los reembolsos, solo filtrar por término de búsqueda si existe
  const filteredReembolsos = reembolsos
    .filter(reembolso => {
      // Filtro por término de búsqueda
      if (searchTerm) {
        const cliente = clientes.find(c => c.id === reembolso.idCliente);
        if (!cliente) return false;
        const matchesSearch = 
          cliente.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (reembolso.motivo && reembolso.motivo.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (reembolso.monto && reembolso.monto.toString().includes(searchTerm));
        
        if (!matchesSearch) return false;
      }

      // Filtro por estado
      if (filtrosAplicados.estado) {
        const estado = getEstadoReembolso(reembolso);
        if (filtrosAplicados.estado !== estado) return false;
      }
      
      // Filtro por fecha
      if (filtrosAplicados.fechaInicio || filtrosAplicados.fechaFin) {
        const fechaReembolso = new Date(reembolso.createdAt);
        
        if (filtrosAplicados.fechaInicio) {
          const fechaInicio = new Date(filtrosAplicados.fechaInicio);
          if (fechaReembolso < fechaInicio) return false;
        }
        
        if (filtrosAplicados.fechaFin) {
          const fechaFin = new Date(filtrosAplicados.fechaFin);
          fechaFin.setHours(23, 59, 59, 999); // Final del día
          if (fechaReembolso > fechaFin) return false;
        }
      }
      
      return true;
    });

  const openCreateModal = () => {
    setFormData({
      idCliente: "",
      monto: "",
      banco: "",
      numCuentaDeposito: "",
      archivoUrl: "",
      comentarios: "",
    });
    setFormMode("create");
    setShowModal(true);
  };

  const openEditModal = (reembolso) => {
    setCurrentReembolso(reembolso);
    setFormData({
      idCliente: reembolso.idCliente,
      monto: reembolso.monto,
      banco: reembolso.banco,
      numCuentaDeposito: reembolso.numCuentaDeposito,
      archivoUrl: reembolso.archivoUrl || '',
      comentarios: reembolso.comentarios || ''
    });
    setFormMode('edit');
    setShowModal(true);
  };

  const openViewModal = (reembolso) => {
    setCurrentReembolso(reembolso);
    setFormData({
      idCliente: reembolso.idCliente,
      monto: reembolso.monto,
      banco: reembolso.banco,
      numCuentaDeposito: reembolso.numCuentaDeposito,
      archivoUrl: reembolso.archivoUrl || '',
      comentarios: reembolso.comentarios || ''
    });
    setFormMode('view');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentReembolso(null);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setCurrentReembolso(null);
  };

  const cambiarEstadoReembolso = async () => {
    try {
      if (accionEstado === 'aprobar') {
        await reembolsoService.approve(currentReembolso.id);
        toast.success(MENSAJES.REEMBOLSO_APROBADO);
      } else if (accionEstado === 'rechazar') {
        await reembolsoService.delete(currentReembolso.id);
        toast.success(MENSAJES.REEMBOLSO_CANCELADO);
      } else if (accionEstado === 'procesar') {
        await reembolsoService.markAsReimbursed(currentReembolso.id);
        toast.success(MENSAJES.REEMBOLSO_COMPLETADO);
      }
      closeConfirmModal();
      cargarReembolsos();
    } catch (error) {
      console.error(`Error al ${accionEstado} el reembolso:`, error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(MENSAJES.ERROR_SERVIDOR);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formMode === 'view') {
      closeModal();
      return;
    }

    try {
      const reembolsoData = {
        idCliente: formData.idCliente,
        monto: parseFloat(formData.monto),
        banco: formData.banco,
        numCuentaDeposito: formData.numCuentaDeposito,
        docAdjunto: formData.archivoUrl.name,
        comentarios: formData.comentarios
      };

      if (formMode === 'create') {
        await reembolsoService.create(reembolsoData);
        toast.success(MENSAJES.REEMBOLSO_CREADO);
      } else if (formMode === 'edit') {
        await reembolsoService.update(currentReembolso.id, reembolsoData);
        toast.success(MENSAJES.REEMBOLSO_ACTUALIZADO);
      }

      closeModal();
      cargarReembolsos();
    } catch (error) {
      console.error('Error al guardar reembolso:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error(MENSAJES.ERROR_SERVIDOR);
      }
    }
  };

  // Función para calcular el saldo total del cliente
  const calcularSaldoTotal = async (clienteId) => {
    try {
      // Obtener garantías validadas
      const garantiasResponse = await reembolsoService.getByCliente(clienteId);
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

  const getClienteInfo = (idCliente) => {
    const cliente = clientes.find(c => c.id === idCliente);
    return cliente || { nombreCompleto: 'Cliente no encontrado', correo: '', numDocumento: '', tipDocumento: '' };
  };
  // Función para enviar mensaje de WhatsApp
  const enviarWhatsApp = async (reembolso) => {
    try {
      // Validar la facturación
      await reembolsoService.approve(reembolso.id);

      // Obtener cliente y enviar mensaje
      const cliente = getClienteInfo(reembolso.idCliente);
      const mensaje = `Hola ${cliente.nombreCompleto}, te informamos que ya se realizó el reembolso por un monto de ${formatCurrency(reembolso.monto, 'USD')} bajo el concepto por ${reembolso.comentarios}`;
      window.open(`https://wa.me/${cliente.numCelular}?text=${encodeURIComponent(mensaje)}`, '_blank');
      
      // Calcular y actualizar el saldo total del cliente
      const saldoTotal = await calcularSaldoTotal(reembolso.idCliente);
      await clienteService.update(reembolso.idCliente, { saldoTotalDolar: saldoTotal });
      
      // Actualizar la lista de reembolsos
      toast.success('Reembolso validado y mensaje enviado correctamente');
      cargarReembolsos();
    } catch (error) {
      console.error('Error al validar el reembolso:', error);
      toast.error('Error al validar el reembolso');
    }
  };

  // Añadir estado para el error de monto
  const [montoError, setMontoError] = useState('');

  // Modificar handleInputChange para validar el monto
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Si cambia el cliente, actualizar el saldo
    if (name === 'idCliente') {
      const clienteSeleccionado = clientes.find(c => c.id === Number(value));
      setFormData({
        ...formData,
        [name]: value,
        saldoCliente: clienteSeleccionado ? clienteSeleccionado.saldoTotalDolar || 0 : 0
      });
    } else if (name === 'monto') {
      // Validar que el monto no sea mayor al saldo
      const monto = parseFloat(value);
      const saldo = parseFloat(formData.saldoCliente);
      
      if (monto > saldo) {
        setMontoError('El monto no debe ser mayor al saldo del cliente');
      } else {
        setMontoError('');
      }
      
      setFormData({
        ...formData,
        [name]: value
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleFiltrar = () => {
    setFiltrosAplicados({
      fechaInicio: filtroFechaInicio,
      fechaFin: filtroFechaFin,
      estado: filtroEstado
    });
    setShowFiltros(false);
  };

  const limpiarFiltros = () => {
    setFiltroFechaInicio('');
    setFiltroFechaFin('');
    setFiltroEstado('');
    setFiltrosAplicados({
      fechaInicio: '',
      fechaFin: '',
      estado: ''
    });
    setShowFiltros(false);
  };

  const getConfirmModalTitle = () => {
    switch (accionEstado) {
      case 'aprobar': return 'Aprobar Reembolso';
      case 'rechazar': return 'Rechazar Reembolso';
      case 'procesar': return 'Procesar Reembolso';
      default: return '';
    }
  };

  const getConfirmModalMessage = () => {
    switch (accionEstado) {
      case 'aprobar': return '¿Estás seguro de que deseas aprobar este reembolso?';
      case 'rechazar': return '¿Estás seguro de que deseas rechazar este reembolso?';
      case 'procesar': return '¿Estás seguro de que deseas marcar este reembolso como procesado?';
      default: return '';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Reembolsos</h1>
        <button
          onClick={openCreateModal}
          className="flex items-center px-4 py-2 bg-bob-primary text-white rounded-md hover:bg-bob-primary-dark"
        >
          <Plus size={18} className="mr-1" /> Nuevo Reembolso
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center mb-4 relative">
          <Search size={20} className="absolute left-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por cliente o motivo..."
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
                <option value="Pendiente a Informar">Pendiente a Informar</option>
                <option value="Informado a Cliente">Informado a Cliente</option>
              </select>
            </div>
            
            <div className="flex items-end space-x-2">
              <button
                onClick={handleFiltrar}
                className="px-4 py-2 bg-bob-primary text-white rounded-md hover:bg-bob-primary-dark"
              >
                Aplicar filtros
              </button>
              <button
                onClick={limpiarFiltros}
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
            <p className="mt-2 text-gray-600">Cargando reembolsos...</p>
          </div>
        ) : filteredReembolsos.length === 0 ? (
          <div className="text-center py-8">
            <AlertTriangle size={48} className="mx-auto text-yellow-500 mb-2" />
            <p className="text-gray-600">No se encontraron reembolsos{searchTerm ? ' que coincidan con la búsqueda' : ''}.</p>
          </div>
        ) : (
          <div className="overflow-x-auto max-w-full">
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">ID</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Cliente</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Monto</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Fecha</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Estado</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReembolsos.map((reembolso) => {
                  const cliente = clientes.find(c => c.id === reembolso.idCliente);
                  const estado = getEstadoReembolso(reembolso);
                  
                  return (
                    <tr key={reembolso.id} className="hover:bg-gray-50">
                      <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-[80px]">
                        {reembolso.id}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 truncate max-w-[120px]">
                        {cliente
                          ? cliente.nombreCompleto
                          : "Cliente no encontrado"}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 truncate max-w-[80px]">
                        {formatCurrency(reembolso.monto)}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 truncate max-w-[80px]">
                        {new Date(reembolso.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap max-w-[120px]">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            estado === "Pendiente a Informar"
                              ? "bg-yellow-100 text-yellow-800"
                              : estado === "Informado a Cliente"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {estado}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm font-medium max-w-[100px]">
                        <div className="flex space-x-2">
                          {estado === "Pendiente a Informar" && (
                            <>
                              <button
                                onClick={() => openEditModal(reembolso)}
                                className="text-indigo-600 hover:text-indigo-900"
                                title="Editar"
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                onClick={() => enviarWhatsApp(reembolso)}
                                className="text-green-600 hover:text-green-900"
                                title="Enviar a WhatsApp"
                              >
                                <MessageSquare size={18} />
                              </button>
                            </>
                          )}

                          {estado === "Informado a Cliente" && (
                            <>
                              <button
                                onClick={() => openViewModal(reembolso)}
                                className="text-green-600 hover:text-green-900"
                                title="Ver detalles"
                              >
                                <Eye size={18} />
                              </button>
                              <button
                                onClick={() =>
                                  window.open(reembolso.docAdjunto, "_blank")
                                }
                                className="text-blue-600 hover:text-blue-900"
                                title="Ver documento"
                              >
                                <FileCheck size={18} />
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

      {/* Modal para crear/editar reembolso */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {formMode === 'create' ? 'Nuevo Reembolso' : formMode === 'edit' ? 'Editar Reembolso' : 'Detalles de Reembolso'}
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
                        {cliente.nombreCompleto}
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
                            onChange={(e) => {
                              if (e.target.files && e.target.files[0]) {
                                setFormData({
                                  ...formData,
                                  docAdjuntoNombre: e.target.files[0].name
                                });
                              }
                            }}
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
                        {formData.docAdjuntoNombre ? formData.docAdjuntoNombre : "Sin documento adjunto"}
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
                    placeholder="Comentarios adicionales (opcional)"
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
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="border-b px-6 py-3">
              <h3 className="text-lg font-medium">{getConfirmModalTitle()}</h3>
            </div>
            <div className="p-6">
              <p>{getConfirmModalMessage()}</p>
              {currentReembolso && (
                <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                  <p><span className="font-medium">Cliente:</span> {clientes.find(c => c.id === currentReembolso.idCliente)?.nombreCompleto}</p>
                  <p><span className="font-medium">Monto:</span> {formatCurrency(currentReembolso.monto)}</p>
                  <p><span className="font-medium">Motivo:</span> {currentReembolso.motivo}</p>
                </div>
              )}
            </div>
            <div className="bg-gray-50 px-6 py-3 flex justify-end">
              <button
                onClick={closeConfirmModal}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
              >
                Cancelar
              </button>
              <button
                onClick={cambiarEstadoReembolso}
                className={`${
                  accionEstado === 'aprobar'
                    ? 'bg-green-600 hover:bg-green-700'
                    : accionEstado === 'rechazar'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white font-bold py-2 px-4 rounded`}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionReembolsosXander;