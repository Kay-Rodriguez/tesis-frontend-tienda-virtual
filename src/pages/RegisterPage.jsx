import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FaUser,
  FaEnvelope,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";

import logo2 from "../assets/logo2.jpg";
import { supabase } from "../supabaseClient";
import { provinciasEcuador } from "../helpers/constants";

export function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    provincia: "",
    celular: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const appUrl = window.location.origin;

  const showAlert = (icon, title, text) => {
    Swal.fire({
      icon,
      title,
      text,
      confirmButtonColor: "#0ea5e9",
      background: "#0f172a",
      color: "#fff",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "celular") {
      const onlyNumbers = value.replace(/\D/g, "").slice(0, 10);
      setForm({ ...form, celular: onlyNumbers });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const validateForm = () => {
    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{3,25}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nameRegex.test(form.nombre.trim())) {
      showAlert(
        "warning",
        "Nombre inválido",
        "El nombre debe tener mínimo 3 letras y no debe contener números."
      );
      return false;
    }

    if (!nameRegex.test(form.apellido.trim())) {
      showAlert(
        "warning",
        "Apellido inválido",
        "El apellido debe tener mínimo 3 letras y no debe contener números."
      );
      return false;
    }

    if (!form.provincia) {
      showAlert("warning", "Provincia requerida", "Selecciona una provincia.");
      return false;
    }

    if (!/^09\d{8}$/.test(form.celular)) {
      showAlert(
        "warning",
        "Celular inválido",
        "Ingresa un número ecuatoriano válido. Ejemplo: 0999999999."
      );
      return false;
    }

    if (!emailRegex.test(form.email.trim())) {
      showAlert(
        "warning",
        "Correo inválido",
        "Ingresa un correo electrónico válido."
      );
      return false;
    }

    if (form.password.length < 6) {
      showAlert(
        "warning",
        "Contraseña muy corta",
        "La contraseña debe tener al menos 6 caracteres."
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (!supabase) {
        throw new Error("Supabase no está configurado correctamente.");
      }

      const { error } = await supabase.auth.signUp({
        email: form.email.trim().toLowerCase(),
        password: form.password,
        options: {
          emailRedirectTo: `${appUrl}/login`,
          data: {
            nombre: form.nombre.trim(),
            apellido: form.apellido.trim(),
            provincia: form.provincia,
            celular: form.celular,
            role: "cliente",
          },
        },
      });

      if (error) throw error;

      await Swal.fire({
        icon: "success",
        title: "Cuenta creada",
        text: "Revisa tu correo electrónico para verificar tu cuenta.",
        confirmButtonText: "Continuar",
        confirmButtonColor: "#0ea5e9",
        background: "#0f172a",
        color: "#fff",
      });

      navigate("/verify-account");
    } catch (err) {
      showAlert(
        "error",
        "No se pudo crear la cuenta",
        err.message || "Inténtalo nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page register-auth-layout">
      <section className="register-card register-card-compact">
        <div className="register-card-header">
          <div className="register-icon-badge">
            <FaShieldAlt />
          </div>

          <div>
            <h1>Crear cuenta nueva</h1>
            <p>Regístrate, verifica tu correo y compra de forma segura.</p>
          </div>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-row">
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
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Provincia</label>
              <div className="input-icon-wrap">
                <FaMapMarkerAlt />
                <select
                  name="provincia"
                  value={form.provincia}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona tu provincia</option>
                  {provinciasEcuador.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Celular WhatsApp</label>
              <div className="input-icon-wrap">
                <FaWhatsapp />
                <input
                  name="celular"
                  value={form.celular}
                  onChange={handleChange}
                  required
                  placeholder="0999999999"
                  maxLength={10}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Correo electrónico</label>
            <div className="input-icon-wrap">
              <FaEnvelope />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="correo@ejemplo.com"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <div className="input-icon-wrap password-field">
              <FaLock />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Mínimo 6 caracteres"
              />

              <button
                type="button"
                className="password-eye-btn"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button className="btn btn-primary btn-full register-submit" disabled={loading}>
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <div className="auth-switch">
          ¿Ya tienes cuenta?
          <Link to="/login" className="auth-link">
            Inicia sesión
          </Link>
        </div>
      </section>

      <aside className="register-side register-side-compact">
        <div className="auth-hero-img">
          <img src={logo2} alt="Logo VIT" />
        </div>

        <div className="register-benefits">
          <span><FaCheckCircle /> Compra segura</span>
          <span><FaCheckCircle /> Verificación por correo</span>
          <span><FaCheckCircle /> Resumen por WhatsApp</span>
        </div>
      </aside>
    </div>
  );
}