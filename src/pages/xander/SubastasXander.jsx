// src/pages/xander/SubastasXander.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Plus, Edit, X, Check } from 'lucide-react';
import subastaService from '../../services/subastaService';
import garantiaService from '../../services/garantiaService';
import clienteService from '../../services/clienteService';
import { MENSAJES, SUBASTA_ESTADOS, MONEDAS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';

const SubastasXander = () => {
  const [subastas, setSubastas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showGarantiaModal, setShowGarantiaModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [currentSubasta, setCurrentSubasta] = useState(null);
  const [formMode, setFormMode] = useState('create'); // 'create' o 'edit'

  // Formulario de subasta
  const [formData, setFormData] = useState({
    titulo: '',
    imgSubasta: '',
    placaVehiculo: '',
    empresa: '',
    fecha: '',
    moneda: 'USD',
    monto: '',
    descripcion: '',
    estado: SUBASTA_ESTADOS.ACTIVA
  });

  // Formulario de garantía
  const [garantiaData, setGarantiaData] = useState({
    idSubasta: '',
    idCliente: '',
    concepto: '',
    fechaSubasta: '',
    fechaExpiracion: '',
    tipo: 'Ingreso',
    moneda: 'USD',
    montoGarantia: '',
    banco: '',
    numCuentaDeposito: '',
    docAdjunto: '',
    comentarios: ''
  });

  useEffect(() => {
    cargarSubastas();
    cargarClientes();
  }, []);

  const cargarSubastas = async () => {
    setIsLoading(true);
    try {
      const response = await subastaService.getAll();
      if (response.success) {
        setSubastas(response.data);
      } else {
        toast.error('Error al cargar subastas');
      }
    } catch (error) {
      console.error('Error al cargar subastas:', error);
      toast.error(MENSAJES.ERROR_SERVIDOR);
    } finally {
      setIsLoading(false);
    }
  };

  const cargarClientes = async () => {
    try {
      const response = await clienteService.getAll();
      if (response.success) {
        setClientes(response.data);
      } else {
        toast.error('Error al cargar clientes');
      }
    } catch (error) {
      console.error('Error al cargar clientes:', error);
      toast.error(MENSAJES.ERROR_SERVIDOR);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleGarantiaInputChange = (e) => {
    const { name, value } = e.target;
    setGarantiaData({
      ...garantiaData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const subastaData = {
        ...formData,
        monto: parseFloat(formData.monto)
      };

      let response;
      if (formMode === 'create') {
        response = await subastaService.create(subastaData);
        if (response.success) {
          toast.success(MENSAJES.SUBASTA_CREADA);
          setSubastas([...subastas, response.data]);
        }
      } else {
        response = await subastaService.update(currentSubasta.idSubasta, subastaData);
        if (response.success) {
          toast.success(MENSAJES.SUBASTA_ACTUALIZADA);
          setSubastas(subastas.map(s => s.idSubasta === currentSubasta.idSubasta ? response.data : s));
        }
      }

      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('Error al guardar subasta:', error);
      toast.error(MENSAJES.ERROR_SERVIDOR);
    }
  };

  const handleGarantiaSubmit = async (e) => {
    e.preventDefault();
    try {
      const garantiaFormData = {
        ...garantiaData,
        montoGarantia: parseFloat(garantiaData.montoGarantia)
      };

      const response = await garantiaService.create(garantiaFormData);
      if (response.success) {
        toast.success(MENSAJES.GARANTIA_CREADA);
        setShowGarantiaModal(false);
        resetGarantiaForm();
      }
    } catch (error) {
      console.error('Error al crear garantía:', error);
      toast.error(MENSAJES.ERROR_SERVIDOR);
    }
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGarantiaData({
        ...garantiaData,
        docAdjunto: file.name
      });
    }
  };

  const handleCerrarSubasta = async () => {
    try {
      const response = await subastaService.close(currentSubasta.idSubasta);
      if (response.success) {
        toast.success(MENSAJES.SUBASTA_CERRADA);
        setSubastas(subastas.map(s => s.idSubasta === currentSubasta.idSubasta ? { ...s, estado: SUBASTA_ESTADOS.CERRADA } : s));
        setShowConfirmModal(false);
      }
    } catch (error) {
      console.error('Error al cerrar subasta:', error);
      toast.error(MENSAJES.ERROR_SERVIDOR);
    }
  };

  const openCreateModal = () => {
    setFormMode('create');
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (subasta) => {
    setFormMode('edit');
    setCurrentSubasta(subasta);
    setFormData({
      titulo: subasta.titulo,
      imgSubasta: subasta.imgSubasta || '',
      placaVehiculo: subasta.placaVehiculo,
      empresa: subasta.empresa,
      fecha: new Date(subasta.fecha).toISOString().split('T')[0],
      moneda: subasta.moneda,
      monto: subasta.monto.toString(),
      descripcion: subasta.descripcion || '',
      estado: subasta.estado
    });
    setShowModal(true);
  };

  const openGarantiaModal = (subasta) => {
    setCurrentSubasta(subasta);
    // Calcular el monto de la garantía como el 8% del monto de la subasta
    const montoSubasta = parseFloat(subasta.monto);
    const montoGarantia = montoSubasta * 0.08;
    
    setGarantiaData({
      ...garantiaData,
      idSubasta: subasta.idSubasta,
      fechaSubasta: new Date(subasta.fecha).toISOString().split('T')[0],
      fechaExpiracion: new Date(new Date(subasta.fecha).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      moneda: subasta.moneda,
      montoGarantia: montoGarantia.toFixed(2) // Redondear a 2 decimales
    });
    setShowGarantiaModal(true);
  };

  const openConfirmModal = (subasta) => {
    setCurrentSubasta(subasta);
    setShowConfirmModal(true);
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      imgSubasta: '',
      placaVehiculo: '',
      empresa: '',
      fecha: '',
      moneda: 'USD',
      monto: '',
      descripcion: '',
      estado: SUBASTA_ESTADOS.ACTIVA
    });
    setCurrentSubasta(null);
  };

  const resetGarantiaForm = () => {
    setGarantiaData({
      idSubasta: '',
      idCliente: '',
      concepto: '',
      fechaSubasta: '',
      fechaExpiracion: '',
      tipo: 'Ingreso',
      moneda: 'USD',
      montoGarantia: '',
      banco: '',
      numCuentaDeposito: '',
      docAdjunto: '',
      comentarios: ''
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bob-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Subastas</h1>
        <button
          onClick={openCreateModal}
          className="bg-bob-primary hover:bg-bob-primary-dark text-white px-4 py-2 rounded-md flex items-center gap-2"
        >
          <Plus size={18} />
          Nueva Subasta
        </button>
      </div>

      {/* Lista de subastas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subastas.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No hay subastas registradas
          </div>
        ) : (
          subastas.map((subasta) => (
            <div key={subasta.idSubasta} className="bg-white rounded-lg shadow-md overflow-hidden">
              {subasta.imgSubasta && (
                <div className="h-48 overflow-hidden">
                  <img 
                    src={subasta.imgSubasta} 
                    alt={subasta.titulo} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-lg font-semibold text-gray-800">{subasta.titulo}</h2>
                  <span 
                    className={`px-2 py-1 text-xs font-medium rounded-full ${subasta.estado === SUBASTA_ESTADOS.ACTIVA ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                  >
                    {subasta.estado === SUBASTA_ESTADOS.ACTIVA ? 'Abierto' : 'Cerrado'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{subasta.descripcion}</p>
                <p className="text-sm text-gray-600 mb-2">Placa: {subasta.placaVehiculo}</p>
                <p className="text-sm text-gray-600 mb-2">Empresa: {subasta.empresa}</p>
                <p className="text-sm text-gray-600 mb-2">Fecha: {new Date(subasta.fecha).toLocaleDateString()}</p>
                <p className="text-lg font-bold text-bob-primary mb-4">
                  {formatCurrency(subasta.monto, subasta.moneda)}
                </p>

                {subasta.estado === SUBASTA_ESTADOS.ACTIVA && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => openEditModal(subasta)}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                    >
                      <Edit size={16} />
                      Editar
                    </button>
                    <button
                      onClick={() => openGarantiaModal(subasta)}
                      className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                    >
                      <Plus size={16} />
                      Nueva Garantía
                    </button>
                    <button
                      onClick={() => openConfirmModal(subasta)}
                      className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                    >
                      <X size={16} />
                      Cerrar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal para crear/editar subasta */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-xl font-bold mb-6">
              {formMode === 'create' ? 'Nueva Subasta' : 'Editar Subasta'}
            </h2>
            <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto pr-2">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título *
                  </label>
                  <input
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    URL de Imagen
                  </label>
                  <input
                    type="text"
                    name="imgSubasta"
                    value={formData.imgSubasta}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Placa de Vehículo *
                  </label>
                  <input
                    type="text"
                    name="placaVehiculo"
                    value={formData.placaVehiculo}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Empresa *
                  </label>
                  <input
                    type="text"
                    name="empresa"
                    value={formData.empresa}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha *
                  </label>
                  <input
                    type="date"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Moneda *
                    </label>
                    <select
                      name="moneda"
                      value={formData.moneda}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
                    >
                      {Object.entries(MONEDAS).map(([key, value]) => (
                        <option key={key} value={value}>{value}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Monto *
                    </label>
                    <input
                      type="number"
                      name="monto"
                      value={formData.monto}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
                    />
                  </div>
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

              <div className="mt-6 flex justify-end space-x-3">
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
                  {formMode === 'create' ? 'Crear Subasta' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para crear nueva garantía */}
      {showGarantiaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-xl font-bold mb-6">Nueva Garantía</h2>
            <form onSubmit={handleGarantiaSubmit} className="max-h-[70vh] overflow-y-auto pr-2">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cliente Ganador *
                  </label>
                  <select
                    name="idCliente"
                    value={garantiaData.idCliente}
                    onChange={handleGarantiaInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
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
                    Concepto *
                  </label>
                  <select
                    name="concepto"
                    value={garantiaData.concepto}
                    onChange={handleGarantiaInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
                  >
                    <option value="">Seleccione un concepto</option>
                    <option value="Ganador 1">Ganador 1</option>
                    <option value="Ganador 2">Ganador 2</option>
                    <option value="Ganador 3">Ganador 3</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fecha Expiración *
                  </label>
                  <input
                    type="date"
                    name="fechaExpiracion"
                    value={garantiaData.fechaExpiracion}
                    onChange={handleGarantiaInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
                  />
                </div>

                {/* Campo tipo oculto con valor por defecto "Ingreso" */}
                <input
                  type="hidden"
                  name="tipo"
                  value={garantiaData.tipo}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Moneda *
                    </label>
                    <select
                      name="moneda"
                      value={garantiaData.moneda}
                      onChange={handleGarantiaInputChange}
                      required
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary bg-gray-100"
                    >
                      {Object.entries(MONEDAS).map(([key, value]) => (
                        <option key={key} value={value}>{value}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Monto Garantía (8%)
                    </label>
                    <input
                      type="number"
                      name="montoGarantia"
                      value={garantiaData.montoGarantia}
                      onChange={handleGarantiaInputChange}
                      required
                      min="0"
                      step="0.01"
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary bg-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Banco *
                  </label>
                  <input
                    type="text"
                    name="banco"
                    value={garantiaData.banco}
                    onChange={handleGarantiaInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Cuenta de Depósito *
                  </label>
                  <input
                    type="text"
                    name="numCuentaDeposito"
                    value={garantiaData.numCuentaDeposito}
                    onChange={handleGarantiaInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Documento Adjunto *
                  </label>
                  <input
                    type="file"
                    name="docAdjunto"
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
                  />
                  <p className="text-xs text-gray-500 mt-1">Formatos aceptados: JPG, PNG, PDF. Máximo 5MB.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Comentarios
                  </label>
                  <textarea
                    name="comentarios"
                    value={garantiaData.comentarios}
                    onChange={handleGarantiaInputChange}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
                  ></textarea>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowGarantiaModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bob-primary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Crear Garantía
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación para cerrar subasta */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirmar cierre de subasta</h3>
            <p className="text-sm text-gray-500 mb-6">¿Estás seguro de cerrar la subasta? Esta acción no se puede deshacer.</p>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bob-primary"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleCerrarSubasta}
                className="px-4 py-2 bg-red-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Cerrar Subasta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubastasXander;