import React, { useState } from "react";
import "./Auth.css";
import { supabase } from "../supabaseclient";

export default function ForgotPassword(): JSX.Element {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin, // Redirect to the same app to handle the reset
      });
      if (error) throw error;
      setMessage("Se ha enviado un correo para restablecer tu contraseña. Revisa tu bandeja de entrada.");
    } catch (error: any) {
      setError(error.message || "Error al intentar restablecer la contraseña.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <h2>Recuperar Contraseña</h2>
        <form onSubmit={handlePasswordReset} className="auth-form">
          <p>Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.</p>
          <label>
            Correo
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="tu@correo.com" />
          </label>

          <button type="submit" className="auth-btn" disabled={loading}>{loading ? 'Enviando...' : 'Enviar enlace'}</button>

          <div className="auth-links">
            <a href="#login">Volver a iniciar sesión</a>
          </div>
          {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
          {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
        </form>
      </div>
    </main>
  );
}
