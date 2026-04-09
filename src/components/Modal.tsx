"use client";

import Image from "next/image";

interface ModalProps {
  isOpen: boolean;
  imageUrl: string;
  label?: string;
  onClose: () => void;
  onReplace: () => void;
}

export default function Modal({
  isOpen,
  imageUrl,
  label,
  onClose,
  onReplace,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Fermer"
        >
          ✕
        </button>

        <Image
          src={imageUrl}
          alt={label || "Photo agrandie"}
          width={800}
          height={600}
          style={{ width: "100%", maxHeight: "400px", objectFit: "contain", borderRadius: "16px", background: "#f5f5f5" }}
          unoptimized={imageUrl?.endsWith(".gif")}
        />

        {label && <div className="modal-name">{label}</div>}

        <div style={{ marginTop: "14px", display: "flex", gap: "10px", justifyContent: "center" }}>
          <button
            onClick={onReplace}
            style={{
              padding: "8px 20px",
              border: "none",
              borderRadius: "12px",
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 700,
              fontSize: "0.85em",
              cursor: "pointer",
              background: "#E8845C",
              color: "white",
              transition: "transform 0.2s",
            }}
            aria-label="Remplacer la photo"
          >
            📷 Remplacer
          </button>
          <button
            onClick={onClose}
            style={{
              padding: "8px 20px",
              border: "none",
              borderRadius: "12px",
              fontFamily: "'Nunito', sans-serif",
              fontWeight: 700,
              fontSize: "0.85em",
              cursor: "pointer",
              background: "#E0E0E0",
              color: "#555",
              transition: "transform 0.2s",
            }}
            aria-label="Fermer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
