import { supabase } from "@/lib/supabase";
import MemberCard from "@/components/MemberCard";

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
  section: string;
  sort_order: number;
}

interface Companion {
  id: string;
  member_id: string;
  name: string;
  photo: string | null;
  signe: string | null;
  type: "photo" | "both" | "emoji";
  sort_order: number;
}

const SECTION_CONFIG = {
  cedric: { title: "⭐ C'est toi !", badge: "coral" },
  parents: { title: "🏠 Les parents d'accueil", badge: "green" },
  siblings: { title: "🌿 Les frères et sœurs d'accueil", badge: "gold" },
  memorial: { title: "🕊️ En mémoire", badge: "memorial" },
};

export default async function TrombiPage() {
  const { data: members } = await supabase
    .from("members")
    .select("*")
    .order("section")
    .order("sort_order");

  const { data: companions } = await supabase
    .from("companions")
    .select("*")
    .order("member_id")
    .order("sort_order");

  const companionsByMember = (companions || []).reduce(
    (acc, comp) => {
      if (!acc[comp.member_id]) acc[comp.member_id] = [];
      acc[comp.member_id].push(comp);
      return acc;
    },
    {} as Record<string, Companion[]>
  );

  const sections = {
    cedric: (members || []).filter((m) => m.section === "cedric"),
    parents: (members || []).filter((m) => m.section === "parents"),
    siblings: (members || []).filter((m) => m.section === "siblings"),
    memorial: (members || []).filter((m) => m.section === "memorial"),
  };

  const renderSection = (
    key: keyof typeof SECTION_CONFIG,
    membersList: Member[]
  ) => {
    if (membersList.length === 0) return null;
    const config = SECTION_CONFIG[key];

    return (
      <section key={key} className="mb-16">
        <div className="text-center mb-8">
          <h2 className={`section-badge ${config.badge}`}>{config.title}</h2>
        </div>
        <div className="cards-grid">
          {membersList.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              companions={companionsByMember[member.id] || []}
            />
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="bg-trombi min-h-screen">
      <div className="page-header trombi">
        <h1>Trombinoscope</h1>
        <p>La famille de Cédric</p>
      </div>

      <div className="instructions" style={{ color: "#8B6050" }}>
        <strong style={{ color: "#C06030" }}>Comment ça marche ?</strong><br />
        Clique sur une photo pour la voir en grand ou la remplacer.<br />
        Clique sur un nom ou un texte pour le modifier.
      </div>

      <div className="pb-16">
        {renderSection("cedric", sections.cedric)}
        {renderSection("parents", sections.parents)}
        {renderSection("siblings", sections.siblings)}
        {renderSection("memorial", sections.memorial)}
      </div>

      <footer className="app-footer" style={{ color: "#B08060" }}>
        <span className="heart" style={{ color: "#E8845C" }}>❤️</span>
        <br />
        Fait avec amour pour Cédric
      </footer>
    </div>
  );
}
