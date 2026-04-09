"use client";

import { useRef, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface EditableTextProps {
  table: string;
  id: string;
  field: string;
  value: string;
  className?: string;
  onUpdate?: () => void;
}

export default function EditableText({
  table,
  id,
  field,
  value,
  className = "",
  onUpdate,
}: EditableTextProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (elementRef.current) {
      elementRef.current.textContent = value;
    }
  }, [value]);

  const handleBlur = async () => {
    if (!elementRef.current) return;

    const newValue = elementRef.current.textContent || "";
    if (newValue === value) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from(table)
        .update({ [field]: newValue })
        .eq("id", id);

      if (error) throw error;
      onUpdate?.();
    } catch (error) {
      console.error("Save failed:", error);
      if (elementRef.current) {
        elementRef.current.textContent = value;
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      elementRef.current?.blur();
    }
  };

  return (
    <div
      ref={elementRef}
      contentEditable
      suppressContentEditableWarning
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={`cursor-text ${className} ${isSaving ? "opacity-50" : ""}`}
      role="textbox"
      tabIndex={0}
    >
      {value}
    </div>
  );
}
