import React from 'react';

const UserHome: React.FC = () => {
    return (
        <div className="user-home-container">
            <div className="user-home">
                <h1 className="main-title">¿Qué vas a hacer hoy?</h1>

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
