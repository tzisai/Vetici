import React, { useContext, useState } from "react";
import "./navbar.css";
import logo from "../imgs/logo.png";
import { AuthContext } from "../../context/AuthContext";

export default function Navbar(): JSX.Element {
    const [open, setOpen] = useState(false);
    const { user, isAuthenticated, isAdmin, logout } = useContext(AuthContext);

    return (
        <nav className="vetici-nav">
            <div className="brand">
                <a href="#" aria-label="Vetici home">
                    <img src={logo} alt="Vetici logo" className="nav-logo" />
                </a>
            </div>

            {/* saludo */}
            {isAuthenticated && user && (
                <div className="nav-user">Hola, {user.name}</div>
            )}

            <button
                className="toggle-btn"
                aria-expanded={open}
                aria-label="Abrir menú"
                onClick={() => setOpen((s) => !s)}
            >
                <span className="bar" />
                <span className="bar" />
                <span className="bar" />
            </button>

                        <div className={`links ${open ? "open" : ""}`} onClick={() => setOpen(false)}>
                                {!isAuthenticated && (
                                    <>
                                        <a href="#inicio">Inicio</a>
                                        <a href="#productos">Tienda</a>
                                        <a href="#login">Iniciar sesión</a>
                                    </>
                                )}

                                {isAuthenticated && !isAdmin && (
                                    /* cliente */
                                    <>
                                        <a href="#inicio">Inicio</a>
                                        <a href="#productos">Tienda</a>
                                        <a href="#mis-mascotas">Mis mascotas</a>
                                        <a href="#mis-citas">Citas</a>
                                        <a href="#cuenta">Mi cuenta</a>
                                        <a href="#" onClick={(e) => { e.preventDefault(); logout(); }}>Cerrar sesión</a>
                                    </>
                                )}

                                {isAuthenticated && isAdmin && (
                                    /* admin */
                                    <>
                                        <a href="#inicio">Inicio</a>
                                        <a href="#inventario">Inventario</a>
                                        <a href="#agenda">Agenda</a>
                                        <a href="#expedientes">Expedientes</a>
                                        <a href="#finanzas">Finanzas</a>
                                        <a href="#cuenta">Mi cuenta</a>
                                        <a href="#" onClick={(e) => { e.preventDefault(); logout(); }}>Cerrar sesión</a>
                                    </>
                                )}
                        </div>
        </nav>
    );
}
