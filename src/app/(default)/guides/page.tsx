import { CategoryPage } from '@/modules/categoryPage';
import { generateSimpleMetadata } from '@/reblog/utils/generateMetadata';

export const metadata = generateSimpleMetadata(
  'Guides',
  'Helpful guides and articles on various topics'
);

type PageProps = {
  searchParams: Promise<Record<string, string | string[]>>;
};

export default async function GuidesPage({ searchParams }: PageProps) {
  // Await searchParams before using it
  const params = await searchParams;
  
  return (
    <CategoryPage
      searchParams={params}
      category="guides"
      title="Guides"
      description="Helpful guides and articles on various topics"
      emptyMessage="No guides found"
    />
  );
}