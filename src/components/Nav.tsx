"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + "/");
  };

  const navItems = [
    { href: "/", label: "👨‍👩‍👧‍👦", name: "Trombi", color: "bg-yellow-100" },
    { href: "/larnay", label: "🏫", name: "Larnay", color: "bg-purple-100" },
    { href: "/signaire", label: "🤟", name: "Signaire", color: "bg-teal-100" },
    {
      href: "/calendrier",
      label: "📅",
      name: "Calendrier",
      color: "bg-slate-100",
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-40">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-around">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex flex-col items-center justify-center gap-1
              w-20 h-20 rounded-lg
              transition-all duration-200
              ${
                isActive(item.href)
                  ? `${item.color} ring-4 ring-offset-2 ring-offset-white scale-110`
                  : "hover:opacity-80"
              }
              touch-target
            `}
            aria-label={item.name}
            title={item.name}
          >
            <span className="text-4xl">{item.label}</span>
            <span className="text-xs font-semibold text-gray-700">
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
