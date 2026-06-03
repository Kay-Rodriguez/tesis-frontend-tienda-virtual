import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  FaBoxOpen,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSave,
  FaTimes,
  FaImage,
  FaUpload,
} from "react-icons/fa";
import { apiRequest } from "../../helpers/api";
import { showToast } from "../../helpers/toast";

const emptyForm = {
  id: null,
  nombre: "",
  descripcion: "",
  precio: "",
  stock: "",
  categoria_id: "",
  publicado: true,
  imagenes: "",
};

export function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState([]);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);

    try {
      const [productos, categorias] = await Promise.all([
        apiRequest("/admin/products"),
        apiRequest("/categorias"),
      ]);

      setProducts(productos || []);
      setCategories(categorias || []);
    } catch (err) {
      showToast(err.message || "Error cargando productos", "error");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(emptyForm);
    setFiles([]);
    setPreview([]);
    setFormOpen(true);
  };

  const openEdit = (product) => {
    setEditing({
      id: product.id,
      nombre: product.nombre || "",
      descripcion: product.descripcion || "",
      precio: product.precio || "",
      stock: product.stock || "",
      categoria_id: product.categoria_id || "",
      publicado: product.publicado ?? true,
      imagenes: "",
    });

    setFiles([]);
    setPreview([]);
    setFormOpen(true);
    
    setTimeout(() => {
  document
    .querySelector(".admin-product-form-card")
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}, 100);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(emptyForm);
    setFiles([]);
    setPreview([]);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setEditing((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files || []);
    setFiles(selected);
    setPreview(selected.map((file) => URL.createObjectURL(file)));
  };

  const getImagenesArray = () => {
    return editing.imagenes
      .split("\n")
      .map((url) => url.trim())
      .filter(Boolean);
  };

  const uploadImages = async () => {
    if (!files.length) return [];

    const urls = [];

    for (const file of files) {
      const fd = new FormData();
      fd.append("file", file);

      const res = await apiRequest("/admin/upload?bucket=productos", {
        method: "POST",
        body: fd,
      });

      if (Array.isArray(res?.urls)) {
        urls.push(...res.urls);
      } else if (res?.url) {
        urls.push(res.url);
      }
    }

    return urls;
  };

  const saveProduct = async (e) => {
    e.preventDefault();

    if (
      !editing.nombre ||
      !editing.descripcion ||
      !editing.precio ||
      !editing.stock ||
      !editing.categoria_id
    ) {
      showToast("Completa todos los campos obligatorios", "warn");
      return;
    }

    setSaving(true);

    try {
      const uploadedUrls = await uploadImages();
      const manualUrls = getImagenesArray();
      const finalImages = [...manualUrls, ...uploadedUrls];

      if (editing.id) {
        const body = {
          nombre: editing.nombre,
          descripcion: editing.descripcion,
          precio: Number(editing.precio),
          stock: Number(editing.stock),
          publicado: editing.publicado,
          nuevas_imagenes: finalImages,
          categoria_id: Number(editing.categoria_id),
        };

        const res = await apiRequest(`/admin/products/${editing.id}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });

        showToast(res.message || "Producto actualizado", "success");
      } else {
        const body = {
          nombre: editing.nombre,
          descripcion: editing.descripcion,
          precio: Number(editing.precio),
          stock: Number(editing.stock),
          categoria_id: Number(editing.categoria_id),
          publicado: editing.publicado,
          imagenes: finalImages,
        };

        const res = await apiRequest("/admin/products", {
          method: "POST",
          body: JSON.stringify(body),
        });

        showToast(res.message || "Producto creado", "success");
      }

      closeForm();
      loadAll();
    } catch (err) {
      showToast(err.message || "Error guardando producto", "error");
    } finally {
      setSaving(false);
    }
  };

  const deleteProduct = async (id) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar producto?",
      text: "Se eliminará el producto y sus imágenes asociadas.",
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
      const res = await apiRequest(`/admin/products/${id}`, {
        method: "DELETE",
      });

      showToast(res.message || "Producto eliminado", "success");
      loadAll();
    } catch (err) {
      showToast(err.message || "Error eliminando producto", "error");
    }
  };

  const getImage = (product) => {
    return (
      product?.imagenes_producto?.[0]?.url ||
      "https://cdn-icons-png.flaticon.com/512/679/679720.png"
    );
  };

  const getCategoryName = (categoriaId) => {
    return (
      categories.find((c) => String(c.id) === String(categoriaId))?.nombre ||
      "Sin categoría"
    );
  };

  if (loading) {
    return <div className="admin-products-loading">Cargando productos...</div>;
  }

  return (
    <div className="admin-products-page">
      <section className="admin-products-header">
        <div>
          <span className="admin-chip">
            <FaBoxOpen /> Gestión de catálogo
          </span>

          <h1>Productos</h1>

          <p>
            Crea, actualiza, elimina y controla stock, precio, estado e imágenes
            del catálogo tecnológico VIT.
          </p>
        </div>

        <button className="btn btn-primary" onClick={openCreate}>
          <FaPlus /> Nuevo producto
        </button>
      </section>

      {formOpen && (
        <section className="admin-product-form-card">
          <div className="admin-product-form-title">
            <h2>{editing.id ? "Editar producto" : "Crear producto"}</h2>

            <button
              type="button"
              className="admin-product-close"
              onClick={closeForm}
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={saveProduct}>
            <div className="admin-product-form-grid">
              <div className="admin-field">
                <label>Nombre</label>
                <input
                  name="nombre"
                  value={editing.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Smartphone Samsung"
                />
              </div>

              <div className="admin-field">
                <label>Categoría</label>
                <select
                  name="categoria_id"
                  value={editing.categoria_id}
                  onChange={handleChange}
                >
                  <option value="">Selecciona categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-field">
                <label>Precio</label>
                <input
                  type="number"
                  step="0.01"
                  name="precio"
                  value={editing.precio}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>

              <div className="admin-field">
                <label>Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={editing.stock}
                  onChange={handleChange}
                  placeholder="0"
                />
              </div>

              <div className="admin-field admin-field-full">
                <label>Descripción</label>
                <textarea
                  name="descripcion"
                  value={editing.descripcion}
                  onChange={handleChange}
                  placeholder="Descripción del producto"
                />
              </div>

              <div className="admin-field admin-field-full">
                <label>
                  <FaImage /> URLs de imágenes
                </label>

                <textarea
                  name="imagenes"
                  value={editing.imagenes}
                  onChange={handleChange}
                  placeholder="Pega una URL por línea"
                />

                <small>
                  Puedes pegar URLs manuales. Si editas un producto, las imágenes
                  existentes se mantienen.
                </small>
              </div>

              <div className="admin-field admin-field-full">
                <label>
                  <FaUpload /> Subir imágenes desde computadora
                </label>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFiles}
                />

                {preview.length > 0 && (
                  <div className="admin-upload-preview">
                    {preview.map((src, index) => (
                      <img key={index} src={src} alt={`preview-${index}`} />
                    ))}
                  </div>
                )}
              </div>

              <label className="admin-product-check">
                <input
                  type="checkbox"
                  name="publicado"
                  checked={editing.publicado}
                  onChange={handleChange}
                />
                Producto publicado
              </label>
            </div>

            <div className="admin-product-actions">
              <button className="btn btn-primary" disabled={saving}>
                <FaSave /> {saving ? "Guardando..." : "Guardar producto"}
              </button>

              <button type="button" className="btn btn-outline" onClick={closeForm}>
                Cancelar
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="admin-products-grid">
        {products.length === 0 ? (
          <div className="admin-products-loading">
            No hay productos registrados.
          </div>
        ) : (
          products.map((product) => (
            <article className="admin-product-card" key={product.id}>
              <div className="admin-product-img">
                <img src={getImage(product)} alt={product.nombre} />
              </div>

              <div className="admin-product-info">
                <div className="admin-product-top">
                  <h3>{product.nombre}</h3>

                  <span
                    className={
                      product.publicado ? "admin-status on" : "admin-status off"
                    }
                  >
                    {product.publicado ? "Publicado" : "Oculto"}
                  </span>
                </div>

                <p>{product.descripcion}</p>

                <div className="admin-product-meta">
                  <strong>${Number(product.precio || 0).toFixed(2)}</strong>
                  <span>Stock: {product.stock}</span>
                  <span>{getCategoryName(product.categoria_id)}</span>
                </div>

                <div className="admin-product-card-actions">
                  <button onClick={() => openEdit(product)}>
                    <FaEdit /> Editar
                  </button>

                  <button
                    className="danger"
                    onClick={() => deleteProduct(product.id)}
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