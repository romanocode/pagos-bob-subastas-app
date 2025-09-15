import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { walletService } from "../../services/walletService";
import WalletCard from "../../components/cliente/WalletCard";
import { toast } from "react-toastify";

export default function WalletCliente() {
  const { currentUser } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [form, setForm] = useState({
    tipoDocumento: '',
    numeroDocumento: '',
    banco: '',
    tipoCuenta: '',
    numeroCuenta: '',
    referencia: '',
    monto: ''
  });
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    walletService.getWalletByUserId(currentUser.id).then(res => setWallet(res.data));
  }, [currentUser]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDepositar = async (e) => {
    e.preventDefault();
    setEnviando(true);
    await walletService.createTransaction({
      usuario_id: currentUser.id,
      tipo: 'GARANTIA',
      monto: Number(form.monto),
      estado: 'PENDIENTE',
      referencia_bancaria: form.referencia,
      datos_bancarios: {
        banco: form.banco,
        tipo_cuenta: form.tipoCuenta,
        numero_cuenta: form.numeroCuenta,
        tipo_documento: form.tipoDocumento,
        numero_documento: form.numeroDocumento
      }
    });
    toast.success("Depósito enviado para validación");
    setEnviando(false);
    setForm({
      tipoDocumento: '',
      numeroDocumento: '',
      banco: '',
      tipoCuenta: '',
      numeroCuenta: '',
      referencia: '',
      monto: ''
    });
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-bob-primary mb-6">Registrar Depósito de Garantía</h2>
      <WalletCard wallet={wallet} />
      <form className="bg-white rounded-lg p-6 border border-gray-200 shadow mt-8 space-y-4" onSubmit={handleDepositar}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Documento</label>
          <select name="tipoDocumento" required value={form.tipoDocumento} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2">
            <option value="">Seleccione</option>
            <option value="DNI">DNI</option>
            <option value="CE">Carnet de Extranjería (CE)</option>
            <option value="RUC">RUC</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Número de Documento</label>
          <input name="numeroDocumento" required value={form.numeroDocumento} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Banco</label>
          <input name="banco" required value={form.banco} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Cuenta</label>
          <input name="tipoCuenta" required value={form.tipoCuenta} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Número de Cuenta</label>
          <input name="numeroCuenta" required value={form.numeroCuenta} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Referencia de Transferencia</label>
          <input name="referencia" required value={form.referencia} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Monto (USD)</label>
          <input name="monto" type="number" min={0} required value={form.monto} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2" />
        </div>
        <button type="submit" disabled={enviando} className="bg-bob-primary hover:bg-bob-secondary text-white px-6 py-2 rounded transition">
          {enviando ? "Enviando..." : "Registrar Depósito"}
        </button>
      </form>
    </div>
  );
}