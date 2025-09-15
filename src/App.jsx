import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import DashboardCliente from './pages/cliente/DashboardCliente';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import ValidacionPagos from './pages/admin/ValidacionPagos';
import GestionSubastas from './pages/admin/GestionSubastas';
import GestionReembolsos from './pages/admin/GestionReembolsos';
import UsuariosAdmin from './pages/admin/UsuarioAdmin';
import WalletCliente from './pages/cliente/WalletCliente';
import MovimientosCliente from './pages/cliente/MovimientosCliente';
import ReembolsosCliente from './pages/cliente/ReembolsosCliente';

// ...resto del código...

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            {/* Cliente */}
            <Route path="/cliente/dashboard" element={<DashboardCliente />} />
            <Route path="/cliente/wallet" element={<WalletCliente />} />
            <Route path="/cliente/movimientos" element={<MovimientosCliente />} />
            <Route path="/cliente/reembolsos" element={<ReembolsosCliente />} />
            {/* Admin */}
            <Route path="/admin/dashboard" element={<DashboardAdmin />} />
            <Route path="/admin/pagos" element={<ValidacionPagos />} />
            <Route path="/admin/subastas" element={<GestionSubastas />} />
            <Route path="/admin/reembolsos" element={<GestionReembolsos />} />
            <Route path="/admin/usuarios" element={<UsuariosAdmin />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
