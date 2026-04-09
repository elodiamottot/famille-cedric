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

const SECTION_CONFIG = {
  lieux: { title: "📍 Lieux", color: "border-teal-500" },
  aliments: { title: "🍽️ Aliments", color: "border-teal-500" },
  trains: { title: "🚆 Trains", color: "border-teal-500" },
};

export default function SignairePage() {
  const [members, setMembers] = useState<SignaireMember[]>([]);
  const [activeTab, setActiveTab] = useState<"lieux" | "aliments" | "trains">(
    "lieux"
  );
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

  const membersByCategory = (members || []).reduce(
    (acc, member) => {
      if (!acc[member.category]) acc[member.category] = [];
      acc[member.category].push(member);
      return acc;
    },
    {} as Record<string, SignaireMember[]>
  );

  const currentMembers = membersByCategory[activeTab] || [];
  const config = SECTION_CONFIG[activeTab as keyof typeof SECTION_CONFIG];

  return (
    <div className="section-signaire min-h-screen rounded-lg p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        Signaire
      </h1>

      <div className="flex justify-center gap-4 mb-12 flex-wrap">
        {(Object.keys(SECTION_CONFIG) as Array<keyof typeof SECTION_CONFIG>).map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                flex items-center gap-2 px-6 py-4 rounded-lg font-bold
                transition-all duration-200 touch-target
                ${
                  activeTab === tab
                    ? "bg-teal-500 text-white ring-4 ring-offset-2 scale-105"
                    : "bg-white text-gray-800 hover:bg-gray-100"
                }
              `}
            >
              <span className="text-2xl">{SECTION_CONFIG[tab].title}</span>
            </button>
          )
        )}
      </div>

      {isLoading ? (
        <div className="text-center text-gray-600">Chargement...</div>
      ) : (
        <section>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            {config.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentMembers.map((member) => (
              <div
                key={member.id}
                className={`bg-white rounded-lg shadow-md p-6 border-l-8 ${config.color}`}
              >
                <EditableText
                  table="signaire"
                  id={member.id}
                  field="name"
                  value={member.name}
                  className="text-2xl font-bold text-gray-800 mb-4"
                  onUpdate={handleUpdate}
                />
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">
                      Photo
                    </p>
                    <PhotoSlot
                      table="signaire"
                      id={member.id}
                      field="photo"
                      label="Photo"
                      currentUrl={member.photo}
                      size="lg"
                      onUpdate={handleUpdate}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-2">
                      Signé
                    </p>
                    <PhotoSlot
                      table="signaire"
                      id={member.id}
                      field="signe"
                      label="Signé"
                      currentUrl={member.signe}
                      size="lg"
                      onUpdate={handleUpdate}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
