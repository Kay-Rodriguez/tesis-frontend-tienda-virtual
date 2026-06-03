import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";
import { apiRequest } from "../helpers/api";

export function VerifyPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Verificando tu cuenta...");

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        const data = await apiRequest(`/auth/verify/${token}`);

        setStatus("success");
        setMessage(data.message || "Cuenta verificada correctamente.");

        await Swal.fire({
          icon: "success",
          title: "Cuenta verificada",
          text: "Ahora puedes iniciar sesión.",
          confirmButtonText: "Iniciar sesión",
          confirmButtonColor: "#0ea5e9",
          background: "#0f172a",
          color: "#fff",
        });

        navigate("/login");
      } catch (err) {
        setStatus("error");
        setMessage(err.message || "El enlace no es válido o ya expiró.");

        Swal.fire({
          icon: "error",
          title: "No se pudo verificar",
          text: err.message || "Solicita un nuevo enlace de verificación.",
          confirmButtonColor: "#0ea5e9",
          background: "#0f172a",
          color: "#fff",
        });
      }
    };

    if (token) verifyAccount();
  }, [token, navigate]);

  return (
    <div className="verify-wait-page">
      <div className="verify-card">
        <div className={`verify-icon ${status}`}>
          {status === "loading" && <FaSpinner className="spin" />}
          {status === "success" && <FaCheckCircle />}
          {status === "error" && <FaTimesCircle />}
        </div>

        <h1>Verificación de cuenta</h1>
        <p>{message}</p>

        {status !== "loading" && (
          <button className="btn btn-primary" onClick={() => navigate("/login")}>
            Ir a iniciar sesión
          </button>
        )}
      </div>
    </div>
  );
}