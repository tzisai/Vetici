import React, { useState, useEffect } from 'react';
import type { Product } from '../data/products';
import { supabase } from '../supabaseclient'; // Import supabase
import type { Supplier } from '../data/suppliers'; // Import Supplier type
import './productFormModal.css';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id' | 'sold' | 'rating'>) => void;
  product?: Product | null;
}

export default function ProductFormModal({ isOpen, onClose, onSave, product }: ProductFormModalProps): JSX.Element | null {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    cost: 0,
    stock: 0,
    supplier: '',
    image: '',
  });
  const [suppliers, setSuppliers] = useState<Supplier[]>([]); // State for suppliers
  const [loadingSuppliers, setLoadingSuppliers] = useState(true);
  const [suppliersError, setSuppliersError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuppliers = async () => {
      setLoadingSuppliers(true);
      setSuppliersError(null);
      try {
        const { data, error } = await supabase.from('suppliers').select('id, name').order('name', { ascending: true });
        if (error) throw error;
        setSuppliers(data || []);
      } catch (err: any) {
        setSuppliersError(err.message);
      } finally {
        setLoadingSuppliers(false);
      }
    };

    if (isOpen) {
      fetchSuppliers();
      setValidationError(null); // Reset validation error on open
    }
  }, [isOpen]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        price: product.price,
        cost: product.cost,
        stock: product.stock,
        supplier: product.supplier,
        image: product.image || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        cost: 0,
        stock: 0,
        supplier: suppliers.length > 0 ? suppliers[0].name : '', // Default to first supplier if available
        image: '',
      });
    }
  }, [product, suppliers]); // Re-run when suppliers change

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(formData.price) <= Number(formData.cost)) {
      setValidationError('El precio de venta debe ser mayor que el costo.');
      return;
    }
    setValidationError(null);
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{product ? 'Editar Producto' : 'Agregar Producto'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="price">Precio</label>
            <input type="number" step="0.01" id="price" name="price" value={formData.price} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="cost">Costo</label>
            <input type="number" step="0.01" id="cost" name="cost" value={formData.cost} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="stock">Stock</label>
            <input type="number" id="stock" name="stock" value={formData.stock} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="supplier">Proveedor</label>
            {loadingSuppliers ? (
              <p>Cargando proveedores...</p>
            ) : suppliersError ? (
              <p className="error-message">Error al cargar proveedores: {suppliersError}</p>
            ) : suppliers.length > 0 ? (
              <select id="supplier" name="supplier" value={formData.supplier} onChange={handleChange} required>
                <option value="">Seleccione un proveedor</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.name}>{s.name}</option>
                ))}
              </select>
            ) : (
              <p>No hay proveedores disponibles. Agregue proveedores en la sección de proveedores.</p>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="image">URL de Imagen</label>
            <input type="text" id="image" name="image" value={formData.image} onChange={handleChange} />
          </div>
          
          {validationError && <p className="error-message" style={{color: 'red', marginTop: '1rem'}}>{validationError}</p>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">Cancelar</button>
            <button type="submit" className="btn-confirm">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
