// src/components/cliente/WalletCard.jsx
import React from 'react';
import { formatCurrency } from '../../utils/formatters';
import { Wallet, Eye, EyeOff, CreditCard } from 'lucide-react';

const WalletCard = ({ wallet }) => {
  const [showBalance, setShowBalance] = React.useState(true);

  if (!wallet) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg text-white p-6 shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Wallet size={24} />
          <h2 className="text-lg font-semibold">Mi Billetera</h2>
        </div>
        
        <button
          onClick={() => setShowBalance(!showBalance)}
          className="p-2 hover:bg-blue-700 rounded-full transition-colors"
          title={showBalance ? "Ocultar saldo" : "Mostrar saldo"}
        >
          {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      <div className="space-y-4">
        {/* Saldo Total */}
        <div>
          <div className="text-blue-200 text-sm mb-1">Saldo Total</div>
          <div className="text-3xl font-bold">
            {showBalance ? formatCurrency(wallet.saldo_total) : '••••••••'}
          </div>
        </div>

        {/* Saldos Desglosados */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-blue-500">
          <div>
            <div className="text-blue-200 text-sm mb-1">Disponible</div>
            <div className="text-xl font-semibold text-green-300">
              {showBalance ? formatCurrency(wallet.saldo_disponible) : '••••••'}
            </div>
          </div>
          
          <div>
            <div className="text-blue-200 text-sm mb-1">Retenido</div>
            <div className="text-xl font-semibold text-yellow-300">
              {showBalance ? formatCurrency(wallet.saldo_retenido) : '••••••'}
            </div>
          </div>
        </div>

        {/* Indicador Visual */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-blue-200 mb-2">
            <span>Disponible</span>
            <span>Retenido</span>
          </div>
          <div className="w-full bg-blue-700 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-green-400 h-full transition-all duration-300"
              style={{ 
                width: `${(wallet.saldo_disponible / wallet.saldo_total) * 100}%` 
              }}
            ></div>
          </div>
        </div>

        {/* Info adicional */}
        <div className="flex items-center justify-between text-xs text-blue-200 pt-4">
          <div className="flex items-center space-x-1">
            <CreditCard size={14} />
            <span>BOB Wallet</span>
          </div>
          <div>
            Actualizado: {new Date().toLocaleDateString('es-CL')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletCard;