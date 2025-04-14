import ArticleList from '@/reblog/components/articles/ArticleList';
import { Article as ReblogArticle } from '@/reblog/services/articles';

// Constants for pagination
const DEFAULT_ITEMS_PER_PAGE = 3;

interface CategoryPageProps {
  searchParams: { page?: string | string[] };
  category: string;
  title: string;
  description?: string;
  emptyMessage: string;
  itemsPerPage?: number;
  lang?: string;
}

// Our local article interface for the API response
interface ApiArticle {
  id?: string;
  handle: string;
  slug?: string;
  title: string;
  cover?: string;
  meta_description?: string;
  category?: string;
  date?: string;
  content?: string;
  language?: string;
}

interface ArticlesResponse {
  articles: ApiArticle[];
  total: number;
  has_more: boolean;
}

async function fetchArticlesList(
  category: string,
  lang: string = 'EN',
  page: number = 0,
  limit: number = DEFAULT_ITEMS_PER_PAGE
): Promise<ArticlesResponse> {
  try {
    const response = await fetch(
      `https://dashboard.reblog.so/api/external/articles?category=${category}&private_key=${process.env.REBLOG_PRIVATE_API_KEY}&page=${page}&limit=${limit}&lang=${lang}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching articles for ${category}:`, error);
    return { articles: [], total: 0, has_more: false };
  }
}

export async function CategoryPage({
  searchParams,
  category,
  title,
  description,
  emptyMessage,
  itemsPerPage = DEFAULT_ITEMS_PER_PAGE,
  lang = 'EN'
}: CategoryPageProps) {
  // Safely extract and await the page param
  const { page } = await searchParams;
  
  // Parse the page parameter (default to 1 if not provided or invalid)
  const pageValue = Array.isArray(page) ? page[0] : page;
  const currentPage = parseInt(pageValue || '1', 10) || 1;

  // Calculate offset for pagination (page is 0-indexed in the API)
  const offset = (currentPage - 1);

  // Fetch articles with pagination parameters
  const apiResponse = await fetchArticlesList(category, lang, offset, itemsPerPage);

  // Map API articles to the expected Reblog Article format
  const mappedArticles: ReblogArticle[] = apiResponse.articles.map(article => ({
    id: article.id || article.handle, // Ensure id is never undefined
    title: article.title,
    handle: article.handle,
    date: article.date || '',
    content: article.content || '',
    language: article.language || lang,
    category: article.category || category,
    meta_description: article.meta_description,
    cover: article.cover,
  }));

  // Check if there are more articles available
  const hasMore = apiResponse.has_more || false;

  return (
    <div className='pb-12'>
      <ArticleList
        lang={lang}
        articles={mappedArticles}
        title={title}
        description={description}
        categoryPath={category}
        emptyMessage={emptyMessage}
        currentPage={currentPage}
        hasMore={hasMore}
      />
    </div>
  );
} 