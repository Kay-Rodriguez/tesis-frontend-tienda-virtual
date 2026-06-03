import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaMinus,
  FaPlus,
  FaTrash,
  FaArrowLeft,
  FaWhatsapp,
  FaShoppingBag,
  FaShieldAlt,
} from "react-icons/fa";

import { useCart } from "../context/CartContext";
import { apiRequest } from "../helpers/api";
import { showToast } from "../helpers/toast";

export function CartPage() {
  const navigate = useNavigate();
  const { items, cartTotal, updateItem, removeItem, loading, reload } = useCart();
  const [confirming, setConfirming] = useState(false);

  const totalItems = items.reduce(
    (acc, item) => acc + Number(item.cantidad || 0),
    0
  );

  const getImage = (item) =>
    item?.imagen ||
    item?.imagenes_producto?.[0]?.url ||
    "https://cdn-icons-png.flaticon.com/512/679/679720.png";

  const getName = (item) =>
    item?.nombre_producto ||
    item?.nombre ||
    item?.producto_nombre ||
    "Producto";

  const handleConfirmOrder = async () => {
    if (!items.length) {
      showToast("Tu carrito está vacío", "warn");
      return;
    }

    setConfirming(true);

    try {
      const checkout = await apiRequest("/orders/checkout", {
        method: "POST",
      });

      showToast(checkout?.message || "Compra confirmada correctamente", "success");

      try {
        const wa = await apiRequest("/orders/whatsapp");

      if (checkout?.whatsapp_url) {
  window.open(checkout.whatsapp_url, "_blank");
}
      } catch {
        showToast("Pedido creado. No se pudo abrir WhatsApp automáticamente.", "warn");
      }

      await reload();
      navigate("/orders");
    } catch (err) {
      showToast(err.message || "No se pudo confirmar la compra", "error");
    } finally {
      setConfirming(false);
    }
  };

  if (!items.length) {
    return (
      <div className="cart-empty-card">
        <FaShoppingBag />
        <h1>Tu carrito está vacío</h1>
        <p>Agrega productos tecnológicos para continuar con tu compra.</p>
        <button className="btn-cart-main" onClick={() => navigate("/")}>
          Ir al catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page cart-store-page">
      <section className="cart-panel">
        <div className="cart-panel-header">
          <div>
            <span className="cart-chip">Carrito VIT</span>
            <h1>Tu pedido</h1>
          </div>

          <span className="cart-count-pill">{totalItems} ítems</span>
        </div>

        <div className="cart-items-list">
          {items.map((item) => {
            const nombre = getName(item);
            const precio = Number(item?.precio_unitario || item?.precio || 0);
            const cantidad = Number(item.cantidad || 1);
            const subtotal = Number(item.subtotal || precio * cantidad);

            return (
              <article className="cart-item-card" key={item.id}>
                <div
                  className="cart-item-thumb"
                  onClick={() => navigate(`/product/${item.producto_id}`)}
                >
                  <img src={getImage(item)} alt={nombre} />
                </div>

                <div className="cart-item-info">
                  <h3
                    className="cart-product-link"
                    onClick={() => navigate(`/product/${item.producto_id}`)}
                  >
                    {nombre}
                  </h3>

                  <p>Precio unitario: ${precio.toFixed(2)}</p>
                  <strong>${subtotal.toFixed(2)}</strong>
                </div>

                <div className="cart-item-actions">
                  <div className="cart-item-qty">
                    <button
                      className="cart-qty-btn"
                      onClick={() => updateItem(item.id, Math.max(1, cantidad - 1))}
                    >
                      <FaMinus />
                    </button>

                    <span>{cantidad}</span>

                    <button
                      className="cart-qty-btn"
                      onClick={() => updateItem(item.id, cantidad + 1)}
                    >
                      <FaPlus />
                    </button>
                  </div>

                  <button
                    className="cart-item-remove"
                    onClick={() => removeItem(item.id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <button className="cart-continue-btn" onClick={() => navigate("/")}>
          <FaArrowLeft />
          Seguir comprando
        </button>
      </section>

      <aside className="cart-summary">
        <span className="cart-chip orange">Resumen</span>

        <h2>Resumen de pago</h2>

        <div className="cart-summary-row">
          <span>Total pedido</span>
          <strong>${Number(cartTotal).toFixed(2)}</strong>
        </div>

        <div className="cart-summary-row">
          <span>Envío</span>
          <strong>Por coordinar</strong>
        </div>

        <div className="cart-total">
          <span>Total a pagar</span>
          <strong>${Number(cartTotal).toFixed(2)}</strong>
        </div>

        <p className="cart-summary-note">
          <FaWhatsapp />
          El pago se realiza contraentrega. Se generará el resumen para WhatsApp.
        </p>

        <button
          className="btn-checkout"
          disabled={confirming}
          onClick={handleConfirmOrder}
        >
          <FaShieldAlt />
          {confirming ? "Confirmando..." : "Confirmar compra"}
        </button>
      </aside>
    </div>
  );
}