import React, { useState, useMemo } from 'react';
import petData from '../data/pets';
import usersData from '../data/users';
import type { User } from '../data/users';
import type { Pet, MedicalRecord } from '../data/pets';
import { SPECIES_LABELS } from '../data/pets';
import './adminexpedientes.css';

const EmptyState = () => (
  <div className="expediente-placeholder">
    <div className="expediente-placeholder-icon">🐾</div>
    <h2>Selecciona una mascota</h2>
    <p>Elige una mascota de la lista para ver o actualizar su expediente médico.</p>
  </div>
);

const RecordFormModal = ({
  record,
  pet,
  onClose,
  onSave,
}: {
  record: MedicalRecord | Partial<MedicalRecord>;
  pet: Pet;
  onClose: () => void;
  onSave: (updatedRecord: MedicalRecord) => void;
}) => {
  const [formData, setFormData] = useState<Partial<MedicalRecord>>(record);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const newRecord: MedicalRecord = {
      ...formData,
      id: formData.id || `rec_${Date.now()}`,
      petId: pet.id,
      date: formData.date || new Date().toISOString(),
      type: formData.type || 'Consulta',
      status: 'COMPLETADO',
    };
    onSave(newRecord);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{formData.id ? 'Editar' : 'Nueva'} Entrada para {pet.name}</h2>
          <button onClick={onClose} className="modal-close">&times;</button>
        </div>
        <form className="modal-form">
          <div className="form-grid">
            <div className="form-group full-width">
              <label htmlFor="symptoms">Síntomas Reportados</label>
              <textarea
                id="symptoms"
                name="symptoms"
                value={formData.symptoms || ''}
                onChange={handleInputChange}
                placeholder="Ej: Decaimiento, falta de apetito, tos..."
              />
            </div>
            <div className="form-group">
              <label htmlFor="weight">Peso (kg)</label>
              <input
                type="number"
                id="weight"
                name="weight"
                step="0.1"
                value={formData.weight || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="temperature">Temperatura (°C)</label>
              <input
                type="number"
                id="temperature"
                name="temperature"
                step="0.1"
                value={formData.temperature || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group full-width">
              <label htmlFor="diagnosis">Diagnóstico</label>
              <textarea
                id="diagnosis"
                name="diagnosis"
                value={formData.diagnosis || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group full-width">
              <label htmlFor="treatment">Tratamiento</label>
              <textarea
                id="treatment"
                name="treatment"
                value={formData.treatment || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group full-width">
              <label htmlFor="notes">Observaciones / Notas Adicionales</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes || ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="veterinarian">Veterinario</label>
              <input
                type="text"
                id="veterinarian"
                name="veterinarian"
                value={formData.veterinarian || ''}
                onChange={handleInputChange}
              />
            </div>
             <div className="form-group">
              <label htmlFor="date">Fecha</label>
              <input
                type="date"
                id="date"
                name="date"
                value={(formData.date || new Date().toISOString()).split('T')[0]}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </form>
        <div className="modal-actions">
          <button onClick={onClose} className="btn btn-cancel">Cancelar</button>
          <button onClick={handleSave} className="btn btn-save">Guardar Entrada</button>
        </div>
      </div>
    </div>
  );
};


export default function AdminExpedientes(): JSX.Element {
  const [pets, setPets] = useState<Pet[]>(petData.pets);
  const [records, setRecords] = useState<MedicalRecord[]>(petData.medicalRecords);
  const [users, setUsers] = useState<User[]>(usersData);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingRecord, setEditingRecord] = useState<MedicalRecord | Partial<MedicalRecord> | null>(null);

  const filteredPets = useMemo(() => {
    const petWithOwner = pets.map(p => {
      const owner = users.find(u => u.id === p.userId);
      return { ...p, ownerName: owner?.name || 'N/A' };
    });
    return petWithOwner.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [pets, users, searchTerm]);

  const selectedPet = useMemo(() =>
    pets.find(p => p.id === selectedPetId),
    [pets, selectedPetId]
  );
  
  const owner = useMemo(() =>
    users.find(u => u.id === selectedPet?.userId),
    [users, selectedPet]
  );

  const selectedPetRecords = useMemo(() =>
    records
      .filter(r => r.petId === selectedPetId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [records, selectedPetId]
  );

  const handleSaveRecord = (updatedRecord: MedicalRecord) => {
    setRecords(prev => {
      const existing = prev.find(r => r.id === updatedRecord.id);
      if (existing) {
        return prev.map(r => r.id === updatedRecord.id ? updatedRecord : r);
      }
      return [updatedRecord, ...prev];
    });
    setEditingRecord(null);
  };
  
  const handleAddNewEntry = () => {
    if (!selectedPet) return;
    setEditingRecord({ petId: selectedPet.id });
  };

  return (
    <main className="admin-exp-main">
      {editingRecord && selectedPet && (
        <RecordFormModal
          record={editingRecord}
          pet={selectedPet}
          onClose={() => setEditingRecord(null)}
          onSave={handleSaveRecord}
        />
      )}

      <div className="pet-list-column">
        <div className="pet-list-header">
          <h2>Pacientes</h2>
          <input
            type="search"
            placeholder="Buscar por mascota o dueño..."
            className="pet-search-input"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="pet-list">
          {filteredPets.map(pet => (
            <div
              key={pet.id}
              className={`pet-list-item ${pet.id === selectedPetId ? 'active' : ''}`}
              onClick={() => setSelectedPetId(pet.id)}
            >
              <div className="pet-item-name">{pet.name}</div>
              <div className="pet-item-species">{SPECIES_LABELS[pet.species]}</div>
              <div className="pet-item-owner">{pet.ownerName}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="expediente-column">
        {!selectedPet ? <EmptyState /> : (
          <>
            <div className="expediente-header">
              <h2>Expediente de {selectedPet.name}</h2>
              {owner && (
                <div className="expediente-owner-info">
                  <strong>Dueño:</strong> {owner.name} ({owner.email})
                </div>
              )}
              <div className="expediente-pet-info">
                {SPECIES_LABELS[selectedPet.species]} - {selectedPet.breed || 'Sin raza'} - Nacido el {new Date(selectedPet.birthDate).toLocaleDateString()}
              </div>
            </div>
            
            <button className="new-entry-button" onClick={handleAddNewEntry}>
              + Nueva Entrada de Consulta
            </button>

            {selectedPetRecords.map(record => (
              <div key={record.id} className={`record-card ${record.status.toLowerCase()}`}>
                <div className="record-header">
                  <div className="record-header-info">
                    <div className="type">{record.type}</div>
                    <div className="date">{new Date(record.date).toLocaleDateString('es-ES', { dateStyle: 'full' })}</div>
                  </div>
                   <div className="record-actions">
                     <button className="btn-edit" onClick={() => setEditingRecord(record)}>
                       {record.status === 'INCOMPLETO' ? 'Completar' : 'Editar'}
                     </button>
                   </div>
                </div>
                <div className="record-body">
                  {record.symptoms && <div className="record-field"><strong>Síntomas</strong><span>{record.symptoms}</span></div>}
                  {record.weight && <div className="record-field"><strong>Peso</strong><span>{record.weight} kg</span></div>}
                  {record.temperature && <div className="record-field"><strong>Temperatura</strong><span>{record.temperature}°C</span></div>}
                  {record.diagnosis && <div className="record-field"><strong>Diagnóstico</strong><p>{record.diagnosis}</p></div>}
                  {record.treatment && <div className="record-field"><strong>Tratamiento</strong><p>{record.treatment}</p></div>}
                  {record.notes && <div className="record-field"><strong>Notas</strong><p>{record.notes}</p></div>}
                  {record.veterinarian && <div className="record-field"><strong>Veterinario</strong><span>{record.veterinarian}</span></div>}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </main>
  );
}