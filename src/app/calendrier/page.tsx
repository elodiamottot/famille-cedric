"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PhotoSlot from "@/components/PhotoSlot";
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

export default function CalendriePage() {
  const [entries, setEntries] = useState<Record<string, CalendarEntry>>({});
  const [images, setImages] = useState<Record<string, CalendarImage[]>>({});
  const [currentMonth, setCurrentMonth] = useState(3); // April

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

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  const year = 2026;
  const daysInMonth = getDaysInMonth(currentMonth, year);
  const firstDay = getFirstDayOfMonth(currentMonth, year);

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day);
  }

  const dateStr = (day: number) =>
    `2026-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(
      2,
      "0"
    )}`;

  return (
    <div className="section-calendar min-h-screen rounded-lg p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
        Calendrier 2026
      </h1>

      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() =>
            setCurrentMonth((m) => (m === 0 ? 11 : m - 1))
          }
          className="px-6 py-3 bg-teal-500 text-white rounded-lg font-bold text-xl hover:bg-teal-600"
          aria-label="Mois précédent"
        >
          ←
        </button>
        <h2 className="text-3xl font-bold text-gray-800">
          {monthNames[currentMonth]}
        </h2>
        <button
          onClick={() =>
            setCurrentMonth((m) => (m === 11 ? 0 : m + 1))
          }
          className="px-6 py-3 bg-teal-500 text-white rounded-lg font-bold text-xl hover:bg-teal-600"
          aria-label="Mois suivant"
        >
          →
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 overflow-x-auto">
        <div className="grid grid-cols-7 gap-2 min-w-max">
          {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((day) => (
            <div
              key={day}
              className="w-40 font-bold text-center py-2 bg-teal-100 rounded"
            >
              {day}
            </div>
          ))}

          {days.map((day, idx) => (
            <div
              key={idx}
              className={`
                w-40 min-h-48 border rounded-lg p-3 flex flex-col gap-2
                ${
                  day === null
                    ? "bg-gray-100"
                    : "bg-white hover:bg-blue-50 transition-colors"
                }
              `}
            >
              {day !== null && (
                <>
                  <div className="font-bold text-lg text-gray-800">
                    {day}
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    {entries[dateStr(day)]?.is_birthday && (
                      <div className="text-2xl">🎂</div>
                    )}
                    <EditableText
                      table="calendar_entries"
                      id={entries[dateStr(day)]?.id || ""}
                      field="content"
                      value={entries[dateStr(day)]?.content || ""}
                      className="text-sm text-gray-700 flex-1 rounded bg-gray-50 p-2"
                      onUpdate={handleUpdate}
                    />
                  </div>
                  {images[dateStr(day)] && images[dateStr(day)].length > 0 && (
                    <div className="pt-2 border-t">
                      <div className="text-xs font-semibold text-gray-600 mb-1">
                        Photos
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {images[dateStr(day)].map((img) => (
                          <PhotoSlot
                            key={img.id}
                            table="calendar_images"
                            id={img.id}
                            field="image_url"
                            label={`Photo ${img.sort_order}`}
                            currentUrl={img.image_url}
                            size="sm"
                            onUpdate={handleUpdate}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
