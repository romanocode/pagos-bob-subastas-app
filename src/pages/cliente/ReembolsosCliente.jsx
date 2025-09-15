import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { walletService } from "../../services/walletService";
import { toast } from "react-toastify";

export default function ReembolsosCliente() {
  const { currentUser } = useAuth();
  const [garantias, setGarantias] = useState([]);
  const [selectedGarantia, setSelectedGarantia] = useState('');
  const [motivo, setMotivo] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    walletService.getTransactionsByUserId(currentUser.id, { tipo: 'GARANTIA', estado: 'VALIDADO' })
      .then(res => setGarantias(res.data));
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    await walletService.createTransaction({
      usuario_id: currentUser.id,
      tipo: 'REEMBOLSO',
      monto: garantias.find(g => g.id === selectedGarantia)?.monto || 0,
      estado: 'PENDIENTE',
      referencia_bancaria: garantias.find(g => g.id === selectedGarantia)?.referencia_bancaria,
      motivo
    });
    toast.success("Solicitud de reembolso enviada al admin");
    setEnviando(false);
    setSelectedGarantia('');
    setMotivo('');
  };

  return (
    <div className="max-w-xl mx-auto mt-8">
      <h2 className="text-2xl font-bold text-bob-primary mb-6">Solicitar Reembolso de Garantía</h2>
      <form className="bg-white rounded-lg p-6 border border-gray-200 shadow space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Selecciona Garantía</label>
          <select required value={selectedGarantia} onChange={e => setSelectedGarantia(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2">
            <option value="">-- Selecciona --</option>
            {garantias.map(g => (
              <option key={g.id} value={g.id}>
                {g.referencia_bancaria} - Monto: {g.monto}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Motivo</label>
          <textarea required value={motivo} onChange={e => setMotivo(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="Motivo de la solicitud" />
        </div>
        <button type="submit" disabled={enviando} className="bg-bob-secondary hover:bg-bob-primary text-white px-6 py-2 rounded transition">
          {enviando ? "Enviando..." : "Solicitar Reembolso"}
        </button>
      </form>
    </div>
  );
}