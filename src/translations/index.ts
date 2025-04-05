export type Locale = 'en' | 'fr';

type MenuTranslations = {
  home: string;
  discover: string;
  guides: string;
  blog: string;
};

type Translations = {
  menu: MenuTranslations;
};

const translations: Record<Locale, Translations> = {
  en: {
    menu: {
      home: 'Home',
      discover: 'Discover',
      guides: 'Guides',
      blog: 'Blog'
    }
  },
  fr: {
    menu: {
      home: 'Accueil',
      discover: 'Découvrir',
      guides: 'Guides',
      blog: 'Blog'
    }
  }
};

export default translations; 