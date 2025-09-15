// src/services/walletService.js
// Datos demo para la billetera
const BILLETERAS_DEMO = [
  {
    id: 'wallet-1',
    usuario_id: 'user-1',
    saldo_disponible: 3200000,
    saldo_retenido: 1500000,
    saldo_total: 4700000,
    fecha_actualizacion: '2025-09-15T10:30:00Z'
  }
];

const TRANSACCIONES_DEMO = [
  {
    id: 'trans-1',
    usuario_id: 'user-1',
    subasta_id: 'subasta-1',
    tipo: 'GARANTIA',
    monto: 1500000,
    estado: 'VALIDADO',
    referencia_bancaria: 'TRF2025090001',
    fecha_creacion: '2025-08-30T10:00:00Z',
    datos_bancarios: {
      banco: 'Banco de Chile',
      tipo_cuenta: 'Cuenta Corriente'
    }
  },
  {
    id: 'trans-2',
    usuario_id: 'user-1',
    tipo: 'DEPOSITO',
    monto: 5000000,
    estado: 'VALIDADO',
    referencia_bancaria: 'TRF2025090002',
    fecha_creacion: '2025-09-05T14:30:00Z',
    datos_bancarios: {
      banco: 'Banco Estado',
      tipo_cuenta: 'Cuenta Corriente'
    }
  },
  {
    id: 'trans-3',
    usuario_id: 'user-1',
    tipo: 'REEMBOLSO',
    monto: 800000,
    estado: 'PROCESADO',
    referencia_bancaria: 'REF2025091001',
    fecha_creacion: '2025-09-10T09:15:00Z',
    datos_bancarios: {
      banco: 'Banco Santander',
      tipo_cuenta: 'Cuenta Vista'
    }
  },
  {
    id: 'trans-4',
    usuario_id: 'user-1',
    subasta_id: 'subasta-2',
    tipo: 'GARANTIA',
    monto: 2000000,
    estado: 'PENDIENTE',
    referencia_bancaria: 'TRF2025091201',
    fecha_creacion: '2025-09-12T16:45:00Z',
    datos_bancarios: {
      banco: 'Banco BCI',
      tipo_cuenta: 'Cuenta Corriente'
    }
  },
  {
    id: 'trans-5',
    usuario_id: 'user-1',
    tipo: 'PENALIDAD',
    monto: 300000,
    estado: 'VALIDADO',
    referencia_bancaria: 'PEN2025091301',
    fecha_creacion: '2025-09-13T11:20:00Z',
    notas_validacion: 'Penalidad por no completar pago final en plazo establecido'
  }
];

export const walletService = {
  // Obtener billetera por ID de usuario
  async getWalletByUserId(userId) {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const wallet = BILLETERAS_DEMO.find(w => w.usuario_id === userId);
    
    if (!wallet) {
      throw new Error('Billetera no encontrada');
    }
    
    return { data: wallet };
  },

  // Obtener transacciones por ID de usuario
  async getTransactionsByUserId(userId, filters = {}) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let transactions = TRANSACCIONES_DEMO.filter(t => t.usuario_id === userId);
    
    // Aplicar filtros si existen
    if (filters.tipo) {
      transactions = transactions.filter(t => t.tipo === filters.tipo);
    }
    
    if (filters.estado) {
      transactions = transactions.filter(t => t.estado === filters.estado);
    }
    
    if (filters.fecha_desde) {
      transactions = transactions.filter(t => new Date(t.fecha_creacion) >= new Date(filters.fecha_desde));
    }
    
    if (filters.fecha_hasta) {
      transactions = transactions.filter(t => new Date(t.fecha_creacion) <= new Date(filters.fecha_hasta));
    }
    
    // Ordenar por fecha descendente (más recientes primero)
    transactions.sort((a, b) => new Date(b.fecha_creacion) - new Date(a.fecha_creacion));
    
    return { 
      data: transactions,
      total: transactions.length 
    };
  },

  // Obtener una transacción específica
  async getTransactionById(transactionId) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const transaction = TRANSACCIONES_DEMO.find(t => t.id === transactionId);
    
    if (!transaction) {
      throw new Error('Transacción no encontrada');
    }
    
    return { data: transaction };
  },

  // Crear nueva transacción (para futuro uso con backend real)
  async createTransaction(transactionData) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const newTransaction = {
      id: `trans-${Date.now()}`,
      fecha_creacion: new Date().toISOString(),
      estado: 'PENDIENTE',
      ...transactionData
    };
    
    // En una app real, esto se enviaría al backend
    console.log('Nueva transacción creada (DEMO):', newTransaction);
    
    return { data: newTransaction };
  },

  // Actualizar saldo de billetera (simulado)
  async updateWalletBalance(userId, newBalance) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const walletIndex = BILLETERAS_DEMO.findIndex(w => w.usuario_id === userId);
    
    if (walletIndex === -1) {
      throw new Error('Billetera no encontrada');
    }
    
    BILLETERAS_DEMO[walletIndex] = {
      ...BILLETERAS_DEMO[walletIndex],
      ...newBalance,
      fecha_actualizacion: new Date().toISOString()
    };
    
    return { data: BILLETERAS_DEMO[walletIndex] };
  }
};