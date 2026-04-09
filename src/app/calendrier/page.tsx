"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import EditableText from "@/components/EditableText";

interface CalendarEntry {
  id: string;
  entry_date: string;
  content: string;
  is_birthday: boolean;
}

interface CalendarImage {
  id: string;
  entry_date: string;
  image_url: string;
  sort_order: number;
}

const MONTH_NAMES = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

const DAY_HEADERS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export default function CalendriePage() {
  const [entries, setEntries] = useState<Record<string, CalendarEntry>>({});
  const [images, setImages] = useState<Record<string, CalendarImage[]>>({});

  useEffect(() => {
    const fetchData = async () => {
      const { data: calendarEntries } = await supabase
        .from("calendar_entries")
        .select("*");

      const { data: calendarImages } = await supabase
        .from("calendar_images")
        .select("*");

      const entriesMap: Record<string, CalendarEntry> = {};
      (calendarEntries || []).forEach((entry) => {
        entriesMap[entry.entry_date] = entry;
      });
      setEntries(entriesMap);

      const imagesMap: Record<string, CalendarImage[]> = {};
      (calendarImages || []).forEach((image) => {
        if (!imagesMap[image.entry_date]) {
          imagesMap[image.entry_date] = [];
        }
        imagesMap[image.entry_date].push(image);
      });
      setImages(imagesMap);
    };

    fetchData();
  }, []);

  const handleUpdate = async () => {
    const { data: calendarEntries } = await supabase
      .from("calendar_entries")
      .select("*");

    const entriesMap: Record<string, CalendarEntry> = {};
    (calendarEntries || []).forEach((entry) => {
      entriesMap[entry.entry_date] = entry;
    });
    setEntries(entriesMap);
  };

  const getDaysInMonth = (month: number, year: number) =>
    new Date(year, month + 1, 0).getDate();

  const getFirstDayOfMonth = (month: number, year: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Monday = 0
  };

  const year = 2026;

  const dateStr = (month: number, day: number) =>
    `2026-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const renderMonth = (month: number) => {
    const daysInMonth = getDaysInMonth(month, year);
    const firstDay = getFirstDayOfMonth(month, year);

    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let day = 1; day <= daysInMonth; day++) cells.push(day);

    return (
      <div key={month} className="cal-month">
        <div className="cal-month-title">{MONTH_NAMES[month]} {year}</div>
        <div className="cal-grid">
          {DAY_HEADERS.map((d) => (
            <div key={d} className="cal-header">{d}</div>
          ))}
          {cells.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="cal-day empty" />;
            }
            const ds = dateStr(month, day);
            const entry = entries[ds];
            const dayOfWeek = (firstDay + day - 1) % 7;
            const isWeekend = dayOfWeek >= 5;

            return (
              <div
                key={ds}
                className={`cal-day ${isWeekend ? "weekend" : ""}`}
              >
                <div className="day-num">
                  {day}
                  {entry?.is_birthday && <span>🎂</span>}
                </div>
                <div className="day-content">
                  {entry && (
                    <EditableText
                      table="calendar_entries"
                      id={entry.id}
                      field="content"
                      value={entry.content || ""}
                      onUpdate={handleUpdate}
                    />
                  )}
                </div>
                {images[ds] && images[ds].length > 0 && (
                  <div style={{ marginTop: "4px" }}>
                    {images[ds].map((img) => (
                      <img
                        key={img.id}
                        src={img.image_url}
                        alt=""
                        style={{
                          width: "100%",
                          maxHeight: "80px",
                          objectFit: "cover",
                          borderRadius: "6px",
                          marginBottom: "2px",
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // April (3) to December (11)
  const months = [3, 4, 5, 6, 7, 8, 9, 10, 11];

  return (
    <div className="bg-calendrier min-h-screen">
      <div className="page-header calendrier">
        <h1>Calendrier de Cédric</h1>
        <p>Avril — Décembre 2026</p>
      </div>

      <div className="instructions" style={{ color: "#6B7B8D" }}>
        <strong style={{ color: "#556573" }}>Comment ça marche ?</strong><br />
        Clique dans une case pour écrire. Les anniversaires sont marqués avec 🎂.
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 20px 60px" }}>
        {months.map((m) => renderMonth(m))}
      </div>

      <footer className="app-footer" style={{ color: "#6B7B8D" }}>
        <span className="heart" style={{ color: "#6B7B8D" }}>❤️</span>
        <br />
        Fait avec amour pour Cédric
      </footer>
    </div>
  );
}
