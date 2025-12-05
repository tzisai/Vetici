import { useEffect, useState, useContext } from 'react'
import React from "react";
import "./App.css";
import Navbar from "./assets/Comp/navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import About from './components/About';
import Service_H from './components/Service_H';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import { AuthContext } from './context/AuthContext';
import MyAccount from './pages/MyAccount';
import MisMascotas from './pages/MisMascotas';
import Citas from './pages/Citas';
import AdminAgenda from './pages/AdminAgenda';
import AdminExpedientes from './pages/AdminExpedientes';
import AdminFinanzas from './pages/AdminFinanzas';
import AdminInventario from './pages/AdminInventario';
import AdminPedidos from './pages/AdminPedidos';
import AdminProveedores from './pages/AdminProveedores';

export default function App(): JSX.Element {
  const [route, setRoute] = useState<string>(window.location.hash || '#home');

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || '#home');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const { isAuthenticated, isAdmin } = useContext(AuthContext);

  const renderRoute = () => {
    // public routes
    if (route === '#login') return <Login />;
    if (route === '#signup' || route === '#register') return <Register />;
    if (route === '#productos') return <Products />;

    // protected user routes
    if (route === '#mis-mascotas') {
      if (!isAuthenticated) { window.location.hash = '#login'; return null; }
      return <MisMascotas />;
    }
    if (route === '#mis-citas' || route === '#citas') {
      if (!isAuthenticated) { window.location.hash = '#login'; return null; }
      return <Citas />;
    }
    if (route === '#cuenta' || route === '#mi-cuenta') {
      if (!isAuthenticated) { window.location.hash = '#login'; return null; }
      return <MyAccount />;
    }

    // admin routes
    if (route === '#agenda') {
      if (!isAuthenticated || !isAdmin) { window.location.hash = '#login'; return null; }
      return <AdminAgenda />;
    }
    if (route === '#expedientes') {
      if (!isAuthenticated || !isAdmin) { window.location.hash = '#login'; return null; }
      return <AdminExpedientes />;
    }
    if (route === '#finanzas') {
      if (!isAuthenticated || !isAdmin) { window.location.hash = '#login'; return null; }
      return <AdminFinanzas />;
    }
    if (route === '#inventario') {
      if (!isAuthenticated || !isAdmin) { window.location.hash = '#login'; return null; }
      return <AdminInventario />;
    }
    if (route === '#pedidos') {
      if (!isAuthenticated || !isAdmin) { window.location.hash = '#login'; return null; }
      return <AdminPedidos />;
    }
    if (route === '#proveedores') {
      if (!isAuthenticated || !isAdmin) { window.location.hash = '#login'; return null; }
      return <AdminProveedores />;
    }

    // default: homepage
    return (
      <>
        <Hero />
        <About />
        <Service_H />
      </>
    );
  };

  return (
      <>
        <Navbar />
        {renderRoute()}
        <Footer />
      </>
  );
}
