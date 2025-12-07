import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseclient';
import { SPECIES_LABELS } from '../data/pets';
import type { Pet, MedicalRecord } from '../data/pets';
import PetCard from '../components/PetCard';
import PetFormModal from '../components/PetFormModal';
import ConfirmationModal from '../components/ConfirmationModal';
import './mismascotas.css';

export default function MisMascotas(): JSX.Element {
  const [pets, setPets] = useState<Pet[]>([]);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFormOpen, setFormOpen] = useState(false);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [isRecordsOpen, setRecordsOpen] = useState(false);

  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [petToDelete, setPetToDelete] = useState<string | null>(null);

  const fetchPets = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No has iniciado sesión.');

      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPets(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const handleAdd = () => {
    setSelectedPet(null);
    setFormOpen(true);
  };

  const handleEdit = (pet: Pet) => {
    setSelectedPet(pet);
    setFormOpen(true);
  };

  const handleDelete = (petId: string) => {
    setPetToDelete(petId);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!petToDelete) return;
    try {
      const { error } = await supabase.from('pets').delete().eq('id', petToDelete);
      if (error) throw error;
      setPets(pets.filter(p => p.id !== petToDelete));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setConfirmOpen(false);
      setPetToDelete(null);
    }
  };

  const handleSave = async (formData: Omit<Pet, 'id' | 'user_id' | 'created_at' | 'photo'>) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No has iniciado sesión.');

        const petData = { ...formData, user_id: user.id };

      if (selectedPet) {
        // Update
        const { data, error } = await supabase
          .from('pets')
          .update(petData)
          .eq('id', selectedPet.id)
          .select();
        if (error) throw error;
        setPets(pets.map(p => (p.id === selectedPet.id ? data[0] : p)));
      } else {
        // Create
        const { data, error } = await supabase.from('pets').insert(petData).select();
        if (error) throw error;
        setPets([data[0], ...pets]);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setFormOpen(false);
    }
  };

  const handleViewDetails = async (pet: Pet) => {
    setSelectedPet(pet);
    try {
        const { data, error } = await supabase
            .from('medical_records')
            .select('*')
            .eq('pet_id', pet.id)
            .order('date', { ascending: false });

        if (error) throw error;
        setRecords(data || []);
    } catch (err: any) {
        setError(err.message);
    }
    setRecordsOpen(true);
  };

  if (loading) return <div className="loading-state">Cargando tus mascotas...</div>;
  if (error) return <div className="error-state">Error: {error}</div>;

  return (
    <main className="mascotas-main">
      <div className="mascotas-header">
        <h1>Mis Mascotas</h1>
        <button className="btn-new-pet" onClick={handleAdd}>
          + Agregar mascota
        </button>
      </div>

      {isRecordsOpen && selectedPet && (
        <div className="modal-overlay" onClick={() => setRecordsOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setRecordsOpen(false)}>X</button>
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
                  <strong>Fecha de nacimiento:</strong> {new Date(selectedPet.birth_date).toLocaleDateString('es-ES')}
                </div>
                <div className="info-item">
                  <strong>Microchip:</strong> {selectedPet.microchip || 'No registrado'}
                </div>
              </div>
            </div>

            <div className="expediente-records">
              <h3>Historial Médico</h3>
              {records.length === 0 ? (
                <p className="empty-msg">No hay registros médicos aún.</p>
              ) : (
                <div className="records-list">
                  {records.map(record => (
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

      <div className="mascotas-grid">
        {pets.length === 0 ? (
          <p className="empty-msg">No tienes mascotas registradas. ¡Agrega una ahora!</p>
        ) : (
          pets.map(pet => (
            <PetCard
              key={pet.id}
              pet={pet}
              onViewDetails={handleViewDetails}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      <PetFormModal
        isOpen={isFormOpen}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        pet={selectedPet}
      />

      <ConfirmationModal
        isOpen={isConfirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que quieres eliminar esta mascota? Esto también eliminará su historial médico."
      />
    </main>
  );
}
