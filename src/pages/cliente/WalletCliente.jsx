import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { Eye, FileCheck } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";
import facturacionService from "../../services/facturacionService";

export default function WalletCliente() {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [facturas, setFacturas] = useState([]);
  const [filters, setFilters] = useState({ estado: '', fecha_desde: '', fecha_hasta: '' });

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
                              onClick={() => alert(`Ver detalles de factura: ${factura.id}`)}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Ver detalles"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => alert(`Ver documento adjunto de factura: ${factura.id}`)}
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
    </div>
  );
}