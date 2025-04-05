'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type AltLang = {
  lang: string;
  handle: string;
};

interface LanguageNotificationProps {
  currentLang: string;
  alt_langs: AltLang[];
  handle: string;
}

const LanguageNotification = ({ currentLang, alt_langs, handle }: LanguageNotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [browserLang, setBrowserLang] = useState('');
  const [targetLang, setTargetLang] = useState<AltLang | null>(null);

  useEffect(() => {
    // Client-side only code
    if (typeof window === 'undefined') return;
    
    try {
      // Get browser language (first two characters for language code)
      const browserLanguage = navigator.language.split('-')[0].toLowerCase();
      setBrowserLang(browserLanguage);
  
      // Check if alt_langs contains the browser language and it's not the current language
      if (alt_langs && Array.isArray(alt_langs) && alt_langs.length > 0 && currentLang) {
        
        const matchingLang = alt_langs.find(
          lang => lang && lang.lang && lang.lang.toLowerCase() === browserLanguage.toLowerCase() && 
                  currentLang.toLowerCase() !== browserLanguage.toLowerCase()
        );
        
        if (matchingLang) {
          setTargetLang(matchingLang);
          // Check if user has previously dismissed this notification
          const dismissed = localStorage.getItem(`lang_notification_dismissed_${handle}`);
          if (!dismissed) {
            setIsVisible(true);
          }
        }
      }
    } catch {
      // Error handling silently
    }
  }, [alt_langs, currentLang, handle]);

  const handleDismiss = () => {
    setIsVisible(false);
    // Save dismissal in localStorage to prevent showing again for this article
    try {
      localStorage.setItem(`lang_notification_dismissed_${handle}`, 'true');
    } catch {
      // Error handling silently
    }
  };

  if (!isVisible || !targetLang) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 max-w-[600px] bg-blue-600 text-white p-2 rounded-md shadow-lg z-50 pl-8 pr-8">
      <div className="flex justify-between items-center space-x-3">
        <div className="text-sm">
          <span>Want to see this article in your language? </span>
          <Link
            href={"/" + targetLang.handle}
            className="font-bold underline hover:text-blue-100"
          >
            View in {browserLang === 'en' ? 'English' : 
                     browserLang === 'fr' ? 'Français' : 
                     browserLang === 'es' ? 'Español' : 
                     browserLang === 'de' ? 'Deutsch' : browserLang}
          </Link>
        </div>
        <button 
          onClick={handleDismiss}
          className="p-1 rounded-full hover:bg-blue-700 focus:outline-none"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default LanguageNotification; 