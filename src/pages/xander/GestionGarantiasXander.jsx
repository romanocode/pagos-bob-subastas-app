// src/pages/xander/GestionGarantiasXander.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { garantiaService } from '../../services/garantiaService';
import { GARANTIA_ESTADOS, MENSAJES } from '../../utils/constants';

const GestionGarantiasXander = () => {
  const [garantias, setGarantias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedGarantia, setSelectedGarantia] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState('');

  useEffect(() => {
    const fetchGarantias = async () => {
      try {
        const response = await garantiaService.getAll();
        if (response.success) {
          setGarantias(response.data);
        } else {
          toast.error('Error al cargar garantías');
        }
      } catch (error) {
        console.error('Error al cargar garantías:', error);
        toast.error('Error al cargar garantías');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGarantias();
  }, []);

  const handleValidar = (garantia) => {
    setSelectedGarantia(garantia);
    setModalAction('validar');
    setIsModalOpen(true);
  };

  const handleRechazar = (garantia) => {
    setSelectedGarantia(garantia);
    setModalAction('rechazar');
    setIsModalOpen(true);
  };

  const handleEjecutar = (garantia) => {
    setSelectedGarantia(garantia);
    setModalAction('ejecutar');
    setIsModalOpen(true);
  };

  const handleConfirmAction = async () => {
    try {
      let response;
      let message;
      
      switch (modalAction) {
        case 'validar':
          response = await garantiaService.validate(selectedGarantia.id);
          message = MENSAJES.GARANTIA_VALIDADA;
          break;
        case 'rechazar':
          // Rechazar una garantía es equivalente a eliminarla según la API
          response = await garantiaService.delete(selectedGarantia.id);
          message = MENSAJES.GARANTIA_ELIMINADA;
          break;
        case 'ejecutar':
          // No hay un endpoint específico para ejecutar garantías en la API
          // Usamos update para cambiar algún campo relevante
          response = await garantiaService.update(selectedGarantia.id, {
            ...selectedGarantia,
            estado: GARANTIA_ESTADOS.VALIDADO,
            ejecutada: true
          });
          message = 'Garantía ejecutada exitosamente';
          break;
        default:
          return;
      }
      
      if (response.success) {
        toast.success(message);
        
        // Actualizar la lista de garantías
        const updatedResponse = await garantiaService.getAll();
        if (updatedResponse.success) {
          setGarantias(updatedResponse.data);
        }
      } else {
        toast.error(`Error: ${response.message || 'No se pudo completar la acción'}`);
      }
    } catch (error) {
      console.error(`Error al ${modalAction} garantía:`, error);
      toast.error(`Error al ${modalAction} la garantía`);
    } finally {
      setIsModalOpen(false);
      setSelectedGarantia(null);
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id', width: '10%' },
    { header: 'Tipo', accessor: 'tipo', width: '10%' },
    { header: 'Monto', accessor: 'monto', width: '15%', 
      render: (row) => `$${row.monto.toLocaleString()}` },
    { header: 'Estado', accessor: 'estado', width: '15%',
      render: (row) => {
        const estado = row.estado;
        let variant = 'default';
        let displayText = estado;
        
        if (estado === GARANTIA_ESTADOS.PENDIENTE_VALIDACION) {
          variant = 'warning';
          displayText = 'Pendiente de Validación';
        }
        if (estado === GARANTIA_ESTADOS.VALIDADO) {
          variant = 'success';
          displayText = 'Validada';
        }
        
        return <Badge variant={variant}>{displayText}</Badge>;
      }
    },
    { header: 'Fecha', accessor: 'fecha_creacion', width: '15%',
      render: (row) => new Date(row.fecha_creacion).toLocaleDateString() },
    { header: 'Cliente', accessor: 'cliente_nombre', width: '15%' },
    { header: 'Acciones', accessor: '', width: '20%',
      render: (row) => (
        <div className="flex space-x-2">
          {row.estado === GARANTIA_ESTADOS.PENDIENTE_VALIDACION && (
            <>
              <Button 
                size="sm" 
                variant="success" 
                onClick={() => handleValidar(row)}
              >
                Validar
              </Button>
              <Button 
                size="sm" 
                variant="danger" 
                onClick={() => handleRechazar(row)}
              >
                Rechazar
              </Button>
            </>
          )}
          {row.estado === GARANTIA_ESTADOS.VALIDADO && (
            <Button 
              size="sm" 
              variant="primary" 
              onClick={() => handleEjecutar(row)}
            >
              Ejecutar
            </Button>
          )}
        </div>
      )
    }
  ];

  const getModalTitle = () => {
    switch (modalAction) {
      case 'validar': return 'Validar Garantía';
      case 'rechazar': return 'Rechazar Garantía';
      case 'ejecutar': return 'Ejecutar Garantía';
      default: return '';
    }
  };

  const getModalContent = () => {
    if (!selectedGarantia) return null;
    
    let actionText = '';
    switch (modalAction) {
      case 'validar':
        actionText = 'validar';
        break;
      case 'rechazar':
        actionText = 'rechazar';
        break;
      case 'ejecutar':
        actionText = 'ejecutar';
        break;
      default:
        return null;
    }
    
    return (
      <div>
        <p className="mb-4">
          ¿Está seguro que desea {actionText} la garantía <span className="font-semibold">#{selectedGarantia.id}</span> por un monto de <span className="font-semibold">${selectedGarantia.monto.toLocaleString()}</span>?
        </p>
        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleConfirmAction}>
            Confirmar
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestión de Garantías</h1>
        <p className="text-gray-600">
          Administre las garantías de los clientes.
        </p>
      </div>

      <Card>
        <Table 
          columns={columns}
          data={garantias}
          isLoading={isLoading}
          emptyMessage="No hay garantías registradas"
        />
      </Card>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title={getModalTitle()}
      >
        {getModalContent()}
      </Modal>
    </div>
  );
};

export default GestionGarantiasXander;