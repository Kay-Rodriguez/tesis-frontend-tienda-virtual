import React, { useEffect, useState } from "react";
import {
  FaBoxOpen,
  FaUsers,
  FaShoppingCart,
  FaLayerGroup,
  FaChartLine,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../helpers/api";

export function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});

  useEffect(() => {
    loadStats();
  }, []);

 const loadStats = async () => {
  try {
    const [users, products, orders, categories] = await Promise.all([
      apiRequest("/admin/users"),
      apiRequest("/admin/products"),
      apiRequest("/admin/orders"),
      apiRequest("/categorias"),
    ]);

    setStats({
      usuarios: users?.length || 0,
      productos: products?.length || 0,
      pedidos: orders?.length || 0,
      categorias: categories?.length || 0,
    });
  } catch (err) {
    console.error("Error cargando estadísticas:", err);
    setStats({
      usuarios: 0,
      productos: 0,
      pedidos: 0,
      categorias: 0,
    });
  }
};

 const cards = [
  {
    title: "Usuarios",
    value: stats.usuarios ?? stats.total_usuarios ?? 0,
    icon: <FaUsers />,
    path: "/admin/users",
  },
  {
    title: "Productos",
    value: stats.productos ?? stats.total_productos ?? 0,
    icon: <FaBoxOpen />,
    path: "/admin/products",
  },
  {
    title: "Pedidos",
    value: stats.pedidos ?? stats.total_pedidos ?? 0,
    icon: <FaShoppingCart />,
    path: "/admin/orders",
  },
  {
    title: "Categorías",
    value: stats.categorias ?? stats.total_categorias ?? 0,
    icon: <FaLayerGroup />,
    path: "/admin/categories",
  },
];

  return (
    <div className="admin-page">
      <section className="admin-hero">
        <div>
          <span className="admin-chip">
            <FaChartLine /> Panel administrativo
          </span>

          <h1>Centro de control VIT</h1>
          <p>
            Administra usuarios, productos, categorías y compras desde un panel
            moderno conectado a tu backend.
          </p>
        </div>
      </section>

      <section className="admin-grid">
        {cards.map((card) => (
          <article
            key={card.title}
            className="admin-stat-card"
            onClick={() => navigate(card.path)}
          >
            <div className="admin-stat-icon">{card.icon}</div>
            <div>
              <h3>{card.title}</h3>
              <strong>{card.value}</strong>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}