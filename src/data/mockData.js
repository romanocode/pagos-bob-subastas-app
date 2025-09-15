// src/data/mockData.js
export const USUARIOS_DEMO = [
  {
    id: 'user-1',
    email: 'cliente.demo@bob.com',
    nombre: 'Carlos Mendez',
    telefono: '+56912345678',
    tipo_usuario: 'CLIENTE',
    esta_activo: true
  },
  {
    id: 'admin-1',
    email: 'admin.demo@bob.com',
    nombre: 'Ana Rodriguez',
    telefono: '+56987654321',
    tipo_usuario: 'ADMIN_FINANCIERO',
    esta_activo: true
  }
];

export const SUBASTAS_DEMO = [
  {
    id: 'subasta-1',
    titulo: 'Excavadora Caterpillar 320D',
    descripcion: 'Excavadora en excelente estado, 5000 horas de uso',
    precio_inicial: 15000000,
    precio_final: 18500000,
    monto_garantia: 1500000,
    estado: 'FINALIZADA',
    ganador_id: 'user-1',
    fecha_fin: '2025-09-01T15:00:00Z'
  },
  {
    id: 'subasta-2',
    titulo: 'Camión Mercedes Benz Actros',
    descripcion: 'Camión de carga pesada, modelo 2020',
    precio_inicial: 25000000,
    precio_final: 28000000,
    monto_garantia: 2500000,
    estado: 'FINALIZADA',
    ganador_id: 'user-2',
    fecha_fin: '2025-09-10T16:30:00Z'
  }
];

export const TRANSACCIONES_DEMO = [
  {
    id: 'trans-1',
    usuario_id: 'user-1',
    subasta_id: 'subasta-1',
    tipo: 'GARANTIA',
    monto: 1500000,
    estado: 'VALIDADO',
    referencia_bancaria: 'TRF2025090001',
    fecha_creacion: '2025-08-30T10:00:00Z'
  },
  {
    id: 'trans-2',
    usuario_id: 'user-1',
    tipo: 'DEPOSITO',
    monto: 5000000,
    estado: 'VALIDADO',
    referencia_bancaria: 'TRF2025090002',
    fecha_creacion: '2025-09-05T14:30:00Z'
  }
];

export const BILLETERAS_DEMO = [
  {
    id: 'wallet-1',
    usuario_id: 'user-1',
    saldo_disponible: 3200000,
    saldo_retenido: 1500000,
    saldo_total: 4700000
  }
];