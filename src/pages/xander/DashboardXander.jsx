// src/pages/xander/DashboardXander.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Table from '../../components/common/Table';
import Badge from '../../components/common/Badge';
import { GARANTIAS_DEMO, REEMBOLSOS_DEMO } from '../../data/mockData';
import { GARANTIA_ESTADOS, REEMBOLSO_ESTADOS } from '../../utils/constants';

const DashboardXander = () => {
  const { currentUser } = useAuth();
  const [garantias, setGarantias] = useState([]);
  const [reembolsos, setReembolsos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulamos carga de datos
    setTimeout(() => {
      setGarantias(GARANTIAS_DEMO);
      setReembolsos(REEMBOLSOS_DEMO);
      setIsLoading(false);
    }, 1000);
  }, []);

  const garantiasColumns = [
    { header: 'ID', accessor: 'id', width: '10%' },
    { header: 'Tipo', accessor: 'tipo', width: '15%' },
    { header: 'Monto', accessor: 'monto', width: '15%', 
      render: (row) => `$${row.monto.toLocaleString()}` },
    { header: 'Estado', accessor: 'estado', width: '15%',
      render: (row) => {
        const estado = row.estado;
        let variant = 'default';
        
        if (estado === GARANTIA_ESTADOS.PENDIENTE) variant = 'warning';
        if (estado === GARANTIA_ESTADOS.VALIDADA) variant = 'success';
        if (estado === GARANTIA_ESTADOS.RECHAZADA) variant = 'danger';
        if (estado === GARANTIA_ESTADOS.EJECUTADA) variant = 'info';
        
        return <Badge variant={variant}>{estado}</Badge>;
      }
    },
    { header: 'Fecha', accessor: 'fecha_creacion', width: '15%',
      render: (row) => new Date(row.fecha_creacion).toLocaleDateString() },
    { header: 'Cliente', accessor: 'cliente_nombre', width: '20%' },
  ];

  const reembolsosColumns = [
    { header: 'ID', accessor: 'id', width: '10%' },
    { header: 'Garantía ID', accessor: 'garantia_id', width: '15%' },
    { header: 'Monto', accessor: 'monto', width: '15%',
      render: (row) => `$${row.monto.toLocaleString()}` },
    { header: 'Estado', accessor: 'estado', width: '15%',
      render: (row) => {
        const estado = row.estado;
        let variant = 'default';
        
        if (estado === REEMBOLSO_ESTADOS.PENDIENTE) variant = 'warning';
        if (estado === REEMBOLSO_ESTADOS.APROBADO) variant = 'success';
        if (estado === REEMBOLSO_ESTADOS.RECHAZADO) variant = 'danger';
        if (estado === REEMBOLSO_ESTADOS.PROCESANDO) variant = 'info';
        
        return <Badge variant={variant}>{estado}</Badge>;
      }
    },
    { header: 'Fecha', accessor: 'fecha_solicitud', width: '15%',
      render: (row) => new Date(row.fecha_solicitud).toLocaleDateString() },
    { header: 'Cliente', accessor: 'cliente_nombre', width: '20%' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard Xander</h1>
        <p className="text-gray-600">
          Bienvenido, <span className="font-semibold">{currentUser?.nombre}</span>. 
          Aquí puedes ver el resumen de garantías y reembolsos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card title="Garantías Totales" className="bg-blue-50">
          <div className="text-3xl font-bold text-blue-700">
            {garantias.length}
          </div>
          <p className="text-sm text-blue-600">Garantías registradas</p>
        </Card>
        
        <Card title="Reembolsos Pendientes" className="bg-yellow-50">
          <div className="text-3xl font-bold text-yellow-700">
            {reembolsos.filter(r => r.estado === REEMBOLSO_ESTADOS.PENDIENTE).length}
          </div>
          <p className="text-sm text-yellow-600">Esperando aprobación</p>
        </Card>
        
        <Card title="Garantías Ejecutadas" className="bg-green-50">
          <div className="text-3xl font-bold text-green-700">
            {garantias.filter(g => g.estado === GARANTIA_ESTADOS.EJECUTADA).length}
          </div>
          <p className="text-sm text-green-600">Garantías ejecutadas</p>
        </Card>
      </div>

      <div className="mb-8">
        <Card title="Garantías Recientes">
          <Table 
            columns={garantiasColumns}
            data={garantias.slice(0, 5)}
            isLoading={isLoading}
            emptyMessage="No hay garantías registradas"
          />
        </Card>
      </div>

      <div className="mb-8">
        <Card title="Reembolsos Recientes">
          <Table 
            columns={reembolsosColumns}
            data={reembolsos.slice(0, 5)}
            isLoading={isLoading}
            emptyMessage="No hay reembolsos registrados"
          />
        </Card>
      </div>
    </div>
  );
};

export default DashboardXander;