import React from 'react';
import type { Pet } from '../data/pets';
import { SPECIES_LABELS } from '../data/pets';
import './petcard.css';

type Props = {
  pet: Pet;
  onViewDetails?: (pet: Pet) => void;
  onEdit?: (pet: Pet) => void;
  onDelete?: (petId: string) => void;
};

export default function PetCard({ pet, onViewDetails, onEdit, onDelete }: Props): JSX.Element {
  const getAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const age = getAge(pet.birthDate);

  return (
    <div className="pet-card">
      <div className="pet-image">
        <img
          src={pet.photo || 'https://via.placeholder.com/200x200?text=Sin+foto'}
          alt={pet.name}
        />
      </div>
      <div className="pet-content">
        <h3 className="pet-name">{pet.name}</h3>
        <div className="pet-info">
          <span className="pet-species">{SPECIES_LABELS[pet.species]}</span>
          {pet.breed && <span className="pet-breed">{pet.breed}</span>}
        </div>
        <div className="pet-meta">
          <p><strong>Edad:</strong> {age} años</p>
          {pet.microchip && <p><strong>Microchip:</strong> {pet.microchip}</p>}
        </div>
        <div className="pet-actions">
          {onViewDetails && (
            <button className="btn-action btn-view" onClick={() => onViewDetails(pet)}>
              Ver Expediente
            </button>
          )}
          {onEdit && (
            <button className="btn-action btn-edit" onClick={() => onEdit(pet)}>
              Editar
            </button>
          )}
          {onDelete && (
            <button className="btn-action btn-delete" onClick={() => onDelete(pet.id)}>
              Eliminar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
