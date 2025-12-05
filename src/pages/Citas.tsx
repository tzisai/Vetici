import React, { useState, useContext } from 'react';
import appointments, { USER_BOOKABLE_TYPES, APPOINTMENT_TYPE_LABELS } from '../data/appointments';
import type { Appointment } from '../data/appointments';
import { AuthContext } from '../context/AuthContext';
import './citas.css';

export default function Citas(): JSX.Element {
  const { user } = useContext(AuthContext);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    petName: '',
    type: USER_BOOKABLE_TYPES[0],
    date: '',
    time: '',
    notes: '',
  });
  const [userAppointments, setUserAppointments] = useState<Appointment[]>(appointments);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.petName || !formData.date || !formData.time) {
      alert('Por favor completa todos los campos');
      return;
    }

    const newAppointment: Appointment = {
      id: `APT${Date.now()}`,
      userId: user?.email || 'user1',
      petId: `pet_${Date.now()}`,
      petName: formData.petName,
      type: formData.type as any,
      date: formData.date,
      time: formData.time,
      notes: formData.notes,
      status: 'PENDIENTE',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setUserAppointments(prev => [newAppointment, ...prev]);
    setFormData({ petName: '', type: USER_BOOKABLE_TYPES[0], date: '', time: '', notes: '' });
    setShowForm(false);
    alert('Cita reservada exitosamente');
  };

  const handleCancelAppointment = (id: string) => {
    if (confirm('¿Deseas cancelar esta cita?')) {
      setUserAppointments(prev =>
        prev.map(apt => apt.id === id ? { ...apt, status: 'CANCELADA' } : apt)
      );
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

  const upcomingAppointments = userAppointments.filter(apt => apt.status !== 'CANCELADA' && apt.status !== 'COMPLETADA');
  const pastAppointments = userAppointments.filter(apt => apt.status === 'COMPLETADA' || apt.status === 'CANCELADA');

  return (
    <main className="citas-main">
      <div className="citas-header">
        <h1>Mis Citas</h1>
        <button className="btn-new-cita" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : 'Nueva cita'}
        </button>
      </div>

      {/* Formulario de reserva */}
      {showForm && (
        <div className="citas-form-container">
          <h2>Reservar Nueva Cita</h2>
          <form onSubmit={handleBookAppointment} className="citas-form">
            <div className="form-group">
              <label>Nombre de la mascota *</label>
              <input
                type="text"
                name="petName"
                value={formData.petName}
                onChange={handleInputChange}
                placeholder="Ej: Max, Luna..."
                required
              />
            </div>

            <div className="form-group">
              <label>Tipo de servicio *</label>
              <select name="type" value={formData.type} onChange={handleInputChange}>
                {USER_BOOKABLE_TYPES.map(type => (
                  <option key={type} value={type}>
                    {APPOINTMENT_TYPE_LABELS[type]}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Fecha *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="form-group">
                <label>Hora *</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Notas</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Información adicional (alergias, comportamiento especial, etc.)"
                rows={3}
              />
            </div>

            <button type="submit" className="btn-submit">Reservar cita</button>
          </form>
        </div>
      )}

      {/* Citas próximas */}
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
                {apt.status !== 'CONFIRMADA' && (
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

      {/* Historial de citas */}
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
