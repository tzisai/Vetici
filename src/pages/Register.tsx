import React, { useState } from "react";
import "./Auth.css";
import authImg from "../assets/imgs/homeP.jpg";
import { supabase } from "../supabaseclient";

export default function Register(): JSX.Element {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      });
      if (error) throw error;
      if (data.user && !data.session) {
        setMessage("¡Registro exitoso! Revisa tu correo para confirmar tu cuenta.");
      }
    } catch (error: any) {
      setError(error.message || "Error durante el registro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h2>Crear cuenta</h2>
        <form onSubmit={handleRegister} className="auth-form">
          <label>
            Nombre completo
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Tu nombre" />
          </label>

          <label>
            Correo
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="tu@correo.com" />
          </label>

          <label>
            Contraseña
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} placeholder="Mínimo 8 caracteres" />
          </label>

          <button type="submit" className="auth-btn" disabled={loading}>{loading ? 'Registrando...' : 'Crear cuenta'}</button>

          <div className="auth-links">
            <a href="#login">Ya tengo cuenta</a>
          </div>
          {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
          {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
        </form>
      </div>

      <div className="auth-visual">
        <img src={authImg} alt="Veterinaria" />
      </div>
    </main>
  );
}
