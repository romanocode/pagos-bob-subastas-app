// src/pages/admin/GestionGarantias.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import GarantiasTable from '../../components/admin/GarantiasTable';
import Card from '../../components/common/Card';
import garantiaService from '../../services/garantiaService';
import { GARANTIAS_DEMO } from '../../data/mockData';
import { MENSAJES } from '../../utils/constants';

const GestionGarantias = () => {
  const [garantias, setGarantias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    cargarGarantias();
  }, []);

  const cargarGarantias = async () => {
    setIsLoading(true);
    try {
      // En un entorno real, esto sería:
      // const data = await garantiaService.getAll();
      // setGarantias(data);
      
      // Para demo, usamos datos de prueba
      setTimeout(() => {
        setGarantias(GARANTIAS_DEMO);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error al cargar garantías:', error);
      toast.error(MENSAJES.ERROR_SERVIDOR);
      setIsLoading(false);
    }
  };

  const handleValidate = async (id) => {
    try {
      // En un entorno real, esto sería:
      // await garantiaService.validate(id);
      
      // Para demo, actualizamos el estado local
      setGarantias(prev => 
        prev.map(garantia => 
          garantia.id === id 
            ? { ...garantia, estado: 'V', fechaValidacion: new Date().toISOString() } 
            : garantia
        )
      );
      
      toast.success(MENSAJES.GARANTIA_VALIDADA);
    } catch (error) {
      console.error('Error al validar garantía:', error);
      toast.error(MENSAJES.ERROR_SERVIDOR);
    }
  };

  const handleDelete = async (id) => {
    try {
      // En un entorno real, esto sería:
      // await garantiaService.delete(id);
      
      // Para demo, actualizamos el estado local
      setGarantias(prev => prev.filter(garantia => garantia.id !== id));
      
      toast.success(MENSAJES.GARANTIA_ELIMINADA);
    } catch (error) {
      console.error('Error al eliminar garantía:', error);
      toast.error(MENSAJES.ERROR_SERVIDOR);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Gestión de Garantías</h1>
      
      <Card>
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Listado de Garantías</h2>
          <button 
            onClick={cargarGarantias}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            disabled={isLoading}
          >
            {isLoading ? 'Cargando...' : 'Actualizar'}
          </button>
        </div>
        
        {isLoading ? (
          <div className="text-center py-8">Cargando garantías...</div>
        ) : garantias.length === 0 ? (
          <div className="text-center py-8">No hay garantías registradas</div>
        ) : (
          <GarantiasTable 
            garantias={garantias} 
            onValidate={handleValidate} 
            onDelete={handleDelete} 
          />
        )}
      </Card>
    </div>
  );
};

export default GestionGarantias;