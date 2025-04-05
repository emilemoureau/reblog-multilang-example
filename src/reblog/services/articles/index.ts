/**
 * Services related to fetching article data
 */

/**
 * Interface for article data
 */
export interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  language: string;
  handle: string;
  date: string;
  excerpt?: string;
  meta_description?: string;
  author?: {
    name: string;
  };
}

/**
 * Interface for detailed article data
 */
export interface ArticleDetails {
  id: string;
  title: string;
  content?: string;
  md: string;
  category: string;
  language: string;
  handle: string;
  date: string;
  modification_date?: string;
  cover?: string;
  meta_title?: string;
  meta_description?: string;
  recommendations?: Recommendation[];
  alt_langs?: Array<{
    lang: string;
    handle: string;
  }>;
}

/**
 * Interface for recommendation data
 */
export interface Recommendation {
  title: string;
  handle: string;
  date: string;
  cover?: string;
}

/**
 * Fetches articles list based on category and language
 * @param category - The category to fetch articles for
 * @param lang - The language code (EN, FR, etc.)
 * @param page - Page number for pagination
 * @param limit - Number of items per page
 * @returns Array of article objects
 */
export async function getArticlesList(
  category: string, 
  lang: string = 'EN', 
  page: number = 0, 
  limit: number = 10
): Promise<Article[]> {
  try {
    const response = await fetch(
      `https://dashboard.reblog.so/api/external/articles?category=${category}&private_key=${process.env.REBLOG_PRIVATE_API_KEY}&page=${page}&limit=${limit}&lang=${lang}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data: Article[] = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching articles list for ${category}:`, error);
    return [];
  }
}

/**
 * Fetches a single article by its handle
 * @param handle - The article handle/path
 * @returns Article data or null if not found
 */
export async function getArticleDetails(handle: string): Promise<ArticleDetails | null> {
  try {
    const response = await fetch(
      `https://dashboard.reblog.so/api/external/articles?handle=${handle}&private_key=${process.env.REBLOG_PRIVATE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching article details:', error);
    return null;
  }
} 