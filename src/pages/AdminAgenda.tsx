import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseclient';
import type { Appointment } from '../data/appointments';
import { APPOINTMENT_TYPE_LABELS } from '../data/appointments';
import AdminAppointmentModal from '../components/AdminAppointmentModal';
import './AdminAgenda.css';

// Extend Appointment to include joined data
type RichAppointment = Appointment & {
    pets: { name: string } | null;
    profiles: { name: string, email: string } | null;
};

const AdminAgenda: React.FC = () => {
    const [appointments, setAppointments] = useState<RichAppointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string|null>(null);
    const [editingAppointment, setEditingAppointment] = useState<RichAppointment|null>(null);

    const fetchAppointments = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('appointments')
                .select(`
                    *,
                    pets (name),
                    profiles (name, email)
                `)
                .order('date', { ascending: true });

            if (error) throw error;
            setAppointments(data as RichAppointment[] || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    const handleUpdate = async (appointmentId: string, updates: Partial<Appointment>) => {
        try {
            const { data, error } = await supabase
                .from('appointments')
                .update(updates)
                .eq('id', appointmentId)
                .select(`*, pets (name), profiles (name, email)`)
                .single();

            if (error) throw error;

            setAppointments(prev => prev.map(a => (a.id === appointmentId ? data : a)));
            setEditingAppointment(null);
        } catch (err: any) {
            setError(err.message);
        }
    };
    
    if (loading) return <div>Cargando agenda...</div>
    if (error) return <div>Error: {error}</div>

    return (
        <div className="admin-agenda-container">
            <h1>Gestión de Citas</h1>

            {editingAppointment && (
                <AdminAppointmentModal
                    isOpen={!!editingAppointment}
                    onClose={() => setEditingAppointment(null)}
                    appointment={editingAppointment}
                    onSave={handleUpdate}
                />
            )}

            <div className="appointment-list">
                {appointments.length === 0 ? (
                    <p>No hay citas programadas.</p>
                ) : (
                    appointments.map(appointment => (
                        <div key={appointment.id} className={`appointment-card status-${appointment.status.toLowerCase()}`}>
                            <div className="appointment-header">
                                <h2>{APPOINTMENT_TYPE_LABELS[appointment.type]}</h2>
                                <span className={`appointment-status status-${appointment.status.toLowerCase()}`}>{appointment.status}</span>
                            </div>
                            <p><strong>Mascota:</strong> {appointment.pets?.name || 'N/A'}</p>
                            <p><strong>Dueño:</strong> {appointment.profiles?.name || 'N/A'} ({appointment.profiles?.email || 'N/A'})</p>
                            <p><strong>Fecha:</strong> {new Date(appointment.date).toLocaleDateString()} - <strong>Hora:</strong> {appointment.time}</p>
                            {appointment.veterinarian && <p><strong>Veterinario:</strong> {appointment.veterinarian}</p>}
                            {appointment.notes && <p><strong>Notas:</strong> {appointment.notes}</p>}
                            
                            <div className="appointment-actions">
                                {appointment.status === 'PENDIENTE' && (
                                    <button onClick={() => handleUpdate(appointment.id, { status: 'CONFIRMADA' })} className="btn-confirm">
                                        Confirmar
                                    </button>
                                )}
                                {appointment.status === 'CONFIRMADA' && (
                                    <button onClick={() => handleUpdate(appointment.id, { status: 'COMPLETADA' })} className="btn-complete">
                                        Marcar como Completada
                                    </button>
                                )}
                                <button onClick={() => setEditingAppointment(appointment)} className="btn-edit">Editar</button>
                                {appointment.status !== 'CANCELADA' && (
                                    <button onClick={() => handleUpdate(appointment.id, { status: 'CANCELADA' })} className="btn-cancel">
                                        Cancelar
                                    </button>
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