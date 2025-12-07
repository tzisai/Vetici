import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseclient';
import Slideshow from '../components/Slideshow';
import type { Product } from '../data/products'; // Asegúrate que la ruta sea correcta
import './Home.css';

const Home: React.FC = () => {
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        // 'sold' es la columna que indica cuántas veces se ha vendido un producto
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('sold', { ascending: false }) // Los más vendidos primero
          .limit(4);

        if (error) throw error;

        setPopularProducts(data || []);
      } catch (err: any) {
        setError('No se pudieron cargar los productos populares. ' + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularProducts();
  }, []);

  const renderProduct = (product: Product) => (
    <div className="product-slide-card">
      <img src={product.image || 'https://via.placeholder.com/300'} alt={product.name} />
      <div className="product-slide-info">
        <h4>{product.name}</h4>
        <p className="product-slide-price">${product.price.toFixed(2)}</p>
        <button className="btn-buy-slide">Comprar ahora</button>
      </div>
    </div>
  );

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Bienvenido a Vetici</h1>
        <p>Todo lo que tu mascota necesita, en un solo lugar.</p>
      </header>

      <main>
        <Slideshow items={popularProducts} renderItem={renderProduct} title="Lo Más Popular" />
        
        {/* Aquí puedes agregar el resto del contenido de tu página de inicio, como las secciones de "About" y "Services" */}

      </main>
    </div>
  );
};

export default Home;