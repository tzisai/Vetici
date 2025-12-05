import React from 'react';
import type { Product } from '../data/products';
import './adminproductcard.css';

type Props = {
  product: Product;
  margin: number;
  potentialProfit: number;
  realizedProfit: number;
};

function currency(n: number) { return `$${n.toFixed(2)}` }

export default function AdminProductCard({ product, margin, potentialProfit, realizedProfit }: Props): JSX.Element {
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
        <p className="admin-pc-supplier">Proveedor: {product.supplier}</p>
        
        <div className="admin-pc-metrics">
          <div className="admin-pc-metric">
            <span className="admin-pc-label">Precio</span>
            <span className="admin-pc-value">{currency(product.price)}</span>
          </div>
          <div className="admin-pc-metric">
            <span className="admin-pc-label">Costo</span>
            <span className="admin-pc-value">{currency(product.cost)}</span>
          </div>
          <div className="admin-pc-metric">
            <span className="admin-pc-label">Margen</span>
            <span className="admin-pc-value">{currency(margin)}</span>
          </div>
          <div className="admin-pc-metric">
            <span className="admin-pc-label">Stock</span>
            <span className="admin-pc-value">{product.stock}</span>
          </div>
          <div className="admin-pc-metric">
            <span className="admin-pc-label">Vendidos</span>
            <span className="admin-pc-value">{product.sold ?? 0}</span>
          </div>
        </div>

        <div className="admin-pc-profit">
          <div className="admin-pc-profit-metric">
            <span className="admin-pc-label">Ganancia Potencial</span>
            <span className="admin-pc-value">{currency(potentialProfit)}</span>
          </div>
          <div className="admin-pc-profit-metric">
            <span className="admin-pc-label">Ganancia Realizada</span>
            <span className="admin-pc-value">{currency(realizedProfit)}</span>
          </div>
        </div>

        <div className="admin-pc-actions">
          <button className="btn-edit">Editar</button>
          <button className="btn-restock">Reponer</button>
        </div>
      </div>
    </div>
  );
}
