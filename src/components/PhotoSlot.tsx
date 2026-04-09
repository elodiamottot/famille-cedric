"use client";

import { useRef, useState } from "react";
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
  onUpdate?: () => void;
}

export default function PhotoSlot({
  table,
  id,
  field,
  label,
  currentUrl,
  size = "lg",
  onUpdate,
}: PhotoSlotProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const dimensions = size === "lg" ? "w-[180px] h-[160px]" : "w-[140px] h-[130px]";
  const iconSize = size === "lg" ? "text-5xl" : "text-3xl";

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
    } catch (error) {
      console.error("Upload failed:", error);
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
          className={`photo-slot filled ${dimensions}`}
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
            priority
          />
          <div className="photo-slot-overlay">✏️</div>
        </div>
      ) : (
        <div
          className={`photo-slot empty ${dimensions}`}
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
          <div className="flex flex-col items-center gap-2">
            <div className={iconSize}>📸</div>
            <span className="text-xs font-semibold text-gray-600 text-center px-2">
              {label}
            </span>
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
        onClose={() => setIsModalOpen(false)}
        onReplace={handleEdit}
      />
    </>
  );
}
