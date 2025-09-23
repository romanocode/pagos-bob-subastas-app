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
  Upload,
  Trash2,
} from "lucide-react";
import clienteService from "../../services/clienteService";
import garantiaService from "../../services/garantiaService";
import reembolsoService from "../../services/reembolsoService";
import facturacionService from "../../services/facturacionService";
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
  const [showReembolsoModal, setShowReembolsoModal] = useState(false);
  const [showFacturaModal, setShowFacturaModal] = useState(false);
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
  const [reembolsoData, setReembolsoData] = useState({
    monto: "",
    banco: "",
    numCuentaDeposito: "",
    docAdjunto: null,
    docAdjuntoNombre: "",
    comentarios: "",
  });
  const [facturaData, setFacturaData] = useState({
    monto: "",
    banco: "",
    numCuentaDeposito: "",
    concepto: "",
    docAdjunto: null,
    docAdjuntoNombre: "",
    comentarios: "",
  });

  const closeFacturaModal = () => {
    setShowFacturaModal(false);
    setFacturaData({
      monto: "",
      banco: "",
      numCuentaDeposito: "",
      concepto: "",
      docAdjunto: null,
      docAdjuntoNombre: "",
      comentarios: "",
    });
  };

  const handleFacturaInputChange = (e) => {
    const { name, value } = e.target;
    setFacturaData({
      ...facturaData,
      [name]: value,
    });
  };

  const handleFacturaFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFacturaData({
        ...facturaData,
        docAdjunto: file,
        docAdjuntoNombre: file.name,
      });
    }
  };

  const handleFacturaSubmit = async (e) => {
    e.preventDefault();

    // Validar campos requeridos
    if (
      !facturaData.monto ||
      !facturaData.banco ||
      !facturaData.numCuentaDeposito ||
      !facturaData.concepto
    ) {
      toast.error("Por favor complete todos los campos requeridos");
      return;
    }

    try {
      // Preparar datos para enviar
      const formData = new FormData();
      formData.append("idCliente", clienteId);
      formData.append("monto", facturaData.monto);
      formData.append("banco", facturaData.banco);
      formData.append("numCuentaDeposito", facturaData.numCuentaDeposito);
      formData.append("concepto", facturaData.concepto);
      formData.append("comentarios", facturaData.comentarios || "");
      // Adjuntar documento si existe
      if (facturaData.docAdjunto) {
        formData.append("docAdjunto", facturaData.docAdjuntoNombre);
      }
      // Enviar datos al servidor
      await facturacionService.create(formData);

      toast.success("Factura registrada correctamente");
      closeFacturaModal();

      // Actualizar el saldo después de registrar la factura
      await cargarDatos();
    } catch (error) {
      console.error("Error al registrar factura:", error);
      toast.error("Error al registrar la factura");
    }
  };
  const [currentGarantia, setCurrentGarantia] = useState(null);
  const [formMode, setFormMode] = useState("create"); // 'create' o 'edit'

  useEffect(() => {
    cargarDatos();
  }, [clienteId]);

  // Función para obtener la suma de garantías validadas
  const obtenerSumaGarantiasValidadas = async (garantias) => {
    return garantias
      .filter((garantia) => garantia.validatedAt && !garantia.revokedAt)
      .reduce(
        (total, garantia) => total + parseFloat(garantia.montoGarantia || 0),
        0
      );
  };

  // Función para obtener la suma de facturas
  const obtenerSumaFacturas = async (clienteId) => {
    try {
      const facturasResponse = await facturacionService.getByCliente(clienteId);
      return facturasResponse.data
        .filter((factura) => factura.validatedAt && !factura.revokedAt)
        .reduce((total, factura) => total + parseFloat(factura.monto || 0), 0);
    } catch (error) {
      console.error("Error al obtener facturas:", error);
      return 0;
    }
  };

  // Función para obtener la suma de reembolsos
  const obtenerSumaReembolsos = async (clienteId) => {
    try {
      const reembolsosResponse = await reembolsoService.getByCliente(clienteId);
      return reembolsosResponse.data
        .filter((reembolso) => reembolso.validatedAt && !reembolso.revokedAt)
        .reduce(
          (total, reembolso) => total + parseFloat(reembolso.monto || 0),
          0
        );
    } catch (error) {
      console.error("Error al obtener reembolsos:", error);
      return 0;
    }
  };

  // Función para calcular el saldo total
  const calcularSaldoTotal = async (garantias, clienteId) => {
    const sumaGarantias = await obtenerSumaGarantiasValidadas(garantias);
    const sumaFacturas = await obtenerSumaFacturas(clienteId);
    const sumaReembolsos = await obtenerSumaReembolsos(clienteId);

    return sumaGarantias - (sumaFacturas + sumaReembolsos);
  };

  const cargarDatos = async () => {
    setIsLoading(true);
    try {
      // Cargar datos del cliente
      const clienteResponse = await clienteService.getById(clienteId);
      setCliente(clienteResponse.data);

      // Cargar garantías del cliente usando el nuevo endpoint
      const garantiasResponse = await garantiaService.getByCliente(clienteId);
      setGarantias(garantiasResponse.data);

      // Calcular el saldo total y actualizar el cliente
      const saldoTotal = await calcularSaldoTotal(
        garantiasResponse.data,
        clienteId
      );

      // Actualizar el cliente con el nuevo saldo
      const clienteActualizado = {
        ...clienteResponse.data,
        saldoTotalDolar: saldoTotal,
      };
      setCliente(clienteActualizado);

      // Actualizar el saldo en el servidor
      await clienteService.update(clienteId, { saldoTotalDolar: saldoTotal });
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
    if (name === "montoPuja") {
      if (updatedData.porcentaje) {
        const montoPuja = parseFloat(value) || 0;
        const porcentaje = parseFloat(updatedData.porcentaje) || 0;
        updatedData.montoGarantia = ((montoPuja * porcentaje) / 100).toFixed(2);
      }
    } else if (name === "porcentaje") {
      if (updatedData.montoPuja) {
        const montoPuja = parseFloat(updatedData.montoPuja) || 0;
        const porcentaje = parseFloat(value) || 0;
        updatedData.montoGarantia = ((montoPuja * porcentaje) / 100).toFixed(2);
      }
    } else if (name === "montoGarantia") {
      if (updatedData.montoPuja) {
        const montoPuja = parseFloat(updatedData.montoPuja) || 0;
        const montoGarantia = parseFloat(value) || 0;
        if (montoPuja > 0) {
          updatedData.porcentaje = ((montoGarantia / montoPuja) * 100).toFixed(
            2
          );
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
      fechaSubasta:
        garantia.fechaSubasta || new Date().toISOString().split("T")[0],
      fechaExpiracion:
        garantia.fechaExpiracion || new Date().toISOString().split("T")[0],
      montoPuja: garantia.montoPuja || "",
      porcentaje: garantia.porcentaje || "",
      montoGarantia: garantia.montoGarantia || garantia.monto || "",
      concepto: garantia.concepto || "",
    });
    setShowModal(true);
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

        // Recargar datos y actualizar el saldo
        await cargarDatos();
      } else if (confirmAction === "invalidar") {
        await garantiaService.invalidate(garantiaToAction.id);
        toast.success("Garantía invalidada correctamente");

        // Recargar datos y actualizar el saldo
        await cargarDatos();
      } else if (confirmAction === "eliminar") {
        // Eliminar la garantía usando el servicio
        // En un entorno real, esto sería:
        await garantiaService.delete(garantiaToAction.id);
        // Recargar datos y actualizar el saldo
        await cargarDatos();
        toast.success("Garantía eliminada correctamente");
      }
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

  const openReembolsoModal = () => {
    setReembolsoData({
      monto: "",
      banco: "",
      numCuentaDeposito: "",
      docAdjunto: null,
      docAdjuntoNombre: "",
      comentarios: "",
    });
    setShowReembolsoModal(true);
  };

  const closeReembolsoModal = () => {
    setShowReembolsoModal(false);
    setReembolsoData({
      monto: "",
      banco: "",
      numCuentaDeposito: "",
      docAdjunto: null,
      docAdjuntoNombre: "",
      comentarios: "",
    });
  };

  const handleReembolsoInputChange = (e) => {
    const { name, value } = e.target;
    setReembolsoData({
      ...reembolsoData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReembolsoData({
        ...reembolsoData,
        docAdjunto: file,
        docAdjuntoNombre: file.name,
      });
    }
  };

  const handleReembolsoSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("idCliente", clienteId);
      formData.append("monto", reembolsoData.monto);
      formData.append("banco", reembolsoData.banco);
      formData.append("numCuentaDeposito", reembolsoData.numCuentaDeposito);
      formData.append("comentarios", reembolsoData.comentarios || "");

      if (reembolsoData.docAdjunto) {
        formData.append("docAdjunto", reembolsoData.docAdjuntoNombre);
      }

      await reembolsoService.create(formData);
      toast.success("Reembolso registrado correctamente");
      closeReembolsoModal();

      // Actualizar el saldo después de registrar el reembolso
      await cargarDatos();
    } catch (error) {
      console.error("Error al registrar reembolso:", error);
      toast.error(MENSAJES.ERROR_SERVIDOR);
    }
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
                onClick={openReembolsoModal}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md flex items-center gap-1 text-sm"
              >
                <RefreshCw size={16} />
                Reembolso
              </button>
              <button
                onClick={() => setShowFacturaModal(true)}
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

                      {/* Modal de Facturación */}
                      {showFacturaModal && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                          <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
                            <h2 className="text-xl font-bold mb-4">
                              Registrar Factura
                            </h2>
                            <form
                              onSubmit={handleFacturaSubmit}
                              className="space-y-4"
                            >
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Monto *
                                </label>
                                <input
                                  type="number"
                                  name="monto"
                                  value={facturaData.monto}
                                  onChange={handleFacturaInputChange}
                                  required
                                  min="0"
                                  step="0.01"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Banco *
                                </label>
                                <input
                                  type="text"
                                  name="banco"
                                  value={facturaData.banco}
                                  onChange={handleFacturaInputChange}
                                  required
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Número de Cuenta *
                                </label>
                                <input
                                  type="text"
                                  name="numCuentaDeposito"
                                  value={facturaData.numCuentaDeposito}
                                  onChange={handleFacturaInputChange}
                                  required
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Concepto *
                                </label>
                                <select
                                  name="concepto"
                                  value={facturaData.concepto}
                                  onChange={handleFacturaInputChange}
                                  required
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
                                >
                                  <option value="">
                                    Seleccione un concepto
                                  </option>
                                  <option value="Ganador">Ganador</option>
                                  <option value="Penalidad">Penalidad</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Documento Adjunto
                                </label>
                                <div className="flex items-center space-x-2">
                                  <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-md flex items-center">
                                    <Upload size={16} className="mr-2" />
                                    <span>Subir archivo</span>
                                    <input
                                      type="file"
                                      onChange={handleFacturaFileChange}
                                      className="hidden"
                                    />
                                  </label>
                                  {facturaData.docAdjuntoNombre && (
                                    <span className="text-sm text-gray-600">
                                      {facturaData.docAdjuntoNombre}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Comentarios
                                </label>
                                <textarea
                                  name="comentarios"
                                  value={facturaData.comentarios}
                                  onChange={handleFacturaInputChange}
                                  rows="3"
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
                                ></textarea>
                              </div>

                              <div className="flex justify-end space-x-3 pt-4">
                                <button
                                  type="button"
                                  onClick={closeFacturaModal}
                                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                                >
                                  Cancelar
                                </button>
                                <button
                                  type="submit"
                                  className="px-4 py-2 bg-bob-primary hover:bg-bob-primary-dark text-white rounded-md"
                                >
                                  Registrar Factura
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
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
                              onClick={() =>
                                enviarMensajeWhatsApp(cliente, garantia.id)
                              }
                              className="text-green-600 hover:text-green-900 flex items-center gap-1"
                              title="Enviar mensaje de WhatsApp"
                            >
                              <MessageCircle size={16} />
                            </button>
                            <button
                              onClick={() =>
                                mostrarConfirmacion("eliminar", garantia)
                              }
                              className="text-red-600 hover:text-red-900 flex items-center gap-1"
                              title="Eliminar Garantía"
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      {garantia.docAdjunto &&
                        !garantia.validatedAt &&
                        !garantia.invalidatedAt &&
                        !garantia.revokedAt && (
                          <>
                            <button
                              onClick={() =>
                                window.open(garantia.docAdjunto, "_blank")
                              }
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
                      {garantia.validatedAt &&
                        !garantia.invalidatedAt &&
                        !garantia.revokedAt && (
                          <>
                            <button
                              onClick={() =>
                                window.open(garantia.docAdjunto, "_blank")
                              }
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
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
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
              {confirmAction === "validar"
                ? "Validar Garantía"
                : "Invalidar Garantía"}
            </h2>
            <p className="mb-6">
              ¿Está seguro que desea {confirmAction} la garantía
              {garantiaToAction &&
                ` por un monto de ${formatCurrency(
                  garantiaToAction.montoGarantia || garantiaToAction.monto
                )}`}
              ?
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

      {/* Modal de reembolso */}
      {showReembolsoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Registrar Reembolso</h2>
            <form onSubmit={handleReembolsoSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Monto *
                </label>
                <input
                  type="number"
                  name="monto"
                  value={reembolsoData.monto}
                  onChange={handleReembolsoInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Banco *
                </label>
                <input
                  type="text"
                  name="banco"
                  value={reembolsoData.banco}
                  onChange={handleReembolsoInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Cuenta *
                </label>
                <input
                  type="text"
                  name="numCuentaDeposito"
                  value={reembolsoData.numCuentaDeposito}
                  onChange={handleReembolsoInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Documento de Respaldo
                </label>
                <div className="flex items-center">
                  <input
                    type="file"
                    id="docAdjunto"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <label
                    htmlFor="docAdjunto"
                    className="cursor-pointer bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-md flex items-center gap-1 text-sm"
                  >
                    <Upload size={16} />
                    Subir documento
                  </label>
                  {reembolsoData.docAdjuntoNombre && (
                    <span className="ml-2 text-sm text-gray-600">
                      {reembolsoData.docAdjuntoNombre}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comentarios
                </label>
                <textarea
                  name="comentarios"
                  value={reembolsoData.comentarios}
                  onChange={handleReembolsoInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeReembolsoModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bob-primary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Registrar Reembolso
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
