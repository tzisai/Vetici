import React, { useState } from 'react';
import { supabase } from '../supabaseclient';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Pasamos el nombre aquí para que el trigger de la DB lo use
          // para crear el perfil del usuario.
          data: {
            name: name,
          },
        },
      });

      if (error) throw error;

      // Si el registro requiere confirmación por email
      if (data.user && !data.session) {
        setMessage('¡Registro exitoso! Revisa tu correo para confirmar tu cuenta.');
      }
      // Si el registro no requiere confirmación, el usuario ya tiene sesión
      // y el AuthContext lo gestionará.

    } catch (error: any) {
      setError(error.message || 'Error durante el registro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Crear Cuenta</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label htmlFor="name">Nombre</label>
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="password">Contraseña</label>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {message && <p style={{ color: 'green' }}>{message}</p>}
      </form>
      <p>¿Ya tienes una cuenta? <a href="#login">Inicia Sesión</a></p>
    </div>
  );
};

export default Register;