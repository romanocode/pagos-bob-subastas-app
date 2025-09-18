// src/pages/cliente/RegistrarGarantia.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import garantiaService from '../../services/garantiaService';
import { MENSAJES, GARANTIA_TIPOS, MONEDAS } from '../../utils/constants';

const RegistrarGarantia = () => {
  const [formData, setFormData] = useState({
    tipo: GARANTIA_TIPOS.EFECTIVO,
    monto: '',
    moneda: MONEDAS.USD,
    descripcion: '',
    comprobante: null
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      comprobante: e.target.files[0]
    });
    
    // Limpiar error del campo
    if (errors.comprobante) {
      setErrors({
        ...errors,
        comprobante: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.tipo) {
      newErrors.tipo = 'El tipo de garantía es requerido';
    }
    
    if (!formData.monto || isNaN(formData.monto) || parseFloat(formData.monto) <= 0) {
      newErrors.monto = 'Ingrese un monto válido';
    }
    
    if (!formData.moneda) {
      newErrors.moneda = 'La moneda es requerida';
    }
    
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }
    
    if (formData.tipo === GARANTIA_TIPOS.VEHICULAR && !formData.comprobante) {
      newErrors.comprobante = 'El comprobante es requerido para garantías vehiculares';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      // En un entorno real, esto sería:
      // const formDataToSend = new FormData();
      // formDataToSend.append('tipo', formData.tipo);
      // formDataToSend.append('monto', formData.monto);
      // formDataToSend.append('moneda', formData.moneda);
      // formDataToSend.append('descripcion', formData.descripcion);
      // formDataToSend.append('cliente_id', currentUser.id);
      // if (formData.comprobante) {
      //   formDataToSend.append('comprobante', formData.comprobante);
      // }
      // await garantiaService.create(formDataToSend);
      
      // Para demo, simulamos la creación
      setTimeout(() => {
        toast.success(MENSAJES.GARANTIA_CREADA);
        setIsSubmitting(false);
        navigate('/cliente/garantias');
      }, 1000);
    } catch (error) {
      console.error('Error al registrar garantía:', error);
      toast.error(MENSAJES.ERROR_SERVIDOR);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Registrar Nueva Garantía</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tipo de Garantía */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Garantía *
              </label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${errors.tipo ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value={GARANTIA_TIPOS.EFECTIVO}>Efectivo</option>
                <option value={GARANTIA_TIPOS.VEHICULAR}>Vehicular</option>
              </select>
              {errors.tipo && <p className="mt-1 text-sm text-red-600">{errors.tipo}</p>}
            </div>
            
            {/* Moneda */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Moneda *
              </label>
              <select
                name="moneda"
                value={formData.moneda}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${errors.moneda ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value={MONEDAS.USD}>USD - Dólar Americano</option>
                <option value={MONEDAS.PEN}>PEN - Sol Peruano</option>
              </select>
              {errors.moneda && <p className="mt-1 text-sm text-red-600">{errors.moneda}</p>}
            </div>
            
            {/* Monto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto *
              </label>
              <input
                type="number"
                name="monto"
                value={formData.monto}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={`w-full px-3 py-2 border rounded-md ${errors.monto ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.monto && <p className="mt-1 text-sm text-red-600">{errors.monto}</p>}
            </div>
            
            {/* Comprobante (solo para garantías vehiculares) */}
            {formData.tipo === GARANTIA_TIPOS.VEHICULAR && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comprobante *
                </label>
                <input
                  type="file"
                  name="comprobante"
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                  className={`w-full px-3 py-2 border rounded-md ${errors.comprobante ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.comprobante && <p className="mt-1 text-sm text-red-600">{errors.comprobante}</p>}
                <p className="mt-1 text-xs text-gray-500">Formatos aceptados: JPG, PNG, PDF. Máximo 5MB.</p>
              </div>
            )}
            
            {/* Descripción */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción *
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="4"
                placeholder="Describa los detalles de la garantía..."
                className={`w-full px-3 py-2 border rounded-md ${errors.descripcion ? 'border-red-500' : 'border-gray-300'}`}
              ></textarea>
              {errors.descripcion && <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>}
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={() => navigate('/cliente/garantias')}
              className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md mr-4 hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
            >
              {isSubmitting ? 'Registrando...' : 'Registrar Garantía'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrarGarantia;