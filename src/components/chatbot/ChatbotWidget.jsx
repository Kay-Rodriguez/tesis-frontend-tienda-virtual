import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../helpers/api";

export function ChatbotWidget() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hola, soy el asistente de VIT. Puedo ayudarte con productos, precios, stock, envíos y compras contraentrega.",
    },
  ]);

  const productKeywords = [
    "celular",
    "celulares",
    "smartphone",
    "smartphones",
    "telefono",
    "teléfono",
    "audifono",
    "audífono",
    "audifonos",
    "audífonos",
    "cargador",
    "cargadores",
    "laptop",
    "computadora",
    "mouse",
    "teclado",
    "producto",
    "productos",
    "precio",
    "stock",
  ];

  const isProductQuestion = (text) => {
    const q = text.toLowerCase();
    return productKeywords.some((word) => q.includes(word));
  };

  const normalizeSearch = (text) => {
    const q = text.toLowerCase();

    if (q.includes("celular") || q.includes("smartphone") || q.includes("telefono") || q.includes("teléfono")) {
      return "smartphone";
    }

    if (q.includes("audif")) return "aud";
    if (q.includes("cargador")) return "carg";
    if (q.includes("laptop")) return "laptop";
    if (q.includes("mouse")) return "mouse";
    if (q.includes("teclado")) return "teclado";

    return text;
  };

  const searchProducts = async (text) => {
    const search = normalizeSearch(text);

    const products = await apiRequest("/products/filter?disponible=true");

    const filtered = (products || []).filter((p) => {
      const fullText = `${p.nombre || ""} ${p.descripcion || ""} ${p.categorias?.nombre || ""}`.toLowerCase();
      return fullText.includes(search.toLowerCase());
    });

    return filtered.slice(0, 5);
  };

  const sendQuestion = async (text) => {
    if (!text.trim()) return;

    const q = text.trim();
    setQuestion("");
    setMessages((m) => [...m, { from: "user", text: q }]);
    setLoading(true);

    try {
      if (isProductQuestion(q)) {
        const productos = await searchProducts(q);

        if (!productos.length) {
          setMessages((m) => [
            ...m,
            {
              from: "bot",
              text: "No encontré productos disponibles con esa búsqueda. Prueba con otra palabra, por ejemplo: celulares, audífonos, cargadores o laptops.",
            },
          ]);
          return;
        }

        setMessages((m) => [
          ...m,
          {
            from: "bot",
            type: "products",
            text: `Encontré ${productos.length} producto(s) relacionados:`,
            products: productos,
          },
        ]);
        return;
      }

      const data = await apiRequest("/chatbot", {
        method: "POST",
        body: JSON.stringify({ pregunta: q }),
      });

      setMessages((m) => [
        ...m,
        {
          from: "bot",
          text:
            data?.respuesta ||
            "No entendí bien tu pregunta, intenta ser más específico.",
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          from: "bot",
          text: "Hubo un problema al consultar el chatbot. Inténtalo más tarde.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`chatbot-full ${open ? "open" : ""}`}>
      <button className="chatbot-toggle" onClick={() => setOpen(!open)}>
        🤖 Chatbot
      </button>

      <div className="chatbot-full-content">
        <div className="chatbot-header">
          <strong>Tienda VIT</strong>
          <span>Asistente Virtual</span>
        </div>

        <div className="chatbot-body">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`chat-message ${
                m.from === "user" ? "chat-user" : "chat-bot"
              }`}
            >
              <p>{m.text}</p>

              {m.type === "products" && (
                <div className="chatbot-products">
                  {m.products.map((p) => (
                    <div className="chatbot-product-card" key={p.id}>
                      <div className="chatbot-product-img">
                        {p.imagenes_producto?.[0]?.url ? (
                          <img src={p.imagenes_producto[0].url} alt={p.nombre} />
                        ) : (
                          <span>Sin imagen</span>
                        )}
                      </div>

                      <div>
                        <strong>{p.nombre}</strong>
                        <span>${Number(p.precio || 0).toFixed(2)}</span>
                        <small>Stock: {p.stock}</small>

                        <button
                          type="button"
                          onClick={() => navigate(`/product/${p.id}`)}
                        >
                          Ver producto
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && <div className="chat-message chat-bot">Escribiendo...</div>}
        </div>

        <div className="chatbot-input-row">
          <input
            className="input"
            placeholder="Pregunta por celulares, audífonos, precios..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendQuestion(question);
            }}
          />

          <button className="btn btn-primary" onClick={() => sendQuestion(question)}>
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}