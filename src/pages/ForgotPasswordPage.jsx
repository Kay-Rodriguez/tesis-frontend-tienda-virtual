import React, { useState } from "react";
import Swal from "sweetalert2";
import { FaEnvelope, FaPaperPlane } from "react-icons/fa";
import { supabase } from "../supabaseClient";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const appUrl = window.location.origin;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${appUrl}/reset-password`,
      });

      if (error) throw error;

      Swal.fire({
        icon: "success",
        title: "Correo enviado",
        text: "Revisa tu correo para cambiar la contraseña.",
        confirmButtonColor: "#0ea5e9",
        background: "#0f172a",
        color: "#fff",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.message || "No se pudo enviar el correo.",
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
        <div className="verify-icon">
          <FaEnvelope />
        </div>

        <h1>Recuperar contraseña</h1>
        <p>Ingresa tu correo y te enviaremos un enlace de recuperación.</p>

        <form className="form" onSubmit={handleSubmit}>
          <div className="input-icon-wrap">
            <FaEnvelope />
            <input
              type="email"
              required
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button className="btn btn-primary btn-full" disabled={loading}>
            <FaPaperPlane />
            {loading ? "Enviando..." : "Enviar enlace"}
          </button>
        </form>
      </div>
    </div>
  );
}