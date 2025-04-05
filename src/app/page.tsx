import ArticleList from '@/components/articles/ArticleList';
import HeroSections from '@/components/landing/HeroSections';
import { getArticlesList } from '@/reblog/services/articles';

export const metadata = {
  title: 'Guides - Reblog',
  description: 'Helpful guides and articles on various topics'
};

const lang = "EN";

export default async function GuidesPage() {
  const guides = await getArticlesList("guides", lang, 0, 10);
  const blogs = await getArticlesList("blog", lang, 0, 10);

  const heroContent = {
    hero: {
      badge: "Demo Landing Page",
      title: "Build Something Amazing Today",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sagittis magna et sodales sagittis.",
      primaryButton: {
        text: "Get Started",
        href: "#",
      },
      secondaryButton: {
        text: "Learn More",
        href: "#",
      },
    },
    features: {
      title: "Discover Our Features",
      subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      items: [
        {
          title: "Feature 1",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sagittis magna et sodales."
        },
        {
          title: "Feature 2",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sagittis magna et sodales."
        },
        {
          title: "Feature 3",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sagittis magna et sodales."
        }
      ]
    }
  };

  return (
    <div className='pb-12'>
      <HeroSections 
        hero={heroContent.hero}
        features={heroContent.features}
      />
      
      <div className='mt-16' />
      
      <ArticleList
        lang={lang}
        articles={guides}
        title="Guides & Articles"
        categoryPath="guides"
        emptyMessage="No guides found. Check back later for new content."
        paginationDisabled={true}
      />
      <div className='mt-6' />
      <ArticleList
        lang={lang}
        articles={blogs}
        title="Blog"
        categoryPath="blog"
        emptyMessage="No blog posts found. Check back later for new content."
        paginationDisabled={true}
      />
    </div>
  );
}