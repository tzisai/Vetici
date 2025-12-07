import React, { useRef, useState, useEffect } from 'react';
import { supabase } from '../supabaseclient';
import type { Product } from '../data/products';
import './UserHome.css';

// Slideshow Component with controls
const Slideshow = () => {
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const slideshowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchBestSellers = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('products')
                    .order('sold', { ascending: false, nullsFirst: true })
                    .limit(4);

                if (error) throw error;
                setFeaturedProducts(data || []);
            } catch (err) {
                console.error("Error fetching best sellers:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBestSellers();
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (slideshowRef.current) {
            const scrollAmount = slideshowRef.current.offsetWidth * 0.8;
            slideshowRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    if (loading) {
        return <div className="loading-slideshow">Cargando productos más vendidos...</div>;
    }

    return (
        <div className="slideshow-container">
            <h3>Productos Más Vendidos</h3>
            <div className="slideshow-wrapper">
                <button className="scroll-button left" onClick={() => scroll('left')}>&#10094;</button>
                <div className="slideshow" ref={slideshowRef}>
                    {featuredProducts.map((product) => (
                        <div className="slide" key={product.id}>
                            <img src={product.image || 'https://via.placeholder.com/200x200'} alt={product.name} />
                            <p className="product-name">{product.name}</p>
                            <p className="product-price">${product.price.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
                <button className="scroll-button right" onClick={() => scroll('right')}>&#10095;</button>
            </div>
        </div>
    );
};

const UserHome: React.FC = () => {
    return (
        <div className="user-home-container">
            <div className="user-home">
                <h1 className="main-title">¿Qué vas a hacer hoy?</h1>

                <Slideshow />

                <h2 className="sub-title">¿A dónde deseas ir?</h2>
                <div className="nav-grid">
                    <div className="nav-card">
                        <img src="/src/assets/imgs/productos_img.jpg" alt="Tienda" />
                        <h3>Tienda</h3>
                        <a href="#productos" className="nav-button">Ir allí</a>
                    </div>
                    <div className="nav-card">
                        <img src="/src/assets/imgs/cat.png" alt="Mis Mascotas" />
                        <h3>Mis Mascotas</h3>
                        <a href="#mis-mascotas" className="nav-button">Ir allí</a>
                    </div>
                    <div className="nav-card">
                        <img src="/src/assets/imgs/consulta.jpg" alt="Citas" />
                        <h3>Citas</h3>
                        <a href="#citas" className="nav-button">Ir allí</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserHome;
