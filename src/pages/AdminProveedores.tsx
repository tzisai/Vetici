import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseclient';
import type { Supplier } from '../data/suppliers';
import SupplierFormModal from '../components/SupplierFormModal';
import ConfirmationModal from '../components/ConfirmationModal';
import './adminproveedores.css';

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
    <div className="admin-proveedores-container">
      <div className="admin-proveedores-header">
        <button className="btn-regresar" onClick={() => window.location.hash = '#inventario'}>
          Regresar
        </button>
        <div className="admin-proveedores-title">

          <h1>Gestión de Proveedores</h1>
          <p>Administra los proveedores de tus productos.</p>
        </div>
        <div className="admin-proveedores-actions">
          <button onClick={handleAdd} className="admin-proveedores-add-button">
            + Agregar Proveedor
          </button>
        </div>
      </div>

      <div className="admin-proveedores-table-container">
        {suppliers.length > 0 ? (
          <table className="admin-proveedores-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Contacto</th>
                <th>Teléfono</th>
                <th>Email</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map(supplier => (
                <tr key={supplier.id}>
                  <td>{supplier.name}</td>
                  <td>{supplier.contact_name || 'N/A'}</td>
                  <td>{supplier.phone || 'N/A'}</td>
                  <td>{supplier.email || 'N/A'}</td>
                  <td className="admin-proveedores-actions">
                    <button onClick={() => handleEdit(supplier)} className="admin-proveedores-action-button edit">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(supplier.id)} className="admin-proveedores-action-button delete">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
    </div>
  );
}
