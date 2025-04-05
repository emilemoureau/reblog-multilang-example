'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type LanguageOption = {
  code: string;
  label: string;
};

const languages: LanguageOption[] = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' }
];

export default function LanguageMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const getCurrentLang = (): string => {
    if (pathname.startsWith('/fr')) return 'fr';
    return 'en';
  };

  const currentLang = getCurrentLang();
  const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[0];

  // Get equivalent path in other language
  const getLocalizedPath = (targetLang: string): string => {
    // If current lang is English and target is French, add /fr prefix
    if (currentLang === 'en' && targetLang === 'fr') {
      return `/fr${pathname}`;
    }
    // If current lang is French and target is English, remove /fr prefix
    else if (currentLang === 'fr' && targetLang === 'en') {
      return pathname.replace(/^\/fr/, '');
    }
    return pathname;
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white px-3 py-2 rounded-lg transition-colors"
      >
        <span className="sr-only">Select Language</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
        </svg>
        <span>{currentLanguage.label}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-10 py-1 ring-1 ring-black ring-opacity-5">
          {languages.map((lang) => (
            <Link
              key={lang.code}
              href={getLocalizedPath(lang.code)}
              className={`block px-4 py-2 text-sm ${
                lang.code === currentLang
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
              onClick={() => setIsOpen(false)}
            >
              {lang.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 