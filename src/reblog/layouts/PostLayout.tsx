import Image from 'next/image';

import Link from '../components/Link'
import PageTitle from '../components/PageTitle'
import BreadcrumbV2 from '../components/BreadcrumbV2'
/* import { BlogSEO } from '../components/SEO' */
import ScrollTopAndComment from '../components/ScrollTopAndComment'
import SocialShare from '../components/SocialShare'
import { MarkdownParser } from '../markdown/MarkdownParser'
import TableOfContents from '@/components/TableOfContents'
import LanguageNotification from '../components/LanguageNotification'

const postDateTemplate: Intl.DateTimeFormatOptions = {
  weekday: 'short', year: 'numeric', month: 'long', day: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
}

interface FrontMatter {
  date: string;
  title: string;
  cover?: string;
  handle: string;
  modification_date?: string;
  lang?: string;
  meta_title?: string;
  meta_description?: string;
}

type AltLang = {
  lang: string;
  handle: string;
};

type Recommendation = {
  cover?: string;
  title: string;
  handle: string;
  date: string;
  lang?: string;
  _id?: string;
};

type Recommendations = Recommendation[];

function PostLayout({
  frontMatter,
  content,

  breadcrumb_v1_title,
  breadcrumb_v1_handle,

  breadcrumb_v2_title,
  breadcrumb_v2_handle,

  recommendations,

  lang,
  alt_langs
}: {
  frontMatter: FrontMatter;
  content: string;
  breadcrumb_v1_title: string;
  breadcrumb_v1_handle: string;
  breadcrumb_v2_title?: string;
  breadcrumb_v2_handle?: string;
  recommendations?: Recommendations;
  lang?: string;
  alt_langs?: AltLang[];
}) {
  const { date, title, cover, handle, modification_date } = frontMatter
  const contentLang = lang || frontMatter.lang || ""

  return (
    <>
      <ScrollTopAndComment />
      <LanguageNotification currentLang={contentLang} alt_langs={alt_langs || []} handle={handle} />

      <article>
        <div>
          <header>
            <div className="space-y-1">
              <BreadcrumbV2
                items_breadcrumb={[
                  {
                    title: breadcrumb_v1_title,
                    link: breadcrumb_v1_handle
                  },
                  breadcrumb_v2_handle && {
                    title: breadcrumb_v2_title,
                    sep: true,
                    link: breadcrumb_v2_handle
                  },
                  {
                    title: title,
                    sep: true,
                    final: true
                  }
                ]}
              />

              <div>
                <PageTitle>{title}</PageTitle>
              </div>

              {cover && (
                <div className="relative mt-4 mb-6 overflow-hidden rounded-lg shadow-md">
                  <div className="relative h-64 w-full overflow-hidden sm:h-80 md:h-96">
                    <Image
                      width={1000}
                      height={500}
                      objectFit='cover'
                      src={cover}
                      alt={title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-101"
                      priority={true}
                    />
                  </div>
                </div>
              )}

              <div className='flex justify-between pb-4'>
                <div>
                  <dl className="flex flex-col space-y-1 text-sm text-gray-700 dark:text-gray-300">
                    <div className='flex items-center md:flex-row flex-col'>
                      <dd>
                        <time dateTime={date}>
                          {new Date(date).toLocaleDateString(contentLang, postDateTemplate)}
                        </time>
                      </dd>
                    </div>
                    {
                      (modification_date && modification_date != "null") && (
                        <div className='flex items-center'>
                          <dt className="mr-1 font-medium">Edited on:</dt>
                          <dd>
                            <time dateTime={modification_date}>
                              {new Date(modification_date).toLocaleDateString(contentLang, postDateTemplate)}
                            </time>
                          </dd>
                        </div>
                      )
                    }
                  </dl>

                  <div className="flex items-center">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800 dark:text-gray-200">
                        {handle.includes("guides") ? "Jane Doe" : "Jane Doe"}
                      </span>
                    </div>
                  </div>
                </div>

                <SocialShare
                  url={`${process.env.WEBSITE_URL}${handle}`}
                />
              </div>
            </div>
          </header>

          <div className="border-b border-gray-100 mb-2 opacity-100 dark:border-gray-900"></div>

          <div
            className="divide-y divide-gray-200 pb-8 dark:divide-gray-700 xl:grid xl:grid-cols-5 xl:gap-x-6 xl:divide-y-0 mt-6"
          >
            <div className='xl:col-span-1 relative xl:min-h-[calc(100vh-100px)]'>
              <TableOfContents content={content} />
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700 xl:col-span-3 xl:row-span-2 xl:pb-0">
              <div className="prose max-w-none pb-8 dark:prose-dark cs-article-content">
                <MarkdownParser
                  content={content}
                />
              </div>
            </div>
            <div className='xl:col-span-1'>
              <div className="text-sm font-medium leading-5">
                {recommendations && (
                  <>
                    <p className="text-xs uppercase text-gray-500 dark:text-gray-400">
                      {lang === "fr" ? "Recommandés" : "Recommended"}
                    </p>

                    <div className="border-b border-gray-200 dark:border-gray-700 mt-3" />

                    <div>
                      {
                        recommendations && recommendations.map((element, key) => {
                          if (!element) return;
                          return (
                            <div key={key} className="flex flex-col gap-4 py-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
                              <div className="flex gap-4 items-start">
                                <Link
                                  href={(`/${element.handle}`).replace("//", "/")}
                                  className="shrink-0 w-24 h-24 overflow-hidden rounded-lg"
                                >
                                  {element.cover && <Image
                                    width={96}
                                    height={96}
                                    alt={element.title}
                                    src={element.cover}
                                    className="w-24 h-24 object-cover"
                                  />}
                                </Link>
                                <div className="flex-1">
                                  <Link
                                    href={(`/${element.handle}`).replace("//", "/")}
                                    className="text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 font-medium line-clamp-2"
                                  >
                                    {element.title}
                                  </Link>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {new Date(element.date).toLocaleDateString(contentLang, postDateTemplate)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )
                        })
                      }
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  )
}

export default PostLayout;