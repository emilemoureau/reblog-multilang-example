interface DiscoverNavProps {
  onCategoryChange: (category: string) => void;
  activeCategory: string;
}

export default function DiscoverNav({ onCategoryChange, activeCategory }: DiscoverNavProps) {
  const categories = [
    { id: 'all', label: 'All' },
    { id: 'blog', label: 'Blog' },
    { id: 'guides', label: 'Guides' }
  ];

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-4 justify-center">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all cursor-pointer
              ${activeCategory === category.id 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
} 