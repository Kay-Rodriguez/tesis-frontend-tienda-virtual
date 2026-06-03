import React from "react";

export function CategoryCard({
  category,
  active = false,
  icon = "📦",
  onClick,
}) {
  return (
    <button
      type="button"
      className={`category-card ${active ? "active" : ""}`}
      onClick={onClick}
    >
      <span className="category-icon">{icon}</span>
      <span className="category-label">{category.nombre}</span>
    </button>
  );
}