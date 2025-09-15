
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const fetchUsuarios = async () => [
  { id: 1, nombre: "Carlos Pérez", rol: "Cliente", estado: "Activo", email: "carlos@bob.com", telefono: "+56912345678" },
  { id: 2, nombre: "Lucía Torres", rol: "Cliente", estado: "Activo", email: "lucia@bob.com", telefono: "+56987654321" },
  { id: 3, nombre: "Ana Rodriguez", rol: "Admin", estado: "Activo", email: "ana@bob.com", telefono: "+56911223344" },
];

export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    fetchUsuarios().then(setUsuarios);
  }, []);

  const handleToggleActivo = (id) => {
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, estado: u.estado === "Activo" ? "Inactivo" : "Activo" } : u
      )
    );
  };

  const handleVerDetalle = (u) => {
    alert(
      `Perfil de usuario:\nNombre: ${u.nombre}\nRol: ${u.rol}\nEmail: ${u.email}\nTeléfono: ${u.telefono}\nEstado: ${u.estado}`
    );
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-bob-primary mb-6">Usuarios</h2>
      <table className="min-w-full bg-white rounded-lg shadow">
        <thead>
          <tr className="bg-bob-primary text-white">
            <th className="py-2 px-4 text-left">Nombre</th>
            <th className="py-2 px-4 text-left">Rol</th>
            <th className="py-2 px-4 text-left">Email</th>
            <th className="py-2 px-4 text-left">Teléfono</th>
            <th className="py-2 px-4 text-left">Estado</th>
            <th className="py-2 px-4 text-left">Acción</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr
              key={u.id}
              className="border-b cursor-pointer hover:bg-blue-50 transition"
              onClick={() => handleVerDetalle(u)}
            >
              <td className="py-2 px-4">{u.nombre}</td>
              <td className="py-2 px-4">{u.rol}</td>
              <td className="py-2 px-4">{u.email}</td>
              <td className="py-2 px-4">{u.telefono}</td>
              <td className="py-2 px-4">
                <span className={`px-2 py-1 rounded text-white ${
                  u.estado === "Activo"
                    ? "bg-bob-secondary"
                    : "bg-bob-danger"
                }`}>
                  {u.estado}
                </span>
              </td>
              <td className="py-2 px-4">
                <button
                  className="bg-bob-warning hover:bg-bob-primary text-white px-4 py-1 rounded transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleActivo(u.id);
                  }}
                >
                  {u.estado === "Activo" ? "Desactivar" : "Activar"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const handleToggleActivo = (id) => {
  setUsuarios((prev) =>
    prev.map((u) =>
      u.id === id ? { ...u, estado: u.estado === "Activo" ? "Inactivo" : "Activo" } : u
    )
  );
  toast.info("Estado de usuario actualizado");
};