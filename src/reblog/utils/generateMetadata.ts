import { Metadata } from 'next';
import site_metadata from '@/reblog/site_metadata';
import { ArticleDetails } from '../services/articles';

/**
 * Generate simple metadata for category pages
 */
export function generateSimpleMetadata(title: string, description: string): Metadata {
  return {
    title: `${title} - Reblog`,
    description
  };
}

/**
 * Generate metadata for article/post pages with advanced SEO features
 */
export async function generateArticleMetadata(post: ArticleDetails | null, notFoundMetadata?: Metadata): Promise<Metadata> {
  if (!post) {
    return notFoundMetadata || {
      title: 'Post Not Found - Reblog',
      description: 'The requested article could not be found'
    };
  }

  // Build language alternates dynamically from alt_langs
  const languageAlternates: Record<string, string> = {};

  // Process alt_langs array if it exists
  if (post.alt_langs && Array.isArray(post.alt_langs)) {
    post.alt_langs.forEach((altLang: { lang: string; handle: string }) => {
      if (altLang.lang && altLang.handle && altLang.status === 'published' && altLang.main === true) {
        languageAlternates['x-default'] = `${site_metadata.site_url}${post.handle}`;
        languageAlternates[altLang.lang.toLowerCase()] = `${site_metadata.site_url}${altLang.handle}`;
      } else if (altLang.lang && altLang.handle && altLang.status === 'published') {
        languageAlternates[altLang.lang.toLowerCase()] = `${site_metadata.site_url}${altLang.handle}`;
      }
    });
  }

  return {
    title: post.meta_title || post.title,
    description: post.meta_description,
    openGraph: post.cover ? {
      images: [{ url: post.cover }]
    } : undefined,
    alternates: {
      canonical: `${site_metadata.site_url}${post.handle}`,
      languages: languageAlternates
    },
    other: {
      'article:published_time': post.date,
      ...(post.modification_date ? { 'article:modified_time': post.modification_date } : {})
    }
  };
} 