import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaUsers } from "react-icons/fa";
import { apiRequest } from "../../helpers/api";
import { showToast } from "../../helpers/toast";

export function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data = await apiRequest("/admin/users");
      setUsers(data || []);
    } catch (err) {
      showToast(err.message || "Error cargando usuarios", "error");
    }
  };

  const editUser = (u) => {
    setEditing({
      id: u.id,
      nombre: u.nombre || "",
      apellido: u.apellido || "",
      celular: u.celular || "",
      provincia: u.provincia || "",
      role: u.role || "cliente",
      activo: u.activo ?? true,
      is_verified: u.is_verified ?? false,
    });
  };

  const saveUser = async (e) => {
    e.preventDefault();

    try {
      const res = await apiRequest(`/admin/users/${editing.id}`, {
        method: "PUT",
        body: JSON.stringify(editing),
      });

      showToast(res.message || "Usuario actualizado", "success");
      setEditing(null);
      load();
    } catch (err) {
      showToast(err.message || "Error actualizando usuario", "error");
    }
  };

  const deleteUser = async (id) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar usuario?",
      text: "Esta acción no se puede deshacer.",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#0f172a",
      color: "#fff",
      confirmButtonColor: "#ef4444",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await apiRequest(`/admin/users/${id}`, {
        method: "DELETE",
      });

      showToast(res.message || "Usuario eliminado", "success");
      load();
    } catch (err) {
      showToast(err.message || "Error eliminando usuario", "error");
    }
  };

  return (
    <div className="admin-crud-page">
      <div className="admin-crud-header">
        <div>
          <span className="admin-chip">
            <FaUsers /> Gestión de usuarios
          </span>
          <h1>Usuarios</h1>
          <p>Lista, edita o elimina usuarios registrados.</p>
        </div>
      </div>

      {editing && (
        <form className="admin-form-card" onSubmit={saveUser}>
          <h2>Editar usuario</h2>

          <div className="admin-form-grid">
            <input
              value={editing.nombre}
              placeholder="Nombre"
              onChange={(e) => setEditing({ ...editing, nombre: e.target.value })}
            />

            <input
              value={editing.apellido}
              placeholder="Apellido"
              onChange={(e) =>
                setEditing({ ...editing, apellido: e.target.value })
              }
            />

            <input
              value={editing.celular}
              placeholder="Celular"
              onChange={(e) =>
                setEditing({ ...editing, celular: e.target.value })
              }
            />

            <input
              value={editing.provincia}
              placeholder="Provincia"
              onChange={(e) =>
                setEditing({ ...editing, provincia: e.target.value })
              }
            />

            <select
              value={editing.role}
              onChange={(e) => setEditing({ ...editing, role: e.target.value })}
            >
              <option value="cliente">cliente</option>
              <option value="admin">admin</option>
              <option value="administrador">administrador</option>
            </select>

            <select
              value={String(editing.activo)}
              onChange={(e) =>
                setEditing({ ...editing, activo: e.target.value === "true" })
              }
            >
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>

          <div className="admin-form-actions">
            <button className="btn btn-primary">Guardar cambios</button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setEditing(null)}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <div className="admin-table-card">
        {users.map((u) => (
          <div className="admin-table-row" key={u.id}>
            <div>
              <strong>
                {u.nombre} {u.apellido}
              </strong>
              <span>{u.email}</span>
            </div>

            <span>{u.celular || "Sin celular"}</span>
            <span>{u.provincia || "Sin provincia"}</span>
            <span className="admin-badge">{u.role}</span>

            <div className="admin-row-actions">
              <button onClick={() => editUser(u)}>
                <FaEdit />
              </button>

              <button className="danger" onClick={() => deleteUser(u.id)}>
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}