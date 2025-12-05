export type AppointmentType = 
  | 'CHEQUEO_MEDICO' 
  | 'ESTETICA' 
  | 'VACUNACION' 
  | 'CIRUGIA' 
  | 'LABORATORIO' 
  | 'SEGUIMIENTO';

export type Appointment = {
  id: string;
  userId: string;
  petId: string;
  petName: string;
  type: AppointmentType;
  date: string; // ISO date string
  time: string; // HH:mm format
  veterinarian?: string;
  notes?: string;
  status: 'PENDIENTE' | 'CONFIRMADA' | 'COMPLETADA' | 'CANCELADA';
  createdAt: string;
};

// Mock appointments data
const appointments: Appointment[] = [
  {
    id: 'APT001',
    userId: 'user1',
    petId: 'pet1',
    petName: 'Max',
    type: 'CHEQUEO_MEDICO',
    date: '2025-12-10',
    time: '10:00',
    veterinarian: 'Dra. María López',
    notes: 'Chequeo general anual',
    status: 'CONFIRMADA',
    createdAt: '2025-12-01',
  },
  {
    id: 'APT002',
    userId: 'user1',
    petId: 'pet2',
    petName: 'Luna',
    type: 'ESTETICA',
    date: '2025-12-15',
    time: '14:30',
    veterinarian: 'Dr. Carlos García',
    notes: 'Baño y corte de uñas',
    status: 'CONFIRMADA',
    createdAt: '2025-12-01',
  },
  {
    id: 'APT003',
    userId: 'user1',
    petId: 'pet1',
    petName: 'Max',
    type: 'VACUNACION',
    date: '2025-12-20',
    time: '11:00',
    veterinarian: 'Dra. María López',
    notes: 'Vacuna triple',
    status: 'PENDIENTE',
    createdAt: '2025-12-01',
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
