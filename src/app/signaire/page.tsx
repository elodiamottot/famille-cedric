"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PhotoSlot from "@/components/PhotoSlot";
import EditableText from "@/components/EditableText";

interface SignaireMember {
  id: string;
  name: string;
  category: string;
  photo: string | null;
  signe: string | null;
  sort_order: number;
}

const TABS = [
  { key: "lieux", label: "📍 Lieux", badge: "teal", subClass: "sub-teal" },
  { key: "aliments", label: "🍽️ Aliments", badge: "pink", subClass: "sub-pink" },
  { key: "trains", label: "🚆 Trains", badge: "blue", subClass: "sub-blue" },
  { key: "personnages", label: "🧑 Personnages", badge: "gold", subClass: "sub-gold" },
];

export default function SignairePage() {
  const [members, setMembers] = useState<SignaireMember[]>([]);
  const [activeTab, setActiveTab] = useState("lieux");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      const { data } = await supabase
        .from("signaire")
        .select("*")
        .order("category")
        .order("sort_order");
      setMembers(data || []);
      setIsLoading(false);
    };
    fetchMembers();
  }, []);

  const handleUpdate = async () => {
    const { data } = await supabase
      .from("signaire")
      .select("*")
      .order("category")
      .order("sort_order");
    setMembers(data || []);
  };

  const currentMembers = (members || []).filter(
    (m) => m.category === activeTab
  );
  const currentTab = TABS.find((t) => t.key === activeTab)!;

  return (
    <div className="bg-signaire min-h-screen">
      <div className="page-header signaire">
        <h1>Signaire</h1>
        <p>Le vocabulaire en signes de Cédric</p>
      </div>

      <div className="instructions" style={{ color: "#4A8F9F" }}>
        <strong>Comment ça marche ?</strong><br />
        Choisis une catégorie ci-dessous, puis clique sur un emplacement pour ajouter
        une photo ou un signe.
      </div>

      {/* Sub-nav */}
      <div className="sub-nav">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`sub-nav-btn ${tab.subClass} ${
              activeTab === tab.key ? "active" : ""
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#4A8F9F" }}>
          Chargement...
        </div>
      ) : (
        <>
          <div className="text-center mt-12 mb-8">
            <h2 className={`section-badge ${currentTab.badge}`}>
              {currentTab.label}
            </h2>
          </div>

          <div className="cards-grid pb-16">
            {currentMembers.map((member) => (
              <div key={member.id} className="vocab-card">
                <EditableText
                  table="signaire"
                  id={member.id}
                  field="name"
                  value={member.name}
                  className="vocab-name"
                  style={{ color: "#4A8F9F" }}
                  onUpdate={handleUpdate}
                />
                <div className="flex gap-3 justify-center">
                  <PhotoSlot
                    table="signaire"
                    id={member.id}
                    field="photo"
                    label="Photo"
                    currentUrl={member.photo}
                    size="lg"
                    slotType="photo"
                    onUpdate={handleUpdate}
                  />
                  <PhotoSlot
                    table="signaire"
                    id={member.id}
                    field="signe"
                    label="Signe"
                    currentUrl={member.signe}
                    size="lg"
                    slotType="signe"
                    onUpdate={handleUpdate}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <footer className="app-footer" style={{ color: "#5BA4B5" }}>
        <span className="heart" style={{ color: "#5BA4B5" }}>❤️</span>
        <br />
        Fait avec amour pour Cédric
      </footer>
    </div>
  );
}
