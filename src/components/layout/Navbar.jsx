import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import LoginModal from '../common/LoginModal';
import ConfirmModal from '../common/ConfirmModal';

export default function Navbar() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };
  
  const confirmLogout = () => {
    logout();
    toast.info("Sesión cerrada");
    navigate("/");
    setIsLogoutModalOpen(false);
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <>
      {/* Franja naranja superior */}
      <div className="bg-[#FBBF24] text-gray-800 py-2 px-4 flex items-center justify-start cursor-pointer">
        {/* Bullet rojo con efecto de brillo */}
        <div className="relative mr-2 flex-shrink-0">
          <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 w-3 h-3 bg-red-500 rounded-full animate-ping opacity-75"></div>
        </div>
        <span className="text-sm font-medium">
          ¡Descubre oportunidades únicas! Participa en nuestras subastas en vivo ahora.
        </span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>

      <nav className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
        {/* Logo clickeable */}
        <Link
          to="/"
          className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          aria-label="Ir a la página de inicio"
        >
          <img
            src="/src/assets/bob.svg"
            onError={(e) => { e.currentTarget.src = "https://www.somosbob.com/apple-touch-icon.png"; }}
            alt="Logo BOB Subastas"
            className="h-auto w-32"
          />
          <span className="text-2xl font-bold text-bob-primary"></span>
          <span className="text-xs bg-bob-primary text-white px-2 py-1 rounded ml-2">DEMO</span>
        </Link>

        {/* Menú de navegación */}
        <div className="flex items-center space-x-6">
          {currentUser ? (
            <button
              onClick={handleLogout}
              className="bg-bob-danger hover:bg-bob-primary-dark text-white px-4 py-2 rounded transition"
            >
              Salir
            </button>
          ) : (
            <button
              onClick={openLoginModal}
              className="bg-bob-primary hover:bg-bob-primary-dark text-white px-4 py-2 rounded transition"
            >
              Ingresar
            </button>
          )}
        </div>
      </nav>
    
      {/* Modal de Login */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    
      {/* Modal de Confirmación para Logout */}
      <ConfirmModal 
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
        title="Confirmar salida"
        message="¿Seguro que deseas salir?"
      />
    </>
  );
}
