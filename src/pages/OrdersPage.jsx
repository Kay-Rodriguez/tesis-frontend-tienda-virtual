import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../helpers/api";

export function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadOrders = async () => {
    setLoading(true);

    try {
      const res = await apiRequest("/orders/history");

      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.pedidos)
        ? res.pedidos
        : Array.isArray(res?.orders)
        ? res.orders
        : [];

      setOrders(list);
    } catch (err) {
      console.error("Error cargando pedidos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) {
    return <div className="card">Cargando pedidos...</div>;
  }

  if (!orders.length) {
    return (
      <div className="card">
        <h2>No tienes pedidos aún</h2>
        <p>Cuando realices compras aparecerán aquí.</p>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          Ir al catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1>Mis pedidos</h1>

      <div className="orders-list">
        {orders.map((order) => (
          <div className="order-card" key={order.id}>
            <div className="order-header">
              <span className="order-id">
                {order.numero_orden || `Pedido #${order.id}`}
              </span>

              <span className={`order-status order-status-${order.estado}`}>
                {order.estado}
              </span>
            </div>

            <div className="order-body">
              <div>
                Monto total: ${Number(order.monto_total || 0).toFixed(2)}
              </div>

              <div className="order-date">
                {order.creado_en
                  ? new Date(order.creado_en).toLocaleDateString()
                  : "Sin fecha"}
              </div>
            </div>

            {order.items?.length > 0 && (
              <div className="order-items-mini">
                {order.items.map((item, index) => (
                  <div key={index}>
                    {item.nombre_producto} x{item.cantidad} — $
                    {Number(item.subtotal || 0).toFixed(2)}
                  </div>
                ))}
              </div>
            )}

            <button
              className="btn btn-outline"
              onClick={() => navigate(`/orders/${order.id}`)}
            >
              Ver detalles →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}