import React, { useState } from 'react';
import petData, { SPECIES_LABELS } from '../data/pets';
import type { Pet, MedicalRecord } from '../data/pets';
import PetCard from '../components/PetCard';
import './mismascotas.css';

export default function MisMascotas(): JSX.Element {
  const [pets, setPets] = useState<Pet[]>(petData.pets);
  const [records] = useState<MedicalRecord[]>(petData.medicalRecords);
  const [showForm, setShowForm] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [showRecords, setShowRecords] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    species: 'PERRO' as const,
    breed: '',
    birthDate: '',
    microchip: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddPet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.birthDate) {
      alert('Por favor completa los campos requeridos');
      return;
    }

    const newPet: Pet = {
      id: `pet_${Date.now()}`,
      userId: 'user1',
      name: formData.name,
      species: formData.species,
      breed: formData.breed || undefined,
      birthDate: formData.birthDate,
      microchip: formData.microchip || undefined,
      photo: 'https://via.placeholder.com/200x200?text=Sin+foto',
      createdAt: new Date().toISOString().split('T')[0],
    };

    setPets(prev => [newPet, ...prev]);
    setFormData({ name: '', species: 'PERRO', breed: '', birthDate: '', microchip: '' });
    setShowForm(false);
    alert('Mascota agregada exitosamente');
  };

  const handleDeletePet = (petId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta mascota?')) {
      setPets(prev => prev.filter(p => p.id !== petId));
    }
  };

  const handleViewDetails = (pet: Pet) => {
    setSelectedPet(pet);
    setShowRecords(true);
  };

  const petRecords = selectedPet ? records.filter(r => r.petId === selectedPet.id) : [];

  return (
    <main className="mascotas-main">
      <div className="mascotas-header">
        <h1>Mis Mascotas</h1>
        <button className="btn-new-pet" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : 'Agregar mascota'}
        </button>
      </div>

      {/* Formulario de nueva mascota */}
      {showForm && (
        <div className="mascotas-form-container">
          <h2>Registrar Nueva Mascota</h2>
          <form onSubmit={handleAddPet} className="mascotas-form">
            <div className="form-group">
              <label>Nombre *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ej: Max, Luna..."
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Especie *</label>
                <select name="species" value={formData.species} onChange={handleInputChange}>
                  {Object.entries(SPECIES_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Raza</label>
                <input
                  type="text"
                  name="breed"
                  value={formData.breed}
                  onChange={handleInputChange}
                  placeholder="Ej: Labrador..."
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Fecha de nacimiento *</label>
                <input
                  type="date"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Microchip</label>
                <input
                  type="text"
                  name="microchip"
                  value={formData.microchip}
                  onChange={handleInputChange}
                  placeholder="Número de microchip"
                />
              </div>
            </div>

            <button type="submit" className="btn-submit">Registrar mascota</button>
          </form>
        </div>
      )}

      {/* Modal de expediente */}
      {showRecords && selectedPet && (
        <div className="modal-overlay" onClick={() => setShowRecords(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowRecords(false)}>X</button>
            <h2>Expediente de {selectedPet.name}</h2>
            
            <div className="expediente-info">
              <h3>Información General</h3>
              <div className="info-grid">
                <div className="info-item">
                  <strong>Especie:</strong> {SPECIES_LABELS[selectedPet.species]}
                </div>
                <div className="info-item">
                  <strong>Raza:</strong> {selectedPet.breed || 'No especificada'}
                </div>
                <div className="info-item">
                  <strong>Fecha de nacimiento:</strong> {new Date(selectedPet.birthDate).toLocaleDateString('es-ES')}
                </div>
                <div className="info-item">
                  <strong>Microchip:</strong> {selectedPet.microchip || 'No registrado'}
                </div>
              </div>
            </div>

            <div className="expediente-records">
              <h3>Historial Médico</h3>
              {petRecords.length === 0 ? (
                <p className="empty-msg">No hay registros médicos aún.</p>
              ) : (
                <div className="records-list">
                  {petRecords.map(record => (
                    <div key={record.id} className={`record-card status-${record.status.toLowerCase()}`}>
                      <div className="record-header">
                        <strong>{record.type}</strong>
                        <span className={`status-badge ${record.status.toLowerCase()}`}>
                          {record.status === 'INCOMPLETO' ? 'En proceso' : 'Completado'}
                        </span>
                      </div>
                      <div className="record-details">
                        <p><strong>Fecha:</strong> {new Date(record.date).toLocaleDateString('es-ES')}</p>
                        {record.veterinarian && <p><strong>Veterinario:</strong> {record.veterinarian}</p>}
                        {record.weight && <p><strong>Peso:</strong> {record.weight} kg</p>}
                        {record.temperature && <p><strong>Temperatura:</strong> {record.temperature}°C</p>}
                        {record.diagnosis && <p><strong>Diagnóstico:</strong> {record.diagnosis}</p>}
                        {record.treatment && <p><strong>Tratamiento:</strong> {record.treatment}</p>}
                        {record.notes && <p><strong>Notas:</strong> {record.notes}</p>}
                      </div>
                      {record.status === 'INCOMPLETO' && (
                        <p className="incomplete-msg">
                          Este registro será completado por el veterinario después de la cita.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Grid de mascotas */}
      <div className="mascotas-grid">
        {pets.length === 0 ? (
          <p className="empty-msg">No tienes mascotas registradas. ¡Agrega una ahora!</p>
        ) : (
          pets.map(pet => (
            <PetCard
              key={pet.id}
              pet={pet}
              onViewDetails={handleViewDetails}
              onDelete={handleDeletePet}
            />
          ))
        )}
      </div>
    </main>
  );
}
