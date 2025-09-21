import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { walletService } from "../../services/walletService";
import { toast } from "react-toastify";
import { Wallet } from "lucide-react";
import { formatCurrency } from "../../utils/formatters";

export default function WalletCliente() {
  const { currentUser } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [facturas, setFacturas] = useState([]);
  const [filters, setFilters] = useState({ estado: '', fecha_desde: '', fecha_hasta: '' });

  useEffect(() => {
    cargarWallet();
    cargarFacturas();
  }, [currentUser, filters]);

  const cargarWallet = async () => {
    try {
      const response = await walletService.getWalletByUserId(currentUser.id);
      setWallet(response.data);
    } catch (error) {
      console.error('Error al cargar wallet:', error);
      toast.error("Error al cargar la información de la wallet");
    }
  };

  const cargarFacturas = async () => {
    setIsLoading(true);
    try {
      // Simular carga de facturas - en un entorno real esto vendría de un servicio
      const facturasSimuladas = [
        {
          id: 'FAC-001',
          numero: '2025-001',
          fecha: '2025-01-15',
          monto: 1500000,
          estado: 'PENDIENTE',
          tipo: 'GARANTIA',
          descripcion: 'Depósito de garantía - Subasta 001'
        },
        {
          id: 'FAC-002', 
          numero: '2025-002',
          fecha: '2025-01-10',
          monto: 2000000,
          estado: 'VALIDADO',
          tipo: 'GARANTIA',
          descripcion: 'Depósito de garantía - Subasta 002'
        },
        {
          id: 'FAC-003',
          numero: '2025-003', 
          fecha: '2025-01-05',
          monto: 800000,
          estado: 'PROCESADO',
          tipo: 'REEMBOLSO',
          descripcion: 'Reembolso de garantía'
        }
      ];
      
      // Aplicar filtros
      let facturasFiltradas = facturasSimuladas;
      
      if (filters.estado) {
        facturasFiltradas = facturasFiltradas.filter(f => f.estado === filters.estado);
      }
      
      if (filters.fecha_desde) {
        facturasFiltradas = facturasFiltradas.filter(f => new Date(f.fecha) >= new Date(filters.fecha_desde));
      }
      
      if (filters.fecha_hasta) {
        facturasFiltradas = facturasFiltradas.filter(f => new Date(f.fecha) <= new Date(filters.fecha_hasta));
      }
      
      setFacturas(facturasFiltradas);
    } catch (error) {
      console.error('Error al cargar facturas:', error);
      toast.error("Error al cargar las facturas");
    } finally {
      setIsLoading(false);
    }
  };


  const getEstadoClass = (estado) => {
    switch (estado) {
      case 'PENDIENTE':
        return 'bg-yellow-100 text-yellow-800';
      case 'VALIDADO':
        return 'bg-green-100 text-green-800';
      case 'RECHAZADO':
        return 'bg-red-100 text-red-800';
      case 'PROCESADO':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEstadoLabel = (estado) => {
    switch (estado) {
      case 'PENDIENTE':
        return 'Pendiente';
      case 'VALIDADO':
        return 'Validado';
      case 'RECHAZADO':
        return 'Rechazado';
      case 'PROCESADO':
        return 'Procesado';
      default:
        return estado;
    }
  };

  const getTipoLabel = (tipo) => {
    switch (tipo) {
      case 'GARANTIA':
        return 'Garantía';
      case 'REEMBOLSO':
        return 'Reembolso';
      case 'PENALIDAD':
        return 'Penalidad';
      default:
        return tipo;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mi Wallet</h1>
        <div className="text-sm text-gray-600">
          Mis Facturas
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">Cargando información de wallet...</div>
      ) : (
        <>
          {/* SALDO del Cliente */}
          <div className="bg-blue-600 rounded-lg p-6 mb-6 shadow-lg">
            <div className="flex items-center">
              <div className="flex items-center">
                <Wallet className="h-6 w-6 text-white mr-3" />
                <div>
                  <h2 className="text-white font-bold text-lg">Saldo del Cliente</h2>
                  <p className="text-blue-100 text-sm">Saldo Total</p>
                  <p className="text-white text-3xl font-bold">
                    {formatCurrency(currentUser.saldoTotalDolar || currentUser.saldo || 0, 'USD')}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Filtros */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Filtros</h2>
            <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select 
                  value={filters.estado} 
                  onChange={e => setFilters(f => ({ ...f, estado: e.target.value }))} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-bob-primary focus:border-bob-primary"
                >
                  <option value="">Todos</option>
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="VALIDADO">Validado</option>
                  <option value="RECHAZADO">Rechazado</option>
                  <option value="PROCESADO">Procesado</option>
                </select>
              </div>
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
            </form>
          </div>

          {/* Tabla de facturas */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Mis Facturas</h2>
              <p className="text-sm text-gray-600">Lista de todas tus facturas y transacciones</p>
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
                        NÚMERO
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        TIPO
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        MONTO
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        DESCRIPCIÓN
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ESTADO
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        FECHA
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {facturas.map((factura) => (
                      <tr key={factura.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {factura.numero}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getTipoLabel(factura.tipo)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(factura.monto, 'CLP')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {factura.descripcion}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoClass(factura.estado)}`}>
                            {getEstadoLabel(factura.estado)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(factura.fecha).toLocaleDateString('es-CL')}
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