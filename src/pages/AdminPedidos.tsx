import React from 'react';
import './adminpedidos.css';

// Datos de ejemplo que eventualmente vendrán de tu API/BD
const mockPedidos = [
  {
    id: 'PO-2024-001',
    proveedor: 'Proveedor A',
    fechaPedido: '2024-05-10',
    fechaEsperada: '2024-05-20',
    estado: 'Enviado',
    total: 1500.00,
    items: 3,
  },
  {
    id: 'PO-2024-002',
    proveedor: 'Proveedor B',
    fechaPedido: '2024-05-12',
    fechaEsperada: '2024-05-22',
    estado: 'Procesando',
    total: 850.50,
    items: 5,
  },
  {
    id: 'PO-2024-003',
    proveedor: 'Proveedor A',
    fechaPedido: '2024-05-15',
    fechaEsperada: '2024-05-25',
    estado: 'Entregado',
    total: 2100.00,
    items: 2,
  },
  {
    id: 'PO-2024-004',
    proveedor: 'Proveedor C',
    fechaPedido: '2024-05-18',
    fechaEsperada: '2024-05-28',
    estado: 'Pendiente',
    total: 500.75,
    items: 8,
  },
];

const getStatusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case 'entregado': return 'status-delivered';
    case 'enviado': return 'status-shipped';
    case 'procesando': return 'status-processing';
    case 'pendiente': return 'status-pending';
    default: return '';
  }
};

function currency(n: number) { return `$${n.toFixed(2)}` }

export default function AdminPedidos(): JSX.Element {
  return (
    <main className="admin-pedidos-main">
      <div className="admin-pedidos-header">
        <h1>Pedidos a Proveedores</h1>
        <a href="/#proveedores" className="btn-nuevo-pedido">Nuevo Pedido</a>
      </div>

      <div className="pedidos-table-container">
        <table className="pedidos-table">
          <thead>
            <tr>
              <th>ID Pedido</th>
              <th>Proveedor</th>
              <th>Fecha de Pedido</th>
              <th>Fecha Esperada</th>
              <th>Items</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {mockPedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td>{pedido.id}</td>
                <td>{pedido.proveedor}</td>
                <td>{pedido.fechaPedido}</td>
                <td>{pedido.fechaEsperada}</td>
                <td>{pedido.items}</td>
                <td>{currency(pedido.total)}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(pedido.estado)}`}>{pedido.estado}</span>
                </td>
                <td>
                  <button className="action-btn">Ver</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}