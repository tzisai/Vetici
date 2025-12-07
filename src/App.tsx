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
import AdminHome from './pages/AdminHome';
import UserHome from './pages/UserHome';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

export default function App(): JSX.Element {
  const [route, setRoute] = useState<string>(window.location.hash || '#home');

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || '#home');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const { isAuthenticated, isAdmin, needsPasswordReset } = useContext(AuthContext);

  const routes: { [key: string]: { component: JSX.Element; auth: 'public' | 'user' | 'admin' } } = {
    '#login': { component: <Login />, auth: 'public' },
    '#signup': { component: <Register />, auth: 'public' },
    '#register': { component: <Register />, auth: 'public' },
    '#recover': { component: <ForgotPassword />, auth: 'public' },
    '#productos': { component: <Products />, auth: 'public' },
    '#mis-mascotas': { component: <MisMascotas />, auth: 'user' },
    '#mis-citas': { component: <Citas />, auth: 'user' },
    '#citas': { component: <Citas />, auth: 'user' },
    '#micuenta': { component: <MyAccount />, auth: 'user' },
    '#agenda': { component: <AdminAgenda />, auth: 'admin' },
    '#expedientes': { component: <AdminExpedientes />, auth: 'admin' },
    '#finanzas': { component: <AdminFinanzas />, auth: 'admin' },
    '#inventario': { component: <AdminInventario />, auth: 'admin' },
    '#pedidos': { component: <AdminPedidos />, auth: 'admin' },
    '#proveedores': { component: <AdminProveedores />, auth: 'admin' },

  };

  const renderRoute = () => {
    if (needsPasswordReset) {
      return <ResetPassword />;
    }
    
    if (route === '#home' || route === '') {
      if (isAuthenticated) {
        return isAdmin ? <AdminHome /> : <UserHome />;
      }
      return (
        <>
          <Hero />
          <About />
          <Service_H />
        </>
      );
    }

    const currentRoute = routes[route];

    if (currentRoute) {
      const { component, auth } = currentRoute;
      if (auth === 'user' && !isAuthenticated) {
        window.location.hash = '#login';
        return null;
      }
      if (auth === 'admin' && (!isAuthenticated || !isAdmin)) {
        window.location.hash = '#login';
        return null;
      }
      return component;
    }

    // Fallback for any other route, redirect to home
    window.location.hash = '#home';
    return null;
  };

  return (
      <>
        <Navbar />
        {renderRoute()}
        <Footer />
      </>
  );
}
