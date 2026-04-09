"use client";

import Image from "next/image";

interface ModalProps {
  isOpen: boolean;
  imageUrl: string;
  onClose: () => void;
  onReplace: () => void;
}

export default function Modal({
  isOpen,
  imageUrl,
  onClose,
  onReplace,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button
          className="modal-button modal-close"
          onClick={onClose}
          aria-label="Fermer"
        >
          ✕
        </button>

        <Image
          src={imageUrl}
          alt="Photo agrandie"
          width={800}
          height={600}
          className="modal-image"
        />

        <button
          className="modal-button modal-replace"
          onClick={onReplace}
          aria-label="Remplacer la photo"
        >
          Remplacer
        </button>
      </div>
    </div>
  );
}
