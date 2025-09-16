// src/pages/cliente/SolicitarReembolso.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SolicitudReembolso from '../../components/cliente/SolicitudReembolso';
import { useAuth } from '../../context/AuthContext';
import reembolsoService from '../../services/reembolsoService';
import garantiaService from '../../services/garantiaService';
import { GARANTIAS_DEMO } from '../../data/mockData';
import { MENSAJES } from '../../utils/constants';

const SolicitarReembolsoPage = () => {
  const [garantias, setGarantias] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    cargarGarantias();
  }, []);

  const cargarGarantias = async () => {
    setIsLoading(true);
    try {
      // En un entorno real, esto sería:
      // const data = await garantiaService.getAll();
      // const garantiasValidadas = data.filter(g => g.estado === 'V' && g.cliente_id === currentUser.id);
      // setGarantias(garantiasValidadas);
      
      // Para demo, usamos datos de prueba
      setTimeout(() => {
        const garantiasValidadas = GARANTIAS_DEMO.filter(
          g => g.estado === 'V' && g.cliente_id === currentUser.id
        );
        setGarantias(garantiasValidadas);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error al cargar garantías:', error);
      toast.error(MENSAJES.ERROR_SERVIDOR);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      // En un entorno real, esto sería:
      // await reembolsoService.create({
      //   ...formData,
      //   cliente_id: currentUser.id
      // });
      
      // Para demo, simulamos la creación
      setTimeout(() => {
        toast.success(MENSAJES.REEMBOLSO_CREADO);
        setIsSubmitting(false);
        navigate('/cliente/reembolsos');
      }, 1000);
    } catch (error) {
      console.error('Error al solicitar reembolso:', error);
      toast.error(MENSAJES.ERROR_SERVIDOR);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Solicitar Reembolso</h1>
      
      {isLoading ? (
        <div className="text-center py-8">Cargando garantías disponibles...</div>
      ) : (
        <SolicitudReembolso 
          garantias={garantias} 
          onSubmit={handleSubmit} 
          isLoading={isSubmitting} 
        />
      )}
    </div>
  );
};

export default SolicitarReembolsoPage;