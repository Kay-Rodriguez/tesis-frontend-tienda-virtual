import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  FaUser,
  FaEnvelope,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaCamera,
  FaTrash,
  FaSave,
  FaShieldAlt,
  FaShoppingBag,
  FaTruck,
  FaHeadset,
} from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { apiRequest, API_URL } from "../helpers/api";
import { useAuth } from "../context/AuthContext";
import { provinciasEcuador } from "../helpers/constants";


export function ProfilePage() {
  const navigate = useNavigate();
  const { logout, reloadUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
const [avatarOpen, setAvatarOpen] = useState(false);
  const [form, setForm] = useState({
    id: "",
    nombre: "",
    apellido: "",
    provincia: "",
    celular: "",
    email: "",
    avatar: "",
  });

  const loadProfile = async () => {
    try {
      const data = await apiRequest("/users/me");

      setForm({
        id: data.id,
        nombre: data.nombre || "",
        apellido: data.apellido || "",
        provincia: data.provincia || "",
        celular: data.celular || "",
        email: data.email || "",
        avatar: data.avatar || "",
      });
    } catch (err) {
      Swal.fire("Error", err.message || "No se pudo cargar el perfil", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "celular") {
      setForm({ ...form, celular: value.replace(/\D/g, "").slice(0, 10) });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await fetch(`${API_URL}/users/avatar/upload?bucket=avatars`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error subiendo imagen");

      const avatarUrl = data.urls[0];

      await apiRequest("/users/avatar", {
        method: "POST",
        body: JSON.stringify({
          usuario_id: form.id,
          url: avatarUrl,
        }),
      });

      setForm((prev) => ({ ...prev, avatar: avatarUrl }));
      Swal.fire("Listo", "Foto de perfil actualizada", "success");
    } catch (err) {
      Swal.fire("Error", err.message || "No se pudo subir la foto", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await apiRequest("/users/me", {
        method: "PUT",
        body: JSON.stringify({
          nombre: form.nombre,
          apellido: form.apellido,
          provincia: form.provincia,
          celular: form.celular,
          avatar: form.avatar,
        }),
      });

      if (reloadUser) await reloadUser();

      Swal.fire({
        icon: "success",
        title: "Perfil actualizado",
        text: "Tus datos fueron guardados correctamente.",
        confirmButtonColor: "#0ea5e9",
        background: "#0f172a",
        color: "#fff",
      });
    } catch (err) {
      Swal.fire("Error", err.message || "No se pudo actualizar el perfil", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProfile = async () => {
    const result = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar cuenta?",
      text: "Esta acción desactivará o eliminará tu perfil. No podrás comprar con esta cuenta.",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      background: "#0f172a",
      color: "#fff",
    });

    if (!result.isConfirmed) return;

    try {
      await apiRequest("/auth/delete", {
        method: "DELETE",
      });

      await logout();
      navigate("/login");

      Swal.fire("Cuenta eliminada", "Tu perfil fue eliminado correctamente.", "success");
    } catch (err) {
      Swal.fire(
        "Error",
        err.message || "Tu backend aún no tiene configurado DELETE /users/me",
        "error"
      );
    }
  };

  if (loading) return <div className="card">Cargando perfil...</div>;

  const avatar =
    form.avatar || "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  return (
    <div className="profile-store-page">
      <section className="profile-hero-card">
        <div className="profile-hero-left">
          <div className="profile-avatar-box">
            <img
  src={avatar}
  alt="Avatar"
  onClick={() => setAvatarOpen(true)}
  className="profile-avatar-click"
/>
            <label className="profile-camera-btn">
              <FaCamera />
              <input type="file" accept="image/*" onChange={handleAvatarUpload} />
            </label>{avatarOpen && (
  <div className="avatar-modal" onClick={() => setAvatarOpen(false)}>
    <button className="avatar-modal-close" type="button">
      <FaTimes />
    </button>

    <img
      src={avatar}
      alt="Foto grande"
      className="avatar-modal-img"
      onClick={(e) => e.stopPropagation()}
    />
  </div>
)}
          </div>

          <div>
            <span className="profile-chip">
              <FaShieldAlt /> Cliente verificado
            </span>
            <h1>
              Hola, {form.nombre || "cliente"} {form.apellido}
            </h1>
            <p>{form.email}</p>
            {uploading && <small>Subiendo imagen...</small>}
          </div>
        </div>

        <div className="profile-quick-actions">
          <button className="btn btn-primary" onClick={() => navigate("/orders")}>
            <FaShoppingBag /> Mis compras
          </button>

          <button className="btn btn-outline" onClick={() => navigate("/cart")}>
            Ver carrito
          </button>
        </div>
      </section>

      <section className="profile-content-grid">
        <form className="profile-form-card" onSubmit={handleSubmit}>
          <div className="profile-section-header">
            <h2>Datos personales</h2>
            <p>Actualiza tu información para compras, envíos y atención por WhatsApp.</p>
          </div>

          <div className="profile-form-grid">
            <div className="form-group">
              <label>Nombre</label>
              <div className="input-icon-wrap">
                <FaUser />
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                  placeholder="Tu nombre"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Apellido</label>
              <div className="input-icon-wrap">
                <FaUser />
                <input
                  name="apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  required
                  placeholder="Tu apellido"
                />
              </div>
            </div>

            <div className="form-group">
              <label>Celular / WhatsApp</label>
              <div className="input-icon-wrap">
                <FaWhatsapp />
                <input
                  name="celular"
                  value={form.celular}
                  onChange={handleChange}
                  placeholder="0999999999"
                  maxLength={10}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Provincia</label>
              <div className="input-icon-wrap">
                <FaMapMarkerAlt />
                <select
                  name="provincia"
                  value={form.provincia}
                  onChange={handleChange}
                >
                  <option value="">Selecciona provincia</option>
                  {provinciasEcuador.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group profile-email-field">
              <label>Correo electrónico</label>
              <div className="input-icon-wrap disabled">
                <FaEnvelope />
                <input value={form.email} disabled />
              </div>
            </div>
          </div>

          <div className="profile-actions-row">
            <button className="btn btn-primary" disabled={saving}>
              <FaSave />
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>

            <button
              type="button"
              className="btn profile-delete-btn"
              onClick={handleDeleteProfile}
            >
              <FaTrash /> Eliminar perfil
            </button>
          </div>
        </form>

        <aside className="profile-summary-card">
          <h3>Resumen de cuenta</h3>

          <div className="profile-summary-item">
            <FaWhatsapp />
            <div>
              <strong>WhatsApp</strong>
              <span>{form.celular || "No registrado"}</span>
            </div>
          </div>

          <div className="profile-summary-item">
            <FaMapMarkerAlt />
            <div>
              <strong>Provincia</strong>
              <span>{form.provincia || "No registrada"}</span>
            </div>
          </div>

          <div className="profile-summary-item">
            <FaTruck />
            <div>
              <strong>Pedidos</strong>
              <span>Consulta tu historial de compras.</span>
            </div>
          </div>

          <div className="profile-summary-item">
            <FaHeadset />
            <div>
              <strong>Soporte</strong>
              <span>Atención por chatbot y WhatsApp.</span>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}