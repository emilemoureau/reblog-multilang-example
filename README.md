# Multilang / Multi-category Blog SEO Optimized

This is a template for how you can build a multi-category and multilingual blog optimized for SEO, using Reblog as a data source.

## Key features:

- `src/reblog/markdown/MarkdownParser`: The MarkdownParser that lets you interpret markdown sent by Reblog.
- `src/reblog/layout/PostLayout`: The layout that wraps your posts, including: Recommendations, Header, Breadcrumb, and Table of contents. You can duplicate and customize it to match a specific category.
- `src/reblog/services/articles`: Functions to interact with the API.

## Deploy your own

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/emilemoureau/reblog-multilang-example&project-name=reblog-multilang-example&repository-name=reblog-multilang-example)

## Installation

1. Copy / paste the src/reblog folder
2. Add reblog in tsconfig : "@/reblog/*": ["./src/reblog/*"]
3. yarn add remark-gfm rehype-raw react-markdown react-share remark remark-html react-syntax-highlighter
4. Add styles in layout
- import "@/reblog/styles/article.css";
5. Add app/sitemap.xml/route.ts -> If necessary, you can customize the sitemap route to avoid conflicts with the classic sitemap (app/sitemap-articles.xml/routes.tx)
6. Add uploadcare to the Nextjs image provider

```javascript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ucarecdn.com',
      },
    ],
  },
};

export default nextConfig;
```

## Configuration

### Reblog

1. Go to reblog.so & sign up or log in
2. Create a new project
3. Generate and retrieve an API key
4. Create your first article, select a category, and publish it

### Next.js

1. Clone the repository
2. Run `npm install` to install dependencies
3. Create a `.env` file in the root directory and add the following variables:

```
REBLOG_PRIVATE_API_KEY=REBLOG_PRIVATE_API_KEY
WEBSITE_URL=example.com
```

## Reblog's advantages:

- `src/app/layout.ts`
  - Recognition and modification of the `lang=""` attribute based on the URL
- The `alt_langs` property is loaded with the article, allowing native handling of `hreflang` attributes
  - Ability to switch to the user's language