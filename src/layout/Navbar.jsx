import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaShoppingCart,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import logo from "../assets/logo2.jpg";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const isAdmin = ["admin", "administrador"].includes(
    user?.role?.toLowerCase?.()
  );

  const cartCount = items.reduce(
    (acc, item) => acc + Number(item.cantidad || 0),
    0
  );

  const avatar =
    user?.avatar ||
    user?.avatar_url ||
    user?.foto ||
    user?.imagen ||
    "https://cdn-icons-png.flaticon.com/512/847/847969.png";

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="navbar">
      <div className="navbar-brand" onClick={() => navigate("/")}>
        <div className="navbar-logo-img">
          <img src={logo} alt="VIT Logo" />
        </div>

        <div>
          <div className="navbar-title">VISION IDEAL TECHNOLOGY</div>
          <div className="navbar-sub">Tu tienda de confianza</div>
        </div>
      </div>

      <button
        className="nav-toggle"
        type="button"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <FaTimes /> : <FaBars />}
      </button>

      <nav className={`navbar-menu ${open ? "open" : ""}`}>
       {!isAdmin && <NavLink to="/">Inicio</NavLink>}
       
        {!isAdmin && user && (
          <>
            <NavLink to="/cart">Carrito</NavLink>
            <NavLink to="/orders">Mis pedidos</NavLink>
            <NavLink to="/profile">Perfil</NavLink>
          </>
        )}

        {isAdmin && (
          <>
            <NavLink to="/admin">Tablero</NavLink>
            <NavLink to="/admin/users">Usuarios</NavLink>
            <NavLink to="/admin/categories">Categorías</NavLink>
            <NavLink to="/admin/products">Productos</NavLink>
            <NavLink to="/admin/orders">Pedidos</NavLink>
          </>
        )}
      </nav>

      <div className="navbar-right">
        {user ? (
          <>
            {!isAdmin && (
              <button
                className="navbar-cart-btn cart-highlight"
                onClick={() => navigate("/cart")}
              >
                <FaShoppingCart />
                {cartCount > 0 && (
                  <span className="navbar-cart-count">{cartCount}</span>
                )}
              </button>
            )}

            <img
              src={avatar}
              className="nav-avatar desktop"
              alt="Foto de perfil"
              onClick={() => navigate("/profile")}
              onError={(e) => {
                e.currentTarget.src =
                  "https://cdn-icons-png.flaticon.com/512/847/847969.png";
              }}
            />

            <span className="navbar-username">
              Hola, <strong>{user.nombre || user.email}</strong>
            </span>

            <button className="btn btn-outline" onClick={handleLogout}>
              <FaSignOutAlt /> Salir
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-outline" onClick={() => navigate("/login")}>
              <FaUserCircle /> Iniciar sesión
            </button>
            <button className="btn btn-primary" onClick={() => navigate("/register")}>
              Crear cuenta
            </button>
          </>
        )}
      </div>
    </header>
  );
}