import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import ListaGarantiasCliente from './pages/xander/ListaGarantiasCliente';
import SubastasXander from './pages/xander/SubastasXander';
import FacturacionXander from './pages/xander/FacturacionXander';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            
            {/* Cliente */}
            <Route path="/cliente/dashboard" element={<DashboardCliente />} />
            <Route path="/cliente/wallet" element={<WalletCliente />} />
            <Route path="/cliente/movimientos" element={<MovimientosCliente />} />
            <Route path="/cliente/reembolsos" element={<ReembolsosCliente />} />
            <Route path="/cliente/solicitar-reembolso" element={<SolicitarReembolso />} />
            <Route path="/cliente/garantias" element={<GarantiasCliente />} />
            <Route path="/cliente/registrar-garantia" element={<RegistrarGarantia />} />
            
            {/* Admin */}
            <Route path="/admin/dashboard" element={<DashboardAdmin />} />
            <Route path="/admin/pagos" element={<ValidacionPagos />} />
            <Route path="/admin/subastas" element={<GestionSubastas />} />
            <Route path="/admin/garantias" element={<GestionGarantias />} />
            <Route path="/admin/reembolsos" element={<GestionReembolsos />} />
            <Route path="/admin/usuarios" element={<UsuariosAdmin />} />
            
            {/* Xander */}
            <Route path="/xander/dashboard" element={<DashboardXander />} />
            <Route path="/xander/subastas" element={<SubastasXander />} />
            <Route path="/xander/clientes" element={<GestionClientesXander />} />
            <Route path="/xander/garantias" element={<GestionGarantiasXander />} />
            <Route path="/xander/facturacion" element={<FacturacionXander />} />
            <Route path="/xander/reembolsos" element={<GestionReembolsosXander />} />
            <Route path="/xander/clientes/:clienteId/garantias" element={<ListaGarantiasCliente />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
