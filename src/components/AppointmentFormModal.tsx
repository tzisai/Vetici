import React, { useState, useEffect } from 'react';
import type { Appointment, AppointmentType } from '../data/appointments';
import type { Pet } from '../data/pets';
import { USER_BOOKABLE_TYPES, APPOINTMENT_TYPE_LABELS } from '../data/appointments';
import './appointmentFormModal.css';

interface AppointmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: Omit<Appointment, 'id' | 'user_id' | 'created_at' | 'status' | 'petName' | 'veterinarian'>) => void;
  pets: Pet[];
}

export default function AppointmentFormModal({ isOpen, onClose, onSave, pets }: AppointmentFormModalProps): JSX.Element | null {
  const [formData, setFormData] = useState({
    pet_id: '',
    type: USER_BOOKABLE_TYPES[0],
    date: '',
    time: '',
    notes: '',
  });

  useEffect(() => {
    if (pets.length > 0) {
      setFormData(prev => ({ ...prev, pet_id: pets[0].id }));
    }
  }, [pets]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.pet_id) {
        alert('Por favor, registra una mascota primero.');
        return;
    }
    onSave(formData as Omit<Appointment, 'id' | 'user_id' | 'created_at' | 'status' | 'petName' | 'veterinarian'>);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Reservar Nueva Cita</h2>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="pet_id">Mascota</label>
                <select id="pet_id" name="pet_id" value={formData.pet_id} onChange={handleChange} required>
                    {pets.map(pet => (
                        <option key={pet.id} value={pet.id}>{pet.name}</option>
                    ))}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="type">Tipo de Cita</label>
                <select id="type" name="type" value={formData.type} onChange={handleChange} required>
                {USER_BOOKABLE_TYPES.map(type => (
                  <option key={type} value={type}>
                    {APPOINTMENT_TYPE_LABELS[type as AppointmentType]}
                  </option>
                ))}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="date">Fecha</label>
                <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required min={new Date().toISOString().split('T')[0]}/>
            </div>
            <div className="form-group">
                <label htmlFor="time">Hora</label>
                <input type="time" id="time" name="time" value={formData.time} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="notes">Notas</label>
                <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} rows={3}></textarea>
            </div>
            <div className="modal-actions">
                <button type="button" onClick={onClose} className="btn-cancel">Cancelar</button>
                <button type="submit" className="btn-confirm">Reservar Cita</button>
            </div>
        </form>
      </div>
    </div>
  );
}
