'use client';

interface PaginationProps {
  currentPage: number;
  hasMore?: boolean;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, hasMore = false, onPageChange }: PaginationProps) {
  return (
    <nav className="flex justify-center mt-8" aria-label="Pagination">
      <ul className="inline-flex items-center -space-x-px">
        {/* Previous button */}
        <li>
          <button
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`block px-3 py-2 cursor-pointer ml-0 leading-tight border rounded-l-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 ${
              currentPage === 1
                ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}
          >
            <span className="sr-only">Previous</span>
            ←
          </button>
        </li>
        
        {/* Current Page Number */}
        <li>
          <span className="block px-3 py-2 z-10 text-white border-blue-600 bg-blue-600 border dark:border-blue-500 dark:bg-blue-500">
            {currentPage}
          </span>
        </li>
        
        {/* Next button */}
        <li>
          <button
            onClick={() => hasMore && onPageChange(currentPage + 1)}
            disabled={!hasMore}
            className={`block px-3 py-2 cursor-pointer leading-tight border rounded-r-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 ${
              !hasMore
                ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
            }`}
          >
            <span className="sr-only">Next</span>
            →
          </button>
        </li>
      </ul>
    </nav>
  );
}