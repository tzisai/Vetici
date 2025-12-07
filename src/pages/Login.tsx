import React, { useState } from "react";
import "./Auth.css";
import authImg from "../assets/imgs/homeP.jpg";
import { supabase } from "../supabaseclient";

export default function Login(): JSX.Element {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // Si el login es exitoso, el listener en AuthContext se encargará
      // de actualizar el estado y App.tsx te redirigirá a #home.
    } catch (error: any) {
      setError(error.message || "Error al iniciar sesión. Revisa tus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleLogin} className="auth-form">
          <label>
            Correo
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="tu@correo.com" />
          </label>

          <label>
            Contraseña
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
          </label>

          <button type="submit" className="auth-btn" disabled={loading}>{loading ? 'Iniciando...' : 'Entrar'}</button>

          <div className="auth-links">
            <a href="#register">Crear cuenta</a>
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
