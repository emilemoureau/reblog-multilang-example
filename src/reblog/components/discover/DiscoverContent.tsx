'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import DiscoverNav from './DiscoverNav';
import Pagination from '../shared/Pagination';

interface DiscoverContentProps {
  activeCategory: string;
  currentPage: number;
  hasMore?: boolean;
  lang?: string;
  children: React.ReactNode;
}

export default function DiscoverContent({ 
  activeCategory, 
  currentPage, 
  hasMore = false,
  lang,
  children
}: DiscoverContentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategoryChange = (category: string) => {
    // Create new URL with the selected category, reset to page 1
    const params = new URLSearchParams(searchParams);
    params.set('category', category);
    params.set('page', '1'); // Reset to page 1 when changing category
    
    // Navigate to the new URL
    if (lang && lang !== 'en') {
      router.push(`/${lang}/discover?${params.toString()}`);
    } else {
      router.push(`/discover?${params.toString()}`);
    }
  };

  const handlePageChange = (page: number) => {
    // Create new URL with the selected page
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    
    // Navigate to the new URL
    if (lang && lang !== 'en') {
      router.push(`/${lang}/discover?${params.toString()}`);
    } else {
      router.push(`/discover?${params.toString()}`);
    }
  };

  return (
    <>
      <DiscoverNav 
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />
      {children}
      <Pagination 
        currentPage={currentPage}
        hasMore={hasMore}
        onPageChange={handlePageChange}
      />
    </>
  );
}