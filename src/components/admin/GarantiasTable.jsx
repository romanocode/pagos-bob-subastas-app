// src/components/admin/GarantiasTable.jsx
import React, { useState } from 'react';
import Table from '../common/Table';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { GARANTIA_ESTADOS } from '../../utils/constants';

const GarantiasTable = ({ garantias, onValidate, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedGarantia, setSelectedGarantia] = useState(null);

  const handleValidate = (garantia) => {
    onValidate(garantia.id);
  };

  const handleDeleteClick = (garantia) => {
    setSelectedGarantia(garantia);
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    onDelete(selectedGarantia.id);
    setShowModal(false);
  };

  const getEstadoBadge = (estado) => {
    switch (estado) {
      case GARANTIA_ESTADOS.PENDIENTE_VALIDACION:
        return <Badge color="yellow" text="Pendiente Validación" />;
      case GARANTIA_ESTADOS.VALIDADO:
        return <Badge color="green" text="Validado" />;
      default:
        return <Badge color="gray" text="Desconocido" />;
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Cliente', accessor: 'cliente_id' },
    { header: 'Tipo', accessor: 'tipo' },
    { header: 'Fecha Subasta', accessor: 'fechaSubasta' },
    { header: 'Moneda', accessor: 'moneda' },
    { header: 'Monto', accessor: 'monto', cell: (row) => `${row.moneda} ${row.monto}` },
    { header: 'Banco', accessor: 'banco' },
    { header: 'Estado', accessor: 'estado', cell: (row) => getEstadoBadge(row.estado) },
    {
      header: 'Acciones',
      cell: (row) => (
        <div className="flex space-x-2">
          {row.estado === GARANTIA_ESTADOS.PENDIENTE_VALIDACION && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => handleValidate(row)}
            >
              Validar
            </Button>
          )}
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDeleteClick(row)}
          >
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Table columns={columns} data={garantias} />
      
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Confirmar eliminación"
      >
        <div className="p-4">
          <p className="mb-4">¿Está seguro que desea eliminar esta garantía?</p>
          <div className="flex justify-end space-x-2">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default GarantiasTable;