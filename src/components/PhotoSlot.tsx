"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Modal from "./Modal";
import { supabase } from "@/lib/supabase";

interface PhotoSlotProps {
  table: string;
  id: string;
  field: string;
  label: string;
  currentUrl: string | null;
  size?: "lg" | "sm";
  slotType?: "avant" | "apres" | "signe" | "gif" | "photo" | "default";
  onUpdate?: () => void;
}

export default function PhotoSlot({
  table,
  id,
  field,
  label,
  currentUrl,
  size = "lg",
  slotType = "default",
  onUpdate,
}: PhotoSlotProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const dimensions =
    size === "lg"
      ? { width: "120px", height: "213px" }
      : { width: "80px", height: "142px" };

  const slotClass = `slot-${slotType}`;
  const iconEmoji = slotType === "signe" || slotType === "gif" ? "🎬" : "📸";

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${table}/${id}/${field}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("photos")
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const publicUrl = supabase.storage
        .from("photos")
        .getPublicUrl(path).data.publicUrl;

      const { error: updateError } = await supabase
        .from(table)
        .update({ [field]: publicUrl })
        .eq("id", id);

      if (updateError) throw updateError;

      onUpdate?.();
      setIsModalOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Erreur lors de l'upload. Réessaie !");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = () => {
    setIsModalOpen(false);
    fileInputRef.current?.click();
  };

  return (
    <>
      {currentUrl ? (
        <div
          className={`photo-slot filled ${slotClass}`}
          style={dimensions}
          onClick={() => setIsModalOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              setIsModalOpen(true);
            }
          }}
        >
          <Image
            src={currentUrl}
            alt={label}
            fill
            className="photo-slot-image"
            style={{ objectFit: "cover" }}
            priority
            unoptimized={currentUrl?.endsWith(".gif")}
          />
          <span className="slot-label">{label}</span>
          <div className="photo-slot-overlay">✏️</div>
        </div>
      ) : (
        <div
          className={`photo-slot ${slotClass}`}
          style={dimensions}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
        >
          <div className="slot-icon-wrap">
            <span className="slot-icon">{iconEmoji}</span>
            <span className="slot-text">{label}</span>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        aria-label={`Télécharger ${label}`}
        disabled={isUploading}
      />

      <Modal
        isOpen={isModalOpen}
        imageUrl={currentUrl || ""}
        label={label}
        onClose={() => setIsModalOpen(false)}
        onReplace={handleEdit}
      />
    </>
  );
}
