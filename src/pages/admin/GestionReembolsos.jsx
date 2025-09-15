
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";


// Simulación de llamada a backend
const fetchReembolsos = async () => [
  {
    id: 201,
    usuario: "Carlos Pérez",
    monto: 800,
    motivo: "Garantía no adjudicada",
    fecha: "2025-09-13",
    estado: "Pendiente",
  },
  {
    id: 202,
    usuario: "Lucía Torres",
    monto: 1200,
    motivo: "Subasta cancelada",
    fecha: "2025-09-10",
    estado: "Aprobado",
  },
];

export default function GestionReembolsos() {
  const [reembolsos, setReembolsos] = useState([]);

  useEffect(() => {
    fetchReembolsos().then(setReembolsos);
  }, []);

  // Acción para aprobar reembolso
  const handleAprobar = (id) => {
    setReembolsos((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, estado: "Aprobado" } : r
      )
    );
  };

  // Acción para ver detalle (puedes reemplazar alert por modal en producción)
  const handleVerDetalle = (r) => {
    alert(
      `Detalle de reembolso:\nUsuario: ${r.usuario}\nMonto: S/ ${r.monto}\nMotivo: ${r.motivo}\nFecha: ${r.fecha}\nEstado: ${r.estado}`
    );
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-bob-primary mb-6">Gestión de Reembolsos</h2>
      <table className="min-w-full bg-white rounded-lg shadow">
        <thead>
          <tr className="bg-bob-primary text-white">
            <th className="py-2 px-4 text-left">Usuario</th>
            <th className="py-2 px-4 text-left">Monto</th>
            <th className="py-2 px-4 text-left">Motivo</th>
            <th className="py-2 px-4 text-left">Fecha</th>
            <th className="py-2 px-4 text-left">Estado</th>
            <th className="py-2 px-4 text-left">Acción</th>
          </tr>
        </thead>
        <tbody>
          {reembolsos.map((r) => (
            <tr
              key={r.id}
              className="border-b cursor-pointer hover:bg-blue-50 transition"
              onClick={() => handleVerDetalle(r)}
            >
              <td className="py-2 px-4">{r.usuario}</td>
              <td className="py-2 px-4">S/ {r.monto.toLocaleString("es-CL")}</td>
              <td className="py-2 px-4">{r.motivo}</td>
              <td className="py-2 px-4">{r.fecha}</td>
              <td className="py-2 px-4">
                <span
                  className={`px-2 py-1 rounded text-white ${
                    r.estado === "Pendiente"
                      ? "bg-bob-warning"
                      : "bg-bob-secondary"
                  }`}
                >
                  {r.estado}
                </span>
              </td>
              <td className="py-2 px-4">
                {r.estado === "Pendiente" ? (
                  <button
                    className="bg-bob-secondary hover:bg-bob-primary text-white px-4 py-1 rounded transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAprobar(r.id);
                    }}
                  >
                    Aprobar
                  </button>
                ) : (
                  <span className="text-bob-primary font-semibold">Procesado</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const handleAprobar = (id) => {
  if (window.confirm('¿Confirmar aprobación de reembolso?')) {
    setReembolsos((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, estado: "Aprobado" } : r
      )
    );
    toast.success("Reembolso aprobado");
  }
};