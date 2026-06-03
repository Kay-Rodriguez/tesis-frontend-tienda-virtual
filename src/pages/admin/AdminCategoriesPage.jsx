import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  FaLayerGroup,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaSyncAlt,
} from "react-icons/fa";
import { apiRequest } from "../../helpers/api";
import { showToast } from "../../helpers/toast";

const emptyForm = {
  id: null,
  nombre: "",
  descripcion: "",
};

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);

    try {
      const data = await apiRequest("/categorias");
      setCategories(data || []);
    } catch (err) {
      showToast(err.message || "Error cargando categorías", "error");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(emptyForm);
    setFormOpen(true);

    setTimeout(() => {
      document
        .querySelector(".admin-category-form-card")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const openEdit = (category) => {
    setEditing({
      id: category.id,
      nombre: category.nombre || "",
      descripcion: category.descripcion || "",
    });

    setFormOpen(true);

    setTimeout(() => {
      document
        .querySelector(".admin-category-form-card")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(emptyForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setEditing((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const saveCategory = async (e) => {
    e.preventDefault();

    if (!editing.nombre.trim()) {
      showToast("Ingresa el nombre de la categoría", "warn");
      return;
    }

    setSaving(true);

    try {
      if (editing.id) {
        const res = await apiRequest(`/admin/categorias/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify({
            nombre: editing.nombre.trim(),
            descripcion: editing.descripcion.trim(),
          }),
        });

        showToast(res.message || "Categoría actualizada", "success");
      } else {
        const res = await apiRequest("/admin/categorias", {
          method: "POST",
          body: JSON.stringify({
            nombre: editing.nombre.trim(),
            descripcion: editing.descripcion.trim(),
          }),
        });

        showToast(res.message || "Categoría creada", "success");
      }

      closeForm();
      load();
    } catch (err) {
      showToast(err.message || "Error guardando categoría", "error");
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = async (id) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar categoría?",
      text: "Si existen productos vinculados, el backend puede bloquear la eliminación.",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#0f172a",
      color: "#fff",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await apiRequest(`/admin/categorias/${id}`, {
        method: "DELETE",
      });

      showToast(res.message || "Categoría eliminada", "success");
      load();
    } catch (err) {
      showToast(err.message || "No se pudo eliminar la categoría", "error");
    }
  };

  if (loading) {
    return <div className="admin-products-loading">Cargando categorías...</div>;
  }

  return (
    <div className="admin-products-page">
      <section className="admin-products-header">
        <div>
          <span className="admin-chip">
            <FaLayerGroup /> Gestión de categorías
          </span>

          <h1>Categorías</h1>

          <p>
            Crea, edita y elimina categorías para organizar el catálogo de
            productos tecnológicos.
          </p>
        </div>

        <div className="admin-category-header-actions">
          <button className="btn btn-outline" onClick={load}>
            <FaSyncAlt /> Actualizar
          </button>

          <button className="btn btn-primary" onClick={openCreate}>
            <FaPlus /> Nueva categoría
          </button>
        </div>
      </section>

      {formOpen && (
        <section className="admin-product-form-card admin-category-form-card">
          <div className="admin-product-form-title">
            <h2>{editing.id ? "Editar categoría" : "Crear categoría"}</h2>

            <button
              type="button"
              className="admin-product-close"
              onClick={closeForm}
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={saveCategory}>
            <div className="admin-product-form-grid">
              <div className="admin-field">
                <label>Nombre</label>
                <input
                  name="nombre"
                  value={editing.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Smartphones"
                />
              </div>

              <div className="admin-field admin-field-full">
                <label>Descripción</label>
                <textarea
                  name="descripcion"
                  value={editing.descripcion}
                  onChange={handleChange}
                  placeholder="Descripción opcional de la categoría"
                />
              </div>
            </div>

            <div className="admin-product-actions">
              <button className="btn btn-primary" disabled={saving}>
                <FaSave /> {saving ? "Guardando..." : "Guardar categoría"}
              </button>

              <button
                type="button"
                className="btn btn-outline"
                onClick={closeForm}
              >
                Cancelar
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="admin-categories-grid">
        {categories.length === 0 ? (
          <div className="admin-products-loading">
            No hay categorías registradas.
          </div>
        ) : (
          categories.map((cat) => (
            <article className="admin-category-card" key={cat.id}>
              <div className="admin-category-icon">
                <FaLayerGroup />
              </div>

              <div className="admin-category-info">
                <div className="admin-product-top">
                  <h3>{cat.nombre}</h3>
                  <span className="admin-status on">Activa</span>
                </div>

                <p>{cat.descripcion || "Sin descripción registrada."}</p>

                <div className="admin-product-card-actions">
                  <button onClick={() => openEdit(cat)}>
                    <FaEdit /> Editar
                  </button>

                  <button
                    className="danger"
                    onClick={() => deleteCategory(cat.id)}
                  >
                    <FaTrash /> Eliminar
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}