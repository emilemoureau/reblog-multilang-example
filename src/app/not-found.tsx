'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function NotFound() {
  const pathname = usePathname();
  const [langPrefix, setLangPrefix] = useState('');
  
  useEffect(() => {
    // Determine language based on pathname
    if (pathname.startsWith('/fr')) setLangPrefix('/fr');
    else if (pathname.startsWith('/es')) setLangPrefix('/es');
    else if (pathname.startsWith('/de')) setLangPrefix('/de');
  }, [pathname]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-800">404</h1>
      <h2 className="mt-8 text-2xl font-bold text-gray-800 dark:text-white">
        Page Not Found
      </h2>
      <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-md">
        Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
      </p>
      <div className="mt-8">
        <Link
          href={langPrefix || '/'}
          className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
} 