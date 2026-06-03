import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
} from "react-icons/fa";
import { supabase } from "../supabaseClient";

export function ResetPasswordPage() {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordIsStrong = (value) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,}$/.test(
      value
    );
  };

  const getPasswordStrength = () => {
    if (!password) return "";

    if (password.length < 8) return "🔴 Débil";

    if (passwordIsStrong(password)) return "🟢 Segura";

    return "🟡 Media";
  };

  const validatePassword = () => {
    if (password.length < 8) {
      Swal.fire({
        icon: "warning",
        title: "Contraseña demasiado corta",
        text: "Debe tener mínimo 8 caracteres.",
        confirmButtonColor: "#0ea5e9",
        background: "#0f172a",
        color: "#fff",
      });
      return false;
    }

    if (!/[A-Z]/.test(password)) {
      Swal.fire({
        icon: "warning",
        title: "Falta una mayúscula",
        text: "La contraseña debe contener al menos una letra mayúscula.",
        confirmButtonColor: "#0ea5e9",
        background: "#0f172a",
        color: "#fff",
      });
      return false;
    }

    if (!/[a-z]/.test(password)) {
      Swal.fire({
        icon: "warning",
        title: "Falta una minúscula",
        text: "La contraseña debe contener al menos una letra minúscula.",
        confirmButtonColor: "#0ea5e9",
        background: "#0f172a",
        color: "#fff",
      });
      return false;
    }

    if (!/\d/.test(password)) {
      Swal.fire({
        icon: "warning",
        title: "Falta un número",
        text: "La contraseña debe contener al menos un número.",
        confirmButtonColor: "#0ea5e9",
        background: "#0f172a",
        color: "#fff",
      });
      return false;
    }

    if (!/[@$!%*?&.#_-]/.test(password)) {
      Swal.fire({
        icon: "warning",
        title: "Falta un símbolo",
        text: "La contraseña debe contener al menos un símbolo: @$!%*?&.#_-",
        confirmButtonColor: "#0ea5e9",
        background: "#0f172a",
        color: "#fff",
      });
      return false;
    }

    if (!passwordIsStrong(password)) {
      Swal.fire({
        icon: "warning",
        title: "Contraseña insegura",
        text: "La contraseña no cumple los requisitos mínimos de seguridad.",
        confirmButtonColor: "#0ea5e9",
        background: "#0f172a",
        color: "#fff",
      });
      return false;
    }

    if (password !== confirm) {
      Swal.fire({
        icon: "warning",
        title: "Las contraseñas no coinciden",
        text: "Verifica nuevamente la confirmación de contraseña.",
        confirmButtonColor: "#0ea5e9",
        background: "#0f172a",
        color: "#fff",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword()) return;

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;

      await Swal.fire({
        icon: "success",
        title: "Contraseña actualizada correctamente",
        text: "Tu contraseña fue modificada con éxito. Ahora puedes iniciar sesión con tus nuevas credenciales.",
        confirmButtonText: "Iniciar sesión",
        confirmButtonColor: "#0ea5e9",
        background: "#0f172a",
        color: "#fff",
      });

      await supabase.auth.signOut();

      localStorage.removeItem("token");
      localStorage.removeItem("vit_user");

      setTimeout(() => {
        navigate("/login");
      }, 500);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error al actualizar contraseña",
        text:
          err.message ||
          "No se pudo actualizar la contraseña. Vuelve a solicitar el enlace.",
        confirmButtonColor: "#0ea5e9",
        background: "#0f172a",
        color: "#fff",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-wait-page">
      <div className="verify-card">
        <div className="verify-icon success">
          <FaCheckCircle />
        </div>

        <h1>Nueva contraseña</h1>

        <p>
          Escribe una contraseña segura para recuperar el acceso a tu cuenta.
        </p>

        <form className="form" onSubmit={handleSubmit}>
          <div className="input-icon-wrap password-field">
            <FaLock />

            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="Nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          {password && (
            <div style={{ textAlign: "left", marginBottom: "0.5rem" }}>
              <small>{getPasswordStrength()}</small>
              <br />
              <small>
                Debe contener mínimo 8 caracteres, una mayúscula, una
                minúscula, un número y un símbolo.
              </small>
            </div>
          )}

          <div className="input-icon-wrap password-field">
            <FaLock />

            <input
              type={showConfirm ? "text" : "password"}
              required
              placeholder="Confirmar contraseña"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={loading}
            />

            <button
              type="button"
              className="password-eye-btn"
              onClick={() => setShowConfirm((v) => !v)}
              disabled={loading}
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button className="btn btn-primary btn-full" disabled={loading}>
            {loading ? "Guardando..." : "Guardar contraseña"}
          </button>
        </form>
      </div>
    </div>
  );
}