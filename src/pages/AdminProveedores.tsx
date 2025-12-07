import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseclient';
import type { Supplier } from '../data/suppliers';
import SupplierFormModal from '../components/SupplierFormModal';
import ConfirmationModal from '../components/ConfirmationModal';
import './adminproveedores.css';

// A simpler card component to display supplier info
const SupplierCard = ({
  supplier,
  onEdit,
  onDelete,
}: {
  supplier: Supplier;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplierId: string) => void;
}) => {
  return (
    <div className="proveedor-card">
      <h3>{supplier.name}</h3>
      {supplier.contact_name && <p><strong>Contacto:</strong> {supplier.contact_name}</p>}
      {supplier.phone && <p><strong>Teléfono:</strong> {supplier.phone}</p>}
      {supplier.email && <p><strong>Email:</strong> {supplier.email}</p>}
      <div className="proveedor-card-actions">
        <button onClick={() => onEdit(supplier)} className="btn-edit">
          Editar
        </button>
        <button onClick={() => onDelete(supplier.id)} className="btn-delete">
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default function AdminProveedores(): JSX.Element {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [isConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [supplierToDelete, setSupplierToDelete] = useState<string | null>(null);

  const fetchSuppliers = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('suppliers').select('*').order('name', { ascending: true });
      if (error) throw error;
      setSuppliers(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSuppliers();
  }, [fetchSuppliers]);

  const handleAdd = () => {
    setSelectedSupplier(null);
    setFormModalOpen(true);
  };

  const handleEdit = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setFormModalOpen(true);
  };

  const handleDelete = (supplierId: string) => {
    setSupplierToDelete(supplierId);
    setConfirmModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!supplierToDelete) return;
    try {
      const { error } = await supabase.from('suppliers').delete().eq('id', supplierToDelete);
      if (error) throw error;
      setSuppliers(suppliers.filter(s => s.id !== supplierToDelete));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setConfirmModalOpen(false);
      setSupplierToDelete(null);
    }
  };

  const handleSave = async (formData: Omit<Supplier, 'id'> | Supplier) => {
    try {
      if ('id' in formData && formData.id) {
        // Update
        const { data, error } = await supabase
          .from('suppliers')
          .update({
            name: formData.name,
            contact_name: formData.contact_name,
            phone: formData.phone,
            email: formData.email,
          })
          .eq('id', formData.id)
          .select();
        if (error) throw error;
        if (data) {
          setSuppliers(suppliers.map(s => (s.id === formData.id ? data[0] : s)));
        }
      } else {
        // Create
        const { data, error } = await supabase.from('suppliers').insert(formData).select();
        if (error) throw error;
        if (data) {
          setSuppliers([...suppliers, data[0]]);
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setFormModalOpen(false);
    }
  };

  if (loading) return <div>Cargando proveedores...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <main className="admin-proveedores-main">
      <div className="admin-proveedores-header">
        <div className="admin-proveedores-title">
          <h1>Gestión de Proveedores</h1>
          <p>Administra los proveedores de tus productos.</p>
        </div>
        <div className="admin-proveedores-actions">
          <button onClick={handleAdd} className="btn-add-proveedor">
            + Agregar Proveedor
          </button>
        </div>
      </div>

      <div className="proveedores-grid">
        {suppliers.length > 0 ? (
          suppliers.map(supplier => (
            <SupplierCard
              key={supplier.id}
              supplier={supplier}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <p>No hay proveedores registrados. ¡Agrega uno nuevo!</p>
        )}
      </div>

      <SupplierFormModal
        isOpen={isFormModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSave={handleSave}
        supplier={selectedSupplier}
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que quieres eliminar este proveedor? Esta acción no se puede deshacer y podría afectar pedidos existentes."
      />
    </main>
  );
}
