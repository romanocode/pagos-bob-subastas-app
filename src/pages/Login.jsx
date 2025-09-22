import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import clienteService from '../services/clienteService';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

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
      setTimeout(async () => {
        // Credenciales hardcodeadas
        // Información del cliente
        const cliente = await clienteService.getByCorreo(credentials.username);
        if (!cliente) {
          setErrors({ auth: 'Usuario o contraseña incorrectos' });
          setIsLoading(false);
          return;
        }

        if (credentials.username === 'admin' && credentials.password === '1234') {
          login({ username: credentials.username, role: 'admin' });
          navigate('/admin/dashboard');
        } else if (credentials.username === cliente.correo && credentials.password === '1234') {
          login({ username: credentials.username, role: 'cliente' });
          navigate('/cliente/dashboard');
        } else {
          setErrors({ auth: 'Usuario o contraseña incorrectos' });
          setIsLoading(false);
        }
      }, 1500); // 1.5 segundos de "autenticación"
    } catch (error) {
      console.error('Error durante la autenticación:', error);
      setErrors({ auth: 'Error en el sistema. Intente nuevamente.' });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg transform transition duration-500 hover:scale-105">
        <div className="text-center">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">BobSubastas</h2>
          <div className="mt-2 flex justify-center">
            <div className="w-24 h-24 rounded-full bg-bob-primary flex items-center justify-center text-white text-3xl font-bold">
              BOB
            </div>
          </div>
          <p className="mt-2 text-center text-sm text-gray-600">
            Inicia sesión en tu cuenta
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md -space-y-px">
            <div className="mb-4">
              <label htmlFor="username" className="sr-only">Usuario</label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className={`appearance-none rounded-md relative block w-full px-3 py-3 border ${
                  errors.username ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm transition duration-300`}
                placeholder="Usuario"
                value={credentials.username}
                onChange={handleChange}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )}
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={`appearance-none rounded-md relative block w-full px-3 py-3 border ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                } placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm transition duration-300`}
                placeholder="Contraseña"
                value={credentials.password}
                onChange={handleChange}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          {errors.auth && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error de autenticación</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{errors.auth}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Recordarme
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-green-600 hover:text-green-500">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-bob-primary hover:bg-bob-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bob-primary transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              {isLoading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : null}
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>
          </div>
          
          <div className="text-center text-sm text-gray-600 mt-4">
            <p>Credenciales de demo:</p>
            <p>Usuario: "admin" / Contraseña: "1234" → Panel de administrador</p>
            <p>Usuario: "correocliente" / Contraseña: "1234" → Panel de cliente</p>
          </div>
        </form>
        
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            &copy; 2025 BobSubastas. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;