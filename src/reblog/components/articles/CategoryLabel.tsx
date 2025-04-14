interface CategoryLabelProps {
  category: string;
}

export default function CategoryLabel({ category }: CategoryLabelProps) {
  // Define styles for different categories
  const categoryStyles: {[key: string]: {bg: string, text: string, icon: string}} = {
    blog: {
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-800 dark:text-blue-300',
      icon: '📝'
    },
    guides: {
      bg: 'bg-emerald-100 dark:bg-emerald-900/30',
      text: 'text-emerald-800 dark:text-emerald-300',
      icon: '📚'
    },
    all: {
      bg: 'bg-gray-100 dark:bg-gray-800',
      text: 'text-gray-800 dark:text-gray-300',
      icon: '📄'
    }
  };

  // Use default style if category is not defined
  const style = categoryStyles[category.toLowerCase()] || categoryStyles.all;
  
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${style.bg} ${style.text}`}>
      <span className="mr-1">{style.icon}</span>
      {category.charAt(0).toUpperCase() + category.slice(1).toLowerCase()}
    </span>
  );
} 