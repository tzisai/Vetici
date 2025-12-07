import React, { useState, useEffect } from 'react';
import type { Product } from '../data/products';
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
        supplier: '',
        image: '',
      });
    }
  }, [product]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
            <input type="number" id="price" name="price" value={formData.price} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="cost">Costo</label>
            <input type="number" id="cost" name="cost" value={formData.cost} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="stock">Stock</label>
            <input type="number" id="stock" name="stock" value={formData.stock} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="supplier">Proveedor</label>
            <input type="text" id="supplier" name="supplier" value={formData.supplier} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="image">URL de Imagen</label>
            <input type="text" id="image" name="image" value={formData.image} onChange={handleChange} />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">Cancelar</button>
            <button type="submit" className="btn-confirm">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
