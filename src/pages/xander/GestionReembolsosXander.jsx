// src/pages/xander/GestionReembolsosXander.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import { reembolsoService } from '../../services/reembolsoService';
import { REEMBOLSO_ESTADOS, MENSAJES } from '../../utils/constants';

const GestionReembolsosXander = () => {
  const [reembolsos, setReembolsos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReembolso, setSelectedReembolso] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState('');

  useEffect(() => {
    const fetchReembolsos = async () => {
      try {
        const response = await reembolsoService.getAll();
        if (response.success) {
          setReembolsos(response.data);
        } else {
          toast.error('Error al cargar reembolsos');
        }
      } catch (error) {
        console.error('Error al cargar reembolsos:', error);
        toast.error('Error al cargar reembolsos');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReembolsos();
  }, []);

  const handleAprobar = (reembolso) => {
    setSelectedReembolso(reembolso);
    setModalAction('aprobar');
    setIsModalOpen(true);
  };

  const handleRechazar = (reembolso) => {
    setSelectedReembolso(reembolso);
    setModalAction('rechazar');
    setIsModalOpen(true);
  };

  const handleProcesar = (reembolso) => {
    setSelectedReembolso(reembolso);
    setModalAction('procesar');
    setIsModalOpen(true);
  };

  const handleConfirmAction = async () => {
    try {
      let response;
      let message;
      
      switch (modalAction) {
        case 'aprobar':
          response = await reembolsoService.approve(selectedReembolso.id);
          message = MENSAJES.REEMBOLSO_APROBADO;
          break;
        case 'rechazar':
          // Rechazar un reembolso es equivalente a cancelarlo según la API
          response = await reembolsoService.delete(selectedReembolso.id);
          message = MENSAJES.REEMBOLSO_CANCELADO;
          break;
        case 'procesar':
          // Marcar como reembolsado
          response = await reembolsoService.markAsReimbursed(selectedReembolso.id);
          message = MENSAJES.REEMBOLSO_COMPLETADO;
          break;
        default:
          return;
      }
      
      if (response.success) {
        toast.success(message);
        
        // Actualizar la lista de reembolsos
        const updatedResponse = await reembolsoService.getAll();
        if (updatedResponse.success) {
          setReembolsos(updatedResponse.data);
        }
      } else {
        toast.error(`Error: ${response.message || 'No se pudo completar la acción'}`);
      }
    } catch (error) {
      console.error(`Error al ${modalAction} reembolso:`, error);
      toast.error(`Error al ${modalAction} el reembolso`);
    } finally {
      setIsModalOpen(false);
      setSelectedReembolso(null);
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id', width: '10%' },
    { header: 'Garantía ID', accessor: 'garantia_id', width: '10%' },
    { header: 'Monto', accessor: 'monto', width: '15%', 
      render: (row) => `$${row.monto.toLocaleString()}` },
    { header: 'Estado', accessor: 'estado', width: '15%',
      render: (row) => {
        const estado = row.estado;
        let variant = 'default';
        let displayText = estado;
        
        if (estado === REEMBOLSO_ESTADOS.PENDIENTE) {
          variant = 'warning';
          displayText = 'Pendiente';
        }
        if (estado === REEMBOLSO_ESTADOS.APROBADO) {
          variant = 'success';
          displayText = 'Aprobado';
        }
        if (estado === REEMBOLSO_ESTADOS.REEMBOLSADO) {
          variant = 'info';
          displayText = 'Reembolsado';
        }
        if (estado === REEMBOLSO_ESTADOS.CANCELADO) {
          variant = 'danger';
          displayText = 'Cancelado';
        }
        
        return <Badge variant={variant}>{displayText}</Badge>;
      }
    },
    { header: 'Fecha', accessor: 'fecha_solicitud', width: '15%',
      render: (row) => new Date(row.fecha_solicitud).toLocaleDateString() },
    { header: 'Cliente', accessor: 'cliente_nombre', width: '15%' },
    { header: 'Acciones', accessor: '', width: '20%',
      render: (row) => (
        <div className="flex space-x-2">
          {row.estado === REEMBOLSO_ESTADOS.PENDIENTE && (
            <>
              <Button 
                size="sm" 
                variant="success" 
                onClick={() => handleAprobar(row)}
              >
                Aprobar
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
          {row.estado === REEMBOLSO_ESTADOS.APROBADO && (
            <Button 
              size="sm" 
              variant="primary" 
              onClick={() => handleProcesar(row)}
            >
              Procesar
            </Button>
          )}
        </div>
      )
    }
  ];

  const getModalTitle = () => {
    switch (modalAction) {
      case 'aprobar': return 'Aprobar Reembolso';
      case 'rechazar': return 'Rechazar Reembolso';
      case 'procesar': return 'Procesar Reembolso';
      default: return '';
    }
  };

  const getModalContent = () => {
    if (!selectedReembolso) return null;
    
    let actionText = '';
    switch (modalAction) {
      case 'aprobar':
        actionText = 'aprobar';
        break;
      case 'rechazar':
        actionText = 'rechazar';
        break;
      case 'procesar':
        actionText = 'procesar';
        break;
      default:
        return null;
    }
    
    return (
      <div>
        <p className="mb-4">
          ¿Está seguro que desea {actionText} el reembolso <span className="font-semibold">#{selectedReembolso.id}</span> por un monto de <span className="font-semibold">${selectedReembolso.monto.toLocaleString()}</span>?
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestión de Reembolsos</h1>
        <p className="text-gray-600">
          Administre los reembolsos de los clientes.
        </p>
      </div>

      <Card>
        <Table 
          columns={columns}
          data={reembolsos}
          isLoading={isLoading}
          emptyMessage="No hay reembolsos registrados"
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

export default GestionReembolsosXander;