'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type LangLinkProps = {
  href: string;
  label: string;
  lang: string;
};

export default function LangLink({ href, label, lang }: LangLinkProps) {
  const pathname = usePathname();
  
  // Check if current path has a language prefix
  const hasLangPrefix = /^\/(fr|es|de)($|\/)/.test(pathname);
  
  // If the language is English and there's no language prefix, or
  // if the path starts with the language code for other languages
  const isActive = (lang === 'en' && !hasLangPrefix) || 
                   (lang !== 'en' && pathname.startsWith(`/${lang}`));
  
  return (
    <Link 
      href={href} 
      className={`px-2 py-1 text-xs rounded ${
        isActive
          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-medium" 
          : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
      }`}
    >
      {label}
    </Link>
  );
} 