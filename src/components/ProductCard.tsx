import React, { useState } from 'react';
import type { Product } from '../data/products';
import './productcard.css';

type Props = {
  product: Product;
  onAddToCart?: (product: Product, quantity: number) => void;
};

export default function ProductCard({ product, onAddToCart }: Props): JSX.Element {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    const stars = Math.round(rating);
    return (
      <div className="pc-rating">
        {'★'.repeat(stars)}{'☆'.repeat(5 - stars)} <span className="pc-rating-val">({rating})</span>
      </div>
    );
  };

  return (
    <div className="pc-card">
      <div className="pc-image-wrapper">
        <img
          src={product.image || 'https://via.placeholder.com/400x300?text=Sin+imagen'}
          alt={product.name}
          className="pc-image"
        />
        {product.stock === 0 && <div className="pc-out-of-stock">Agotado</div>}
      </div>
      <div className="pc-content">
        <h3 className="pc-name">{product.name}</h3>
        {renderStars(product.rating)}
        <p className="pc-desc">{product.description}</p>
        <div className="pc-price-section">
          <span className="pc-price">${product.price.toFixed(2)}</span>
          {product.stock > 0 && <span className="pc-stock">Stock: {product.stock}</span>}
        </div>
        {product.stock > 0 && (
          <div className="pc-actions">
            <div className="pc-qty">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="pc-qty-btn"
              >
                −
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                max={product.stock}
                className="pc-qty-input"
              />
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="pc-qty-btn"
              >
                +
              </button>
            </div>
            <button
              className={`pc-add-btn ${added ? 'added' : ''}`}
              onClick={handleAddToCart}
            >
              {added ? '✓ Agregado' : 'Agregar al carrito'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
