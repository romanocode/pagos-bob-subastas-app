// src/components/layout/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home,
  Wallet,
  FileText,
  Users,
  CreditCard,
  Gavel,
  RefreshCw,
  BarChart3,
  Shield,
  Receipt
} from 'lucide-react';

const Sidebar = ({ userType }) => {
  const location = useLocation();

  const clienteMenuItems = [
    {
      path: '/cliente/dashboard',
      name: 'Dashboard',
      icon: Home
    },
    {
      path: '/cliente/wallet',
      name: 'Mis Garantías',
      icon: Wallet
    },
    {
      path: '/cliente/movimientos',
      name: 'Garantías',
      icon: FileText
    },
    {
      path: '/cliente/reembolsos',
      name: 'Reembolsos',
      icon: RefreshCw
    }
  ];

  const adminMenuItems = [
    {
      path: '/admin/dashboard',
      name: 'Dashboard Admin',
      icon: BarChart3
    },
    {
      path: '/admin/pagos',
      name: 'Validar Pagos',
      icon: CreditCard
    },
    {
      path: '/admin/subastas',
      name: 'Gestión Subastas',
      icon: Gavel
    },
    {
      path: '/admin/reembolsos',
      name: 'Gestión Reembolsos',
      icon: RefreshCw
    },
    {
      path: '/admin/usuarios',
      name: 'Usuarios',
      icon: Users
    }
  ];

  const xanderMenuItems = [
    {
      path: '/xander/dashboard',
      name: 'Dashboard Xander',
      icon: BarChart3
    },
    {
      path: '/xander/subastas',
      name: 'Subastas',
      icon: Gavel
    },
    {
      path: '/xander/clientes',
      name: 'Clientes',
      icon: Users
    },
    {
      path: '/xander/facturacion',
      name: 'Facturación',
      icon: Receipt
    },
    {
      path: '/xander/reembolsos',
      name: 'Reembolsos',
      icon: RefreshCw
    }
  ];

  let menuItems = clienteMenuItems;
  if (userType === 'admin') {
    menuItems = adminMenuItems;
  } else if (userType === 'xander') {
    menuItems = xanderMenuItems;
  }

  return (
    <div className="fixed left-0 top-[104px] h-[calc(100vh-104px)] w-64 bg-white border-r border-gray-200 overflow-y-auto z-10">
      <nav className="mt-6 px-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-bob-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Demo Info */}
        <div className="mt-8 px-3 py-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="text-xs text-yellow-800 font-medium mb-1">
            MODO DEMO
          </div>
          <div className="text-xs text-yellow-700">
            Esta es una demostración del sistema. Los datos no son reales.
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;