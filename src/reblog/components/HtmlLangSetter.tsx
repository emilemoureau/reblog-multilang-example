'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function HtmlLangSetter() {
  const pathname = usePathname();
  
  useEffect(() => {
    // Determine language based on pathname
    let lang = 'en';
    if (pathname.startsWith('/fr')) lang = 'fr';
    if (pathname.startsWith('/es')) lang = 'es';
    if (pathname.startsWith('/de')) lang = 'de';
    
    // Set the lang attribute on the html element
    document.documentElement.lang = lang;
  }, [pathname]);
  
  // This component doesn't render anything
  return null;
}