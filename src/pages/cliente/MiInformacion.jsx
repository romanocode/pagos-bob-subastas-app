import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { User, Mail, FileText, MapPin, Building, CreditCard } from 'lucide-react';

const MiInformacion = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    email: '',
    tipoDocumento: 'DNI',
    numeroDocumento: '',
    razonSocial: '',
    direccion: '',
    ciudad: 'Lima',
    pais: 'Perú'
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      setIsLoading(true);
      try {
        // Simulación de carga de datos del usuario
        setTimeout(() => {
          // En un entorno real, aquí se haría una llamada a la API
          const mockUserData = {
            nombreCompleto: 'Juan Pérez',
            email: 'juan.perez@ejemplo.com',
            tipoDocumento: 'DNI',
            numeroDocumento: '12345678',
            razonSocial: '',
            direccion: 'Av. Arequipa 123',
            ciudad: 'Lima',
            pais: 'Perú'
          };
          
          setUserInfo(mockUserData);
          setFormData(mockUserData);
          setIsLoading(false);
        }, 1000);
      } catch (err) {
        console.error('Error al cargar información del usuario:', err);
        setError('No se pudo cargar la información del usuario. Intente nuevamente.');
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsLoading(true);
      
      // Simulación de actualización de datos
      setTimeout(() => {
        // En un entorno real, aquí se haría una llamada a la API
        setUserInfo(formData);
        setIsEditing(false);
        setIsLoading(false);
        toast.success('Información actualizada correctamente');
      }, 1000);
    } catch (err) {
      console.error('Error al actualizar información:', err);
      toast.error('No se pudo actualizar la información. Intente nuevamente.');
      setIsLoading(false);
    }
  };

  if (isLoading && !userInfo) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-104px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-bob-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Mi Información</h1>
        <p className="text-gray-600">Visualiza y actualiza tu información personal</p>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-bob-primary px-6 py-4 flex justify-between items-center">
          <h2 className="text-white text-lg font-semibold">Datos Personales</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-white text-bob-primary rounded-md text-sm font-medium hover:bg-gray-100 transition-colors"
            >
              Editar
            </button>
          ) : null}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="nombreCompleto"
                    value={formData.nombreCompleto}
                    onChange={handleChange}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bob-primary"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bob-primary"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de documento
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText size={18} className="text-gray-400" />
                  </div>
                  <select
                    name="tipoDocumento"
                    value={formData.tipoDocumento}
                    onChange={handleChange}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bob-primary"
                  >
                    <option value="DNI">DNI</option>
                    <option value="CE">CE</option>
                    <option value="RUC">RUC</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de documento
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="numeroDocumento"
                    value={formData.numeroDocumento}
                    onChange={handleChange}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bob-primary"
                    required
                  />
                </div>
              </div>

              {formData.tipoDocumento === 'RUC' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Razón social
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="razonSocial"
                      value={formData.razonSocial}
                      onChange={handleChange}
                      className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bob-primary"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bob-primary"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ciudad
                  </label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    País
                  </label>
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

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData(userInfo);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-bob-primary hover:bg-bob-primary-dark text-white rounded-md text-sm font-medium transition-colors"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Guardando...
                  </div>
                ) : (
                  'Guardar cambios'
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Nombre completo</h3>
                <p className="mt-1 flex items-center">
                  <User size={18} className="text-gray-400 mr-2" />
                  {userInfo.nombreCompleto}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Correo electrónico</h3>
                <p className="mt-1 flex items-center">
                  <Mail size={18} className="text-gray-400 mr-2" />
                  {userInfo.email}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Documento</h3>
                <p className="mt-1 flex items-center">
                  <FileText size={18} className="text-gray-400 mr-2" />
                  {userInfo.tipoDocumento}: {userInfo.numeroDocumento}
                </p>
              </div>

              {userInfo.tipoDocumento === 'RUC' && userInfo.razonSocial && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Razón social</h3>
                  <p className="mt-1 flex items-center">
                    <Building size={18} className="text-gray-400 mr-2" />
                    {userInfo.razonSocial}
                  </p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-gray-500">Dirección</h3>
                <p className="mt-1 flex items-center">
                  <MapPin size={18} className="text-gray-400 mr-2" />
                  {userInfo.direccion}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Ubicación</h3>
                <p className="mt-1">
                  {userInfo.ciudad}, {userInfo.pais}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MiInformacion;