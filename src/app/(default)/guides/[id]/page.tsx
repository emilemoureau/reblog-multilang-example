import { notFound } from 'next/navigation';
import PostLayout from '@/reblog/layouts/PostLayout';
import { getArticleDetails } from '@/reblog/services/articles';
import { generateArticleMetadata } from '@/reblog/utils/generateMetadata';

// This setting controls how frequently Next.js checks for updates to this page
export const revalidate = 300;

type PageProps = {
  params: Promise<{ id: string }>;
};

// Dynamic metadata based on the post
export async function generateMetadata({ params }: PageProps) {
  const resolvedParams = await params;
  const post = await getArticleDetails(`guides/${resolvedParams.id}`);
  return generateArticleMetadata(post);
}

export default async function PostPage({ params }: PageProps) {
  const resolvedParams = await params;
  const post = await getArticleDetails(`guides/${resolvedParams.id}`);

  if (!post) {
    notFound();
  }

  return (
    <div className="relative max-w-7xl mx-auto">
      <PostLayout
        frontMatter={{
          title: post.title,
          date: post.date,
          modification_date: post.modification_date,
          cover: post.cover,
          meta_title: post.meta_title,
          meta_description: post.meta_description,
          handle: post.handle
        }}
        content={post.md}
        breadcrumb_v1_title="Guides"
        breadcrumb_v1_handle="/guides"
        recommendations={post.recommendations}
        lang="en"
        alt_langs={post.alt_langs}
      />
    </div>
  );
}