import React, { useEffect, useState } from "react";

// Simulación de llamada a backend
const fetchSubastas = async () => [
  {
    id: 101,
    nombre: "Lote Maquinaria Industrial",
    estado: "Activa",
    fecha: "2025-09-20",
    participantes: 12,
  },
  {
    id: 102,
    nombre: "Vehículos Comerciales",
    estado: "Finalizada",
    fecha: "2025-08-15",
    participantes: 8,
  },
];

export default function GestionSubastas() {
  const [subastas, setSubastas] = useState([]);

  useEffect(() => {
    fetchSubastas().then(setSubastas);
  }, []);

  const handleFinalizar = (id) => {
    setSubastas((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, estado: "Finalizada" } : s
      )
    );
  };

  const handleVerDetalle = (subasta) => {
    alert(
      `Detalle de subasta:\nNombre: ${subasta.nombre}\nFecha: ${subasta.fecha}\nEstado: ${subasta.estado}\nParticipantes: ${subasta.participantes}`
    );
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-bob-primary mb-6">Gestión de Subastas</h2>
      <table className="min-w-full bg-white rounded-lg shadow">
        <thead>
          <tr className="bg-bob-primary text-white">
            <th className="py-2 px-4 text-left">Nombre</th>
            <th className="py-2 px-4 text-left">Estado</th>
            <th className="py-2 px-4 text-left">Fecha</th>
            <th className="py-2 px-4 text-left">Participantes</th>
            <th className="py-2 px-4 text-left">Acción</th>
          </tr>
        </thead>
        <tbody>
          {subastas.map((subasta) => (
            <tr
              key={subasta.id}
              className="border-b cursor-pointer hover:bg-blue-50 transition"
              onClick={() => handleVerDetalle(subasta)}
            >
              <td className="py-2 px-4">{subasta.nombre}</td>
              <td className="py-2 px-4">
                <span
                  className={`px-2 py-1 rounded text-white ${
                    subasta.estado === "Activa"
                      ? "bg-bob-secondary"
                      : "bg-bob-danger"
                  }`}
                >
                  {subasta.estado}
                </span>
              </td>
              <td className="py-2 px-4">{subasta.fecha}</td>
              <td className="py-2 px-4">{subasta.participantes}</td>
              <td className="py-2 px-4">
                {subasta.estado === "Activa" ? (
                  <button
                    className="bg-bob-secondary hover:bg-bob-primary text-white px-4 py-1 rounded transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFinalizar(subasta.id);
                    }}
                  >
                    Finalizar
                  </button>
                ) : (
                  <span className="text-bob-primary font-semibold">Finalizada</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}