import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaBoxOpen } from "react-icons/fa";
import { apiRequest } from "../helpers/api";

export function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDetail() {
      try {
        const data = await apiRequest(`/orders/history/${id}`);
        setOrder(data);
      } catch (err) {
        console.error("Error cargando detalle:", err);
      } finally {
        setLoading(false);
      }
    }

    loadDetail();
  }, [id]);

  if (loading) return <div className="card">Cargando detalle...</div>;

  if (!order) {
    return (
      <div className="card">
        <h2>No se encontró el pedido</h2>
        <button className="btn btn-primary" onClick={() => navigate("/orders")}>
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="order-detail-page">
      <button className="btn btn-outline" onClick={() => navigate("/orders")}>
        <FaArrowLeft /> Volver a mis pedidos
      </button>

      <section className="order-detail-card">
        <h1>{order.numero_orden || `Pedido #${order.id}`}</h1>

        <span className={`order-status order-status-${order.estado}`}>
          {order.estado}
        </span>

        <div className="order-detail-grid">
          <p><strong>Total:</strong> ${Number(order.monto_total || 0).toFixed(2)}</p>
          <p><strong>Método:</strong> {order.metodo_pago}</p>
          <p><strong>Provincia:</strong> {order.provincia || "No registrada"}</p>
          <p><strong>Dirección:</strong> {order.direccion || "No registrada"}</p>
          <p><strong>Teléfono:</strong> {order.telefono || "No registrado"}</p>
          <p><strong>Fecha:</strong> {new Date(order.creado_en).toLocaleDateString()}</p>
        </div>

        <h2>Productos del pedido</h2>

        <div className="order-detail-items">
          {(order.items_pedido || []).map((item, index) => (
            <div className="order-detail-item" key={index}>
              <FaBoxOpen />
              <span>{item.nombre_producto}</span>
              <strong>x{item.cantidad}</strong>
              <strong>${Number(item.subtotal || 0).toFixed(2)}</strong>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}