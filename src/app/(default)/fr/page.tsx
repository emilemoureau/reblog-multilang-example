import ArticleList from '@/reblog/components/articles/ArticleList';
import HeroSections from '@/components/landing/HeroSections';
import { getArticlesList } from '@/reblog/services/articles';

export const metadata = {
  title: 'Guides - Reblog',
  description: 'Guides et articles utiles sur divers sujets'
};

const lang = "FR";

export default async function GuidesPage() {
  const guides = await getArticlesList("guides", lang, 0, 10);
  const blogs = await getArticlesList("blog", lang, 0, 10);

  const heroContent = {
    hero: {
      badge: "Page d'accueil démo",
      title: "Construisez quelque chose d'incroyable aujourd'hui",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sagittis magna et sodales sagittis.",
      primaryButton: {
        text: "Commencer",
        href: "#",
      },
      secondaryButton: {
        text: "En savoir plus",
        href: "#",
      },
    },
    features: {
      title: "Découvrez nos fonctionnalités",
      subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      items: [
        {
          title: "Fonctionnalité 1",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sagittis magna et sodales."
        },
        {
          title: "Fonctionnalité 2",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sagittis magna et sodales."
        },
        {
          title: "Fonctionnalité 3",
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
        title="Guides et Articles"
        categoryPath="guides"
        emptyMessage="Aucun guide trouvé. Revenez plus tard pour du nouveau contenu."
      />
      <div className='mt-6' />
      <ArticleList
        lang={lang}
        articles={blogs}
        title="Blog"
        categoryPath="blog"
        emptyMessage="Aucun article de blog trouvé. Revenez plus tard pour du nouveau contenu."
      />
    </div>
  );
}