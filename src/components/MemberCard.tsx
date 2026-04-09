"use client";

import { useState } from "react";
import PhotoSlot from "./PhotoSlot";
import EditableText from "./EditableText";

interface Member {
  id: string;
  name: string;
  relation: string;
  layout: "full" | "simple" | "full-simple";
  photo_avant: string | null;
  photo_apres: string | null;
  photo_signe: string | null;
  photo_single: string | null;
  card_class: string | null;
}

interface Companion {
  id: string;
  name: string;
  photo: string | null;
  signe: string | null;
  type: "photo" | "both" | "emoji";
}

interface MemberCardProps {
  member: Member;
  companions?: Companion[];
  sectionColor: string;
  onUpdate?: () => void;
}

export default function MemberCard({
  member,
  companions = [],
  sectionColor,
  onUpdate,
}: MemberCardProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUpdate = () => {
    setRefreshKey((k) => k + 1);
    onUpdate?.();
  };

  const isWide = member.card_class === "wide-card";

  const renderPhotoLayout = () => {
    switch (member.layout) {
      case "full":
        return (
          <div className="flex gap-4">
            <div className="flex flex-col gap-4">
              <PhotoSlot
                key={`${refreshKey}-avant`}
                table="members"
                id={member.id}
                field="photo_avant"
                label="Avant"
                currentUrl={member.photo_avant}
                size="lg"
                onUpdate={handleUpdate}
              />
              <PhotoSlot
                key={`${refreshKey}-apres`}
                table="members"
                id={member.id}
                field="photo_apres"
                label="Après"
                currentUrl={member.photo_apres}
                size="lg"
                onUpdate={handleUpdate}
              />
            </div>
            <PhotoSlot
              key={`${refreshKey}-signe`}
              table="members"
              id={member.id}
              field="photo_signe"
              label="Signé"
              currentUrl={member.photo_signe}
              size="lg"
              onUpdate={handleUpdate}
            />
          </div>
        );
      case "simple":
        return (
          <PhotoSlot
            key={`${refreshKey}-single`}
            table="members"
            id={member.id}
            field="photo_single"
            label="Photo"
            currentUrl={member.photo_single}
            size="lg"
            onUpdate={handleUpdate}
          />
        );
      case "full-simple":
        return (
          <div className="flex gap-4 flex-wrap">
            <div className="flex flex-col gap-4">
              <PhotoSlot
                key={`${refreshKey}-avant`}
                table="members"
                id={member.id}
                field="photo_avant"
                label="Avant"
                currentUrl={member.photo_avant}
                size="lg"
                onUpdate={handleUpdate}
              />
              <PhotoSlot
                key={`${refreshKey}-apres`}
                table="members"
                id={member.id}
                field="photo_apres"
                label="Après"
                currentUrl={member.photo_apres}
                size="lg"
                onUpdate={handleUpdate}
              />
            </div>
            <PhotoSlot
              key={`${refreshKey}-single`}
              table="members"
              id={member.id}
              field="photo_single"
              label="Simple"
              currentUrl={member.photo_single}
              size="lg"
              onUpdate={handleUpdate}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`
        bg-white rounded-lg shadow-md p-6 border-l-8
        ${sectionColor}
        ${isWide ? "col-span-2" : ""}
      `}
    >
      <div className="mb-6">
        <EditableText
          key={`${refreshKey}-name`}
          table="members"
          id={member.id}
          field="name"
          value={member.name}
          className="text-2xl font-bold text-gray-800 mb-2"
          onUpdate={handleUpdate}
        />
        <EditableText
          key={`${refreshKey}-relation`}
          table="members"
          id={member.id}
          field="relation"
          value={member.relation}
          className="text-sm text-gray-600"
          onUpdate={handleUpdate}
        />
      </div>

      <div className="mb-6">{renderPhotoLayout()}</div>

      {companions.length > 0 && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">
            Compagnons
          </h4>
          <div className="flex flex-wrap gap-3">
            {companions.map((companion) => (
              <div
                key={companion.id}
                className="flex flex-col items-center gap-2"
              >
                {companion.type === "photo" || companion.type === "both" ? (
                  <PhotoSlot
                    table="companions"
                    id={companion.id}
                    field="photo"
                    label={companion.name}
                    currentUrl={companion.photo}
                    size="sm"
                    onUpdate={handleUpdate}
                  />
                ) : null}
                <span className="text-xs text-gray-600 max-w-[140px] text-center">
                  {companion.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
