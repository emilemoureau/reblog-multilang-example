import Link from 'next/link';
import Image from 'next/image';
import CategoryLabel from './CategoryLabel';

export default function ArticleCard({ lang = "en", article, categoryPath = 'guides' }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex-shrink-0 relative h-48">
        {article.cover ? (
          <Image
            src={article.cover}
            alt={article.title}
            className="h-full w-full object-cover"
            width={500}
            height={300}
          />
        ) : (
          <div className="h-full w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-gray-400 dark:text-gray-500">No image</span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between bg-white dark:bg-gray-800 p-6">
        <div className="flex-1">
          <div className="mb-3">
            <CategoryLabel category={article.category || categoryPath} />
          </div>
          <Link 
            href={`/${article.handle}`}
            className="block mt-2"
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
              {article.title}
            </h3>
          </Link>
          <p className="mt-3 text-base text-gray-500 dark:text-gray-400 line-clamp-3 h-12">
            {article.excerpt || article.meta_description || 'Read more about this article...'}
          </p>
        </div>
        <div className="mt-6 flex items-center">
          {/* <div className="flex-shrink-0">
            <span className="sr-only">Author</span>
            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-sm font-medium text-gray-500 dark:text-gray-400">
              {article.author?.name?.charAt(0) || 'A'}
            </div>
          </div> */}
          <div /* className="ml-3" */>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {article.author?.name || 'Jane Doe'}
            </p>
            <div className="flex space-x-1 text-sm text-gray-500 dark:text-gray-400">
              {article.date && (
                <time dateTime={article.date}>
                  {new Date(article.date).toLocaleDateString(lang, {
                    year: 'numeric', 
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 