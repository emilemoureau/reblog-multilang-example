import Link from 'next/link';

interface Feature {
  title: string;
  description: string;
}

interface HeroSectionsProps {
  hero: {
    badge: string;
    title: string;
    description: string;
    primaryButton: {
      text: string;
      href: string;
    };
    secondaryButton: {
      text: string;
      href: string;
    };
  };
  features: {
    title: string;
    subtitle: string;
    items: Feature[];
  };
}

export default function HeroSections({ 
  hero, 
  features 
}: HeroSectionsProps) {
  return (
    <div className="w-full">
      {/* Hero Section - Light by default, Dark in dark mode */}
      <section className="bg-white dark:bg-black text-gray-800 dark:text-white py-20 px-4 sm:px-6 lg:px-8 relative rounded-lg">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{hero.badge}</span>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {hero.title}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
              {hero.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href={hero.primaryButton.href} 
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-800 dark:border-white text-base font-medium rounded-md text-white dark:text-black bg-gray-800 dark:bg-white hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors"
              >
                {hero.primaryButton.text}
              </Link>
              <Link 
                href={hero.secondaryButton.href} 
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-700 text-base font-medium rounded-md text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
              >
                {hero.secondaryButton.text}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Light by default, Dark in dark mode */}
      <section className="py-20 mt-4 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-white rounded-lg">
        <div className="max-w-4xl mx-auto">
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-4">{features.title}</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {features.subtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.items.map((feature, i) => (
              <div key={i} className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 transition-all hover:border-gray-300 dark:hover:border-gray-700">
                <div className="w-10 h-10 border border-gray-300 dark:border-gray-700 rounded-md flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 