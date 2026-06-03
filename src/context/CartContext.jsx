import React, { createContext, useContext, useState, useEffect } from "react";
import { apiRequest } from "../helpers/api";
import { useAuth } from "./AuthContext";
import { showToast } from "../helpers/toast";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [carritoId, setCarritoId] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadCart = async () => {
    if (!user) {
      setItems([]);
      setCarritoId(null);
      return;
    }

    setLoading(true);
    try {
      const data = await apiRequest("/cart");
      setCarritoId(data.carrito_id);
      setItems(data.items || []);
    } catch (err) {
      showToast(err.message || "Error cargando carrito", "error");
      setItems([]);
      setCarritoId(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, [user]);

  const addToCart = async (productoId, cantidad = 1) => {
    try {
      const res = await apiRequest("/cart", {
        method: "POST",
        body: JSON.stringify({ producto_id: productoId, cantidad }),
      });

      showToast(res?.message || "Producto añadido correctamente", "success");
      await loadCart();
    } catch (err) {
      showToast(err.message || "No se pudo añadir al carrito", "error");
      throw err;
    }
  };

  const updateItem = async (itemId, cantidad) => {
    try {
      const res = await apiRequest(`/cart/${itemId}`, {
        method: "PUT",
        body: JSON.stringify({ cantidad }),
      });

      await loadCart();
    } catch (err) {
      showToast(err.message || "Stock insuficiente", "error");
    }
  };

  const removeItem = async (itemId) => {
    try {
      const res = await apiRequest(`/cart/${itemId}`, { method: "DELETE" });
      showToast(res?.message || "Producto eliminado", "success");
      await loadCart();
    } catch (err) {
      showToast(err.message || "No se pudo eliminar", "error");
    }
  };

  const cartTotal = items.reduce(
    (acc, item) => acc + Number(item.subtotal || 0),
    0
  );

  return (
    <CartContext.Provider
      value={{
        carritoId,
        items,
        loading,
        cartTotal,
        addToCart,
        updateItem,
        removeItem,
        reload: loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}