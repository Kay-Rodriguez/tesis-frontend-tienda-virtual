import React from "react";

export default function Loader({ text = "Cargando..." }) {
  return <div style={{ padding: "2rem" }}>{text}</div>;
}