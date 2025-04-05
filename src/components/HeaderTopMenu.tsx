'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import NavLink from "@/components/NavLink";

const en_menu_items = [
  { href: "/", label: "Home" },
  { href: "/discover", label: "Discover" },
  { href: "/guides", label: "Guides" },
  { href: "/blog", label: "Blog" },
];

const fr_menu_items = [
  { href: "/fr", label: "Accueil" },
  { href: "/fr/guides", label: "Guides" },
  { href: "/fr/blog", label: "Blog" },
];

export default function HeaderTopMenu({
  lang = "en"
}) {
  const pathname = usePathname();
  const [currentLang, setCurrentLang] = useState(lang);
  const menu_items = currentLang === "en" ? en_menu_items : fr_menu_items;

  useEffect(() => {
    // Determine language based on pathname
    let detectedLang = 'en';
    if (pathname.startsWith('/fr')) detectedLang = 'fr';
    if (pathname.startsWith('/es')) detectedLang = 'es';
    if (pathname.startsWith('/de')) detectedLang = 'de';
    
    // Update current language if detected from path
    setCurrentLang(detectedLang);
  }, [pathname]);

  return (
    <nav className="flex items-center">
      <ul className="flex space-x-1">
        {menu_items.map((item) => (
          <li key={item.href}>
            <NavLink href={item.href} label={item.label} />
          </li>
        ))}
      </ul>
    </nav>
  );
}