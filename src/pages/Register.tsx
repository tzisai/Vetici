import React, { useState } from "react";
import "./Auth.css";
import authImg from "../assets/imgs/homeP.jpg";
import { supabase } from "../supabaseclient";

export default function Register(): JSX.Element {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVet, setIsVet] = useState(false);
  const [authKey, setAuthKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const VET_AUTH_KEY = "VET123";

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (isVet && authKey !== VET_AUTH_KEY) {
      setError("Clave de autorización para veterinario incorrecta.");
      return;
    }

    setLoading(true);
    try {
      const userRole = isVet ? 'ADMIN' : 'CLIENTE';

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            role: userRole,
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

          <label className="switch-label">
            <input type="checkbox" checked={isVet} onChange={() => setIsVet(!isVet)} className="switch-input" />
            <span className="switch-slider"></span>
            Crear cuenta de veterinario
          </label>

          {isVet && (
            <label>
              Clave de autorización
              <input type="password" value={authKey} onChange={(e) => setAuthKey(e.target.value)} required placeholder="Clave secreta" />
            </label>
          )}

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
