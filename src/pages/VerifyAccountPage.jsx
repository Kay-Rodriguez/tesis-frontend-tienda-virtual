import React from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelopeOpenText, FaCheckCircle } from "react-icons/fa";

export function VerifyAccountPage() {
  const navigate = useNavigate();

  return (
    <div className="verify-wait-page">
      <div className="verify-card">
        <div className="verify-icon">
          <FaEnvelopeOpenText />
        </div>

        <h1>Verifica tu cuenta</h1>

        <p>
          Hemos enviado un enlace de verificación a tu correo electrónico.
          Abre el mensaje y confirma tu cuenta para poder iniciar sesión.
        </p>

        <div className="verify-info">
          <span>
            <FaCheckCircle /> Revisa también spam o correo no deseado.
          </span>
        </div>

        <button className="btn btn-primary" onClick={() => navigate("/login")}>
          Ir a iniciar sesión
        </button>
      </div>
    </div>
  );
}