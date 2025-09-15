import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { walletService } from "../../services/walletService";
import WalletCard from "../../components/cliente/WalletCard";
import MovimientosList from "../../components/cliente/MovimientosList";
import { formatCurrency } from "../../utils/formatters";
import { TrendingUp, Award, RefreshCw, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DashboardCliente = () => {
  const { currentUser } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadUserData();
    // eslint-disable-next-line
  }, [currentUser]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [walletRes, transactionsRes] = await Promise.all([
        walletService.getWalletByUserId(currentUser.id),
        walletService.getTransactionsByUserId(currentUser.id),
      ]);

      setWallet(walletRes.data);
      setTransactions(transactionsRes.data);
    } catch (err) {
      setError("Error al cargar los datos del usuario");
    } finally {
      setLoading(false);
    }
  };

  const getStats = () => {
    const subastasGanadas = transactions.filter(
      (t) => t.tipo === "GARANTIA" && t.estado === "VALIDADO"
    ).length;
    const totalDepositado = transactions
      .filter((t) => t.tipo === "GARANTIA" && t.estado === "VALIDADO")
      .reduce((sum, t) => sum + t.monto, 0);
    const reembolsosPendientes = transactions.filter(
      (t) => t.tipo === "REEMBOLSO" && t.estado === "PENDIENTE"
    ).length;

    return { subastasGanadas, totalDepositado, reembolsosPendientes };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 mb-2">⚠️ Error</div>
        <p className="text-red-700">{error}</p>
        <button
          onClick={loadUserData}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Hola, {currentUser.nombre}
          </h1>
          <p className="text-gray-600 mt-1">
            Bienvenido a tu panel de control de BOB Subastas
          </p>
        </div>
        <div className="text-sm text-gray-500 bg-white px-3 py-2 rounded-lg border">
          <Clock size={16} className="inline mr-1" />
          Actualizado: {new Date().toLocaleString("es-CL")}
        </div>
      </div>

      {/* Wallet Card */}
      {wallet && <WalletCard wallet={wallet} />}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Subastas Ganadas
              </h3>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {stats.subastasGanadas}
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Award className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Garantía Depositada
              </h3>
              <p className="text-3xl font-bold text-green-600 mt-2">
                {formatCurrency(stats.totalDepositado, "USD")}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Reembolsos Pendientes
              </h3>
              <p className="text-3xl font-bold text-yellow-600 mt-2">
                {stats.reembolsosPendientes}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <RefreshCw className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Movimientos Recientes */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Movimientos Recientes
            </h2>
            <button
              type="button"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              onClick={() => navigate("/cliente/movimientos")}
            >
              Ver todos →
            </button>
          </div>
        </div>
        <div className="p-6">
          <MovimientosList transactions={transactions.slice(0, 5)} />
        </div>
      </div>

      {/* Acciones Rápidas */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200 mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Acciones Rápidas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            type="button"
            className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-left"
            onClick={() => navigate("/cliente/wallet")}
          >
            <div className="text-blue-600 font-medium">Depositar Garantía</div>
            <div className="text-sm text-gray-600 mt-1">
              Registra tu depósito de garantía
            </div>
          </button>
          <button
            type="button"
            className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-left"
            onClick={() => navigate("/cliente/movimientos")}
          >
            <div className="text-blue-600 font-medium">Ver Movimientos</div>
            <div className="text-sm text-gray-600 mt-1">
              Consulta tu historial financiero
            </div>
          </button>
          <button
            type="button"
            className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all text-left"
            onClick={() => navigate("/cliente/reembolsos")}
          >
            <div className="text-blue-600 font-medium">Solicitar Reembolso</div>
            <div className="text-sm text-gray-600 mt-1">
              Solicita devolución de garantía
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardCliente;