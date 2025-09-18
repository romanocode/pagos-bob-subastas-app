// src/components/cliente/SolicitudReembolso.jsx
import React, { useState, useEffect } from 'react';
import Card from '../common/Card';
import Input from '../common/Input';
import Button from '../common/Button';
import { validateReembolso } from '../../utils/validators';
import { MENSAJES } from '../../utils/constants';

const SolicitudReembolso = ({ garantias, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    garantia_id: '',
    monto: '',
    banco: '',
    cuentaDeposito: ''
  });
  const [errors, setErrors] = useState({});
  const [garantiaSeleccionada, setGarantiaSeleccionada] = useState(null);

  useEffect(() => {
    if (formData.garantia_id && formData.garantia_id !== 'nueva') {
      const garantia = garantias.find(g => g.id === formData.garantia_id);
      if (garantia) {
        setGarantiaSeleccionada(garantia);
        setFormData(prev => ({
          ...prev,
          monto: garantia.monto,
          banco: garantia.banco,
          cuentaDeposito: garantia.cuentaDeposito
        }));
      }
    } else if (formData.garantia_id === 'nueva') {
      setGarantiaSeleccionada(null);
      setFormData(prev => ({
        ...prev,
        monto: '',
        banco: '',
        cuentaDeposito: ''
      }));
    }
  }, [formData.garantia_id, garantias]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar errores al cambiar un campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar formulario
    const validation = validateReembolso(formData);
    if (!validation.isValid) {
      setErrors({
        ...errors,
        general: validation.error,
        fields: validation.missingFields
      });
      return;
    }

    // Enviar datos
    const dataToSubmit = {
      ...formData,
      garantia_id: formData.garantia_id === 'nueva' ? null : formData.garantia_id
    };
    
    onSubmit(dataToSubmit);
  };

  return (
    <Card title="Solicitar Reembolso">
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {errors.general}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Seleccione garantía
          </label>
          <select
            name="garantia_id"
            value={formData.garantia_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccione una opción</option>
            <option value="nueva">Nueva solicitud (sin garantía)</option>
            {garantias.map(garantia => (
              <option key={garantia.id} value={garantia.id}>
                {garantia.id} - {garantia.tipo} - {garantia.moneda} {garantia.monto}
              </option>
            ))}
          </select>
          {errors.fields?.includes('garantia_id') && (
            <p className="text-red-500 text-xs mt-1">Este campo es requerido</p>
          )}
        </div>

        <Input
          label="Monto"
          name="monto"
          type="number"
          value={formData.monto}
          onChange={handleChange}
          placeholder="Ingrese el monto"
          error={errors.fields?.includes('monto') ? 'Este campo es requerido' : ''}
          disabled={garantiaSeleccionada !== null}
        />

        <Input
          label="Banco"
          name="banco"
          value={formData.banco}
          onChange={handleChange}
          placeholder="Ingrese el banco"
          error={errors.fields?.includes('banco') ? 'Este campo es requerido' : ''}
        />

        <Input
          label="Cuenta de Depósito"
          name="cuentaDeposito"
          value={formData.cuentaDeposito}
          onChange={handleChange}
          placeholder="Ingrese la cuenta de depósito"
          error={errors.fields?.includes('cuentaDeposito') ? 'Este campo es requerido' : ''}
        />

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
          >
            {isLoading ? 'Enviando...' : 'Solicitar Reembolso'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default SolicitudReembolso;