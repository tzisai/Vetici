import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseclient';
import Slideshow from '../components/Slideshow';
import './AdminHome.css';

// Asumimos esta estructura para una cita
interface Appointment {
  id: string;
  date: string;
  pet_name: string;
  owner_name: string;
  reason: string;
}

const AdminHome: React.FC = () => {
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const today = new Date().toISOString();
        
        const { data, error } = await supabase
          .from('appointments')
          .select('id, date, pet_name, owner_name, reason')
          .gte('date', today) // Obtener citas de hoy en adelante
          .order('date', { ascending: true }) // Ordenar por fecha más cercana
          .limit(4); // Limitar a 4

        if (error) throw error;

        setUpcomingAppointments(data || []);
      } catch (err: any) {
        setError('No se pudieron cargar las citas. ' + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const renderAppointment = (appointment: Appointment) => (
    <div className="appointment-card">
      <h3>Próxima Cita</h3>
      <p className="appointment-date">
        {new Date(appointment.date).toLocaleString('es-ES', { dateStyle: 'full', timeStyle: 'short' })}
      </p>
      <p><strong>Mascota:</strong> {appointment.pet_name}</p>
      <p><strong>Dueño:</strong> {appointment.owner_name}</p>
      <p><strong>Motivo:</strong> {appointment.reason}</p>
    </div>
  );

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <main className="admin-home-main">
      <h1>Panel de Administrador</h1>
      <Slideshow items={upcomingAppointments} renderItem={renderAppointment} title="Citas Más Próximas" />
      {/* Aquí puedes agregar más contenido para el home del admin */}
    </main>
  );
};

export default AdminHome;