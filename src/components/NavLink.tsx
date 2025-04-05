'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavLinkProps = {
  href: string;
  label: string;
};

export default function NavLink({ href, label }: NavLinkProps) {
  const pathname = usePathname();
  
  const isActive = pathname === href;
  
  return (
    <Link 
      href={href} 
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        isActive
          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800/50"
      }`}
    >
      {label}
    </Link>
  );
} 