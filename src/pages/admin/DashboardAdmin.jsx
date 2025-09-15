import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { formatCurrency } from "../../utils/formatters";
import { DollarSign, Users, Shield, RefreshCw, Award } from "lucide-react";

Modal.setAppElement("#root");

const fetchAdminStats = async () => ({
  pagosTotales: 120,
  pagosPendientes: 8,
  subastasActivas: 5,
  reembolsosPendientes: 2,
  usuarios: 35,
  totalGarantias: 45000,
  totalReembolsos: 12000,
  historial: [
    { id: 1, tipo: "Pago", usuario: "Carlos Pérez", monto: 1500, estado: "Validado", fecha: "2025-09-10" },
    { id: 2, tipo: "Subasta", usuario: "Lucía Torres", monto: 28000, estado: "Finalizada", fecha: "2025-09-12" },
    { id: 3, tipo: "Reembolso", usuario: "Ana Rodriguez", monto: 800, estado: "Pendiente", fecha: "2025-09-13" },
  ]
});

export default function DashboardAdmin() {
  const [stats, setStats] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [detalle, setDetalle] = useState(null);

  useEffect(() => {
    fetchAdminStats().then(setStats);
  }, []);

  const openModal = (item) => {
    setDetalle(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setDetalle(null);
  };

  if (!stats) return <div className="text-bob-primary">Cargando...</div>;

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-bob-primary mb-6">Dashboard Admin</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-bob-primary text-white rounded-lg p-6 shadow flex items-center gap-4">
          <DollarSign size={32} />
          <div>
            <div className="text-lg">Garantías Totales</div>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalGarantias, 'USD')}</div>
          </div>
        </div>
        <div className="bg-bob-warning text-white rounded-lg p-6 shadow flex items-center gap-4">
          <RefreshCw size={32} />
          <div>
            <div className="text-lg">Reembolsos Totales</div>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalReembolsos, 'USD')}</div>
          </div>
        </div>
        <div className="bg-bob-secondary text-white rounded-lg p-6 shadow flex items-center gap-4">
          <Award size={32} />
          <div>
            <div className="text-lg">Subastas Activas</div>
            <div className="text-2xl font-bold">{stats.subastasActivas}</div>
          </div>
        </div>
        <div className="bg-bob-primary-dark text-white rounded-lg p-6 shadow flex items-center gap-4 col-span-1 md:col-span-2">
          <Users size={32} />
          <div>
            <div className="text-lg">Usuarios Registrados</div>
            <div className="text-2xl font-bold">{stats.usuarios}</div>
          </div>
        </div>
        <div className="bg-bob-danger text-white rounded-lg p-6 shadow flex items-center gap-4">
          <Shield size={32} />
          <div>
            <div className="text-lg">Pagos Pendientes</div>
            <div className="text-2xl font-bold">{stats.pagosPendientes}</div>
          </div>
        </div>
      </div>
      <h3 className="text-xl font-semibold text-bob-primary mb-4">Historial Reciente</h3>
      <table className="min-w-full bg-white rounded-lg shadow">
        <thead>
          <tr className="bg-bob-primary text-white">
            <th className="py-2 px-4 text-left">Tipo</th>
            <th className="py-2 px-4 text-left">Usuario</th>
            <th className="py-2 px-4 text-left">Monto (USD)</th>
            <th className="py-2 px-4 text-left">Estado</th>
            <th className="py-2 px-4 text-left">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {stats.historial.map((item) => (
            <tr key={item.id} className="border-b cursor-pointer hover:bg-blue-50 transition"
              onClick={() => openModal(item)}>
              <td className="py-2 px-4">{item.tipo}</td>
              <td className="py-2 px-4">{item.usuario}</td>
              <td className="py-2 px-4">{formatCurrency(item.monto, 'USD')}</td>
              <td className="py-2 px-4">{item.estado}</td>
              <td className="py-2 px-4">{item.fecha}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        className="bg-white rounded-lg p-8 max-w-md mx-auto mt-24 shadow-lg outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center"
      >
        {detalle && (
          <div>
            <h2 className="text-xl font-bold mb-4 text-bob-primary">Detalle</h2>
            <div className="space-y-2">
              <div><strong>Tipo:</strong> {detalle.tipo}</div>
              <div><strong>Usuario:</strong> {detalle.usuario}</div>
              <div><strong>Monto:</strong> {formatCurrency(detalle.monto, 'USD')}</div>
              <div><strong>Estado:</strong> {detalle.estado}</div>
              <div><strong>Fecha:</strong> {detalle.fecha}</div>
            </div>
            <button
              className="mt-6 bg-bob-primary text-white px-4 py-2 rounded"
              onClick={closeModal}
            >
              Cerrar
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}