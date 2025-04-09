import ArticleList from '@/components/articles/ArticleList';
import DiscoverContent from '@/components/discover/DiscoverContent';
import { getArticlesList } from '@/reblog/services/articles';

export const metadata = {
  title: 'Découvrir - Reblog',
  description: 'Guides et articles utiles sur divers sujets'
};

// Constants for pagination
const ITEMS_PER_PAGE = 3;

type DiscoverPageProps = {
  searchParams: Promise<Record<string, string | string[]>>;
};

const lang = 'fr';

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
  const articlesResponse = await getArticlesList(category, "FR", offset, ITEMS_PER_PAGE);
  
  // Get total count from the API response
  /* const totalItems = articlesResponse.total || 0; */
  
  // Check if there are more articles available
  const hasMore = false; // Simplified since the API doesn't provide this information

  // Titles for different categories
  const categoryTitles = {
    all: "Tout le Contenu",
    blog: "Articles de Blog",
    guides: "Guides & Tutoriels"
  };

  return (
    <div className='pb-12'>
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-8 text-center">
        Découvrir
      </h1>
      
      <DiscoverContent 
        activeCategory={category}
        currentPage={currentPage}
        hasMore={hasMore}
        lang={lang}
      >
        <ArticleList
          lang={lang}
          articles={articlesResponse}
          title={categoryTitles[category as keyof typeof categoryTitles] || "Tout le Contenu"}
          categoryPath={category}
          emptyMessage={`Aucun ${category === 'all' ? 'contenu' : category} trouvé. Revenez plus tard pour du nouveau contenu.`}
          paginationDisabled={true}
        />
      </DiscoverContent>
    </div>
  );
}