
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

// Simulación de llamada a backend
const fetchPagosPendientes = async () => [
  {
    id: 1,
    usuario: "Carlos Pérez",
    monto: 1500,
    fecha: "2025-09-10",
    estado: "Pendiente",
  },
  {
    id: 2,
    usuario: "Lucía Torres",
    monto: 2000,
    fecha: "2025-09-12",
    estado: "Pendiente",
  },
];

export default function ValidacionPagos() {
  const [pagos, setPagos] = useState([]);

  useEffect(() => {
    fetchPagosPendientes().then(setPagos);
  }, []);

  const handleValidar = (id) => {
    setPagos((prev) =>
      prev.map((pago) =>
        pago.id === id ? { ...pago, estado: "Validado" } : pago
      )
    );
  };

  const handleRechazar = (id) => {
    setPagos((prev) =>
      prev.map((pago) =>
        pago.id === id ? { ...pago, estado: "Rechazado" } : pago
      )
    );
  };

  const handleVerDetalle = (pago) => {
    alert(
      `Detalle de pago:\nUsuario: ${pago.usuario}\nMonto: S/ ${pago.monto}\nFecha: ${pago.fecha}\nEstado: ${pago.estado}`
    );
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-bob-primary mb-6">Validación de Pagos</h2>
      <table className="min-w-full bg-white rounded-lg shadow">
        <thead>
          <tr className="bg-bob-primary text-white">
            <th className="py-2 px-4 text-left">Usuario</th>
            <th className="py-2 px-4 text-left">Monto</th>
            <th className="py-2 px-4 text-left">Fecha</th>
            <th className="py-2 px-4 text-left">Estado</th>
            <th className="py-2 px-4 text-left">Acción</th>
          </tr>
        </thead>
        <tbody>
          {pagos.map((pago) => (
            <tr
              key={pago.id}
              className="border-b cursor-pointer hover:bg-blue-50 transition"
              onClick={() => handleVerDetalle(pago)}
            >
              <td className="py-2 px-4">{pago.usuario}</td>
              <td className="py-2 px-4">S/ {pago.monto.toLocaleString("es-CL")}</td>
              <td className="py-2 px-4">{pago.fecha}</td>
              <td className="py-2 px-4">
                <span className={`px-2 py-1 rounded text-white ${
                  pago.estado === "Pendiente"
                    ? "bg-bob-warning"
                    : pago.estado === "Validado"
                    ? "bg-bob-secondary"
                    : "bg-bob-danger"
                }`}>
                  {pago.estado}
                </span>
              </td>
              <td className="py-2 px-4">
                {pago.estado === "Pendiente" ? (
                  <div className="flex gap-2">
                    <button
                      className="bg-bob-secondary hover:bg-bob-primary text-white px-4 py-1 rounded transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleValidar(pago.id);
                      }}
                    >
                      Validar
                    </button>
                    <button
                      className="bg-bob-danger hover:bg-red-700 text-white px-4 py-1 rounded transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRechazar(pago.id);
                      }}
                    >
                      Rechazar
                    </button>
                  </div>
                ) : (
                  <span className="text-bob-primary font-semibold">{pago.estado}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const handleValidar = (id) => {
  if (window.confirm('¿Estás seguro que deseas validar este pago?')) {
    setPagos((prev) =>
      prev.map((pago) =>
        pago.id === id ? { ...pago, estado: "Validado" } : pago
      )
    );
    toast.success("Pago validado correctamente");
  }
};

const handleRechazar = (id) => {
  if (window.confirm('¿Estás seguro que deseas rechazar este pago?')) {
    setPagos((prev) =>
      prev.map((pago) =>
        pago.id === id ? { ...pago, estado: "Rechazado" } : pago
      )
    );
    toast.error("Pago rechazado");
  }
};