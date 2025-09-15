import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm("¿Seguro que deseas salir?")) {
      logout();
      toast.info("Sesión cerrada");
      navigate("/");
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
      {/* Logo clickeable */}
      <Link
        to="/"
        className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
        aria-label="Ir a la página de inicio"
      >
        <img
          src="/logo-bob.svg"
          alt="Logo BOB Subastas"
          className="h-8 w-8"
        />
        <span className="text-2xl font-bold text-bob-primary">BOB Subastas</span>
        <span className="text-xs bg-bob-primary text-white px-2 py-1 rounded ml-2">DEMO</span>
      </Link>

      {/* Menú de navegación */}
      <div className="flex items-center space-x-6">
        <Link
          to="/categorias"
          className="text-gray-700 hover:text-bob-primary transition-colors"
        >
          Categorías
        </Link>
        <Link
          to="/subastas"
          className="text-gray-700 hover:text-bob-primary transition-colors"
        >
          Subastas
        </Link>
        <Link
          to="/quiero-vender"
          className="text-gray-700 hover:text-bob-primary transition-colors"
        >
          Quiero Vender
        </Link>
        {currentUser ? (
          <button
            onClick={handleLogout}
            className="bg-bob-danger hover:bg-bob-primary-dark text-white px-4 py-2 rounded transition"
          >
            Salir
          </button>
        ) : (
          <Link
            to="/login"
            className="bg-bob-primary hover:bg-bob-primary-dark text-white px-4 py-2 rounded transition"
          >
            Ingresar
          </Link>
        )}
      </div>
    </nav>
  );
}