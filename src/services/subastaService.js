// src/services/subastaService.js
import { api } from './api';
import { API_ROUTES } from '../utils/constants';

const subastaService = {
  getAll: async () => {
    try {
      const response = await api.get(API_ROUTES.SUBASTAS);
      return response.data;
    } catch (error) {
      console.error('Error al obtener subastas:', error);
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`${API_ROUTES.SUBASTAS}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener subasta con ID ${id}:`, error);
      throw error;
    }
  },

  create: async (subastaData) => {
    try {
      const response = await api.post(API_ROUTES.SUBASTAS, subastaData);
      return response.data;
    } catch (error) {
      console.error('Error al crear subasta:', error);
      throw error;
    }
  },

  update: async (id, subastaData) => {
    try {
      const response = await api.put(`${API_ROUTES.SUBASTAS}/${id}`, subastaData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar subasta con ID ${id}:`, error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`${API_ROUTES.SUBASTAS}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar subasta con ID ${id}:`, error);
      throw error;
    }
  },

  close: async (id) => {
    try {
      const response = await api.patch(`${API_ROUTES.SUBASTAS}/${id}/close`);
      return response.data;
    } catch (error) {
      console.error(`Error al cerrar subasta con ID ${id}:`, error);
      throw error;
    }
  }
};

export default subastaService;