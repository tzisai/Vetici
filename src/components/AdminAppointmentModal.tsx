import React, { useState } from 'react';
import { supabase } from '../supabaseclient';
import type { Appointment } from '../data/appointments';
import { APPOINTMENT_TYPE_LABELS } from '../data/appointments';

interface AdminAppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (appointmentId: string, updates: Partial<Appointment>) => Promise<void>;
    appointment: Appointment | null;
}

export default function AdminAppointmentModal({ isOpen, onClose, onSave, appointment }: AdminAppointmentModalProps): JSX.Element | null {
    const [veterinarian, setVeterinarian] = useState(appointment?.veterinarian || '');
    const [status, setStatus] = useState(appointment?.status || 'PENDIENTE');

    if (!isOpen || !appointment) return null;

    const handleSave = () => {
        onSave(appointment.id, { veterinarian, status });
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Editar Cita</h2>
                <div className="form-group">
                    <label htmlFor="veterinarian">Veterinario</label>
                    <input
                        id="veterinarian"
                        type="text"
                        value={veterinarian}
                        onChange={(e) => setVeterinarian(e.target.value)}
                        placeholder="Nombre del veterinario"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="status">Estado</label>
                    <select id="status" value={status} onChange={(e) => setStatus(e.target.value as Appointment['status'])}>
                        <option value="PENDIENTE">Pendiente</option>
                        <option value="CONFIRMADA">Confirmada</option>
                        <option value="COMPLETADA">Completada</option>
                        <option value="CANCELADA">Cancelada</option>
                    </select>
                </div>
                <div className="modal-actions">
                    <button onClick={onClose} className="btn-cancel">Cancelar</button>
                    <button onClick={handleSave} className="btn-confirm">Guardar</button>
                </div>
            </div>
        </div>
    );
}
