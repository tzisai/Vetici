import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseclient';
import Slideshow from '../components/Slideshow';
import './AdminHome.css';

// Asumimos esta estructura para una cita desde Supabase
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
        <div className="appointment-slide-card">
            <h3>Cita Próxima</h3>
            <p className="appointment-date">
                {new Date(appointment.date).toLocaleString('es-ES', { dateStyle: 'full', timeStyle: 'short' })}
            </p>
            <p><strong>Mascota:</strong> {appointment.pet_name}</p>
            <p><strong>Dueño:</strong> {appointment.owner_name}</p>
            <p><strong>Motivo:</strong> {appointment.reason}</p>
        </div>
    );

    return (
        <div className="admin-home-container">
            <div className="admin-home">
                <h1 className="main-title">¿Qué vas a hacer hoy?</h1>

                {loading && <p>Cargando citas...</p>}
                {error && <p>Error: {error}</p>}
                {!loading && !error && (
                    <Slideshow items={upcomingAppointments} renderItem={renderAppointment} title="Citas Más Próximas" />
                )}

                <h2 className="sub-title">Panel de Administración</h2>
                <div className="nav-grid">
                    <div className="nav-card">
                        <img src="/src/assets/imgs/productos_img.jpg" alt="Inventario" />
                        <h3>Inventario</h3>
                        <a href="#/admin/inventario" className="nav-button">Ir allí</a>
                    </div>
                    <div className="nav-card">
                        <img src="/src/assets/imgs/cirugia.jpg" alt="Agenda" />
                        <h3>Agenda</h3>
                        <a href="#/admin/agenda" className="nav-button">Ir allí</a>
                    </div>
                    <div className="nav-card">
                        <img src="/src/assets/imgs/estetica.jpg" alt="Expedientes" />
                        <h3>Expedientes</h3>
                        <a href="#/admin/expedientes" className="nav-button">Ir allí</a>
                    </div>
                    <div className="nav-card">
                        <img src="/src/assets/imgs/homeP.jpg" alt="Finanzas" />
                        <h3>Finanzas</h3>
                        <a href="#/admin/finanzas" className="nav-button">Ir allí</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHome;
