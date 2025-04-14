import ArticleCard from '@/reblog/components/articles/ArticleCard';
import ArticlePagination from '@/reblog/components/articles/ArticlePagination';
import { Article } from '@/reblog/services/articles';

interface ArticleListProps {
  lang?: string;
  articles: Article[] | { articles: Article[] };
  title?: string;
  description?: string;
  categoryPath?: string;
  emptyMessage?: string;
  currentPage?: number;
  hasMore?: boolean;
  paginationDisabled?: boolean;
}

export default function ArticleList({
  lang = 'en',
  articles = [], 
  title = 'Articles', 
  description,
  categoryPath = 'guides',
  emptyMessage = 'No articles found.',
  currentPage = 1,
  hasMore = false,
  paginationDisabled = false
}: ArticleListProps) {
  // Handle both formats: array of articles or object with articles property
  const articlesArray = Array.isArray(articles) 
    ? articles 
    : (articles.articles || []);

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-8">
        {title}
      </h1>
      
      {description && (
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {description}
        </p>
      )}
      
      {articlesArray.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articlesArray.map((article) => (
              <ArticleCard
                key={article.id || article.handle || Math.random().toString()}
                lang={lang}
                article={article}
                categoryPath={categoryPath}
              />
            ))}
          </div>
          
          {!paginationDisabled && (
            <ArticlePagination 
              currentPage={currentPage}
              hasMore={hasMore}
              categoryPath={categoryPath}
            />
          )}
        </>
      )}
    </div>
  );
} 