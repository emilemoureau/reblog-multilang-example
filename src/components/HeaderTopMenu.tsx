'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import NavLink from "@/components/NavLink";
import LangLink from './LangLink';

const en_menu_items = [
  { href: "/", label: "Home" },
  { href: "/discover", label: "Discover" },
  { href: "/guides", label: "Guides" },
  { href: "/blog", label: "Blog" },
];

const fr_menu_items = [
  { href: "/fr", label: "Accueil" },
  { href: "/fr/discover", label: "Discover" },
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
      <div className="flex space-x-2">
        <LangLink href="/" label="EN" lang="en" />
        <LangLink href="/fr" label="FR" lang="fr" />
      </div>
      <div className="h-5 w-[1px] bg-gray-200 dark:bg-gray-800 mt-0.5 mx-2" />
      <ul className="flex space-x-1">
        <li>
          <a className='px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800/50' href="https://github.com/emilemoureau/reblog-multilang-example" target="_blank" rel="noopener noreferrer">Github
          </a>
        </li>
        {menu_items.map((item) => (
          <li key={item.href}>
            <NavLink href={item.href} label={item.label} />
          </li>
        ))}
      </ul>
    </nav>
  );
}