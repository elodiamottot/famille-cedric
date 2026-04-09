export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabase";
import PhotoSlot from "@/components/PhotoSlot";
import EditableText from "@/components/EditableText";

interface LarnayMember {
  id: string;
  name: string;
  section: string;
  photo: string | null;
  signe: string | null;
  sort_order: number;
}

const SECTION_CONFIG = {
  main: { title: "🏫 Larnay", badge: "purple" },
  pros: { title: "👩‍⚕️ Professionnels", badge: "purple" },
  residents: { title: "🧑‍🤝‍🧑 Résidents", badge: "purple" },
};

export default async function LarnayPage() {
  const { data: members } = await supabase
    .from("larnay")
    .select("*")
    .order("section")
    .order("sort_order");

  const sections = {
    main: (members || []).filter((m) => m.section === "main"),
    pros: (members || []).filter((m) => m.section === "pros"),
    residents: (members || []).filter((m) => m.section === "residents"),
  };

  const renderSection = (
    key: keyof typeof SECTION_CONFIG,
    membersList: LarnayMember[]
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
            <div key={member.id} className="vocab-card">
              <EditableText
                table="larnay"
                id={member.id}
                field="name"
                value={member.name}
                className="vocab-name"
                style={{ color: "#7B5EA8" }}
              />
              <div className="flex gap-3 justify-center">
                <PhotoSlot
                  table="larnay"
                  id={member.id}
                  field="photo"
                  label="Photo"
                  currentUrl={member.photo}
                  size="lg"
                  slotType="photo"
                />
                <PhotoSlot
                  table="larnay"
                  id={member.id}
                  field="signe"
                  label="Signe"
                  currentUrl={member.signe}
                  size="lg"
                  slotType="signe"
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="bg-larnay min-h-screen">
      <div className="page-header larnay">
        <h1>Larnay</h1>
        <p>L&apos;institution et les personnes</p>
      </div>

      <div className="instructions" style={{ color: "#7B5EA8" }}>
        <strong>Comment ça marche ?</strong><br />
        Clique sur un emplacement vide pour ajouter une photo ou un signe.
        Clique sur une image existante pour la voir en grand ou la remplacer.
      </div>

      <div className="pb-16">
        {renderSection("main", sections.main)}
        {renderSection("pros", sections.pros)}
        {renderSection("residents", sections.residents)}
      </div>

      <footer className="app-footer" style={{ color: "#9B7EC8" }}>
        <span className="heart" style={{ color: "#9B7EC8" }}>❤️</span>
        <br />
        Fait avec amour pour Cédric
      </footer>
    </div>
  );
}
