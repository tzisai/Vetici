import React from 'react';
import './adminproveedores.css';

export default function AdminProveedores(): JSX.Element {
  return (
    <main className="admin-proveedores-main">
      <div className="admin-proveedores-header">
        <div className="admin-proveedores-title">
          <h1>Hacer Pedido a Proveedores</h1>
          <p>Gestionar pedidos y proveedores</p>
        </div>
        <a href="/#inventario" className="btn-back">
          Regresar a Inventario
        </a>
      </div>

      <div className="admin-proveedores-form">
        <form>
          <div className="form-group">
            <label htmlFor="proveedor">Proveedor</label>
            <select id="proveedor" name="proveedor">
              <option value="proveedor1">Proveedor 1</option>
              <option value="proveedor2">Proveedor 2</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="producto">Producto</label>
            <select id="producto" name="producto">
              <option value="producto1">Producto 1</option>
              <option value="producto2">Producto 2</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="cantidad">Cantidad</label>
            <input type="number" id="cantidad" name="cantidad" min="1" />
          </div>
          <button type="submit" className="btn-hacer-pedido">
            Hacer Pedido
          </button>
        </form>
      </div>
    </main>
  );
}