import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaStar,
  FaCheckCircle,
  FaArrowLeft,
} from "react-icons/fa";
import { apiRequest } from "../helpers/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { showToast } from "../helpers/toast";

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
const { reload } = useCart();
  const [producto, setProducto] = useState(null);
  const [similares, setSimilares] = useState([]);
  const [cantidad, setCantidad] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
const [zoomOpen, setZoomOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await apiRequest(`/admin/products/${id}`);
        setProducto(data);

        if (data?.categoria_id) {
          const lista = await apiRequest(
            `/products/filter?categoria_id=${data.categoria_id}&disponible=true`
          );

          setSimilares(lista.filter((p) => p.id !== data.id).slice(0, 4));
        }
      } catch (err) {
        setError(err.message || "No se pudo cargar el producto.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const addToCart = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setAdding(true);

    try {
      const res = await apiRequest("/cart", {
        method: "POST",
        body: JSON.stringify({
          producto_id: Number(id),
          cantidad: Number(cantidad),
        }),
      });

      showToast(
        res?.message || "Producto añadido correctamente al carrito",
        "success"
      );
      await reload();
    } catch (err) {
      showToast(err.message || "No se pudo añadir al carrito", "error");
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div className="card">Cargando producto...</div>;
  if (error) return <div className="card error-text">{error}</div>;
  if (!producto) return <div className="card">Producto no encontrado</div>;

  const imagenes = producto.imagenes_producto || [];
  const imagenActiva = imagenes[activeIndex]?.url;

  return (
    <div className="product-detail-page">
      <section className="product-detail-amazon">
        <div className="product-gallery-layout">
          <div className="product-thumbs-column">
            {imagenes.length > 0 ? (
              imagenes.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`product-thumb-btn ${
                    idx === activeIndex ? "active" : ""
                  }`}
                  onClick={() => setActiveIndex(idx)}
                >
                  <img src={img.url} alt={producto.nombre} />
                </button>
              ))
            ) : (
              <div className="product-thumb-empty">Sin imagen</div>
            )}
          </div>

          <div
  className="product-main-image product-main-image-click"
  onClick={() => imagenActiva && setZoomOpen(true)}
>
  {imagenActiva ? (
    <img src={imagenActiva} alt={producto.nombre} />
  ) : (
    <span>Sin imagen</span>
  )}
</div>

{zoomOpen && (
  <div className="product-zoom-modal" onClick={() => setZoomOpen(false)}>
    <button className="product-zoom-close" type="button">
      ✕
    </button>

    <img
      src={imagenActiva}
      alt={producto.nombre}
      className="product-zoom-img"
      onClick={(e) => e.stopPropagation()}
    />
  </div>
)}
        </div>

        <div className="product-info-panel">
          <span className="product-badge-main">Producto destacado</span>

          <h1>{producto.nombre}</h1>

          <div className="product-rating">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <span>4.8 | Producto recomendado</span>
          </div>

          <p className="product-description">{producto.descripcion}</p>

          <div className="product-price-main">
            ${Number(producto.precio).toFixed(2)}
          </div>

          <div className="product-status-row">
            <span className="stock-pill">
              <FaCheckCircle />
              Stock: {producto.stock > 0 ? producto.stock : "Agotado"}
            </span>

            <span className="category-pill">
              Categoría: {producto.categoria_id || "General"}
            </span>
          </div>

          <div className="qty-box">
            <span>Cantidad</span>

            <div className="qty-control">
              <button
                type="button"
                onClick={() => setCantidad(Math.max(1, cantidad - 1))}
              >
                −
              </button>

              <strong>{cantidad}</strong>

              <button type="button" onClick={() => setCantidad(cantidad + 1)}>
                +
              </button>
            </div>
          </div>

          <div className="product-action-stack">
            <button
              className="btn-add-cart-featured"
              disabled={producto.stock <= 0 || adding}
              onClick={addToCart}
            >
              <FaShoppingCart />
              {adding ? "Añadiendo..." : "Añadir al carrito"}
            </button>

            <button
              className="btn-back-shop"
              type="button"
              onClick={() => navigate("/")}
            >
              <FaArrowLeft />
              Volver a la tienda
            </button>
          </div>
        </div>
      </section>

      <section className="similar-products">
        <h2 className="section-title">Productos relacionados</h2>
        <p className="section-subtitle">
          Otros artículos de la misma categoría.
        </p>

        <div className="products-grid related-grid">
          {similares.map((p) => (
            <article
              key={p.id}
              className="product-card"
              onClick={() => navigate(`/product/${p.id}`)}
            >
              <div className="product-img">
                {p.imagenes_producto?.[0]?.url ? (
                  <img src={p.imagenes_producto[0].url} alt={p.nombre} />
                ) : (
                  <span>Sin imagen</span>
                )}
              </div>

              <div className="product-title">{p.nombre}</div>
              <div className="product-meta">{p.descripcion}</div>

              <div className="product-footer">
                <span className="product-price">
                  ${Number(p.precio).toFixed(2)}
                </span>

                <span className="badge badge-success">
                  Stock {p.stock > 0 ? p.stock : "Agotado"}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}