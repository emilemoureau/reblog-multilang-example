import Head from 'next/head'

import site_metadata from '../site_metadata'

const CommonSEO = ({ title, description, ogType, ogImage, twImage, canonicalUrl, pathname, alt_langs }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="robots" content="follow, index" />
      <meta name="description" content={description} />
      <meta property="og:url" content={`${site_metadata.siteUrl}${pathname}`} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={site_metadata.title} />
      <meta property="og:description" content={description} />
      <meta property="og:title" content={title} />
      {ogImage && (
        Array.isArray(ogImage) ? (
          ogImage.map(({ url }) => (
            <meta 
              property="og:image" 
              content={url} 
              key={url} 
            />
          ))
        ) : (
          <meta 
            property="og:image" 
            content={ogImage} 
            key={ogImage} 
          />
        )
      )}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={site_metadata.twitter} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {twImage && (
        <meta 
          name="twitter:image" 
          content={twImage} 
        />
      )}
      <link
        rel="canonical"
        href={canonicalUrl ? canonicalUrl : `${site_metadata.siteUrl}${pathname}`}
      />
      
      {/* Add hreflang tags if alt_langs are provided */}

      <link rel="alternate" hreflang="x-default" href={`test`} />

      {console.log("alt_langs ->", alt_langs)}
      {alt_langs && Array.isArray(alt_langs) && alt_langs.length > 0 && (
        alt_langs.map((langItem) => (
          <link 
            key={langItem.lang}
            rel="alternate"
            hreflang={langItem.lang.toLowerCase()} 
            href={`${site_metadata.siteUrl}${langItem.handle}`}
          />
        ))
      )}
      
      {/* Add x-default hreflang if main language is defined */}
      {(alt_langs && Array.isArray(alt_langs) && alt_langs.find(item => item.main)) && (
        <link 
          rel="alternate"
          hreflang="x-default" 
          href={`${site_metadata.siteUrl}${alt_langs.find(item => item.main).handle}`}
        />
      )}
    </Head>
  )
}

export const PageSEO = ({ title, description, pathname, alt_langs }) => {
  const ogImageUrl = site_metadata.siteUrl + site_metadata.socialBanner
  const twImageUrl = site_metadata.siteUrl + site_metadata.socialBanner
  return (
    <CommonSEO
      title={title}
      description={description}
      ogType="website"
      ogImage={ogImageUrl}
      twImage={twImageUrl}
      site_metadata={site_metadata}
      pathname={pathname}
      alt_langs={alt_langs}
    />
  )
}

export const BlogSEO = ({
  authorDetails,
  title,
  summary,
  date = "2025-03-28",
  lastmod,
  url,
  images = []
}) => {
  const publishedAt = new Date(date).toISOString()
  const modifiedAt = (lastmod && lastmod != 'null') ? new Date(lastmod || date).toISOString() : null
  let imagesArr =
    images.length === 0
      ? [site_metadata.socialBanner]
      : typeof images === 'string'
      ? [images]
      : images

  const featuredImages = imagesArr.map((img) => {
    return {
      '@type': 'ImageObject',
      url: img && typeof img === 'string' && img.includes('http') 
        ? img 
        : `${site_metadata.siteUrl}${img || site_metadata.socialBanner}`,
    }
  })

  let authorList
  if (authorDetails) {
    authorList = authorDetails.map((author) => {
      return {
        '@type': 'Person',
        name: author.name,
      }
    })
  } else {
    authorList = {
      '@type': 'Person',
      name: site_metadata.author,
    }
  }

  let structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    headline: title,
    image: featuredImages,
    datePublished: publishedAt
  }

  if(lastmod && lastmod != "null") structuredData.dateModified = modifiedAt;

  structuredData = {
    ...structuredData,
    author: authorList,
    publisher: {
      '@type': 'Organization',
      name: site_metadata.author,
      logo: {
        '@type': 'ImageObject',
        url: `${site_metadata.siteUrl}${site_metadata.siteLogo}`,
      },
    },
    description: summary
  }

  return (
    <>
      <Head>
        {date && <meta property="article:published_time" content={publishedAt} />}
        {(lastmod && lastmod != "null") && <meta property="article:modified_time" content={modifiedAt} />}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData, null, 2),
          }}
        />
      </Head>
    </>
  )
}
