import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { garantiaService } from "../../services/garantiaService";
import {
  formatCurrency,
  formatDate,
  getStatusColor,
} from "../../utils/formatters";
import {
  ArrowUpCircle,
  ArrowDownCircle,
  Clock,
  CheckCircle,
  XCircle,
  Wallet,
  Shield,
  FileText,
} from "lucide-react";
import { GARANTIA_ESTADOS } from "../../utils/constants";
import { toast } from "react-toastify";

export default function MovimientosCliente() {
  const { currentUser } = useAuth();
  const [garantias, setGarantias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGarantia, setSelectedGarantia] = useState(null);
  const [formData, setFormData] = useState({
    banco: "",
    numCuentaDeposito: "",
    docAdjunto: null,
    dtFacRuc: "",
    dtFacRazonSocial: "",
  });
  const [filters, setFilters] = useState({
    fecha_desde: "", // Inicializar como string vacío para evitar problemas con fechas inválidas
    fecha_hasta: "", // Inicializar como string vacío para evitar problemas con fechas inválidas
    estado: "", // Filtro de estado: pendiente, validada, rechazada, revocada
  });
  
  // Inicializar fechas después de montar el componente
  useEffect(() => {
    const unMesAtras = new Date();
    unMesAtras.setMonth(unMesAtras.getMonth() - 1);
    
    setFilters({
      fecha_desde: unMesAtras.toISOString().split("T")[0],
      fecha_hasta: new Date().toISOString().split("T")[0],
      estado: ""
    });
  }, []);

  useEffect(() => {
    cargarGarantias();
  }, [currentUser]);

  const handleOpenModal = (garantia) => {
    setSelectedGarantia(garantia);
    setFormData({
      banco: garantia.banco || "",
      numCuentaDeposito: garantia.numCuentaDeposito || "",
      docAdjunto: null,
      dtFacRuc: garantia.dtFacRuc || "",
      dtFacRazonSocial: garantia.dtFacRazonSocial || "",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGarantia(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === "application/pdf" || file.type.startsWith("image/")) {
        setFormData((prev) => ({
          ...prev,
          docAdjunto: file,
          docAdjuntoNombre: file.name, // Guardamos el nombre del archivo
        }));
      } else {
        toast.error("Solo se permiten archivos PDF o imágenes");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedGarantia) return;

    try {
      setIsLoading(true);

      // Si hay un archivo adjunto, crear un nombre único y ofrecer descargarlo
      if (formData.docAdjunto) {
        try {
          // Crear un nombre único para el archivo
          const fileExtension = formData.docAdjunto.name.split('.').pop();
          const fileName = `${Date.now()}_${selectedGarantia.id}.${fileExtension}`;
          
          
          
          // Crear un Blob con el contenido del archivo
          const blob = new Blob([await formData.docAdjunto.arrayBuffer()]);
          
          // Crear un enlace de descarga
          const downloadLink = document.createElement('a');
          downloadLink.href = URL.createObjectURL(blob);
          downloadLink.download = fileName;

          // Guardar solo el nombre del archivo en el formData
          formData.docAdjuntoNombre = downloadLink.href;

        } catch (error) {
          console.error("Error al procesar el archivo:", error);
          toast.error("Error al procesar el archivo");
          setIsLoading(false);
          return;
        }
      }

      // Crear FormData para enviar los datos
      const formDataToSend = new FormData();
      formDataToSend.append("banco", formData.banco);
      formDataToSend.append("numCuentaDeposito", formData.numCuentaDeposito);
      formDataToSend.append("dtFacRuc", formData.dtFacRuc);
      formDataToSend.append("dtFacRazonSocial", formData.dtFacRazonSocial);

      // Enviar solo el nombre del archivo, no el archivo completo
      if (formData.docAdjuntoNombre) {
        formDataToSend.append("docAdjunto", formData.docAdjuntoNombre);
      }

      // Llamar al servicio para actualizar la garantía
      const response = await garantiaService.getSentByCliente(
        selectedGarantia.id,
        formDataToSend
      );

      if (response.success) {
        toast.success("Datos de garantía actualizados correctamente");
        handleCloseModal();
        cargarGarantias(); // Recargar las garantías
      } else {
        toast.error("Error al actualizar los datos de la garantía");
      }
    } catch (error) {
      console.error("Error al actualizar garantía:", error);
      toast.error("Error al actualizar los datos de la garantía");
    } finally {
      setIsLoading(false);
    }
  };

  const cargarGarantias = async () => {
    setIsLoading(true);
    try {
      if (currentUser && currentUser.id) {
        const response = await garantiaService.getByCliente(currentUser.id);
        let garantiasFiltradas = response.data;
        
        console.log('Total garantías obtenidas:', garantiasFiltradas.length);
        console.log('Filtros aplicados:', filters);

        // Aplicar filtros
        if (filters.estado) {
          garantiasFiltradas = garantiasFiltradas.filter((garantia) => {
            if (filters.estado === "pendiente") {
              return (
                !garantia.validatedAt &&
                !garantia.invalidatedAt &&
                !garantia.revokedAt
              );
            } else if (filters.estado === "validada") {
              return garantia.validatedAt;
            } else if (filters.estado === "rechazada") {
              return garantia.invalidatedAt;
            } else if (filters.estado === "revocada") {
              return garantia.revokedAt;
            }
            return true;
          });
          console.log('Después de filtrar por estado:', garantiasFiltradas.length);
        }

        // Filtrar por fecha solo si ambas fechas están definidas
         if (filters.fecha_desde && filters.fecha_hasta) {
           try {
             console.log('Filtrando por fechas:', filters.fecha_desde, 'hasta', filters.fecha_hasta);
             
             // Convertir strings a objetos Date
             const fechaDesde = new Date(filters.fecha_desde + 'T00:00:00');
             const fechaHasta = new Date(filters.fecha_hasta + 'T23:59:59');
             
             console.log('Fechas convertidas:', fechaDesde, fechaHasta);
             
             // Verificar si las fechas son válidas
             if (!isNaN(fechaDesde.getTime()) && !isNaN(fechaHasta.getTime())) {
               garantiasFiltradas = garantiasFiltradas.filter(garantia => {
                 if (!garantia.createdAt) return false;
                 
                 const fechaCreacion = new Date(garantia.createdAt);
                 const resultado = fechaCreacion >= fechaDesde && fechaCreacion <= fechaHasta;
                 
                 console.log(
                   'Garantía:', garantia.id,
                   'Fecha creación:', fechaCreacion,
                   'Dentro del rango:', resultado
                 );
                 
                 return resultado;
               });
               
               console.log('Después de filtrar por fecha:', garantiasFiltradas.length);
             } else {
               console.error('Fechas inválidas:', { fechaDesde, fechaHasta });
               toast.error('Las fechas seleccionadas no son válidas');
             }
           } catch (error) {
             console.error('Error al filtrar por fechas:', error);
             toast.error('Error al procesar las fechas');
           }
         } else {
           console.log('No se aplicó filtro de fechas porque faltan valores');
         }

        setGarantias(garantiasFiltradas);
      }
    } catch (error) {
      console.error("Error al cargar garantías:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getGarantiaIcon = (estado) => {
    if (estado === GARANTIA_ESTADOS.PENDIENTE) return Clock;
    if (estado === GARANTIA_ESTADOS.RECHAZADA) return XCircle;
    if (estado === GARANTIA_ESTADOS.VALIDADA) return CheckCircle;
    if (estado === GARANTIA_ESTADOS.REVOCADA) return ArrowUpCircle;
    return Shield;
  };

  const renderEstadoGarantia = (garantia) => {
    let displayText = "";
    let badgeClass = "";

    if (garantia.validatedAt) {
      displayText = "Validada";
      badgeClass = "bg-green-100 text-green-800";
    } else if(garantia.docAdjunto){
      displayText = "Pendiente de Validación";
      badgeClass = "bg-blue-100 text-blue-800";
    }
    else if (garantia.invalidatedAt) {
      displayText = "Rechazada";
      badgeClass = "bg-red-100 text-red-800";
    } else if (garantia.revokedAt) {
      displayText = "Revocada";
      badgeClass = "bg-orange-100 text-orange-800";
    } else {
      displayText = "Pendiente";
      badgeClass = "bg-yellow-100 text-yellow-800";
    }

    return (
      <span
        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badgeClass}`}
      >
        {displayText}
      </span>
    );
  };

  if (isLoading) {
    return <div className="p-6 text-center">Cargando garantías...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Mis Garantías</h1>
      </div>

      {/* SALDO del Cliente */}
      <div className="bg-blue-600 rounded-lg p-6 mb-6 shadow-lg">
        <div className="flex items-center">
          <div className="flex items-center">
            <Wallet className="h-6 w-6 text-white mr-3" />
            <div>
              <h2 className="text-white font-bold text-lg">Mi Saldo</h2>
              <p className="text-blue-100 text-sm">Saldo Total</p>
              <p className="text-white text-3xl font-bold">
                {formatCurrency(
                  currentUser.saldoTotalDolar || currentUser.saldo || 0,
                  "USD"
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Filtros</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              value={filters.estado}
              onChange={(e) =>
                setFilters((f) => ({ ...f, estado: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
            >
              <option value="">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="validada">Validada</option>
              <option value="rechazada">Rechazada</option>
              <option value="revocada">Revocada</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Desde
            </label>
            <input
              type="date"
              value={filters.fecha_desde}
              onChange={(e) =>
                setFilters((f) => ({ ...f, fecha_desde: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hasta
            </label>
            <input
              type="date"
              value={filters.fecha_hasta}
              onChange={(e) =>
                setFilters((f) => ({ ...f, fecha_hasta: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={cargarGarantias}
            className="px-4 py-2 bg-bob-primary text-white rounded-md hover:bg-bob-primary-dark focus:outline-none focus:ring-2 focus:ring-bob-primary focus:ring-opacity-50"
          >
            Filtrar
          </button>
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
                  TÍTULO DE SUBASTA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  FECHA CREACIÓN
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  TOTAL GARANTÍA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ESTADO
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ACCIONES
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {garantias.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No hay garantías para mostrar
                  </td>
                </tr>
              ) : (
                garantias.map((garantia) => {
                  const Icon = getGarantiaIcon(garantia.estado);
                  return (
                    <tr key={garantia.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {garantia.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {garantia.subasta.titulo || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(garantia.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        {formatCurrency(
                          garantia.montoGarantia || garantia.monto
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {renderEstadoGarantia(garantia)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        
                        {!garantia.docAdjunto && (
                          <button
                            onClick={() => handleOpenModal(garantia)}
                            className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md text-xs flex items-center"
                          >
                            <FileText size={14} className="mr-1" />
                            Completar datos
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para completar datos de garantía */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6">
              Completar datos de garantía
            </h2>
            <form
              onSubmit={handleSubmit}
              className="max-h-[70vh] overflow-y-auto pr-2"
            >
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Banco
                  </label>
                  <input
                    type="text"
                    name="banco"
                    value={formData.banco}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Cuenta de Depósito
                  </label>
                  <input
                    type="text"
                    name="numCuentaDeposito"
                    value={formData.numCuentaDeposito}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Documento Adjunto (PDF o Imagen)
                  </label>
                  <input
                    type="file"
                    accept="application/pdf,image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
                    required={
                      !formData.docAdjunto && !selectedGarantia?.docAdjunto
                    }
                  />
                  {formData.docAdjunto && (
                    <p className="mt-1 text-sm text-green-600">
                      Archivo seleccionado: {formData.docAdjunto.name}
                    </p>
                  )}
                  {!formData.docAdjunto && selectedGarantia?.docAdjunto && (
                    <p className="mt-1 text-sm text-gray-600">
                      Archivo actual: {selectedGarantia.docAdjunto}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    RUC para Facturación
                  </label>
                  <input
                    type="text"
                    name="dtFacRuc"
                    value={formData.dtFacRuc}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Razón Social para Facturación
                  </label>
                  <input
                    type="text"
                    name="dtFacRazonSocial"
                    value={formData.dtFacRazonSocial}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bob-primary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    "Guardar"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
