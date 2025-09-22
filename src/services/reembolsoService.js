// src/services/reembolsoService.js
import api from './api';
import { API_ROUTES } from '../utils/constants';

/**
 * Servicio para gestionar reembolsos
 */
export const reembolsoService = {
  /**
   * Obtiene todos los reembolsos
   * @returns {Promise} Promesa con la respuesta
   */
  getAll: async () => {
    try {
      const response = await api.get(API_ROUTES.REEMBOLSOS);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtiene un reembolso por su ID
   * @param {string} id - ID del reembolso
   * @returns {Promise} Promesa con la respuesta
   */
  getById: async (id) => {
    try {
      const response = await api.get(API_ROUTES.REEMBOLSO_POR_ID(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Crea un nuevo reembolso
   * @param {Object} reembolsoData - Datos del reembolso
   * @returns {Promise} Promesa con la respuesta
   */
  create: async (reembolsoData) => {
    debugger;
    try {
      const response = await api.post(API_ROUTES.REEMBOLSOS, reembolsoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Actualiza un reembolso existente
   * @param {string} id - ID del reembolso
   * @param {Object} reembolsoData - Datos actualizados del reembolso
   * @returns {Promise} Promesa con la respuesta
   */
  update: async (id, reembolsoData) => {
    try {
      const response = await api.put(API_ROUTES.REEMBOLSO_POR_ID(id), reembolsoData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Aprueba un reembolso
   * @param {string} id - ID del reembolso
   * @returns {Promise} Promesa con la respuesta
   */
  approve: async (id) => {
    try {
      const response = await api.put(API_ROUTES.APROBAR_REEMBOLSO(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Marca un reembolso como reembolsado
   * @param {string} id - ID del reembolso
   * @returns {Promise} Promesa con la respuesta
   */
  markAsReimbursed: async (id) => {
    try {
      const response = await api.put(API_ROUTES.MARCAR_REEMBOLSADO(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Elimina un reembolso
   * @param {string} id - ID del reembolso
   * @returns {Promise} Promesa con la respuesta
   */
  delete: async (id) => {
    try {
      const response = await api.delete(API_ROUTES.REEMBOLSO_POR_ID(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtiene todos los reembolsos de un cliente
   * @param {string} clienteId - ID del cliente
   * @returns {Promise} Promesa con la respuesta
   */
  getByCliente: async (clienteId) => {
    try {
      const response = await api.get(API_ROUTES.REEMBOLSOS_CLIENTE(clienteId));
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default reembolsoService;