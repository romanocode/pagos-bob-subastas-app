/**
 * Constantes del Sistema de Pagos - Bob Subastas
 * Basado en la documentación: doc-app-bob.md
 */

// Estados de Garantías
export const GARANTIA_ESTADOS = {
  PENDIENTE_VALIDACION: 'PV',
  VALIDADO: 'V'
};

// Estados de Reembolsos
export const REEMBOLSO_ESTADOS = {
  PENDIENTE: 'P',
  APROBADO: 'A',
  REEMBOLSADO: 'R',
  CANCELADO: 'cancelado'
};

// Tipos de Garantías
export const GARANTIA_TIPOS = {
  EFECTIVO: 'efectivo',
  VEHICULAR: 'vehicular'
};

// Monedas
export const MONEDAS = {
  USD: 'USD',
  PEN: 'PEN'
};

// Rutas de la API
export const API_ROUTES = {
  // Clientes
  CLIENTES: '/clientes',
  CLIENTE_POR_ID: (id) => `/clientes/${id}`,
  
  // Garantías
  GARANTIAS: '/garantias',
  GARANTIA_POR_ID: (id) => `/garantias/${id}`,
  VALIDAR_GARANTIA: (id) => `/garantias/${id}/validate`,
  
  // Reembolsos
  REEMBOLSOS: '/reembolsos',
  REEMBOLSO_POR_ID: (id) => `/reembolsos/${id}`,
  APROBAR_REEMBOLSO: (id) => `/reembolsos/${id}/validate`,
  MARCAR_REEMBOLSADO: (id) => `/reembolsos/${id}/reimburse`
};

// Mensajes del sistema
export const MENSAJES = {
  // Éxito
  CLIENTE_CREADO: 'Cliente creado exitosamente',
  CLIENTE_ACTUALIZADO: 'Cliente actualizado exitosamente',
  CLIENTE_ANULADO: 'Cliente anulado exitosamente',
  CLIENTE_ACTIVADO: 'Cliente activado exitosamente',
  CLIENTE_INACTIVADO: 'Cliente inactivado exitosamente',
  
  GARANTIA_CREADA: 'Garantía registrada exitosamente',
  GARANTIA_ACTUALIZADA: 'Garantía actualizada exitosamente',
  GARANTIA_VALIDADA: 'Garantía validada exitosamente',
  GARANTIA_ELIMINADA: 'Garantía eliminada exitosamente',
  
  REEMBOLSO_CREADO: 'Reembolso registrado exitosamente',
  REEMBOLSO_ACTUALIZADO: 'Reembolso actualizado exitosamente',
  REEMBOLSO_APROBADO: 'Reembolso aprobado exitosamente',
  REEMBOLSO_COMPLETADO: 'Reembolso marcado como completado exitosamente',
  REEMBOLSO_CANCELADO: 'Reembolso cancelado exitosamente',
  REEMBOLSO_PROCESANDO: 'Reembolso en proceso de pago',
  REEMBOLSO_RECHAZADO: 'Reembolso rechazado',
  
  // Errores
  ERROR_CAMPOS_REQUERIDOS: 'Por favor complete todos los campos requeridos',
  ERROR_CORREO_INVALIDO: 'El formato de correo electrónico no es válido',
  ERROR_CORREO_DUPLICADO: 'Ya existe un cliente con este correo electrónico',
  ERROR_CLIENTE_NO_ENCONTRADO: 'Cliente no encontrado',
  ERROR_GARANTIA_NO_ENCONTRADA: 'Garantía no encontrada',
  ERROR_REEMBOLSO_NO_ENCONTRADO: 'Reembolso no encontrado',
  ERROR_SERVIDOR: 'Error en el servidor. Intente nuevamente más tarde'
};