'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-800">404</h1>
      <h2 className="mt-8 text-2xl font-bold text-gray-800 dark:text-white">
        Page Non Trouvée
      </h2>
      <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-md">
        Désolé, nous n'avons pas pu trouver la page que vous cherchez. Elle a peut-être été déplacée ou supprimée.
      </p>
      <div className="mt-8">
        <Link
          href="/fr"
          className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
        >
          Retour à l'Accueil
        </Link>
      </div>
    </div>
  );
} 