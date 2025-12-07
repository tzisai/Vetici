import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseclient';
import type { Product } from '../data/products';
import './AdminFinanzas.css';

function currency(n: number) {
  return `${n.toFixed(2)}`;
}

export default function AdminFinanzas(): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('products').select('*').not('is_deleted', 'is', true);
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

  const productData = products.map(p => {
    const margin = p.price - p.cost;
    return {
      ...p,
      margin,
      potentialProfit: margin * p.stock,
      realizedProfit: margin * (p.sold ?? 0),
    };
  });

  const totalPotential = productData.reduce((s, r) => s + r.potentialProfit, 0);
  const totalRealized = productData.reduce((s, r) => s + r.realizedProfit, 0);
  const totalStockValue = products.reduce((sum, p) => sum + (p.stock * p.cost), 0);

  if(loading) return <div>Cargando datos financieros...</div>
  if(error) return <div>Error: {error}</div>

  return (
    <main className="admin-finanzas-main">
      <div className="admin-finanzas-header">
        <div className="admin-finanzas-title">
          <h1>Dashboard Financiero</h1>
          <p>Análisis detallado de la rentabilidad de tus productos.</p>
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon icon-inventory">📦</div>
          <div className="summary-details">
            <div className="summary-value">{currency(totalStockValue)}</div>
            <div className="summary-label">Valor de Inventario (Costo)</div>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon icon-potential">📈</div>
          <div className="summary-details">
            <div className="summary-value">{currency(totalPotential)}</div>
            <div className="summary-label">Ganancia Potencial</div>
          </div>
        </div>
        <div className="summary-card">
          <div className="card-icon icon-realized">💰</div>
          <div className="summary-details">
            <div className="summary-value">{currency(totalRealized)}</div>
            <div className="summary-label">Ganancia Realizada</div>
          </div>
        </div>
      </div>

      <div className="finanzas-table-container">
        <table className="finanzas-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Costo</th>
              <th>Precio</th>
              <th>Margen</th>
              <th>Stock</th>
              <th>Vendido</th>
              <th>Ganancia Potencial</th>
              <th>Ganancia Realizada</th>
            </tr>
          </thead>
          <tbody>
            {productData.map(p => (
              <tr key={p.id}>
                <td>
                  <div className="product-name-cell">
                    <img 
                      src={p.image || 'https://via.placeholder.com/40x40?text=N/A'} 
                      alt={p.name}
                      className="product-image-small"
                    />
                    <span className="product-name-text">{p.name}</span>
                  </div>
                </td>
                <td className="currency">{currency(p.cost)}</td>
                <td className="currency">{currency(p.price)}</td>
                <td className={`currency ${p.margin > 0 ? 'profit-positive' : 'profit-negative'}`}>
                  {currency(p.margin)}
                </td>
                <td>{p.stock} unidades</td>
                <td>{p.sold ?? 0} unidades</td>
                <td className="currency">{currency(p.potentialProfit)}</td>
                <td className="currency profit-positive">{currency(p.realizedProfit)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}