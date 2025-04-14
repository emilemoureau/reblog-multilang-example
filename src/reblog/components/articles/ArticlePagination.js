'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Pagination from '@/reblog/components/shared/Pagination';

export default function ArticlePagination({ currentPage, hasMore, categoryPath }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page) => {
    // Create new URL with the selected page
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    
    // Navigate to the new URL
    router.push(`/${categoryPath}?${params.toString()}`);
  };

  return (
    <Pagination 
      currentPage={currentPage}
      hasMore={hasMore}
      onPageChange={handlePageChange}
    />
  );
} 