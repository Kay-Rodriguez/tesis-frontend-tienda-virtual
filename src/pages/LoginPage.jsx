import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSignInAlt,
} from "react-icons/fa";

import logo2 from "../assets/logo2.jpg";
import { apiRequest } from "../helpers/api";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const alert = (icon, title, text) => {
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
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;

    const email = form.email.trim().toLowerCase();
    const password = form.password;

    if (!email || !password) {
      alert("warning", "Campos requeridos", "Ingresa correo y contraseña.");
      return;
    }

    setLoading(true);

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      console.log("LOGIN BACKEND:", data);

      if (!data?.token) {
        throw new Error("El backend no devolvió token.");
      }

      const loggedUser = data.user || data.admin;

      if (!loggedUser) {
        throw new Error("El backend no devolvió datos del usuario.");
      }

      loginUser(loggedUser, data.token);

      const role = loggedUser.role?.toLowerCase?.();

      if (role === "admin" || role === "administrador") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error("ERROR LOGIN:", err);

      localStorage.removeItem("token");
      localStorage.removeItem("vit_user");

      alert(
        "error",
        "Error al iniciar sesión",
        err.message || "Correo o contraseña incorrectos."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page grid-two auth-one-screen">
      <section className="card auth-card login-card-modern">
        <h1 className="section-title">Iniciar sesión</h1>

        <p className="section-subtitle">
          Ingresa a VIT con tu correo y contraseña para hacer tus pedidos y
          compras.
        </p>

        <form className="form" onSubmit={handleLogin}>
          <div className="form-group">
            <label className="label">Correo electrónico</label>

            <div className="input-icon-wrap">
              <FaEnvelope />
              <input
                type="email"
                name="email"
                required
                placeholder="correo@ejemplo.com"
                value={form.email}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="label">Contraseña</label>

            <div className="input-icon-wrap password-field">
              <FaLock />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                placeholder="Tu contraseña"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
              />

              <button
                type="button"
                className="password-eye-btn"
                onClick={() => setShowPassword((v) => !v)}
                disabled={loading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button
            className="btn btn-primary btn-full login-submit"
            type="submit"
            disabled={loading}
          >
            <FaSignInAlt />
            {loading ? "Ingresando..." : "Entrar"}
          </button>
        </form>

        <p className="auth-switch">
          ¿Olvidaste tu contraseña?
          <Link to="/forgot-password" className="auth-link">
            Restablécela aquí
          </Link>
        </p>

        <p className="auth-switch">
          ¿No tienes cuenta aún?
          <Link to="/register" className="auth-link">
            Crea tu cuenta
          </Link>
        </p>
      </section>

      <aside className="auth-side login-side-modern">
        <div className="auth-hero-img login-logo-big">
          <img src={logo2} alt="Logo VIT" />
        </div>

        <p className="auth-side-text">
          Tu tienda de tecnología de confianza en Ecuador. Accede a tus pedidos
          en segundos.
        </p>
      </aside>
    </div>
  );
}