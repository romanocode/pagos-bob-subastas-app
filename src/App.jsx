import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import DashboardCliente from './pages/cliente/DashboardCliente';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import ValidacionPagos from './pages/admin/ValidacionPagos';
import GestionSubastas from './pages/admin/GestionSubastas';
import GestionReembolsos from './pages/admin/GestionReembolsos';
import UsuariosAdmin from './pages/admin/UsuarioAdmin';
import WalletCliente from './pages/cliente/WalletCliente';
import MovimientosCliente from './pages/cliente/MovimientosCliente';
import ReembolsosCliente from './pages/cliente/ReembolsosCliente';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout><Home /></Layout>} />
          
          {/* Cliente */}
          <Route path="/cliente/dashboard" element={<Layout><DashboardCliente /></Layout>} />
          <Route path="/cliente/wallet" element={<Layout><WalletCliente /></Layout>} />
          <Route path="/cliente/movimientos" element={<Layout><MovimientosCliente /></Layout>} />
          <Route path="/cliente/reembolsos" element={<Layout><ReembolsosCliente /></Layout>} />
          
          {/* Admin */}
          <Route path="/admin/dashboard" element={<Layout><DashboardAdmin /></Layout>} />
          <Route path="/admin/pagos" element={<Layout><ValidacionPagos /></Layout>} />
          <Route path="/admin/subastas" element={<Layout><GestionSubastas /></Layout>} />
          <Route path="/admin/reembolsos" element={<Layout><GestionReembolsos /></Layout>} />
          <Route path="/admin/usuarios" element={<Layout><UsuariosAdmin /></Layout>} />
          
          {/* Ruta de fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
