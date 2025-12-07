export type AppointmentType = 
  | 'CHEQUEO_MEDICO' 
  | 'ESTETICA' 
  | 'VACUNACION' 
  | 'CIRUGIA' 
  | 'LABORATORIO' 
  | 'SEGUIMIENTO';

export type Appointment = {
  id: string;
  user_id: string;
  pet_id: string;
  type: AppointmentType;
  date: string; // ISO date string
  time: string; // HH:mm format
  veterinarian?: string;
  notes?: string;
  status: 'PENDIENTE' | 'CONFIRMADA' | 'COMPLETADA' | 'CANCELADA';
  created_at: string;
  // This is not in the table, but useful for display
  petName?: string; 
};

// Mock appointments data
const appointments: Appointment[] = [
  {
    id: 'APT001',
    user_id: 'user1',
    pet_id: 'pet1',
    petName: 'Max',
    type: 'CHEQUEO_MEDICO',
    date: '2025-12-10',
    time: '10:00',
    veterinarian: 'Dra. María López',
    notes: 'Chequeo general anual',
    status: 'CONFIRMADA',
    created_at: '2025-12-01',
  },
  {
    id: 'APT002',
    user_id: 'user1',
    pet_id: 'pet2',
    petName: 'Luna',
    type: 'ESTETICA',
    date: '2025-12-15',
    time: '14:30',
    veterinarian: 'Dr. Carlos García',
    notes: 'Baño y corte de uñas',
    status: 'CONFIRMADA',
    created_at: '2025-12-01',
  },
  {
    id: 'APT003',
    user_id: 'user1',
    pet_id: 'pet1',
    petName: 'Max',
    type: 'VACUNACION',
    date: '2025-12-20',
    time: '11:00',
    veterinarian: 'Dra. María López',
    notes: 'Vacuna triple',
    status: 'PENDIENTE',
    created_at: '2025-12-01',
  },
];

export default appointments;

// Service types that users can book directly
export const USER_BOOKABLE_TYPES: AppointmentType[] = ['CHEQUEO_MEDICO', 'ESTETICA'];

// Service types that only admin can assign
export const ADMIN_ONLY_TYPES: AppointmentType[] = ['VACUNACION', 'CIRUGIA', 'LABORATORIO', 'SEGUIMIENTO'];

export const APPOINTMENT_TYPE_LABELS: Record<AppointmentType, string> = {
  CHEQUEO_MEDICO: 'Chequeo Médico',
  ESTETICA: 'Estética',
  VACUNACION: 'Vacunación',
  CIRUGIA: 'Cirugía',
  LABORATORIO: 'Laboratorio',
  SEGUIMIENTO: 'Seguimiento',
};
