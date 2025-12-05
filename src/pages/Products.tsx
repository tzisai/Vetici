import React, { useState } from 'react';
import products from '../data/products';
import type { Product } from '../data/products';
import ProductCard from '../components/ProductCard';
import './products.css';

type CartItem = { product: Product; quantity: number };

export default function Products(): JSX.Element {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const available = products.filter(p => p.stock > 0);

  const handleAddToCart = (product: Product, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <main className="products-main">
      <div className="products-header">
        <h1>Tienda de Mascotas</h1>
        <button className="cart-toggle" onClick={() => setShowCart(!showCart)}>
          Carrito ({cartCount})
        </button>
      </div>

      {showCart && (
        <div className="cart-panel">
          <h2>Tu carrito</h2>
          {cart.length === 0 ? (
            <p>Tu carrito está vacío</p>
          ) : (
            <>
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.product.id} className="cart-item">
                    <div className="cart-item-info">
                      <strong>{item.product.name}</strong>
                      <p>Cantidad: {item.quantity} × ${item.product.price.toFixed(2)}</p>
                    </div>
                    <div className="cart-item-total">
                      <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                      <button onClick={() => handleRemoveFromCart(item.product.id)} className="cart-remove">✕</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cart-total">
                <strong>Total: ${cartTotal.toFixed(2)}</strong>
              </div>
              <button className="checkout-btn">Ir a pagar</button>
            </>
          )}
        </div>
      )}

      <div className="products-grid">
        {available.length === 0 ? (
          <p>No hay productos disponibles por el momento.</p>
        ) : (
          available.map(p => (
            <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} />
          ))
        )}
      </div>
    </main>
  );
}
