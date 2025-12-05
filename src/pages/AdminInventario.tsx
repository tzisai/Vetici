import React from 'react';
import products from '../data/products';
import type { Product } from '../data/products';
import './admininventario.css';
import './adminproductcard.css'; // Re-using some styles

// A simpler card component focused only on stock
const StockCard = ({ product }: { product: Product }) => {
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
        <a href="/#proveedores" className="btn-reponer">
          Reponer Stock
        </a>
      </div>
    </div>
  );
};


export default function AdminInventario(): JSX.Element {
  return (
    <main className="admin-inventario-main">
      <div className="admin-inventario-header">
        <div className="admin-inventario-title">
          <h1>Inventario de Productos</h1>
          <p>Gestiona el stock de tus productos.</p>
        </div>
        <a href="/#proveedores" className="btn-reponer-inventario">
          Hacer Pedido a Proveedores
        </a>
      </div>

      <div className="admin-products-grid">
        {products.map(product => (
          <StockCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </main>
  );
}
