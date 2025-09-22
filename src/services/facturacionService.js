// src/services/facturacionService.js
import api from './api';
import { API_ROUTES } from '../utils/constants';

/**
 * Servicio para gestionar facturación
 */
export const facturacionService = {
  /**
   * Obtiene todas las facturaciones
   * @returns {Promise} Promesa con la respuesta
   */
  getAll: async () => {
    try {
      const response = await api.get(API_ROUTES.FACTURACION);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtiene una facturación por su ID
   * @param {string} id - ID de la facturación
   * @returns {Promise} Promesa con la respuesta
   */
  getById: async (id) => {
    try {
      const response = await api.get(API_ROUTES.FACTURACION_POR_ID(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Crea una nueva facturación
   * @param {Object} facturacionData - Datos de la facturación
   * @returns {Promise} Promesa con la respuesta
   */
  create: async (facturacionData) => {
    try {
      const response = await api.post(API_ROUTES.FACTURACION, facturacionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Actualiza una facturación existente
   * @param {string} id - ID de la facturación
   * @param {Object} facturacionData - Datos actualizados de la facturación
   * @returns {Promise} Promesa con la respuesta
   */
  update: async (id, facturacionData) => {
    try {
      const response = await api.put(API_ROUTES.FACTURACION_POR_ID(id), facturacionData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Valida una facturación
   * @param {string} id - ID de la facturación
   * @returns {Promise} Promesa con la respuesta
   */
  validate: async (id) => {
    try {
      const response = await api.patch(API_ROUTES.VALIDAR_FACTURACION(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Revoca una facturación
   * @param {string} id - ID de la facturación
   * @returns {Promise} Promesa con la respuesta
   */
  revoke: async (id) => {
    try {
      const response = await api.patch(API_ROUTES.REVOCAR_FACTURACION(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtiene todas las facturaciones de un cliente
   * @param {string} clienteId - ID del cliente
   * @returns {Promise} Promesa con la respuesta
   */
  getByCliente: async (clienteId) => {
    try {
      const response = await api.get(API_ROUTES.FACTURACIONES_CLIENTE(clienteId));
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default facturacionService;