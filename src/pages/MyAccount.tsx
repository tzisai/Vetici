import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import orders, { STATUS_LABELS, STATUS_COLORS } from '../data/orders';
import type { Order } from '../data/orders';
import './myaccount.css';

export default function MyAccount(): JSX.Element {
  const { user, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState<'perfil' | 'compras' | 'seguridad'>('perfil');
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [userOrders] = useState<Order[]>(orders.filter(o => o.userId === (user?.email || 'user1')));

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    alert('Perfil actualizado (mock)');
    setEditMode(false);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = () => {
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      alert('Por favor completa todos los campos');
      return;
    }
    if (passwordData.new !== passwordData.confirm) {
      alert('Las contraseñas no coinciden');
      return;
    }
    alert('Contraseña actualizada (mock)');
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  const handleDeleteAccount = () => {
    if (confirm('¿Estás seguro? Esta acción no se puede deshacer.')) {
      if (confirm('Confirma una vez más para dar de baja tu cuenta permanentemente.')) {
        alert('Cuenta desactivada (mock)');
        logout();
        window.location.hash = '#home';
      }
    }
  };

  return (
    <main className="myaccount-main">
      {/* Header del perfil */}
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-placeholder">{user?.name?.charAt(0).toUpperCase() || 'U'}</div>
        </div>
        <div className="profile-intro">
          <h1>{user?.name || 'Usuario'}</h1>
          <p>{user?.email}</p>
          <p className="role-badge">{user?.role === 'ADMIN' ? 'Veterinario' : 'Cliente'}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button
          className={`tab-btn ${activeTab === 'perfil' ? 'active' : ''}`}
          onClick={() => setActiveTab('perfil')}
        >
          Perfil
        </button>
        <button
          className={`tab-btn ${activeTab === 'compras' ? 'active' : ''}`}
          onClick={() => setActiveTab('compras')}
        >
          Mis Compras
        </button>
        <button
          className={`tab-btn ${activeTab === 'seguridad' ? 'active' : ''}`}
          onClick={() => setActiveTab('seguridad')}
        >
          Seguridad
        </button>
      </div>

      {/* Contenido de tabs */}
      <div className="tab-content">
        {/* TAB: Perfil */}
        {activeTab === 'perfil' && (
          <div className="section perfil-section">
            <div className="section-header">
              <h2>Información del Perfil</h2>
              <button
                className="btn-edit-profile"
                onClick={() => setEditMode(!editMode)}
              >
                {editMode ? '✕ Cancelar' : '✏️ Editar'}
              </button>
            </div>

            {!editMode ? (
              <div className="profile-info">
                <div className="info-card">
                  <label>Nombre</label>
                  <p>{user?.name}</p>
                </div>
                <div className="info-card">
                  <label>Correo electrónico</label>
                  <p>{user?.email}</p>
                </div>
                <div className="info-card">
                  <label>Tipo de cuenta</label>
                  <p>{user?.role === 'ADMIN' ? 'Veterinario' : 'Cliente'}</p>
                </div>
                <div className="info-card">
                  <label>Miembro desde</label>
                  <p>1 de enero de 2023</p>
                </div>
              </div>
            ) : (
              <div className="profile-edit">
                <div className="form-group">
                  <label>Nombre</label>
                  <input
                    type="text"
                    name="name"
                    value={editData.name}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="form-group">
                  <label>Correo electrónico</label>
                  <input
                    type="email"
                    name="email"
                    value={editData.email}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="form-actions">
                  <button className="btn-save" onClick={handleSaveProfile}>
                    Guardar cambios
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: Mis Compras */}
        {activeTab === 'compras' && (
          <div className="section compras-section">
            <h2>Historial de Compras</h2>
            {userOrders.length === 0 ? (
              <p className="empty-msg">No tienes compras registradas.</p>
            ) : (
              <div className="orders-list">
                {userOrders.map(order => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div className="order-info">
                        <h3>Orden #{order.id}</h3>
                        <p className="order-date">
                          {new Date(order.date).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                      <div className="order-status-container">
                        <span
                          className="order-status"
                          style={{ backgroundColor: STATUS_COLORS[order.status] }}
                        >
                          {STATUS_LABELS[order.status]}
                        </span>
                      </div>
                    </div>

                    <div className="order-items">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="order-item">
                          <span className="item-name">{item.productName}</span>
                          <span className="item-qty">x{item.quantity}</span>
                          <span className="item-price">${item.subtotal.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="order-footer">
                      <div className="order-total">
                        <strong>Total: ${order.total.toFixed(2)}</strong>
                      </div>
                      <button className="btn-reorder">Repetir orden</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: Seguridad */}
        {activeTab === 'seguridad' && (
          <div className="section seguridad-section">
            <h2>Seguridad y Privacidad</h2>

            <div className="subsection">
              <h3>Cambiar Contraseña</h3>
              <div className="form-group">
                <label>Contraseña actual</label>
                <input
                  type="password"
                  name="current"
                  value={passwordData.current}
                  onChange={handlePasswordChange}
                  placeholder="Ingresa tu contraseña actual"
                />
              </div>
              <div className="form-group">
                <label>Nueva contraseña</label>
                <input
                  type="password"
                  name="new"
                  value={passwordData.new}
                  onChange={handlePasswordChange}
                  placeholder="Ingresa una nueva contraseña"
                />
              </div>
              <div className="form-group">
                <label>Confirmar nueva contraseña</label>
                <input
                  type="password"
                  name="confirm"
                  value={passwordData.confirm}
                  onChange={handlePasswordChange}
                  placeholder="Confirma tu nueva contraseña"
                />
              </div>
              <button className="btn-change-password" onClick={handleChangePassword}>
                Actualizar contraseña
              </button>
            </div>

            <div className="subsection">
              <h3>Sesiones Activas</h3>
              <div className="session-info">
                <p>Dispositivo actual: Navegador</p>
                <p>Última actividad: Hace unos minutos</p>
                <button className="btn-logout-all">Cerrar todas las sesiones</button>
              </div>
            </div>

            <div className="subsection danger-zone">
              <h3>Zona de Peligro</h3>
              <p>Una vez que des de baja tu cuenta, no hay vuelta atrás. Por favor, estés seguro.</p>
              <button className="btn-delete-account" onClick={handleDeleteAccount}>
                Dar de baja mi cuenta
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
