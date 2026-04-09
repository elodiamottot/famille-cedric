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
  onUpdate?: () => void;
}

export default function MemberCard({
  member,
  companions = [],
  onUpdate,
}: MemberCardProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUpdate = () => {
    setRefreshKey((k) => k + 1);
    onUpdate?.();
  };

  const isCedric = member.card_class === "cedric-card";
  const isWide = member.card_class === "wide-card";

  const renderPhotoLayout = () => {
    switch (member.layout) {
      case "full":
        return (
          <div className="flex gap-3 justify-center flex-wrap">
            <PhotoSlot
              key={`${refreshKey}-avant`}
              table="members"
              id={member.id}
              field="photo_avant"
              label="Avant"
              currentUrl={member.photo_avant}
              size="lg"
              slotType="avant"
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
              slotType="apres"
              onUpdate={handleUpdate}
            />
            <PhotoSlot
              key={`${refreshKey}-signe`}
              table="members"
              id={member.id}
              field="photo_signe"
              label="Signe"
              currentUrl={member.photo_signe}
              size="lg"
              slotType="signe"
              onUpdate={handleUpdate}
            />
          </div>
        );
      case "simple":
        return (
          <div className="flex justify-center">
            <PhotoSlot
              key={`${refreshKey}-single`}
              table="members"
              id={member.id}
              field="photo_single"
              label="Photo"
              currentUrl={member.photo_single}
              size="lg"
              slotType="photo"
              onUpdate={handleUpdate}
            />
          </div>
        );
      case "full-simple":
        return (
          <div className="flex gap-3 justify-center flex-wrap">
            <PhotoSlot
              key={`${refreshKey}-avant`}
              table="members"
              id={member.id}
              field="photo_avant"
              label="Avant"
              currentUrl={member.photo_avant}
              size="lg"
              slotType="avant"
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
              slotType="apres"
              onUpdate={handleUpdate}
            />
            <PhotoSlot
              key={`${refreshKey}-single`}
              table="members"
              id={member.id}
              field="photo_single"
              label="Photo"
              currentUrl={member.photo_single}
              size="lg"
              slotType="photo"
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
      className={`card ${isCedric ? "cedric-card" : ""}`}
      style={isCedric ? { width: "500px", maxWidth: "100%" } : isWide ? { width: "100%", maxWidth: "870px" } : { width: "420px", maxWidth: "100%" }}
    >
      <EditableText
        key={`${refreshKey}-name`}
        table="members"
        id={member.id}
        field="name"
        value={member.name}
        className="card-name"
        onUpdate={handleUpdate}
      />
      <EditableText
        key={`${refreshKey}-relation`}
        table="members"
        id={member.id}
        field="relation"
        value={member.relation}
        className="card-relation"
        onUpdate={handleUpdate}
      />

      <div className="mb-4">{renderPhotoLayout()}</div>

      {companions.length > 0 && (
        <div className="mini-trombi">
          <div className="mini-trombi-title">Compagnons</div>
          <div className="flex flex-wrap gap-3 justify-center">
            {companions.map((companion) => (
              <div key={companion.id} className="mini-card">
                <div className="mini-name">{companion.name}</div>
                <div className="flex gap-2 justify-center mt-2">
                  {(companion.type === "photo" || companion.type === "both") && (
                    <PhotoSlot
                      table="companions"
                      id={companion.id}
                      field="photo"
                      label={companion.name}
                      currentUrl={companion.photo}
                      size="sm"
                      slotType="photo"
                      onUpdate={handleUpdate}
                    />
                  )}
                  {companion.type === "both" && (
                    <PhotoSlot
                      table="companions"
                      id={companion.id}
                      field="signe"
                      label="Signe"
                      currentUrl={companion.signe}
                      size="sm"
                      slotType="signe"
                      onUpdate={handleUpdate}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
