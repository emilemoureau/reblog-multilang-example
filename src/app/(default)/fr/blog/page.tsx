import { CategoryPage } from '@/reblog/modules/categoryPage';
import { generateSimpleMetadata } from '@/reblog/utils/generateMetadata';

export const metadata = generateSimpleMetadata(
  'Blog', 
  'Helpful blog posts on various topics'
);

type BlogPageProps = {
  searchParams: Promise<Record<string, string | string[]>>;
};

export default async function BlogPageFR({ searchParams }: BlogPageProps) {
  // Await searchParams before using it
  const params = await searchParams;
  
  return (
    <CategoryPage
      searchParams={params}
      category="blog"
      title="Blog"
      description="Helpful blog posts on various topics"
      emptyMessage="No blog posts found"
      lang="FR"
    />
  );
} 