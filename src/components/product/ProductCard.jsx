import React from "react";

export function ProductCard({ product, onClick }) {
  return (
    <article className="product-card" onClick={onClick}>
      <div className="product-img">
        {product?.imagenes_producto?.[0]?.url ? (
          <img src={product.imagenes_producto[0].url} alt={product.nombre} />
        ) : (
          <span>Sin imagen</span>
        )}
      </div>

      <div className="product-title">{product.nombre}</div>
      <div className="product-meta">{product.descripcion}</div>

      <div className="product-footer">
        <span className="product-price">
          ${Number(product.precio).toFixed(2)}
        </span>
        <span className="badge badge-success">
          Stock {product.stock > 0 ? product.stock : "Agotado"}
        </span>
      </div>
    </article>
  );
}