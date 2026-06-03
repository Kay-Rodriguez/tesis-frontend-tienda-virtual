import React from "react";

export function ProductSlider({ products = [], slideIndex = 0, onClickProduct }) {
  return (
    <div className="home-slider">
      <div className="home-slider-window">
        <div
          className="home-slider-track"
          style={{ transform: `translateX(-${slideIndex * 100}%)` }}
        >
          {products.map((p) => (
            <div
              key={p.id}
              className="home-slide"
              onClick={() => onClickProduct?.(p)}
            >
              <div className="home-slide-image">
                <img src={p.imagenes_producto?.[0]?.url} alt={p.nombre} />
              </div>
              <div className="home-slide-info">
                <h3>{p.nombre}</h3>
                <p>${Number(p.precio).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}