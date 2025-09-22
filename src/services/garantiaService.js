// src/services/garantiaService.js
import api from './api';
import { API_ROUTES } from '../utils/constants';

/**
 * Servicio para gestionar garantías
 */
export const garantiaService = {
  /**
   * Obtiene todas las garantías
   * @returns {Promise} Promesa con la respuesta
   */
  getAll: async () => {
    try {
      const response = await api.get(API_ROUTES.GARANTIAS);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtiene una garantía por su ID
   * @param {string} id - ID de la garantía
   * @returns {Promise} Promesa con la respuesta
   */
  getById: async (id) => {
    try {
      const response = await api.get(API_ROUTES.GARANTIA_POR_ID(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Crea una nueva garantía
   * @param {Object} garantiaData - Datos de la garantía
   * @returns {Promise} Promesa con la respuesta
   */
  create: async (garantiaData) => {
    try {
      const response = await api.post(API_ROUTES.GARANTIAS, garantiaData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Actualiza una garantía existente
   * @param {string} id - ID de la garantía
   * @param {Object} garantiaData - Datos actualizados de la garantía
   * @returns {Promise} Promesa con la respuesta
   */
  update: async (id, garantiaData) => {
    try {
      const response = await api.put(API_ROUTES.GARANTIA_POR_ID(id), garantiaData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Valida una garantía
   * @param {string} id - ID de la garantía
   * @returns {Promise} Promesa con la respuesta
   */
  validate: async (id) => {
    debugger;
    try {
      const response = await api.patch(API_ROUTES.VALIDAR_GARANTIA(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Invalidar una garantía
   */

  /**
   * Invalidar una garantía
   * @param {string} id - ID de la garantía
   * @returns {Promise} Promesa con la respuesta
   */
  invalidate: async (id) => {
    try {
      const response = await api.patch(API_ROUTES.INVALIDAR_GARANTIA(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtiene todas las garantías de un cliente específico
   * @param {string} clienteId - ID del cliente
   * @returns {Promise} Promesa con la respuesta
   */
  getByCliente: async (clienteId) => {
    try {
      const response = await api.get(API_ROUTES.GARANTIA_CLIENTE(clienteId));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Informa que la garantía ya ha sido enviado al cliente
   * @param {*} id ID de la garantía
   * @returns {Promise} Promesa con la respuesta
   */
  sentGarantia: async (id) => {
    try {
      const response = await api.patch(API_ROUTES.SENT_GARANTIA(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtiene todas las garantías enviadas a un cliente específico
   * @param {string} idGarantia - ID del cliente
   * @returns {Promise} Promesa con la respuesta
   */
  getSentByCliente: async (idGarantia, garantiaData) => {
    debugger;
    try {
      const response = await api.put(API_ROUTES.GARANTIA_SENT_CLIENTE(idGarantia), garantiaData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default garantiaService;