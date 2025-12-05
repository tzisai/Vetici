import React, { useState, useContext } from "react";
import "./Auth.css";
import authImg from "../assets/imgs/homeP.jpg";
import { AuthContext } from "../context/AuthContext";

export default function Register(): JSX.Element {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login } = useContext(AuthContext);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // mock register: create user and login as CLIENTE
    login({ name, email, role: "CLIENTE" });
    window.location.hash = "#home";
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h2>Crear cuenta</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Nombre completo
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Tu nombre"
            />
          </label>

          <label>
            Correo
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="tu@correo.com"
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              placeholder="Mínimo 8 caracteres"
            />
          </label>

          <button type="submit" className="auth-btn">Crear cuenta</button>

          <div className="auth-links">
            <a href="#login">Ya tengo cuenta</a>
          </div>
        </form>
      </div>

      <div className="auth-visual">
        <img src={authImg} alt="Veterinaria" />
      </div>
    </main>
  );
}
