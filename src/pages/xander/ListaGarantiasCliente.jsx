// src/pages/xander/ListaGarantiasCliente.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Plus,
  ArrowLeft,
  Edit,
  Wallet,
  RefreshCw,
  CreditCard,
  FileText,
  MessageCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import clienteService from "../../services/clienteService";
import garantiaService from "../../services/garantiaService";
import { MENSAJES, GARANTIA_ESTADOS } from "../../utils/constants";
import { formatCurrency } from "../../utils/formatters";

const ListaGarantiasCliente = () => {
  const { clienteId } = useParams();
  const navigate = useNavigate();

  const [cliente, setCliente] = useState(null);
  const [garantias, setGarantias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState("");
  const [garantiaToAction, setGarantiaToAction] = useState(null);
  const [formData, setFormData] = useState({
    monto: "",
    moneda: "USD",
    banco: "",
    descripcion: "",
    tipo: "ingreso",
    fechaSubasta: "",
    fechaExpiracion: "",
    placaVehiculo: "",
    empresaVehiculo: "",
    numCuentaDeposito: "",
    docAdjunto: "",
    montoPuja: "",
    porcentaje: "",
    montoGarantia: "",
    concepto: "",
  });
  const [currentGarantia, setCurrentGarantia] = useState(null);
  const [formMode, setFormMode] = useState("create"); // 'create' o 'edit'

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
      console.error("Error al cargar datos:", error);
      toast.error(MENSAJES.ERROR_SERVIDOR);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    const updatedData = {
      ...formData,
      [name]: value,
    };
    
    // Cálculo automático entre porcentaje y monto de garantía
    if (name === 'montoPuja') {
      if (updatedData.porcentaje) {
        const montoPuja = parseFloat(value) || 0;
        const porcentaje = parseFloat(updatedData.porcentaje) || 0;
        updatedData.montoGarantia = (montoPuja * porcentaje / 100).toFixed(2);
      }
    } else if (name === 'porcentaje') {
      if (updatedData.montoPuja) {
        const montoPuja = parseFloat(updatedData.montoPuja) || 0;
        const porcentaje = parseFloat(value) || 0;
        updatedData.montoGarantia = (montoPuja * porcentaje / 100).toFixed(2);
      }
    } else if (name === 'montoGarantia') {
      if (updatedData.montoPuja) {
        const montoPuja = parseFloat(updatedData.montoPuja) || 0;
        const montoGarantia = parseFloat(value) || 0;
        if (montoPuja > 0) {
          updatedData.porcentaje = ((montoGarantia / montoPuja) * 100).toFixed(2);
        }
      }
    }
    
    setFormData(updatedData);
  };


  const openEditModal = (garantia) => {
    setFormMode("edit");
    setCurrentGarantia(garantia);
    setFormData({
      monto: garantia.monto,
      moneda: garantia.moneda,
      tipo: "ingreso", // Siempre ingreso por defecto
      fechaSubasta: garantia.fechaSubasta || new Date().toISOString().split("T")[0],
      fechaExpiracion: garantia.fechaExpiracion || new Date().toISOString().split("T")[0],
      montoPuja: garantia.montoPuja || "",
      porcentaje: garantia.porcentaje || "",
      montoGarantia: garantia.montoGarantia || garantia.monto || "",
      concepto: garantia.concepto || ""
    });
    setShowModal(true);
  };

  const verDocumento = (docAdjunto) => {
    // Verificar si el documento es una URL de blob o una ruta relativa
    if (docAdjunto && (docAdjunto.startsWith('blob:') || docAdjunto.startsWith('http'))) {
      // Si es una URL de blob o una URL completa, abrirla directamente
      window.open(docAdjunto, '_blank');
      toast.info(`Abriendo documento en nueva ventana`);
    } else if (docAdjunto) {
      // Si es una ruta relativa, construir la URL completa
      window.open(`/docsAdjunts/${docAdjunto}`, '_blank');
      toast.info(`Abriendo documento: ${docAdjunto}`);
    } else {
      // Si no hay documento adjunto
      toast.warning('No hay documento disponible para visualizar');
    }
  };
  
  const mostrarConfirmacion = (accion, garantia) => {
    setConfirmAction(accion);
    setGarantiaToAction(garantia);
    setShowConfirmModal(true);
  };

  const cerrarModalConfirmacion = () => {
    setShowConfirmModal(false);
    setConfirmAction("");
    setGarantiaToAction(null);
  };

  const ejecutarAccion = async () => {
    try {
      if (confirmAction === "validar") {
        await garantiaService.validate(garantiaToAction.id);
        toast.success("Garantía validada correctamente");
      } else if (confirmAction === "invalidar") {
        await garantiaService.invalidate(garantiaToAction.id);
        toast.success("Garantía invalidada correctamente");
      }
      cargarDatos(); // Recargar datos para actualizar la lista
    } catch (error) {
      console.error(`Error al ${confirmAction} garantía:`, error);
      toast.error(`Error al ${confirmAction} la garantía`);
    } finally {
      cerrarModalConfirmacion();
    }
  };
  
  const validarGarantia = (garantia) => {
    mostrarConfirmacion("validar", garantia);
  };
  
  const invalidarGarantia = (garantia) => {
    mostrarConfirmacion("invalidar", garantia);
  };
  
  const enviarMensajeWhatsApp = async (cliente, id) => {
    const mensaje = `Buenos días ${cliente.nombreCompleto}, se le ha creado una garantía para que pueda realizar el pago correspondiente. Favor de revisarlo en la web http://localhost:5173/ . Saludos!!`;
    const mensajeEncoded = encodeURIComponent(mensaje);
    const telefono = cliente.numCelular || "";
    
    // Abrir WhatsApp Web con el mensaje predefinido
    window.open(`https://wa.me/${telefono}?text=${mensajeEncoded}`, "_blank");
    
    // Enviar la garantía al cliente
    const response = await garantiaService.sentGarantia(id);
    if (response) {
      toast.success("Garantía enviada al cliente");
      // Recargar datos del cliente para actualizar la lista de garantías
      cargarDatos();
    } else {
      toast.error("Error al enviar la garantía");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentGarantia(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formMode === "create") {
        const nuevaGarantia = {
          ...formData,
          clienteId: parseInt(clienteId),
          estado: GARANTIA_ESTADOS.PENDIENTE_VALIDACION,
          fechaCreacion: new Date().toISOString(),
        };

        await garantiaService.create(nuevaGarantia);
        toast.success(MENSAJES.GARANTIA_CREADA);
      } else {
        await garantiaService.update(currentGarantia.id, {
          ...currentGarantia,
          ...formData,
        });
        toast.success(MENSAJES.GARANTIA_ACTUALIZADA);
      }
      closeModal();
      cargarDatos();
    } catch (error) {
      console.error("Error:", error);
      toast.error(MENSAJES.ERROR_SERVIDOR);
    }
  };

  const volver = () => {
    navigate("/xander/clientes");
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
          Garantías del Cliente: {cliente?.nombreCompleto || "Cargando..."}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Card de Saldo */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg text-white p-4 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Wallet size={20} />
                <h2 className="text-lg font-semibold">Saldo</h2>
              </div>
            </div>
            <div className="space-y-2">
              <div>
                <div className="text-blue-200 text-sm">Saldo Total</div>
                <div className="text-2xl font-bold">
                  {cliente
                    ? formatCurrency(cliente.saldoTotalDolar, "USD")
                    : "..."}
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
                onClick={() => toast.info("Funcionalidad en desarrollo")}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md flex items-center gap-1 text-sm"
              >
                <RefreshCw size={16} />
                Reembolso
              </button>
              <button
                onClick={() => toast.info("Funcionalidad en desarrollo")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md flex items-center gap-1 text-sm"
              >
                <CreditCard size={16} />
                Facturar
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título Subasta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Creación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Garantía
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    Cargando garantías...
                  </td>
                </tr>
              ) : garantias.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
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
                      {garantia.subasta.titulo || "No especificado"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {garantia.createdAt
                        ? new Date(garantia.createdAt)
                            .toLocaleDateString("es-ES", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            })
                            .replace(/\//g, "-")
                        : "No especificado"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(garantia.montoGarantia)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {garantia.createdAt &&
                        !garantia.sentedAt &&
                        !garantia.validatedAt &&
                        !garantia.invalidatedAt &&
                        !garantia.revokedAt && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Creado
                          </span>
                        )}
                      {garantia.sentedAt && !garantia.docAdjunto && (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          Enviado
                        </span>
                      )}
                      {garantia.docAdjunto && !garantia.validatedAt && (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          Pendiente de Validación
                        </span>
                      )}
                      {garantia.validatedAt && !garantia.invalidatedAt && (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Validado
                        </span>
                      )}
                      {garantia.invalidatedAt && !garantia.revokedAt && (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Invalidado
                        </span>
                      )}
                      {garantia.revokedAt && (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          Cancelado Por Cliente
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center space-x-2">
                      {garantia.createdAt &&
                        !garantia.sentedAt &&
                        !garantia.validatedAt &&
                        !garantia.invalidatedAt &&
                        !garantia.revokedAt && (
                        <>
                          <button
                            onClick={() => openEditModal(garantia)}
                            className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
                            title="Editar Garantía"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => enviarMensajeWhatsApp(cliente, garantia.id)}
                            className="text-green-600 hover:text-green-900 flex items-center gap-1"
                            title="Enviar mensaje de WhatsApp"
                          >
                            <MessageCircle size={16} />
                          </button>
                        </>
                      )}
                      {garantia.docAdjunto && !garantia.validatedAt && !garantia.invalidatedAt && !garantia.revokedAt (
                        <>
                          <button
                            onClick={() => verDocumento(garantia.docAdjunto)}
                            className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                            title="Ver Documento"
                          >
                            <FileText size={16} />
                          </button>
                          <button
                            onClick={() => validarGarantia(garantia)}
                            className="text-green-600 hover:text-green-900 flex items-center gap-1"
                            title="Validar Garantía"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button
                            onClick={() => invalidarGarantia(garantia)}
                            className="text-red-600 hover:text-red-900 flex items-center gap-1"
                            title="Invalidar Garantía"
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                      {garantia.validatedAt && !garantia.invalidatedAt && !garantia.revokedAt && (
                        <>
                          <button
                            onClick={() => verDocumento(garantia.docAdjunto)}
                            className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                            title="Ver Documento"
                          >
                            <FileText size={16} />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para editar garantía */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6">
              {formMode === "create" ? "Nueva Garantía" : "Editar Garantía"}
            </h2>
            <form
              onSubmit={handleSubmit}
              className="max-h-[70vh] overflow-y-auto pr-2"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Concepto *
                  </label>
                  <select
                    name="concepto"
                    value={formData.concepto}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
                  >
                    <option value="">Seleccione un concepto</option>
                    <option value="Ganador 1">Ganador 1</option>
                    <option value="Ganador 2">Ganador 2</option>
                    <option value="Ganador 3">Ganador 3</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha Expiración *
                    </label>
                    <input
                      type="date"
                      name="fechaExpiracion"
                      value={
                        formData.fechaExpiracion
                          ? new Date(formData.fechaExpiracion)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Moneda *
                    </label>
                    <select
                      name="moneda"
                      value={formData.moneda}
                      onChange={handleInputChange}
                      required
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary bg-gray-100"
                    >
                      <option value="USD">USD</option>
                      <option value="PEN">PEN</option>
                    </select>
                  </div>
                </div>

                {/* Campo tipo oculto con valor por defecto "Ingreso" */}
                <input type="hidden" name="tipo" value={formData.tipo} />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monto Puja
                  </label>
                  <input
                    type="number"
                    name="montoPuja"
                    value={formData.montoPuja}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary bg-gray-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      % Garantía
                    </label>
                    <input
                      type="number"
                      name="porcentaje"
                      value={formData.porcentaje}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Total Garantía
                    </label>
                    <input
                      type="number"
                      name="montoGarantia"
                      value={formData.montoGarantia}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary bg-gray-100"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bob-primary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  {formMode === "create" ? "Crear" : "Actualizar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de confirmación para validar/invalidar garantía */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {confirmAction === "validar" ? "Validar Garantía" : "Invalidar Garantía"}
            </h2>
            <p className="mb-6">
              ¿Está seguro que desea {confirmAction} la garantía 
              {garantiaToAction && ` por un monto de ${formatCurrency(garantiaToAction.montoGarantia || garantiaToAction.monto)}`}?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={cerrarModalConfirmacion}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bob-primary"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={ejecutarAccion}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  confirmAction === "validar"
                    ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                    : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                }`}
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

export default ListaGarantiasCliente;
