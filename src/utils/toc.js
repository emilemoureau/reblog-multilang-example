import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import rehypeToc from '@jsdevtools/rehype-toc';

export function addTableOfContents(markdown) {
  // Process the markdown
  const result = unified()
    .use(remarkParse) // Parse markdown
    .use(remarkRehype) // Convert to HTML AST
    .use(rehypeSlug) // Add IDs to headings in HTML
    .use(rehypeToc, {
      headings: ['h2', 'h3', 'h4'], // Specify which headings to include
      nav: true, // Wrap TOC in <nav> element
      position: 'beforebegin' // Place TOC at the beginning
    })
    .use(rehypeStringify) // Convert back to HTML string
    .processSync(markdown)
    .toString();

  return result;
} 