import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseclient'; // Import supabase client
import type { Product } from '../data/products';
import ProductFormModal from '../components/ProductFormModal';
import ConfirmationModal from '../components/ConfirmationModal';
import PurchaseOrderModal from '../components/PurchaseOrderModal'; // Import the new modal
import './admininventario.css';
import './adminproductcard.css';

// A simpler card component focused only on stock
const StockCard = ({
  product,
  onEdit,
  onDelete,
}: {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}) => {
  return (
    <div className="admin-pc-card">
      <div className="admin-pc-image-wrapper">
        <img
          src={product.image || 'https://via.placeholder.com/400x300?text=Sin+imagen'}
          alt={product.name}
          className="admin-pc-image"
        />
        {product.stock === 0 && <div className="admin-pc-out-of-stock">Agotado</div>}
      </div>
      <div className="admin-pc-content">
        <h3 className="admin-pc-name">{product.name}</h3>
        <div className="stock-info">
          <div className="stock-label">Unidades en Stock</div>
          <div className={`stock-value ${product.stock < 10 ? 'low-stock' : ''}`}>
            {product.stock}
          </div>
        </div>
        <div className="admin-pc-actions">
          <button onClick={() => onEdit(product)} className="btn-edit">
            Editar
          </button>
          <button onClick={() => onDelete(product.id)} className="btn-delete">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AdminInventario(): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [isPoModalOpen, setPoModalOpen] = useState(false); // State for the new modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*').order('name', { ascending: true });
      if (error) throw error;
      setProducts(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAdd = () => {
    setSelectedProduct(null);
    setFormModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormModalOpen(true);
  };

  const handleDelete = (productId: string) => {
    setProductToDelete(productId);
    setConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', productToDelete);
      if (error) throw error;
      setProducts(products.filter(p => p.id !== productToDelete));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setConfirmModalOpen(false);
      setProductToDelete(null);
    }
  };

  const handleSave = async (formData: Omit<Product, 'id' | 'sold' | 'rating'>) => {
    try {
      if (selectedProduct) {
        // Update
        const { data, error } = await supabase
          .from('products')
          .update(formData)
          .eq('id', selectedProduct.id)
          .select();
        if (error) throw error;
        if (data) {
            setProducts(products.map(p => (p.id === selectedProduct.id ? data[0] : p)));
        }
      } else {
        // Create
        const { data, error } = await supabase.from('products').insert(formData).select();
        if (error) throw error;
        if (data) {
            setProducts([...products, data[0]]);
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setFormModalOpen(false);
    }
  };

  // Handler to open the Purchase Order modal
  const handleMakeOrder = () => {
    setPoModalOpen(true);
  };
  
  const handlePoSave = () => {
    setPoModalOpen(false);
    // Optionally, you could show a success message or refetch data if needed
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <main className="admin-inventario-main">
      <div className="admin-inventario-header">
        <div className="admin-inventario-title">
          <h1>Inventario de Productos</h1>
          <p>Gestiona el stock de tus productos.</p>
        </div>
        <div className="admin-inventario-actions">
          <button onClick={handleMakeOrder} className="btn-make-order">
            Hacer Pedido
          </button>
          <button onClick={handleAdd} className="btn-add-product">
            + Agregar Producto
          </button>
        </div>
      </div>

      <div className="admin-products-grid">
        {products.map(product => (
          <StockCard
            key={product.id}
            product={product}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSave={handleSave}
        product={selectedProduct}
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer."
      />

      <PurchaseOrderModal 
        isOpen={isPoModalOpen}
        onClose={() => setPoModalOpen(false)}
        onSave={handlePoSave}
      />
    </main>
  );
}
