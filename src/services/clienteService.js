// src/services/clienteService.js
import api from './api';
import { API_ROUTES } from '../utils/constants';

/**
 * Servicio para gestionar clientes
 */
export const clienteService = {
  /**
   * Obtiene todos los clientes
   * @returns {Promise} Promesa con la respuesta
   */
  getAll: async () => {
    try {
      const response = await api.get(API_ROUTES.CLIENTES);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtiene un cliente por su ID
   * @param {string} id - ID del cliente
   * @returns {Promise} Promesa con la respuesta
   */
  getById: async (id) => {
    try {
      const response = await api.get(API_ROUTES.CLIENTE_POR_ID(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Crea un nuevo cliente
   * @param {Object} clienteData - Datos del cliente
   * @returns {Promise} Promesa con la respuesta
   */
  create: async (clienteData) => {
    try {
      const response = await api.post(API_ROUTES.CLIENTES, clienteData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Actualiza un cliente existente
   * @param {string} id - ID del cliente
   * @param {Object} clienteData - Datos actualizados del cliente
   * @returns {Promise} Promesa con la respuesta
   */
  update: async (id, clienteData) => {
    try {
      const response = await api.put(API_ROUTES.CLIENTE_POR_ID(id), clienteData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Elimina un cliente
   * @param {string} id - ID del cliente
   * @returns {Promise} Promesa con la respuesta
   */
  delete: async (id) => {
    try {
      const response = await api.delete(API_ROUTES.CLIENTE_POR_ID(id));
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default clienteService;