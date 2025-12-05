export type Pet = {
  id: string;
  userId: string;
  name: string;
  species: 'PERRO' | 'GATO' | 'CONEJO' | 'AVE' | 'OTRO';
  breed?: string;
  birthDate: string; // ISO date
  microchip?: string;
  photo?: string;
  createdAt: string;
};

export type MedicalRecord = {
  id: string;
  petId: string;
  date: string;
  type: string; // Chequeo, Vacuna, etc.
  symptoms?: string;
  veterinarian?: string;
  diagnosis?: string;
  treatment?: string;
  notes?: string;
  weight?: number; // kg
  temperature?: number; // Celsius
  status: 'INCOMPLETO' | 'COMPLETADO'; // Usuario crea, admin completa
};

// Mock pets
const pets: Pet[] = [
  {
    id: 'pet1',
    userId: 'user1',
    name: 'Max',
    species: 'PERRO',
    breed: 'Labrador Retriever',
    birthDate: '2020-05-15',
    microchip: '123456789',
    photo: 'https://images.unsplash.com/photo-1633722715463-d30628a72f51?w=200&h=200&fit=crop',
    createdAt: '2023-01-10',
  },
  {
    id: 'pet2',
    userId: 'user1',
    name: 'Luna',
    species: 'GATO',
    breed: 'Gato Siamés',
    birthDate: '2021-08-22',
    microchip: '987654321',
    photo: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200&h=200&fit=crop',
    createdAt: '2023-02-14',
  },
];

// Mock medical records
const medicalRecords: MedicalRecord[] = [
  {
    id: 'rec1',
    petId: 'pet1',
    date: '2025-10-15',
    type: 'Chequeo Médico',
    veterinarian: 'Dra. María López',
    diagnosis: 'Mascota saludable',
    treatment: 'Ninguno',
    weight: 32.5,
    temperature: 38.2,
    status: 'COMPLETADO',
  },
  {
    id: 'rec2',
    petId: 'pet1',
    date: '2025-12-10',
    type: 'Chequeo Médico',
    weight: 32.0,
    symptoms: 'Decaimiento y falta de apetito.',
    status: 'INCOMPLETO',
  },
];

export default { pets, medicalRecords };

export const SPECIES_LABELS: Record<Pet['species'], string> = {
  PERRO: 'Perro',
  GATO: 'Gato',
  CONEJO: 'Conejo',
  AVE: 'Ave',
  OTRO: 'Otro',
};
