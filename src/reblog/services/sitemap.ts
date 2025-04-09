/**
 * Services related to sitemap generation
 */

interface SitemapArticle {
  handle: string;
  date: string;
  edit_date: string;
}

interface SitemapResponse {
  articles: SitemapArticle[];
}

/**
 * Fetches sitemap data from the Reblog API
 * @returns Array of sitemap entries
 */
export async function getSitemapData(): Promise<SitemapResponse> {
  try {
    const response = await fetch(
      `https://dashboard.reblog.so/api/external/articles?sitemap=true&private_key=${process.env.REBLOG_PRIVATE_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data: SitemapResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching sitemap data:', error);
    return { articles: [] };
  }
}

/**
 * Generates XML sitemap content
 * @returns XML string for the sitemap
 */
export async function generateSitemapXml(): Promise<string> {
  const data = await getSitemapData();
  
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  console.log(data);

  data.articles.forEach(article => {
    xml += '  <url>\n';
    xml += `    <loc>${process.env.WEBSITE_URL}/${article.handle}</loc>\n`;
    xml += `    <lastmod>${article.edit_date ? article.edit_date.slice(0, 10) : article.date.slice(0, 10)}</lastmod>\n`;
    xml += '    <changefreq>monthly</changefreq>\n';
    xml += '    <priority>0.8</priority>\n';
    xml += '  </url>\n';
  });

  xml += '</urlset>';
  return xml;
} 