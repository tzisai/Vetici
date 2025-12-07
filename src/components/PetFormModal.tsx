import React, { useState, useEffect } from 'react';
import type { Pet } from '../data/pets';
import { SPECIES_LABELS } from '../data/pets';
import './petFormModal.css';

interface PetFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (pet: Omit<Pet, 'id' | 'user_id' | 'created_at' | 'photo'>) => void;
  pet?: Pet | null;
}

export default function PetFormModal({ isOpen, onClose, onSave, pet }: PetFormModalProps): JSX.Element | null {
  const [formData, setFormData] = useState({
    name: '',
    species: 'PERRO' as const,
    breed: '',
    birth_date: '',
    microchip: '',
  });

  useEffect(() => {
    if (pet) {
      setFormData({
        name: pet.name,
        species: pet.species,
        breed: pet.breed || '',
        birth_date: pet.birth_date,
        microchip: pet.microchip || '',
      });
    } else {
      setFormData({
        name: '',
        species: 'PERRO' as const,
        breed: '',
        birth_date: '',
        microchip: '',
      });
    }
  }, [pet]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Omit<Pet, 'id' | 'user_id' | 'created_at' | 'photo'>);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{pet ? 'Editar Mascota' : 'Agregar Mascota'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Nombre</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="species">Especie</label>
            <select id="species" name="species" value={formData.species} onChange={handleChange}>
                {Object.entries(SPECIES_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="breed">Raza</label>
            <input type="text" id="breed" name="breed" value={formData.breed} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="birth_date">Fecha de Nacimiento</label>
            <input type="date" id="birth_date" name="birth_date" value={formData.birth_date} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="microchip">Microchip</label>
            <input type="text" id="microchip" name="microchip" value={formData.microchip} onChange={handleChange} />
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">Cancelar</button>
            <button type="submit" className="btn-confirm">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
