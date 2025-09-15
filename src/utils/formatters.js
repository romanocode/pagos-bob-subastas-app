// src/utils/formatters.js
export const formatCurrency = (amount, currency = 'CLP') => {
  if (amount == null || amount === undefined) return '$0';
  
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString, options = {}) => {
  if (!dateString) return 'Fecha no disponible';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  
  try {
    return new Date(dateString).toLocaleDateString('es-CL', {
      ...defaultOptions,
      ...options,
    });
  } catch (error) {
    return 'Fecha inválida';
  }
};

export const formatDateShort = (dateString) => {
  return formatDate(dateString, {
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateLong = (dateString) => {
  return formatDate(dateString, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getStatusColor = (status) => {
  const colors = {
    PENDIENTE: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    VALIDADO: 'bg-green-100 text-green-800 border-green-200',
    RECHAZADO: 'bg-red-100 text-red-800 border-red-200',
    PROCESADO: 'bg-blue-100 text-blue-800 border-blue-200',
    FINALIZADA: 'bg-gray-100 text-gray-800 border-gray-200',
    CANCELADA: 'bg-red-100 text-red-800 border-red-200',
    SOLICITADO: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    APROBADO: 'bg-green-100 text-green-800 border-green-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};

export const getStatusText = (status) => {
  const statusTexts = {
    PENDIENTE: 'Pendiente',
    VALIDADO: 'Validado',
    RECHAZADO: 'Rechazado',
    PROCESADO: 'Procesado',
    FINALIZADA: 'Finalizada',
    CANCELADA: 'Cancelada',
    SOLICITADO: 'Solicitado',
    APROBADO: 'Aprobado',
  };
  return statusTexts[status] || status;
};

export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Formato chileno: +56 9 1234 5678
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('569') && cleaned.length === 11) {
    return `+56 9 ${cleaned.slice(3, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
};

export const formatRUT = (rut) => {
  if (!rut) return '';
  
  // Formato RUT chileno: 12.345.678-9
  const cleaned = rut.replace(/\D/g, '');
  if (cleaned.length >= 7) {
    const dv = cleaned.slice(-1);
    const number = cleaned.slice(0, -1);
    return `${number.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}-${dv}`;
  }
  return rut;
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const formatPercentage = (value, decimals = 1) => {
  if (value == null) return '0%';
  return `${(value * 100).toFixed(decimals)}%`;
};