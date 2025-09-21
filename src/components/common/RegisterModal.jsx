import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const RegisterModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nombreCompleto: '',
    tipoDocumento: 'DNI',
    numeroDocumento: '',
    razonSocial: '',
    direccion: '',
    ciudad: 'Lima',
    pais: 'Perú'
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo no es válido';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 4) {
      newErrors.password = 'La contraseña debe tener al menos 4 caracteres';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    if (!formData.nombreCompleto) {
      newErrors.nombreCompleto = 'El nombre completo es requerido';
    }
    
    if (!formData.numeroDocumento) {
      newErrors.numeroDocumento = 'El número de documento es requerido';
    } else {
      if (formData.tipoDocumento === 'DNI' && formData.numeroDocumento.length !== 8) {
        newErrors.numeroDocumento = 'El DNI debe tener 8 dígitos';
      } else if (formData.tipoDocumento === 'CE' && formData.numeroDocumento.length < 8) {
        newErrors.numeroDocumento = 'El CE debe tener al menos 8 caracteres';
      } else if (formData.tipoDocumento === 'RUC' && formData.numeroDocumento.length !== 11) {
        newErrors.numeroDocumento = 'El RUC debe tener 11 dígitos';
      }
    }
    
    if (formData.tipoDocumento === 'RUC' && !formData.razonSocial) {
      newErrors.razonSocial = 'La razón social es requerida para RUC';
    }
    
    if (!formData.direccion) {
      newErrors.direccion = 'La dirección es requerida';
    }
    
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulación de registro con timeout
      setTimeout(() => {
        // Aquí iría la llamada a la API para registrar al usuario
        toast.success('Registro exitoso. Ahora puedes iniciar sesión.');
        login({ username: formData.email, role: 'cliente' });
        onClose();
        navigate('/cliente/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error durante el registro:', error);
      setErrors({ general: 'Error en el sistema. Intente nuevamente.' });
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden transform transition-all">
        {/* Encabezado */}
        <div className="bg-bob-primary text-white px-6 py-4">
          <h2 className="text-xl font-semibold">Registro en BOB Subastas</h2>
          <p className="text-sm opacity-80">Completa tus datos para crear una cuenta</p>
        </div>
        
        {/* Formulario */}
        <form onSubmit={handleSubmit} className="px-6 py-4 max-h-[70vh] overflow-y-auto">
          {errors.general && (
            <div className="mb-4 bg-red-50 p-3 rounded-md text-sm text-red-600">
              {errors.general}
            </div>
          )}
          
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700">Datos de acceso</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-bob-primary`}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-bob-primary`}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-bob-primary`}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
            
            <h3 className="font-medium text-gray-700 pt-2">Datos personales</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
              <input
                type="text"
                name="nombreCompleto"
                value={formData.nombreCompleto}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.nombreCompleto ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-bob-primary`}
              />
              {errors.nombreCompleto && (
                <p className="mt-1 text-xs text-red-600">{errors.nombreCompleto}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de documento</label>
                <select
                  name="tipoDocumento"
                  value={formData.tipoDocumento}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bob-primary"
                >
                  <option value="DNI">DNI</option>
                  <option value="CE">CE</option>
                  <option value="RUC">RUC</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número de documento</label>
                <input
                  type="text"
                  name="numeroDocumento"
                  value={formData.numeroDocumento}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.numeroDocumento ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-bob-primary`}
                />
                {errors.numeroDocumento && (
                  <p className="mt-1 text-xs text-red-600">{errors.numeroDocumento}</p>
                )}
              </div>
            </div>
            
            {formData.tipoDocumento === 'RUC' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Razón social</label>
                <input
                  type="text"
                  name="razonSocial"
                  value={formData.razonSocial}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.razonSocial ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-bob-primary`}
                />
                {errors.razonSocial && (
                  <p className="mt-1 text-xs text-red-600">{errors.razonSocial}</p>
                )}
              </div>
            )}
            
            <h3 className="font-medium text-gray-700 pt-2">Datos de facturación</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.direccion ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-bob-primary`}
              />
              {errors.direccion && (
                <p className="mt-1 text-xs text-red-600">{errors.direccion}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                <input
                  type="text"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bob-primary"
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">País</label>
                <input
                  type="text"
                  name="pais"
                  value={formData.pais}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bob-primary"
                  readOnly
                />
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-bob-primary hover:bg-bob-primary-dark text-white rounded-md text-sm font-medium transition duration-300 flex items-center justify-center"
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                "Registrarme"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterModal;