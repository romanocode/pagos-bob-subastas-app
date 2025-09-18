/**
 * Validadores para el Sistema de Pagos - Bob Subastas
 * Basado en la documentación: doc-app-bob.md
 */

/**
 * Valida que todos los campos requeridos estén presentes y no vacíos
 * @param {Object} data - Objeto con los datos a validar
 * @param {Array<string>} requiredFields - Array con los nombres de los campos requeridos
 * @returns {Object} - Objeto con el resultado de la validación
 */
export const validateRequiredFields = (data, requiredFields) => {
  const missingFields = [];
  
  requiredFields.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      missingFields.push(field);
    }
  });
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
};

/**
 * Valida que el formato de correo electrónico sea válido
 * @param {string} email - Correo electrónico a validar
 * @returns {boolean} - true si el formato es válido, false en caso contrario
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida los datos de un cliente
 * @param {Object} clienteData - Datos del cliente a validar
 * @returns {Object} - Objeto con el resultado de la validación
 */
export const validateCliente = (clienteData) => {
  const requiredFields = ['correo', 'nombreCompleto', 'tipoDocumento', 'numeroDocumento', 'celular'];
  const { isValid, missingFields } = validateRequiredFields(clienteData, requiredFields);
  
  if (!isValid) {
    return {
      isValid: false,
      error: 'Campos requeridos faltantes',
      missingFields
    };
  }
  
  if (!validateEmail(clienteData.correo)) {
    return {
      isValid: false,
      error: 'Formato de correo electrónico inválido'
    };
  }
  
  return { isValid: true };
};

/**
 * Valida los datos de una garantía
 * @param {Object} garantiaData - Datos de la garantía a validar
 * @returns {Object} - Objeto con el resultado de la validación
 */
export const validateGarantia = (garantiaData) => {
  const requiredFields = ['tipo', 'moneda', 'monto', 'descripcion'];
  const { isValid, missingFields } = validateRequiredFields(garantiaData, requiredFields);
  
  if (!isValid) {
    return {
      isValid: false,
      error: 'Campos requeridos faltantes',
      missingFields
    };
  }
  
  // Validación del monto
  if (isNaN(parseFloat(garantiaData.monto)) || parseFloat(garantiaData.monto) <= 0) {
    return {
      isValid: false,
      error: 'El monto debe ser un número positivo'
    };
  }
  
  // Validación adicional para garantías vehiculares
  if (garantiaData.tipo === 'vehicular') {
    if (!garantiaData.comprobante) {
      return {
        isValid: false,
        error: 'Para garantías vehiculares, el comprobante es obligatorio'
      };
    }
  }
  
  return { isValid: true };
};

/**
 * Valida los campos específicos de una garantía para el formulario
 * @param {Object} garantiaData - Datos de la garantía a validar
 * @returns {Object} - Objeto con errores por campo
 */
export const validateGarantiaForm = (garantiaData) => {
  const errors = {};
  
  if (!garantiaData.tipo || garantiaData.tipo.trim() === '') {
    errors.tipo = 'El tipo de garantía es requerido';
  }
  
  if (!garantiaData.monto || isNaN(garantiaData.monto) || parseFloat(garantiaData.monto) <= 0) {
    errors.monto = 'Ingrese un monto válido';
  }
  
  if (!garantiaData.moneda || garantiaData.moneda.trim() === '') {
    errors.moneda = 'La moneda es requerida';
  }
  
  if (!garantiaData.descripcion || garantiaData.descripcion.trim() === '') {
    errors.descripcion = 'La descripción es requerida';
  }
  
  // Validación específica para garantías vehiculares
  if (garantiaData.tipo === 'vehicular' && !garantiaData.comprobante) {
    errors.comprobante = 'El comprobante es requerido para garantías vehiculares';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};


/**
 * Valida los datos de un reembolso
 * @param {Object} reembolsoData - Datos del reembolso a validar
 * @returns {Object} - Objeto con el resultado de la validación
 */
export const validateReembolso = (reembolsoData) => {
  const requiredFields = ['garantia_id', 'motivo', 'banco_destino', 'cuenta_destino'];
  const { isValid, missingFields } = validateRequiredFields(reembolsoData, requiredFields);
  
  if (!isValid) {
    return {
      isValid: false,
      error: 'Campos requeridos faltantes',
      missingFields
    };
  }
  
  // Validación del motivo
  if (reembolsoData.motivo && reembolsoData.motivo.length < 10) {
    return {
      isValid: false,
      error: 'El motivo debe tener al menos 10 caracteres'
    };
  }
  
  return { isValid: true };
};

/**
 * Valida los campos específicos de un reembolso para el formulario
 * @param {Object} reembolsoData - Datos del reembolso a validar
 * @returns {Object} - Objeto con errores por campo
 */
export const validateReembolsoForm = (reembolsoData) => {
  const errors = {};
  
  if (!reembolsoData.garantia_id) {
    errors.garantia_id = 'Debe seleccionar una garantía';
  }
  
  if (!reembolsoData.motivo || reembolsoData.motivo.trim() === '') {
    errors.motivo = 'El motivo del reembolso es requerido';
  } else if (reembolsoData.motivo.length < 10) {
    errors.motivo = 'El motivo debe tener al menos 10 caracteres';
  }
  
  if (!reembolsoData.cuenta_destino || reembolsoData.cuenta_destino.trim() === '') {
    errors.cuenta_destino = 'La cuenta de destino es requerida';
  }
  
  if (!reembolsoData.banco_destino || reembolsoData.banco_destino.trim() === '') {
    errors.banco_destino = 'El banco de destino es requerido';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};