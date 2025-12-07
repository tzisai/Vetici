import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseclient';
import type { Product } from '../data/products';
import ProductCard from '../components/ProductCard';
import './products.css';

type CartItem = { product: Product; quantity: number };

export default function Products(): JSX.Element {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .gt('stock', 0) // only fetch products with stock > 0
        .order('name', { ascending: true });
        
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
  
  const handleCheckout = async () => {
    if(!window.confirm('¿Quieres finalizar tu compra?')) return;
    
    try {
      setLoading(true);
      // Process all cart items
      await Promise.all(cart.map(async (item) => {
        const { product, quantity } = item;

        // Fetch the latest product data to ensure stock is accurate
        const { data: currentProduct, error: fetchError } = await supabase
            .from('products')
            .select('stock, sold')
            .eq('id', product.id)
            .single();
        
        if (fetchError || !currentProduct) {
            throw new Error(`No se pudo obtener el producto: ${product.name}`);
        }

        if (currentProduct.stock < quantity) {
            throw new Error(`No hay suficiente stock para ${product.name}. Disponible: ${currentProduct.stock}`);
        }

        // Calculate new values
        const newStock = currentProduct.stock - quantity;
        const newSold = (currentProduct.sold || 0) + quantity;

        // Update the product in the database
        const { error: updateError } = await supabase
            .from('products')
            .update({ stock: newStock, sold: newSold })
            .eq('id', product.id);
        
        if (updateError) {
            throw new Error(`Error al actualizar el producto: ${product.name}`);
        }
      }));

      alert('¡Gracias por tu compra!');
      setCart([]);
      setShowCart(false);
      fetchProducts(); // Refresh products list

    } catch (err: any) {
      alert(`Error en el pago: ${err.message}`);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (loading && products.length === 0) return <div>Cargando productos...</div>
  if (error) return <div>Error: {error}</div>

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
              <button onClick={handleCheckout} className="checkout-btn" disabled={loading}>
                {loading ? 'Procesando...' : 'Ir a pagar'}
              </button>
            </>
          )}
        </div>
      )}

      <div className="products-grid">
        {products.length === 0 && !loading ? (
          <p>No hay productos disponibles por el momento.</p>
        ) : (
          products.map(p => (
            <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} />
          ))
        )}
      </div>
    </main>
  );
}
