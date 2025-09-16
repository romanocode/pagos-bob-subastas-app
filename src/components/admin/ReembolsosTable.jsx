// src/components/admin/ReembolsosTable.jsx
import React, { useState } from 'react';
import Table from '../common/Table';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { REEMBOLSO_ESTADOS } from '../../utils/constants';

const ReembolsosTable = ({ reembolsos, onApprove, onReimburse, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedReembolso, setSelectedReembolso] = useState(null);
  const [modalAction, setModalAction] = useState('');

  const handleActionClick = (reembolso, action) => {
    setSelectedReembolso(reembolso);
    setModalAction(action);
    setShowModal(true);
  };

  const handleConfirmAction = () => {
    switch (modalAction) {
      case 'approve':
        onApprove(selectedReembolso.id);
        break;
      case 'reimburse':
        onReimburse(selectedReembolso.id);
        break;
      case 'delete':
        onDelete(selectedReembolso.id);
        break;
      default:
        break;
    }
    setShowModal(false);
  };

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case REEMBOLSO_ESTADOS.PENDIENTE:
        return <Badge color="yellow" text="Pendiente" />;
      case REEMBOLSO_ESTADOS.APROBADO:
        return <Badge color="blue" text="Aprobado" />;
      case REEMBOLSO_ESTADOS.REEMBOLSADO:
        return <Badge color="green" text="Reembolsado" />;
      case REEMBOLSO_ESTADOS.CANCELADO:
        return <Badge color="red" text="Cancelado" />;
      default:
        return <Badge color="gray" text="Desconocido" />;
    }
  };

  const getModalTitle = () => {
    switch (modalAction) {
      case 'approve':
        return 'Confirmar aprobación';
      case 'reimburse':
        return 'Confirmar reembolso';
      case 'delete':
        return 'Confirmar eliminación';
      default:
        return 'Confirmar acción';
    }
  };

  const getModalMessage = () => {
    switch (modalAction) {
      case 'approve':
        return '¿Está seguro que desea aprobar este reembolso?';
      case 'reimburse':
        return '¿Está seguro que desea marcar este reembolso como reembolsado?';
      case 'delete':
        return '¿Está seguro que desea eliminar este reembolso?';
      default:
        return '¿Está seguro que desea realizar esta acción?';
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Cliente', accessor: 'cliente_id' },
    { header: 'Garantía', accessor: 'garantia_id', cell: (row) => row.garantia_id || 'N/A' },
    { header: 'Monto', accessor: 'monto' },
    { header: 'Banco', accessor: 'banco' },
    { header: 'Cuenta', accessor: 'cuentaDeposito' },
    { header: 'Estado', accessor: 'estado', cell: (row) => getEstadoBadge(row.estado) },
    { header: 'Fecha Creación', accessor: 'fechaCreacion', cell: (row) => new Date(row.fechaCreacion).toLocaleDateString() },
    {
      header: 'Acciones',
      cell: (row) => (
        <div className="flex space-x-2">
          {row.estado === REEMBOLSO_ESTADOS.PENDIENTE && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleActionClick(row, 'approve')}
            >
              Aprobar
            </Button>
          )}
          {row.estado === REEMBOLSO_ESTADOS.APROBADO && (
            <Button
              variant="success"
              size="sm"
              onClick={() => handleActionClick(row, 'reimburse')}
            >
              Reembolsar
            </Button>
          )}
          {row.estado !== REEMBOLSO_ESTADOS.REEMBOLSADO && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleActionClick(row, 'delete')}
            >
              Eliminar
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <Table columns={columns} data={reembolsos} />
      
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={getModalTitle()}
      >
        <div className="p-4">
          <p className="mb-4">{getModalMessage()}</p>
          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button 
              variant={modalAction === 'delete' ? 'danger' : 'primary'} 
              onClick={handleConfirmAction}
            >
              Confirmar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ReembolsosTable;