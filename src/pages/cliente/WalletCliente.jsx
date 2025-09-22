import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { Eye, FileCheck, Upload } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";
import facturacionService from "../../services/facturacionService";
import clienteService from "../../services/clienteService";

export default function WalletCliente() {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [facturas, setFacturas] = useState([]);
  const [filters, setFilters] = useState({ estado: '', fecha_desde: '', fecha_hasta: '' });
  const [showModal, setShowModal] = useState(false);
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [clienteData, setClienteData] = useState(null);

  useEffect(() => {
    cargarFacturas();
  }, [currentUser]);



  const cargarFacturas = async () => {
    setIsLoading(true);
    try {
      const response = await facturacionService.getByCliente(currentUser.id);
      if (response.data.length === 0) {
        toast.info("No tienes facturas disponibles");
      }

      // Filtrar la data por fechas de creación
      const filteredFacturas = response.data.filter(factura => {
        const facturaDate = new Date(factura.createdAt);
        const desde = filters.fecha_desde ? new Date(filters.fecha_desde) : null;
        const hasta = filters.fecha_hasta ? new Date(filters.fecha_hasta) : null;
        return (!desde || facturaDate >= desde) && (!hasta || facturaDate <= hasta);
      });

      setFacturas(filteredFacturas);
    } catch (error) {
      console.error('Error al cargar facturas:', error);
      toast.error("Error al cargar las facturas");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleVerDetalles = async (factura) => {
    setSelectedFactura(factura);
    setShowModal(true);
    
    try {
      // Obtener datos del cliente usando el ID
      const clienteInfo = await clienteService.getById(factura.idCliente);
      setClienteData(clienteInfo);
    } catch (error) {
      console.error('Error al obtener datos del cliente:', error);
      toast.error("Error al cargar información del cliente");
    }
  };
  
  const closeModal = () => {
    setShowModal(false);
    setSelectedFactura(null);
    setClienteData(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Facturas</h1>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">Cargando información de facturas...</div>
      ) : (
        <>
          {/* Filtros */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Filtros</h2>
            <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
                <input 
                  type="date" 
                  value={filters.fecha_desde} 
                  onChange={e => setFilters(f => ({ ...f, fecha_desde: e.target.value }))} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
                <input 
                  type="date" 
                  value={filters.fecha_hasta} 
                  onChange={e => setFilters(f => ({ ...f, fecha_hasta: e.target.value }))} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => cargarFacturas()}
                  className="w-full px-4 py-2 bg-bob-primary text-white rounded-md hover:bg-bob-primary-dark focus:outline-none focus:ring-2 focus:ring-bob-primary"
                >
                  Filtrar
                </button>
              </div>
            </form>
          </div>

          {/* Tabla de facturas */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Mis Facturas</h2>
              <p className="text-sm text-gray-600">Lista de todas las facturas que Bob me ha realizado</p>
            </div>
            
            {isLoading ? (
              <div className="p-6 text-center">Cargando facturas...</div>
            ) : facturas.length === 0 ? (
              <div className="p-6 text-center text-gray-600">
                No hay facturas para mostrar
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        CLIENTE
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        CONCEPTO
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        MONTO
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ACCIONES
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {facturas.map((factura) => (
                      <tr key={factura.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {factura.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {currentUser.nombreCompleto || "Cliente"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {factura.tipo === 'GARANTIA' ? 'Ganador' : 'Penalidad'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          {formatCurrency(factura.monto, 'USD')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleVerDetalles(factura)}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Ver detalles"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => window.open(factura.docAdjunto, '_blank')}
                              className="text-blue-600 hover:text-blue-900"
                              title="Ver documento"
                            >
                              <FileCheck size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    
      {/* Modal para ver detalles de factura */}
      {showModal && selectedFactura && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={closeModal}>
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Detalles de Factura
              </h2>
              <button 
                type="button" 
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cliente
                  </label>
                  <div className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 text-sm">
                    {clienteData ? clienteData.data.nombreCompleto : 'Cargando...'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Saldo de Cliente
                  </label>
                  <div className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 text-sm">
                    {formatCurrency(clienteData ? clienteData.data.saldoTotalDolar : 0, 'USD')}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Concepto
                  </label>
                  <div className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 text-sm">
                    {selectedFactura.concepto}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Monto (USD)
                  </label>
                  <div className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 text-sm">
                    {formatCurrency(selectedFactura.monto, 'USD')}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Banco
                  </label>
                  <div className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 text-sm">
                    {selectedFactura.banco || 'No especificado'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número de Cuenta
                  </label>
                  <div className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 text-sm">
                    {selectedFactura.numCuentaDeposito || 'No especificado'}
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Comentarios
                  </label>
                  <div className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 text-sm min-h-[60px]">
                    {selectedFactura.comentarios || 'Sin comentarios'}
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-4 sticky bottom-0 bg-white pt-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}