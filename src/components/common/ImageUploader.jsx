import React, { useState } from "react";

export function ImageUploader({ onFiles }) {
  const [preview, setPreview] = useState([]);

  const handleFiles = (files) => {
    const arr = Array.from(files);
    onFiles(arr);
    setPreview(arr.map((file) => URL.createObjectURL(file)));
  };

  return (
    <div>
      <div
        className="dropzone"
        onClick={() => document.getElementById("imgInput").click()}
      >
        📤 Arrastra imágenes aquí o haz clic para seleccionar
      </div>

      <input
        id="imgInput"
        type="file"
        multiple
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => handleFiles(e.target.files)}
      />

      {preview.length > 0 && (
        <div className="preview-grid">
          {preview.map((src, i) => (
            <div key={i} className="preview-item">
              <img src={src} alt={`preview-${i}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}