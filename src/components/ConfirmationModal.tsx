import React from 'react';
import './confirmationModal.css';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message }: ConfirmationModalProps): JSX.Element | null {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onClose} className="btn-cancel">Cancelar</button>
          <button onClick={onConfirm} className="btn-confirm">Confirmar</button>
        </div>
      </div>
    </div>
  );
}
