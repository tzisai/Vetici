import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseclient';
import type { PurchaseOrder } from '../data/purchaseOrders';
import type { Supplier } from '../data/suppliers';
import PurchaseOrderModal from '../components/PurchaseOrderModal'; // Import the modal
import ConfirmationModal from '../components/ConfirmationModal'; // Import ConfirmationModal
import './adminpedidos.css';


const getStatusClass = (status: PurchaseOrder['status']) => {
  switch (status) {
    case 'ENTREGADO': return 'status-delivered';
    case 'PEDIDO': return 'status-processing';
    case 'CANCELADO': return 'status-pending';
    default: return '';
  }
};

function currency(n: number) { return `$${n.toFixed(2)}` }

export default function AdminPedidos(): JSX.Element {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPoModalOpen, setIsPoModalOpen] = useState(false); // State for the modal
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null); // State for expanded row
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false); // State for confirmation modal
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null); // State for order to delete

  const fetchPurchaseOrders = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('purchase_orders')
        .select(`
          *,
          suppliers ( name ),
          purchase_order_items (
            *,
            products ( name, description, price, image )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map the data to include the supplier name directly
      const ordersWithSupplierNames: PurchaseOrder[] = data.map((order: any) => ({
        ...order,
        supplier: order.suppliers,
        items: order.purchase_order_items.map((item: any) => ({
            ...item,
            product: item.products,
        })),
      }));
      setPurchaseOrders(ordersWithSupplierNames);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPurchaseOrders();
  }, [fetchPurchaseOrders]);

  const handleDelete = (orderId: string) => {
    setOrderToDelete(orderId);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!orderToDelete) return;
    setLoading(true);
    try {
      // First delete purchase_order_items associated with this purchase_order
      const { error: deleteItemsError } = await supabase
        .from('purchase_order_items')
        .delete()
        .eq('purchase_order_id', orderToDelete);

      if (deleteItemsError) throw deleteItemsError;

      // Then delete the purchase_order itself
      const { error } = await supabase
        .from('purchase_orders')
        .delete()
        .eq('id', orderToDelete);
      if (error) throw error;
      setPurchaseOrders(purchaseOrders.filter(po => po.id !== orderToDelete));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsConfirmModalOpen(false);
      setOrderToDelete(null);
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: PurchaseOrder['status']) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('purchase_orders')
        .update({ status: newStatus })
        .eq('id', orderId)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setPurchaseOrders(purchaseOrders.map(po => (po.id === orderId ? { ...po, status: data.status } : po)));
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Cargando pedidos...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <main className="admin-pedidos-main">
        <div className="admin-pedidos-header">
            <button className="btn-regresar" onClick={() => window.location.hash = '#inventario'}>
                Regresar
            </button>
            <h1>Pedidos a Proveedores</h1>
            <button onClick={() => setIsPoModalOpen(true)} className="btn-nuevo-pedido">Nuevo Pedido</button>
        </div>

      <div className="pedidos-table-container">
        <table className="pedidos-table">
          <thead>
            <tr>
              <th>ID Pedido</th>
              <th>Proveedor</th>
              <th>Fecha de Pedido</th>
              <th>Total</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {purchaseOrders.map((pedido) => (
              <React.Fragment key={pedido.id}>
                <tr onClick={() => setExpandedOrderId(expandedOrderId === pedido.id ? null : pedido.id)} style={{ cursor: 'pointer' }}>
                  <td>{pedido.id}</td>
                  <td>{pedido.supplier?.name || 'N/A'}</td>
                  <td>{new Date(pedido.created_at).toLocaleDateString()}</td>
                  <td>{currency(pedido.total_cost || 0)}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(pedido.status)}`}>{pedido.status}</span>
                  </td>
                  <td>
                    <select
                      value={pedido.status}
                      onChange={(e) => handleUpdateStatus(pedido.id, e.target.value as PurchaseOrder['status'])}
                      className="status-dropdown"
                      disabled={loading}
                    >
                      <option value="PEDIDO">Pedido</option>
                      <option value="ENTREGADO">Entregado</option>
                      <option value="CANCELADO">Cancelado</option>
                    </select>
                    <button className="action-btn delete" onClick={(e) => { e.stopPropagation(); handleDelete(pedido.id); }}>Eliminar</button>
                  </td>
                </tr>
                {expandedOrderId === pedido.id && pedido.items && pedido.items.length > 0 && (
                  <tr className="expanded-row-details">
                    <td colSpan={6}>
                      <div className="order-items-detail">
                        <h4>Items del Pedido:</h4>
                        <ul>
                          {pedido.items.map(item => (
                            <li key={item.id}>
                              {item.product?.name || 'Producto Desconocido'} ({item.quantity} x {currency(item.cost || 0)}) - Subtotal: {currency(item.subtotal || 0)}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        {purchaseOrders.length === 0 && !loading && (
          <p className="no-pedidos-message">No hay pedidos registrados.</p>
        )}
      </div>

      <PurchaseOrderModal 
        isOpen={isPoModalOpen}
        onClose={() => setIsPoModalOpen(false)}
        onSave={fetchPurchaseOrders} // Refetch orders after saving a new one
      />
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que quieres eliminar este pedido? Esta acción también eliminará todos los ítems asociados."
      />
    </main>
  );
}