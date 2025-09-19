import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CreditCard, Info } from 'lucide-react';

const LoginModal = ({ isOpen, onClose }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  
  // Resetear el estado cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setCredentials({ username: '', password: '' });
      setErrors({});
      setIsLoading(false);
    }
  }, [isOpen]);

  // Validación en tiempo real
  useEffect(() => {
    validateForm();
  }, [credentials]);

  const validateForm = () => {
    const newErrors = {};
    
    if (credentials.username.trim() === '' && credentials.username !== '') {
      newErrors.username = 'El usuario es requerido';
    }
    
    if (credentials.password.trim() === '' && credentials.password !== '') {
      newErrors.password = 'La contraseña es requerida';
    } else if (credentials.password.length > 0 && credentials.password.length < 4) {
      newErrors.password = 'La contraseña debe tener al menos 4 caracteres';
    }
    
    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación final antes de enviar
    if (credentials.username.trim() === '') {
      setErrors(prev => ({ ...prev, username: 'El usuario es requerido' }));
      return;
    }
    
    if (credentials.password.trim() === '') {
      setErrors(prev => ({ ...prev, password: 'La contraseña es requerida' }));
      return;
    }
    
    setIsLoading(true);
    
    // Simulación de autenticación con timeout para mostrar el loader
    try {
      setTimeout(() => {
        // Credenciales hardcodeadas
        if (credentials.username === 'admin' && credentials.password === '1234') {
          login({ username: credentials.username, role: 'xander' });
          onClose();
          navigate('/xander/dashboard');
        } else if (credentials.username === 'cliente' && credentials.password === '1234') {
          login({ username: credentials.username, role: 'cliente' });
          onClose();
          navigate('/cliente/dashboard');
        } else {
          setErrors({ auth: 'Usuario o contraseña incorrectos' });
          setIsLoading(false);
        }
      }, 1000); // 1 segundo de "autenticación"
    } catch (error) {
      console.error('Error durante la autenticación:', error);
      setErrors({ auth: 'Error en el sistema. Intente nuevamente.' });
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden transform transition-all">
        {/* Logo y encabezado */}
        <div className="text-center pt-6 pb-2">
          <img 
            src="/src/assets/bob.svg" 
            alt="Logo BOB Subastas" 
            className="h-auto w-32 mx-auto"
          />
         
          <p className="text-gray-600 text-sm mt-1">Bienvenido de vuelta</p>
          <p className="text-gray-500 text-xs">Accede a tu cuenta</p>
        </div>
        
        {/* Formulario */}
        <form onSubmit={handleSubmit} className="px-8 py-6">
          {errors.auth && (
            <div className="mb-4 bg-red-50 p-3 rounded-md text-sm text-red-600">
              {errors.auth}
            </div>
          )}
          
          <div className="mb-4">
            <input
              type="text"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="Correo"
              className={`w-full px-3 py-2 border ${errors.username ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-bob-primary`}
            />
            {errors.username && (
              <p className="mt-1 text-xs text-red-600">{errors.username}</p>
            )}
          </div>
          
          <div className="mb-6">
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              placeholder="Contraseña"
              className={`w-full px-3 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-bob-primary`}
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-bob-primary hover:bg-bob-primary-dark text-white py-2 rounded-md transition duration-300 flex items-center justify-center"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              "Iniciar Sesión"
            )}
          </button>
          
          {/* Instrucciones de login */}
          <div className="mt-4 bg-blue-50 p-3 rounded-md border border-blue-100">
            <div className="flex items-start">
              <Info size={16} className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-xs text-blue-700">
                <p className="font-semibold mb-1">Credenciales de prueba:</p>
                <p><span className="font-medium">Xander:</span> usuario: admin, clave: 1234</p>
                <p><span className="font-medium">Cliente:</span> usuario: cliente, clave: 1234</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <a href="#" className="text-sm text-bob-primary hover:underline" onClick={(e) => {
              e.preventDefault();
              // Aquí iría la lógica para recuperar contraseña
            }}>
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </form>
        
        {/* Registro */}
        <div className="bg-gray-50 px-8 py-4 text-center border-t border-gray-200">
          <p className="text-sm text-gray-600">
            ¿Es la primera vez que usas BOB?{' '}
            <a href="#" className="font-medium text-bob-primary hover:underline" onClick={(e) => {
              e.preventDefault();
              // Aquí iría la lógica para registrarse
            }}>
              Regístrate
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;