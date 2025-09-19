import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { Gavel, DollarSign, Shield, BarChart3 } from 'lucide-react';

const Home = () => {
  const { currentUser, switchUserType } = useAuth();

  const features = [
    {
      icon: Gavel,
      title: 'Gestión de Subastas',
      description: 'Sistema completo para manejar subastas industriales y de vehículos'
    },
    {
      icon: DollarSign,
      title: 'Pagos y Garantías',
      description: 'Control automático de garantías, pagos y penalidades'
    },
    {
      icon: Shield,
      title: 'Billetera Digital',
      description: 'Manejo seguro de saldos y transacciones financieras'
    },
    {
      icon: BarChart3,
      title: 'Reportes Avanzados',
      description: 'Dashboard con métricas y análisis financiero en tiempo real'
    }
  ];

  const handleStartDemo = (userType) => {
    switchUserType(userType);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="text-bob-primary">BOB Subastas</span>
            <br />
            <span className="text-3xl sm:text-4xl md:text-5xl">Sistema de Gestión</span>
          </h1>
          
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
            Plataforma integral para la gestión de pagos, garantías y reembolsos 
            en subastas industriales. <span className="font-semibold text-bob-primary">Versión DEMO</span>
          </p>

          {/* Current User Info */}
          {currentUser && (
            <div className="mt-6 p-4 bg-teal-50 rounded-lg inline-block">
              <p className="text-sm text-bob-primary">
                Conectado como: <span className="font-semibold">{currentUser.nombre}</span>
                <br />
                <Link 
                  to={currentUser.tipo_usuario?.includes('ADMIN') ? '/admin/dashboard' : '/cliente/dashboard'}
                  className="text-bob-primary hover:text-bob-primary-dark underline"
                >
                  Ir al Dashboard
                </Link>
              </p>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="mx-auto w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-bob-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Demo Information */}
        <div className="mt-16 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-yellow-800 mb-2">
              Información de la Demo
            </h2>
            <div className="text-sm text-yellow-700 space-y-2">
              <p>• Esta es una demostración funcional del sistema BOB Subastas</p>
              <p>• Los datos mostrados son ficticios y solo para propósitos de presentación</p>
              <p>• No incluye sistema de autenticación ni módulo de pujas reales</p>
              <p>• Puedes alternar entre vista Cliente y Admin desde la navegación superior</p>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-12 text-center">
          <h3 className="text-lg font-semibold text-gray-600 mb-4">Tecnologías Utilizadas</h3>
          <div className="flex justify-center space-x-8 text-sm text-gray-500">
            <span className="bg-white px-3 py-1 rounded border">React</span>
            <span className="bg-white px-3 py-1 rounded border">Vite</span>
            <span className="bg-white px-3 py-1 rounded border">Tailwind CSS</span>
            <span className="bg-white px-3 py-1 rounded border">React Router</span>
            <span className="bg-white px-3 py-1 rounded border">Lucide Icons</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;