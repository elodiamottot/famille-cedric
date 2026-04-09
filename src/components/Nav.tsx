"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", key: "trombi", emoji: "👨‍👩‍👧‍👦", label: "Trombinoscope" },
    { href: "/larnay", key: "larnay", emoji: "🏫", label: "Larnay" },
    { href: "/signaire", key: "signaire", emoji: "🤟", label: "Signaire" },
    { href: "/calendrier", key: "calendrier", emoji: "📅", label: "Calendrier" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="nav-bar">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`nav-pill ${
            isActive(item.href)
              ? `active-${item.key}`
              : "inactive"
          }`}
        >
          {item.emoji} {item.label}
        </Link>
      ))}
    </nav>
  );
}
