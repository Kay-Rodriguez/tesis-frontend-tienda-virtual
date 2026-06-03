import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../helpers/api";
import { getCategoryIcon } from "../helpers/categoryIcons";
import logo from "../assets/logo2.jpg";
import { FaShoppingCart, FaUserPlus, FaCheckCircle, FaTruck, FaWhatsapp } from "react-icons/fa";

export function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [latest, setLatest] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [slideIndex, setSlideIndex] = useState(0);

  const catalogRef = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiRequest("/products/filter?disponible=true");
        const ordenados = (data || []).sort((a, b) => b.id - a.id);

        setProductos(ordenados);
        setLatest(ordenados.slice(0, 9));

        const cats = await apiRequest("/categorias");
        setCategorias(cats || []);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!latest.length) return;
    const id = setInterval(
      () => setSlideIndex((prev) => (prev + 1) % latest.length),
      4000
    );
    return () => clearInterval(id);
  }, [latest]);

  const prevSlide = () => {
    if (!latest.length) return;
    setSlideIndex((prev) => (prev - 1 + latest.length) % latest.length);
  };

  const nextSlide = () => {
    if (!latest.length) return;
    setSlideIndex((prev) => (prev + 1) % latest.length);
  };

  const categoriasVisibles = categorias.filter(
    (c) => !["General", "Autogenerada"].includes(c.nombre)
  );

  const selectedCategoryLabel =
    categoriasVisibles.find((c) => String(c.id) === String(selectedCategory))
      ?.nombre || "";

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const applySearch = (e) => {
    e?.preventDefault?.();
    setSearch((prev) => prev.trim());
    setSelectedCategory("");
  };

  const filteredProducts = productos.filter((p) => {
    if (selectedCategory && String(p.categoria_id) !== String(selectedCategory)) {
      return false;
    }

    const q = search.trim().toLowerCase();
    if (!q) return true;

    const num = Number(q.replace(",", "."));
    if (!Number.isNaN(num)) {
      const precio = Number(p.precio);
      return Math.round(precio) === Math.round(num);
    }

    const texto = `${p.nombre} ${p.descripcion || ""}`.toLowerCase();
    return texto.includes(q);
  });

  return (
    <div>
      <div className="grid-two home-hero">
        <div>
          <h1 className="hero-title">
            Tu tienda de tecnología online de confianza en Ecuador
          </h1>
          <p className="hero-subtitle">
            VIT es una tienda online de productos tecnológicos que cuenta con
            productos a precios competitivos.
            <br />
            <br />
            Contamos con más de 2 años de experiencia en Quito, Ecuador.
            <br />
            <br />
            Realizamos pedidos por Pago Contra Entrega solo en Quito.
            <br />
            <br />
            En caso de otras provincias, se realiza el pago una vez se genera
            la orden de envío.
            <br />
            <br />
            Horarios de envío: <strong>8am a 5pm</strong>.
          </p>

          <div className="hero-actions-center">
  <div className="hero-buttons">
    <button
      className="btn btn-primary hero-btn"
      type="button"
      onClick={scrollToCatalog}
    >
      <FaShoppingCart />
      Ver catálogo
    </button>

    {!user && (
      <button
        className="btn btn-outline hero-btn"
        type="button"
        onClick={() => navigate("/register")}
      >
        <FaUserPlus />
        Crear cuenta gratis
      </button>
    )}
  </div>

  <div className="chips-row">
    <span className="chip">
      <FaCheckCircle />
      Usuarios verificados
    </span>
    <span className="chip">
      <FaTruck />
      Envíos a provincias
    </span>
    <span className="chip">
      <FaWhatsapp />
      Atención por WhatsApp
    </span>
  </div>
</div>
        </div>

        <div className="hero-visual">
          <div className="hero-img">
            <img src={logo} alt="Logo VIT" className="hero-main-logo" />
          </div>
        </div>
      </div>

      <section className="home-slider-section">
        <h2 className="section-title">Productos en promoción</h2>
        <p className="section-subtitle">
          Últimos productos añadidos al catálogo.
        </p>

        <div className="home-slider">
          <button
            type="button"
            className="home-slider-arrow left"
            onClick={prevSlide}
            disabled={!latest.length}
          >
            ‹
          </button>

          <div className="home-slider-window">
            <div
              className="home-slider-track"
              style={{ transform: `translateX(-${slideIndex * 100}%)` }}
            >
              {latest.map((p) => (
                <div
                  key={p.id}
                  className="home-slide"
                  onClick={() => navigate(`/product/${p.id}`)}
                >
                  <div className="home-slide-image">
                    {p.imagenes_producto?.[0]?.url ? (
                      <img src={p.imagenes_producto[0].url} alt={p.nombre} />
                    ) : (
                      <span>Sin imagen</span>
                    )}
                  </div>
                  <div className="home-slide-info">
                    <h3>{p.nombre}</h3>
                    <p>${Number(p.precio).toFixed(2)}</p>
                  </div>
                </div>
              ))}
              {!latest.length && (
                <div className="home-slide">
                  <div className="home-slide-image">
                    <span>Sin productos todavía</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            className="home-slider-arrow right"
            onClick={nextSlide}
            disabled={!latest.length}
          >
            ›
          </button>
        </div>
      </section>

      <section>
        <div className="home-search-container">
          <input
            type="text"
            placeholder="Buscar producto por nombre, descripción o precio..."
            className="home-search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            className="btn btn-primary home-search-btn"
            onClick={applySearch}
          >
            Buscar
          </button>
        </div>
      </section>

      <section ref={catalogRef} className="home-categories-section">
        <h2 className="categories-title">categorías</h2>

        <div className="categories-carousel">
          {categoriasVisibles.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={
                "category-card " +
                (String(selectedCategory) === String(cat.id) ? "active" : "")
              }
              onClick={() => setSelectedCategory(String(cat.id))}
            >
              <span className="category-icon">
                {getCategoryIcon(cat.nombre)}
              </span>
              <span className="category-label">{cat.nombre}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="home-products-section">
        <h2 className="section-title" style={{ marginTop: "1.5rem" }}>
          {selectedCategoryLabel || "Todos los productos"}
        </h2>

        <div className="products-grid">
          {filteredProducts.length === 0 ? (
            <p>No hay productos en esta categoría.</p>
          ) : (
            filteredProducts.map((p) => (
              <article key={p.id} className="product-card">
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
                  type="button"
                  onClick={() => navigate(`/product/${p.id}`)}
                >
                  Ver detalle
                </button>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}