import React, { useState, useContext } from "react";
import "./Auth.css";
import authImg from "../assets/imgs/homeP.jpg";
import { AuthContext } from "../context/AuthContext";

export default function Login(): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<string>("CLIENTE");
  const { login } = useContext(AuthContext);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // mock login: crear usuario y persistir en contexto
    const name = email.split("@")[0];
    login({ name, email, role: role as any });
    // navigate to home
    window.location.hash = "#home";
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleSubmit} className="auth-form">
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
            Rol (solo para pruebas)
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="CLIENTE">Cliente</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </label>

          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              placeholder="••••••••"
            />
          </label>

          <button type="submit" className="auth-btn">Entrar</button>

          <div className="auth-links">
            <a href="#signup">Crear cuenta</a>
            <a href="#recover">¿Olvidaste tu contraseña?</a>
          </div>
        </form>
      </div>

      <div className="auth-visual">
        <img src={authImg} alt="Veterinaria" />
      </div>
    </main>
  );
}
