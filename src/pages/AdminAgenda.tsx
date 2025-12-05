import React, { useState } from 'react';
import appointmentsData, { type Appointment, APPOINTMENT_TYPE_LABELS } from '../data/appointments';
import petsData from '../data/pets';
import usersData from '../data/users';
import './AdminAgenda.css';

const AdminAgenda: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(appointmentsData);

  const getPetName = (petId: string) => {
    const pet = petsData.pets.find(p => p.id === petId);
    return pet ? pet.name : 'Desconocido';
  };

  const getOwnerName = (userId: string) => {
    const user = usersData.find(u => u.id === userId);
    return user ? user.name : 'Desconocido';
  };

  const handleCancel = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres cancelar esta cita?')) {
      setAppointments(prevAppointments =>
        prevAppointments.map(app =>
          app.id === id ? { ...app, status: 'CANCELADA' } : app
        )
      );
      alert('Cita cancelada.');
    }
  };

  const handleReschedule = (id: string) => {
    // For now, just mark it as pending reschedule. A real implementation would involve a modal for new date/time.
    alert(`Funcionalidad de reagendar para la cita ${id} (no implementada completamente).`);
    setAppointments(prevAppointments =>
      prevAppointments.map(app =>
        app.id === id ? { ...app, status: 'PENDIENTE' } : app
      )
    );
  };

  return (
    <div className="admin-agenda-container">
      <h1>Gestión de Citas</h1>
      <div className="appointment-list">
        {appointments.length === 0 ? (
          <p>No hay citas programadas.</p>
        ) : (
          appointments.map(appointment => (
            <div key={appointment.id} className={`appointment-card status-${appointment.status.toLowerCase()}`}>
              <div className="appointment-header">
                <h2>Cita #{appointment.id} - {APPOINTMENT_TYPE_LABELS[appointment.type]}</h2>
                <span className={`appointment-status status-${appointment.status.toLowerCase()}`}>{appointment.status}</span>
              </div>
              <p><strong>Mascota:</strong> {getPetName(appointment.petId)}</p>
              <p><strong>Dueño:</strong> {getOwnerName(appointment.userId)}</p>
              <p><strong>Fecha:</strong> {appointment.date} - <strong>Hora:</strong> {appointment.time}</p>
              {appointment.veterinarian && <p><strong>Veterinario:</strong> {appointment.veterinarian}</p>}
              {appointment.notes && <p><strong>Notas:</strong> {appointment.notes}</p>}
              <div className="appointment-actions">
                {appointment.status !== 'CANCELADA' && appointment.status !== 'COMPLETADA' && (
                  <>
                    <button onClick={() => handleReschedule(appointment.id)} className="btn-reschedule">Reagendar</button>
                    <button onClick={() => handleCancel(appointment.id)} className="btn-cancel">Cancelar</button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminAgenda;