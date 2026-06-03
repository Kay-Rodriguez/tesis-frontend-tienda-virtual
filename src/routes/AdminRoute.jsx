import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div style={{ padding: "2rem" }}>Cargando...</div>;

  const role = user?.role?.toLowerCase?.();

  if (!user || !["admin", "administrador"].includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}