// src/data/mockData.js
export const USUARIOS_DEMO = [
  {
    id: 'user-1',
    email: 'cliente.demo@bob.com',
    nombre: 'Carlos Mendez',
    telefono: '+56912345678',
    tipo_usuario: 'CLIENTE',
    tipoDocumento: 'DNI',
    numeroDocumento: '12345678',
    celular: '+56912345678',
    esta_activo: true
  },
  {
    id: 'admin-1',
    email: 'admin.demo@bob.com',
    nombre: 'Ana Rodriguez',
    telefono: '+56987654321',
    tipo_usuario: 'ADMIN_FINANCIERO',
    tipoDocumento: 'DNI',
    numeroDocumento: '87654321',
    celular: '+56987654321',
    esta_activo: true
  },
  {
    id: 'xander-1',
    email: 'xander@demo.com',
    nombre: 'Xander Demo',
    telefono: '+56955555555',
    tipo_usuario: 'XANDER',
    tipoDocumento: 'DNI',
    numeroDocumento: '55555555',
    celular: '+56955555555',
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

// Datos de garantías según la documentación
export const GARANTIAS_DEMO = [
  {
    id: 'garantia-1',
    cliente_id: 'user-1',
    tipo: 'efectivo',
    fechaSubasta: '2025-09-01',
    moneda: 'USD',
    monto: 1500,
    banco: 'Banco Internacional',
    cuentaDeposito: '123-456-789',
    estado: 'V', // Validado
    fechaCreacion: '2025-08-25T10:00:00Z',
    fechaValidacion: '2025-08-26T14:30:00Z'
  },
  {
    id: 'garantia-2',
    cliente_id: 'user-1',
    tipo: 'vehicular',
    fechaSubasta: '2025-09-15',
    moneda: 'PEN',
    monto: 5000,
    banco: 'Banco de Crédito',
    cuentaDeposito: '987-654-321',
    placa: 'ABC-123',
    empresa: 'Transportes XYZ',
    estado: 'PV', // Pendiente de validación
    fechaCreacion: '2025-09-10T09:15:00Z'
  }
];

// Datos de reembolsos según la documentación
export const REEMBOLSOS_DEMO = [
  {
    id: 'reembolso-1',
    garantia_id: 'garantia-1',
    cliente_id: 'user-1',
    cliente_nombre: 'Juan Pérez',
    monto: 1500,
    banco: 'Banco Internacional',
    cuentaDeposito: '123-456-789',
    estado: 'R', // Reembolsado
    fecha_solicitud: '2025-09-05T16:20:00Z',
    fecha_aprobacion: '2025-09-06T10:45:00Z',
    fecha_reembolso: '2025-09-07T14:30:00Z'
  },
  {
    id: 'reembolso-2',
    garantia_id: 'garantia-2',
    cliente_id: 'user-1',
    cliente_nombre: 'Juan Pérez',
    monto: 5000,
    banco: 'Banco de Crédito',
    cuentaDeposito: '987-654-321',
    estado: 'P', // Pendiente
    fecha_solicitud: '2025-09-16T11:30:00Z'
  },
  {
    id: 'reembolso-3',
    garantia_id: 'garantia-3',
    cliente_id: 'user-1',
    cliente_nombre: 'Juan Pérez',
    monto: 2500,
    banco: 'Banco Continental',
    cuentaDeposito: '555-666-777',
    estado: 'A', // Aprobado
    fecha_solicitud: '2025-09-20T09:00:00Z',
    fecha_aprobacion: '2025-09-21T15:20:00Z'
  },
  {
    id: 'reembolso-4',
    garantia_id: 'garantia-4',
    cliente_id: 'user-2',
    cliente_nombre: 'María López',
    monto: 3000,
    banco: 'Banco de la Nación',
    cuentaDeposito: '111-222-333',
    estado: 'P', // Pendiente
    fecha_solicitud: '2025-09-22T14:15:00Z'
  },
  {
    id: 'reembolso-5',
    garantia_id: 'garantia-5',
    cliente_id: 'user-2',
    cliente_nombre: 'María López',
    monto: 4500,
    banco: 'Banco Interbank',
    cuentaDeposito: '444-555-666',
    estado: 'procesando', // Procesando
    fecha_solicitud: '2025-09-18T10:30:00Z',
    fecha_aprobacion: '2025-09-19T09:45:00Z'
  }
];