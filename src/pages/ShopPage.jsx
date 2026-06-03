import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaTruck,
  FaShieldAlt,
  FaWhatsapp,
  FaStar,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../helpers/api";
import { getCategoryIcon } from "../helpers/categoryIcons";

export function ShopPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [slideIndex, setSlideIndex] = useState(0);
  const [page, setPage] = useState(1);

  const PRODUCTS_PER_PAGE = 9;

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiRequest("/products/filter?disponible=true");
        const ordenados = (data || []).sort((a, b) => b.id - a.id);
        setProductos(ordenados);

        const cats = await apiRequest("/categorias");
        setCategorias(cats || []);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  const destacados = productos.slice(0, 8);

  useEffect(() => {
    if (!destacados.length) return;

    const id = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % destacados.length);
    }, 5500);

    return () => clearInterval(id);
  }, [destacados.length]);

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();

    return productos.filter((p) => {
      if (selectedCategory && String(p.categoria_id) !== String(selectedCategory)) {
        return false;
      }

      if (!q) return true;

      const numeric = Number(q.replace(",", "."));
      if (!Number.isNaN(numeric)) {
        return Math.round(Number(p.precio)) === Math.round(numeric);
      }

      return `${p.nombre} ${p.descripcion || ""}`.toLowerCase().includes(q);
    });
  }, [productos, search, selectedCategory]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE
  );

  const handleCategorySelect = (cat) => {
    setSelectedCategory(String(cat.id));
    setPage(1);
  };

  const clearCategory = () => {
    setSelectedCategory("");
    setPage(1);
  };

  const selectedCategoryLabel =
    categorias.find((c) => String(c.id) === String(selectedCategory))?.nombre ||
    "Todos los productos";

  const activeSlide = destacados[slideIndex];

  return (
    <div className="shop-page">
      <section className="shop-hero-user">
        <div>
          <span className="shop-badge">🔥 Tienda tecnológica VIT</span>

          <h1>
            Bienvenido, {user?.nombre || "cliente"} 👋
          </h1>

          <p>
            encuentra tecnología al mejor precio
          </p>

          <div className="shop-hero-actions">
            <button className="btn btn-primary" onClick={() => navigate("/cart")}>
              <FaShoppingCart /> Ver carrito
            </button>

            <button className="btn btn-outline" onClick={() => navigate("/orders")}>
              Mis pedidos
            </button>

            <button className="btn btn-outline" onClick={() => navigate("/profile")}>
              Editar perfil
            </button>
          </div>
        </div>

        <div className="shop-deal-card">
          <span>CYBER VIT</span>
          <strong>Ofertas</strong>
          <p>Productos destacados para ti</p>
        </div>
      </section>

      <section className="store-benefits">
        <div><FaTruck /> Envíos disponibles</div>
        <div><FaShieldAlt /> Compra segura</div>
        <div><FaWhatsapp /> Atención por WhatsApp</div>
        <div><FaStar /> Productos destacados</div>
      </section>

      <section className="main-product-carousel">
        <div className="carousel-header">
          <div>
            <span className="shop-badge">Producto destacado</span>
            <h2>Recomendado para ti</h2>
          </div>

          <div className="carousel-dots">
            {destacados.map((_, i) => (
              <button
                key={i}
                className={i === slideIndex ? "active" : ""}
                onClick={() => setSlideIndex(i)}
              />
            ))}
          </div>
        </div>

        {activeSlide ? (
          <div
            className="featured-slide"
            onClick={() => navigate(`/product/${activeSlide.id}`)}
          >
            <div className="featured-image">
              {activeSlide.imagenes_producto?.[0]?.url ? (
                <img
                  src={activeSlide.imagenes_producto[0].url}
                  alt={activeSlide.nombre}
                />
              ) : (
                <span>Sin imagen</span>
              )}
            </div>

            <div className="featured-info">
              <span className="featured-tag">Nuevo / destacado</span>
              <h3>{activeSlide.nombre}</h3>
              <p>{activeSlide.descripcion}</p>

              <strong>${Number(activeSlide.precio).toFixed(2)}</strong>

              <button className="btn btn-primary">
                Ver producto
              </button>
            </div>
          </div>
        ) : (
          <div className="card">No hay productos destacados todavía.</div>
        )}
      </section>

      <section className="home-search-container">
        <input
          className="home-search-input"
          placeholder="Buscar producto por nombre, descripción o precio..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <button className="btn btn-primary" type="button">
          Buscar
        </button>
      </section>

      <section className="home-categories-section">
        <h2 className="categories-title">Categorías</h2>

        <div className="categories-carousel">
          <button
            className={`category-card ${!selectedCategory ? "active" : ""}`}
            onClick={clearCategory}
          >
            <span className="category-icon">🛒</span>
            <span className="category-label">Todo</span>
          </button>

          {categorias.map((cat) => (
            <button
              key={cat.id}
              className={`category-card ${
                String(selectedCategory) === String(cat.id) ? "active" : ""
              }`}
              onClick={() => handleCategorySelect(cat)}
            >
              <span className="category-icon">{getCategoryIcon(cat.nombre)}</span>
              <span className="category-label">{cat.nombre}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="home-products-section">
        <div className="products-section-header">
          <div>
            <h2 className="section-title">{selectedCategoryLabel}</h2>
            <p className="section-subtitle">
              Mostrando {paginatedProducts.length} de {filteredProducts.length} productos.
            </p>
          </div>
        </div>

        <div className="products-grid products-grid-3x3">
          {paginatedProducts.length === 0 ? (
            <p>No hay productos disponibles.</p>
          ) : (
            paginatedProducts.map((p) => (
              <article className="product-card" key={p.id}>
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

                <button
                  className="btn btn-outline btn-full"
                  onClick={() => navigate(`/product/${p.id}`)}
                >
                  Ver detalle
                </button>
              </article>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                className={page === index + 1 ? "active" : ""}
                onClick={() => setPage(index + 1)}
              >
                Página {index + 1}
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}