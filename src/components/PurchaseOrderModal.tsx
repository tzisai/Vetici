import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseclient';
import type { Product } from '../data/products';
import './purchaseOrderModal.css';

// Assuming you have these types. If not, you might need to create them.
interface Supplier {
  id: string;
  name: string;
}

interface OrderItem {
  product_id: string;
  quantity: number;
  cost: number;
  subtotal: number;
}

interface PurchaseOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function PurchaseOrderModal({ isOpen, onClose, onSave }: PurchaseOrderModalProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: suppliersData, error: suppliersError } = await supabase.from('suppliers').select('id, name');
      console.log("Supabase Fetch - Suppliers Data:", suppliersData); // Debug log
      console.log("Supabase Fetch - Suppliers Error:", suppliersError); // Debug log
      if (suppliersError) throw suppliersError;
      setSuppliers(suppliersData || []);

      const { data: productsData, error: productsError } = await supabase.from('products').select('*');
      if (productsError) throw productsError;
      setProducts(productsData || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, fetchData]);

  const handleAddItem = () => {
    const defaultProduct = products.length > 0 ? products[0] : null;
    if (!defaultProduct) return;

    setOrderItems([
      ...orderItems,
      { product_id: defaultProduct.id, quantity: 1, cost: defaultProduct.cost ?? 0, subtotal: defaultProduct.cost ?? 0 },
    ]);
  };

  const handleItemChange = (index: number, field: 'product_id' | 'quantity', value: string | number) => {
    const newItems = [...orderItems];
    const item = newItems[index];

    if (field === 'product_id') {
      const product = products.find(p => p.id === value);
      item.product_id = value as string;
      item.cost = product?.cost ?? 0;
    } else {
      item.quantity = Number(value);
    }
    
    item.subtotal = item.cost * item.quantity;
    newItems[index] = item;
    setOrderItems(newItems);
  };

  const handleRemoveItem = (index: number) => {
    setOrderItems(orderItems.filter((_, i) => i !== index));
  };
  
  const calculateTotal = () => {
    return orderItems.reduce((acc, item) => acc + item.subtotal, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier || orderItems.length === 0) {
      setError("Por favor, seleccione un proveedor y agregue al menos un producto.");
      return;
    }
    setError(null);
    setLoading(true);

    try {
        // Step 1: Create the Purchase Order
        const total_cost = calculateTotal();
        const { data: poData, error: poError } = await supabase
            .from('purchase_orders')
            .insert({
                supplier_id: selectedSupplier,
                payment_method: paymentMethod,
                total_cost: total_cost,
                status: 'PEDIDO',
            })
            .select()
            .single();

        if (poError) throw poError;
        if (!poData) throw new Error("Failed to create purchase order.");

        // Step 2: Create the Purchase Order Items
        const itemsToInsert = orderItems.map(item => ({
            ...item,
            purchase_order_id: poData.id,
        }));

        const { error: itemsError } = await supabase.from('purchase_order_items').insert(itemsToInsert);

        if (itemsError) throw itemsError;

        // Step 3: Update product stock
        for (const item of orderItems) {
            const { data: productData, error: productError } = await supabase
                .from('products')
                .select('stock')
                .eq('id', item.product_id)
                .single();

            if (productError) throw productError;

            const newStock = (productData?.stock || 0) + item.quantity;

            const { error: updateStockError } = await supabase
                .from('products')
                .update({ stock: newStock })
                .eq('id', item.product_id);

            if (updateStockError) throw updateStockError;
        }
        
        onSave();
        handleClose();
    } catch (err: any) {
        setError(`Error al guardar el pedido: ${err.message}. Es posible que necesite agregar la columna 'payment_method' a la tabla 'purchase_orders'.`);
    } finally {
        setLoading(false);
    }
  };
  
  const handleClose = () => {
    // Reset state
    setSelectedSupplier('');
    setPaymentMethod('');
    setOrderItems([]);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="po-modal-overlay">
      <div className="po-modal-content">
        <div className="po-modal-header">
          <h2>Nuevo Pedido a Proveedor</h2>
          <button onClick={handleClose} className="po-modal-close-btn">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          {error && <p className="po-error-message">{error}</p>}
          
          <div className="po-form-grid">
            <div className="po-form-group">
              <label htmlFor="supplier">Proveedor</label>
              <select
                id="supplier"
                value={selectedSupplier}
                onChange={e => setSelectedSupplier(e.target.value)}
                required
                disabled={loading || suppliers.length === 0} // Disable if loading or no suppliers
              >
                <option value="" disabled>
                  {loading ? 'Cargando proveedores...' : suppliers.length === 0 ? 'No hay proveedores disponibles' : 'Seleccione un proveedor'}
                </option>
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              {suppliers.length === 0 && !loading && <p className="po-warning-message">Asegúrese de haber agregado proveedores en su base de datos.</p>}
            </div>
            <div className="po-form-group">
              <label htmlFor="paymentMethod">Tipo de Pago</label>
              <input type="text" id="paymentMethod" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} placeholder="Ej: Tarjeta, Efectivo" />
            </div>
          </div>

          <div className="po-item-list-header">
            <h3>Items del Pedido</h3>
            <button type="button" onClick={handleAddItem} className="po-add-item-btn">+ Agregar Item</button>
          </div>

          {orderItems.map((item, index) => (
            <div key={index} className="po-order-item">
              <select value={item.product_id} onChange={e => handleItemChange(index, 'product_id', e.target.value)}>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <input type="number" min="1" value={item.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} />
              <span>{`$${item.cost.toFixed(2)}`}</span>
              <button type="button" onClick={() => handleRemoveItem(index)} className="po-remove-item-btn">&times;</button>
            </div>
          ))}

          <div className="po-total-cost">
            Total: ${calculateTotal().toFixed(2)}
          </div>

          <div className="po-modal-footer">
            <button type="button" onClick={handleClose} className="po-modal-btn-cancel">Cancelar</button>
            <button type="submit" className="po-modal-btn-save" disabled={loading}>{loading ? 'Guardando...' : 'Guardar Pedido'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
