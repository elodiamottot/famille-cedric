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
  main: { title: "🏫 Larnay", color: "border-purple-500" },
  pros: { title: "👩‍⚕️ Professionnels", color: "border-purple-500" },
  residents: { title: "🧑‍🤝‍🧑 Résidents", color: "border-purple-500" },
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
      <section key={key} className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          {config.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {membersList.map((member) => (
            <div
              key={member.id}
              className={`bg-white rounded-lg shadow-md p-6 border-l-8 ${config.color}`}
            >
              <EditableText
                table="larnay"
                id={member.id}
                field="name"
                value={member.name}
                className="text-2xl font-bold text-gray-800 mb-4"
              />
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2">
                    Photo
                  </p>
                  <PhotoSlot
                    table="larnay"
                    id={member.id}
                    field="photo"
                    label="Photo"
                    currentUrl={member.photo}
                    size="lg"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-2">
                    Signé
                  </p>
                  <PhotoSlot
                    table="larnay"
                    id={member.id}
                    field="signe"
                    label="Signé"
                    currentUrl={member.signe}
                    size="lg"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="section-larnay min-h-screen rounded-lg p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-12 text-center">
        Larnay
      </h1>

      {renderSection("main", sections.main)}
      {renderSection("pros", sections.pros)}
      {renderSection("residents", sections.residents)}
    </div>
  );
}
