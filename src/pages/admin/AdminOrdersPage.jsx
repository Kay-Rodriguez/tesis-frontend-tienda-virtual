import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  FaShoppingCart,
  FaEye,
  FaTrash,
  FaSyncAlt,
  FaWhatsapp,
} from "react-icons/fa";
import { apiRequest } from "../../helpers/api";
import { showToast } from "../../helpers/toast";

const ESTADOS = ["pendiente", "confirmado", "en preparación", "cancelado"];

export function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);

    try {
      const data = await apiRequest("/admin/orders");
      setOrders(data || []);
    } catch (err) {
      showToast(err.message || "Error cargando pedidos", "error");
    } finally {
      setLoading(false);
    }
  };

  const viewDetail = async (id) => {
    try {
      const data = await apiRequest(`/admin/orders/${id}`);
      setSelected(data);

      setTimeout(() => {
        document
          .querySelector(".admin-order-detail-card")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      showToast(err.message || "Error cargando detalle", "error");
    }
  };

  const updateStatus = async (order, nuevo_estado) => {
    if (!nuevo_estado || nuevo_estado === order.estado) return;

    const result = await Swal.fire({
      icon: "question",
      title: "Actualizar estado",
      text: `¿Cambiar pedido a "${nuevo_estado}"?`,
      input: "text",
      inputPlaceholder: "Motivo opcional",
      showCancelButton: true,
      confirmButtonText: "Actualizar",
      cancelButtonText: "Cancelar",
      background: "#0f172a",
      color: "#fff",
      confirmButtonColor: "#0ea5e9",
    });

    if (!result.isConfirmed) return;

    setUpdatingId(order.id);

    try {
      const res = await apiRequest(`/admin/orders/${order.id}`, {
        method: "PUT",
        body: JSON.stringify({
          nuevo_estado,
          razon: result.value || "Actualización administrativa",
        }),
      });

      showToast(res.message || "Estado actualizado", "success");

      if (res.whatsapp_url) {
        window.open(res.whatsapp_url, "_blank");
      }

      await load();

      if (selected?.id === order.id) {
        await viewDetail(order.id);
      }
    } catch (err) {
      showToast(err.message || "Error actualizando estado", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteOrder = async (id) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "¿Eliminar pedido?",
      text: "Se eliminará el pedido y sus productos asociados.",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#0f172a",
      color: "#fff",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await apiRequest(`/admin/orders/${id}`, {
        method: "DELETE",
      });

      showToast(res.message || "Pedido eliminado", "success");
      setSelected(null);
      load();
    } catch (err) {
      showToast(err.message || "Error eliminando pedido", "error");
    }
  };

  if (loading) {
    return <div className="admin-products-loading">Cargando pedidos...</div>;
  }

  return (
    <div className="admin-products-page">
      <section className="admin-products-header">
        <div>
          <span className="admin-chip">
            <FaShoppingCart /> Gestión de compras
          </span>

          <h1>Pedidos</h1>

          <p>
            Lista compras, revisa detalle, actualiza estado y elimina pedidos.
          </p>
        </div>

        <button className="btn btn-outline" onClick={load}>
          <FaSyncAlt /> Actualizar
        </button>
      </section>

      {selected && (
        <section className="admin-product-form-card admin-order-detail-card">
          <div className="admin-product-form-title">
            <h2>{selected.numero_orden || `Pedido #${selected.id}`}</h2>

            <span className={`admin-status ${selected.estado === "cancelado" ? "off" : "on"}`}>
              {selected.estado}
            </span>
          </div>

          <div className="admin-order-detail-grid">
            <p><strong>Cliente:</strong> {selected.nombre_receptor || "N/A"}</p>
            <p><strong>Teléfono:</strong> {selected.telefono || "N/A"}</p>
            <p><strong>Provincia:</strong> {selected.provincia || "N/A"}</p>
            <p><strong>Dirección:</strong> {selected.direccion || "N/A"}</p>
            <p><strong>Método:</strong> {selected.metodo_pago || "N/A"}</p>
            <p><strong>Total:</strong> ${Number(selected.monto_total || 0).toFixed(2)}</p>
          </div>

          <h3>Productos</h3>

          <div className="admin-order-items">
            {(selected.items_pedido || []).map((item) => (
              <div className="admin-order-item" key={item.id || item.nombre_producto}>
                <span>{item.nombre_producto}</span>
                <strong>x{item.cantidad}</strong>
                <strong>${Number(item.subtotal || 0).toFixed(2)}</strong>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="admin-products-grid">
        {orders.length === 0 ? (
          <div className="admin-products-loading">No hay pedidos registrados.</div>
        ) : (
          orders.map((order) => (
            <article className="admin-product-card admin-order-card" key={order.id}>
              <div className="admin-stat-icon">
                <FaShoppingCart />
              </div>

              <div className="admin-product-info">
                <div className="admin-product-top">
                  <h3>{order.numero_orden || `Pedido #${order.id}`}</h3>

                  <span className={`admin-status ${order.estado === "cancelado" ? "off" : "on"}`}>
                    {order.estado}
                  </span>
                </div>

                <p>
                  Cliente: {order.nombre_receptor || "No registrado"} | Total: $
                  {Number(order.monto_total || 0).toFixed(2)}
                </p>

                <div className="admin-product-meta">
                  <span>{order.metodo_pago || "Sin método"}</span>
                  <span>{order.provincia || "Sin provincia"}</span>
                  <span>
                    {order.creado_en
                      ? new Date(order.creado_en).toLocaleDateString()
                      : "Sin fecha"}
                  </span>
                </div>

                <div className="admin-order-status-row">
                  <select
                    value={order.estado || "pendiente"}
                    disabled={updatingId === order.id}
                    onChange={(e) => updateStatus(order, e.target.value)}
                  >
                    {ESTADOS.map((estado) => (
                      <option key={estado} value={estado}>
                        {estado}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="admin-product-card-actions">
                  <button onClick={() => viewDetail(order.id)}>
                    <FaEye /> Ver detalle
                  </button>

                  <button
                    onClick={() =>
                      order.telefono &&
                      window.open(`https://wa.me/593${String(order.telefono).replace(/^0/, "")}`, "_blank")
                    }
                  >
                    <FaWhatsapp /> WhatsApp
                  </button>

                  <button className="danger" onClick={() => deleteOrder(order.id)}>
                    <FaTrash /> Eliminar
                  </button>
                </div>
              </div>
            </article>
          ))
        )}
      </section>
    </div>
  );
}