import React, { useState, useEffect, useCallback, useContext } from 'react';
import { supabase } from '../supabaseclient';
import { APPOINTMENT_TYPE_LABELS } from '../data/appointments';
import type { Appointment } from '../data/appointments';
import type { Pet } from '../data/pets';
import { AuthContext } from '../context/AuthContext';
import AppointmentFormModal from '../components/AppointmentFormModal';
import ConfirmationModal from '../components/ConfirmationModal';
import './citas.css';

export default function Citas(): JSX.Element {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFormOpen, setFormOpen] = useState(false);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      // Fetch pets first
      const { data: petData, error: petError } = await supabase
        .from('pets')
        .select('id, name')
        .eq('user_id', user.id);
      if (petError) throw petError;
      const userPets = petData || [];
      setPets(userPets);

      // Fetch appointments
      const { data: apptData, error: apptError } = await supabase
        .from('appointments')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });
      if (apptError) throw apptError;
      
      // Add petName to appointments
      const appointmentsWithPetNames = apptData.map(appt => ({
        ...appt,
        petName: userPets.find(p => p.id === appt.pet_id)?.name || 'Mascota eliminada'
      }))
      setAppointments(appointmentsWithPetNames || []);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleBookAppointment = async (formData: Omit<Appointment, 'id' | 'user_id' | 'created_at' | 'status' | 'petName' | 'veterinarian'>) => {
    if (!user) return;
    try {
      const petName = pets.find(p => p.id === formData.pet_id)?.name || 'Mascota Desconocida';
      const newAppointment = {
        ...formData,
        user_id: user.id,
        status: 'PENDIENTE' as const,
      };
      const { data, error } = await supabase.from('appointments').insert(newAppointment).select();
      if (error) throw error;

      const createdAppointment = { ...data[0], petName };
      setAppointments(prev => [createdAppointment, ...prev]);
      setFormOpen(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCancelAppointment = (id: string) => {
    setAppointmentToCancel(id);
    setConfirmOpen(true);
  };

  const confirmCancel = async () => {
    if (!appointmentToCancel) return;
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status: 'CANCELADA' })
        .eq('id', appointmentToCancel)
        .select();
      if (error) throw error;
      setAppointments(prev => prev.map(apt => (apt.id === appointmentToCancel ? { ...data[0], petName: apt.petName } : apt)));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setConfirmOpen(false);
      setAppointmentToCancel(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDIENTE: 'pendiente',
      CONFIRMADA: 'confirmada',
      COMPLETADA: 'completada',
      CANCELADA: 'cancelada',
    };
    return statusMap[status] || 'pendiente';
  };

  const upcomingAppointments = appointments.filter(apt => apt.status !== 'CANCELADA' && apt.status !== 'COMPLETADA');
  const pastAppointments = appointments.filter(apt => apt.status === 'COMPLETADA' || apt.status === 'CANCELADA');

  if (loading) return <div>Cargando citas...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <main className="citas-main">
      <div className="citas-header">
        <h1>Mis Citas</h1>
        <button className="btn-new-cita" onClick={() => setFormOpen(true)}>
          Nueva cita
        </button>
      </div>

      <AppointmentFormModal
        isOpen={isFormOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleBookAppointment}
        pets={pets}
      />

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmCancel}
        title="Confirmar Cancelación"
        message="¿Estás seguro de que quieres cancelar esta cita?"
      />

      <div className="citas-section">
        <h2>Citas Próximas</h2>
        {upcomingAppointments.length === 0 ? (
          <p className="empty-msg">No tienes citas próximas. ¡Agenda una ahora!</p>
        ) : (
          <div className="citas-list">
            {upcomingAppointments.map(apt => (
              <div key={apt.id} className={`cita-card status-${getStatusBadge(apt.status)}`}>
                <div className="cita-header">
                  <h3>{apt.petName}</h3>
                  <span className={`status-badge ${getStatusBadge(apt.status)}`}>
                    {apt.status}
                  </span>
                </div>
                <div className="cita-details">
                  <div className="detail-item">
                    <strong>Servicio:</strong> {APPOINTMENT_TYPE_LABELS[apt.type]}
                  </div>
                  <div className="detail-item">
                    <strong>Fecha:</strong> {new Date(apt.date).toLocaleDateString('es-ES', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <div className="detail-item">
                    <strong>Hora:</strong> {apt.time}
                  </div>
                  {apt.veterinarian && (
                    <div className="detail-item">
                      <strong>Veterinario:</strong> {apt.veterinarian}
                    </div>
                  )}
                  {apt.notes && (
                    <div className="detail-item">
                      <strong>Notas:</strong> {apt.notes}
                    </div>
                  )}
                </div>
                {apt.status === 'PENDIENTE' && (
                  <button
                    className="btn-cancel"
                    onClick={() => handleCancelAppointment(apt.id)}
                  >
                    Cancelar cita
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {pastAppointments.length > 0 && (
        <div className="citas-section">
          <h2>Historial de Citas</h2>
          <div className="citas-list">
            {pastAppointments.map(apt => (
              <div key={apt.id} className={`cita-card status-${getStatusBadge(apt.status)} past`}>
                <div className="cita-header">
                  <h3>{apt.petName}</h3>
                  <span className={`status-badge ${getStatusBadge(apt.status)}`}>
                    {apt.status}
                  </span>
                </div>
                <div className="cita-details">
                  <div className="detail-item">
                    <strong>Servicio:</strong> {APPOINTMENT_TYPE_LABELS[apt.type]}
                  </div>
                  <div className="detail-item">
                    <strong>Fecha:</strong> {new Date(apt.date).toLocaleDateString('es-ES')}
                  </div>
                  <div className="detail-item">
                    <strong>Hora:</strong> {apt.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
