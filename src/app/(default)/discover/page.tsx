import ArticleList from '@/components/articles/ArticleList';
import DiscoverContent from '@/components/discover/DiscoverContent';
import { getArticlesList } from '@/reblog/services/articles';

export const metadata = {
  title: 'Discover - Reblog',
  description: 'Helpful guides and articles on various topics'
};

// Constants for pagination
const ITEMS_PER_PAGE = 3;

type DiscoverPageProps = {
  searchParams: Promise<Record<string, string | string[]>>;
};

export default async function DiscoverPage({
  searchParams,
}: DiscoverPageProps) {
  // Await searchParams before using it
  const params = await searchParams;
  
  // Get category from query params or default to 'all'
  const category = params.category as string || 'all';
  
  // Parse the page parameter (default to 1 if not provided or invalid)
  const currentPage = parseInt((params.page as string) || '1', 10) || 1;
  
  // Calculate offset for pagination (page is 0-indexed in the API)
  const offset = (currentPage - 1);
  
  // Fetch articles with pagination parameters
  const articlesResponse = await getArticlesList(category, "EN", offset, ITEMS_PER_PAGE);
  
  // Get total count from the API response
  /* const totalItems = articlesResponse.total || 0; */
  
  // Check if there are more articles available
  const hasMore = false; // Simplified since the API doesn't provide this information

  // Titles for different categories
  const categoryTitles = {
    all: "All Content",
    blog: "Blog Posts",
    guides: "Guides & Tutorials"
  };

  return (
    <div className='pb-12'>
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-8 text-center">
        Discover
      </h1>
      
      <DiscoverContent 
        activeCategory={category}
        currentPage={currentPage}
        hasMore={hasMore}
      >
        <ArticleList
          lang="en"
          articles={articlesResponse}
          title={categoryTitles[category as keyof typeof categoryTitles] || "All Content"}
          categoryPath={category}
          emptyMessage={`No ${category === 'all' ? 'content' : category} found. Check back later for new content.`}
          paginationDisabled={true}
        />
      </DiscoverContent>
    </div>
  );
}