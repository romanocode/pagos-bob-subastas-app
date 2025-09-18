import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';

// Cliente
import DashboardCliente from './pages/cliente/DashboardCliente';
import WalletCliente from './pages/cliente/WalletCliente';
import MovimientosCliente from './pages/cliente/MovimientosCliente';
import ReembolsosCliente from './pages/cliente/ReembolsosCliente';
import SolicitarReembolso from './pages/cliente/SolicitarReembolso';
import GarantiasCliente from './pages/cliente/GarantiasCliente';
import RegistrarGarantia from './pages/cliente/RegistrarGarantia';

// Admin
import DashboardAdmin from './pages/admin/DashboardAdmin';
import ValidacionPagos from './pages/admin/ValidacionPagos';
import GestionSubastas from './pages/admin/GestionSubastas';
import GestionReembolsos from './pages/admin/GestionReembolsos';
import GestionGarantias from './pages/admin/GestionGarantias';
import UsuariosAdmin from './pages/admin/UsuarioAdmin';

// Xander
import DashboardXander from './pages/xander/DashboardXander';
import GestionGarantiasXander from './pages/xander/GestionGarantiasXander';
import GestionReembolsosXander from './pages/xander/GestionReembolsosXander';
import GestionClientesXander from './pages/xander/GestionClientesXander';
import GarantiasClienteXander from './pages/xander/GarantiasClienteXander';
import ListaGarantiasCliente from './pages/xander/ListaGarantiasCliente';

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
          <Route path="/cliente/solicitar-reembolso" element={<Layout><SolicitarReembolso /></Layout>} />
          <Route path="/cliente/garantias" element={<Layout><GarantiasCliente /></Layout>} />
          <Route path="/cliente/registrar-garantia" element={<Layout><RegistrarGarantia /></Layout>} />
          
          {/* Admin */}
          <Route path="/admin/dashboard" element={<Layout><DashboardAdmin /></Layout>} />
          <Route path="/admin/pagos" element={<Layout><ValidacionPagos /></Layout>} />
          <Route path="/admin/subastas" element={<Layout><GestionSubastas /></Layout>} />
          <Route path="/admin/garantias" element={<Layout><GestionGarantias /></Layout>} />
          <Route path="/admin/reembolsos" element={<Layout><GestionReembolsos /></Layout>} />
          <Route path="/admin/usuarios" element={<Layout><UsuariosAdmin /></Layout>} />
          
          {/* Xander */}
          <Route path="/xander/dashboard" element={<Layout><DashboardXander /></Layout>} />
          <Route path="/xander/clientes" element={<Layout><GestionClientesXander /></Layout>} />
          <Route path="/xander/garantias" element={<Layout><GestionGarantiasXander /></Layout>} />
          <Route path="/xander/reembolsos" element={<Layout><GestionReembolsosXander /></Layout>} />
          <Route path="/xander/clientes/:clienteId/garantias" element={<Layout><ListaGarantiasCliente /></Layout>} />
          
          {/* Ruta de fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
