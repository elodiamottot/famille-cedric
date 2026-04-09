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
  cedric: { title: "⭐ C'est toi !", color: "border-yellow-500", bg: "bg-yellow-50" },
  parents: {
    title: "🏠 Les parents d'accueil",
    color: "border-orange-500",
    bg: "bg-orange-50",
  },
  siblings: {
    title: "🌿 Les frères et sœurs d'accueil",
    color: "border-green-500",
    bg: "bg-green-50",
  },
  memorial: { title: "🕊️ En mémoire", color: "border-gray-500", bg: "bg-gray-50" },
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
      <section key={key} className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          {config.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {membersList.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              companions={companionsByMember[member.id] || []}
              sectionColor={config.color}
            />
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="section-trombi min-h-screen rounded-lg p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-12 text-center">
        Trombinoscope
      </h1>

      {renderSection("cedric", sections.cedric)}
      {renderSection("parents", sections.parents)}
      {renderSection("siblings", sections.siblings)}
      {renderSection("memorial", sections.memorial)}
    </div>
  );
}
