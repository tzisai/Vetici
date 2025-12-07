import React, { useState } from "react";
import { supabase } from "../supabaseclient";
import "./Auth.css";

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { data, error } = await supabase.auth.updateUser({ password });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setMessage("Tu contraseña ha sido actualizada exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.");
      setTimeout(() => {
        // Log out the user to force them to log in with the new password
        supabase.auth.signOut();
        window.location.hash = '#login';
      }, 5000);
    }
  };

  return (
    <main className="auth-page">
        <div className="auth-card">
            <h2>Restablecer Contraseña</h2>
            <form onSubmit={handlePasswordReset} className="auth-form">
                <p>Ingresa tu nueva contraseña.</p>
                <label>
                    Nueva Contraseña
                    <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="Mínimo 8 caracteres"
                    />
                </label>
                <button type="submit" className="auth-btn" disabled={loading}>
                    {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
                </button>
                {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
                {message && <p style={{ color: 'green', marginTop: '1rem' }}>{message}</p>}
            </form>
        </div>
    </main>
  );
};

export default ResetPassword;
