"use client"

import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

// Define the type for the TikTok embed object
interface TikTokEmbedObject {
  reloadEmbeds?: () => void;
  // Add other methods/properties if needed
}

// Augment the global Window interface
declare global {
  interface Window {
    tiktokEmbed?: TikTokEmbedObject;
  }
}

export const generateSlug = (str: string | undefined): string => {
  if (!str) return '';

  return str
    .normalize('NFD') // decompose accents
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace with -
    .replace(/-+/g, '-'); // collapse multiple -
};

// Helper function to detect if content is a markdown table
export const isMarkdownTable = (content: string): boolean => {
  const lines = content.trim().split('\n');

  // A basic markdown table needs at least 2 lines (header and separator)
  if (lines.length < 2) return false;

  // Check if all lines have pipe characters
  const allLinesHavePipes = lines.every(line => line.includes('|'));
  if (!allLinesHavePipes) return false;

  // Check if the second line is a separator line (contains only |, -, :, or spaces)
  const separatorLineRegex = /^\s*[\|\-:\s]+\s*$/;
  const hasSeparatorLine = separatorLineRegex.test(lines[1]);

  return hasSeparatorLine;
};

interface CustomImgProps {
  src: string;
  alt?: string;
  [key: string]: string | undefined;
}

const CustomImg = ({ ...rest }: CustomImgProps) => {
  if (!rest.src) return null;
  
  // Create a more robust URL encoding that specifically handles spaces and special characters
  const sanitizeUrl = (url: string): string => {
    // First replace spaces with %20
    const sanitized = url.replace(/ /g, '%20');
    // Then ensure the URL is properly encoded for other special characters
    try {
      // Use URL constructor to validate and normalize the URL
      return new URL(sanitized).toString();
    } catch {
      // If URL constructor fails (invalid URL), fallback to manual encoding
      return encodeURI(sanitized);
    }
  };
  
  const encodedSrc = sanitizeUrl(rest.src);
  
  return (
    <Image
      src={encodedSrc}
      alt={rest.alt || ''}
      width={800}
      height={400}
      style={{ objectFit: "cover" }}
    />
  )
}

interface ButtonExternalV1Props {
  url: string;
  button_title?: string;
}

const ButtonExternalV1 = ({
  url,
  button_title
}: ButtonExternalV1Props) => {
  if (!button_title) return <></>;
  return (
    <a href={url} target='_blank' rel="noreferrer nofollow">
      {button_title.replaceAll("**", "")}
    </a>
  )
}

interface TweetEmbedProps {
  id: string;
}

const TweetEmbed = ({ id }: TweetEmbedProps) => {
  const tweetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only load Twitter widgets when the component is visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Clean up any existing Twitter widgets
          type WindowWithTwitter = Window & typeof globalThis & {
            twttr?: {
              widgets: {
                load: (element: HTMLElement | null) => void
              }
            }
          };

          if ((window as WindowWithTwitter).twttr) {
            // Load the Twitter widget script
            (window as WindowWithTwitter).twttr?.widgets.load(tweetRef.current);
          } else {
            // Load the Twitter widget script if it doesn't exist
            const script = document.createElement('script');
            script.setAttribute('src', 'https://platform.twitter.com/widgets.js');
            script.setAttribute('charset', 'utf-8');
            script.setAttribute('async', 'true');
            script.onload = () => {
              (window as WindowWithTwitter).twttr?.widgets.load(tweetRef.current);
            };
            document.head.appendChild(script);
          }

          // Disconnect observer once loaded
          observer.disconnect();
        }
      });
    }, { threshold: 0.1 });

    if (tweetRef.current) {
      observer.observe(tweetRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [id]);

  return (
    <div ref={tweetRef} className="twitter-tweet-container">
      <blockquote className="twitter-tweet">
        <a href={`https://twitter.com/x/status/${id}`}></a>
      </blockquote>
    </div>
  );
};

interface YoutubeEmbedProps {
  id: string;
  title?: string;
}

const YoutubeEmbed = ({ id, title }: YoutubeEmbedProps) => {
  const iframeRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setShouldLoad(true);
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    if (iframeRef.current) {
      observer.observe(iframeRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={iframeRef} className="youtube-embed-container">
      {shouldLoad ? (
        <iframe
          loading="lazy"
          width="100%"
          height="315"
          src={`https://www.youtube.com/embed/${id}`}
          title={title || "YouTube video player"}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '315px',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          Loading YouTube video...
        </div>
      )}
    </div>
  );
};

interface TikTokEmbedProps {
  id: string;
  username?: string;
}

const TikTokEmbed = ({ id, username }: TikTokEmbedProps) => {
  const tikTokRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only load TikTok widgets when the component is visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Load the TikTok widget script if it doesn't exist
          const existingScript = document.querySelector('script[src="https://www.tiktok.com/embed.js"]');
          
          if (!existingScript) {
            const script = document.createElement('script');
            script.setAttribute('src', 'https://www.tiktok.com/embed.js');
            script.setAttribute('async', 'true');
            document.head.appendChild(script);
          } else {
            // If script already exists, try to force reload of widgets
            if (window.hasOwnProperty('tiktokEmbed')) {
              window.tiktokEmbed?.reloadEmbeds?.();
            }
          }
          
          // Disconnect observer once loaded
          observer.disconnect();
        }
      });
    }, { threshold: 0.1 });

    if (tikTokRef.current) {
      observer.observe(tikTokRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [id, username]);

  return (
    <div ref={tikTokRef} className="tiktok-embed-container">
      {username ? (
        <blockquote 
          className="tiktok-embed" 
          cite={`https://www.tiktok.com/@${username}/video/${id}`}
          data-video-id={id} 
          style={{ maxWidth: '605px', minWidth: '325px' }}>
          <section>
            <a target="_blank" title={`@${username}`} href={`https://www.tiktok.com/@${username}?refer=embed`}>@{username}</a>
          </section>
        </blockquote>
      ) : (
        <iframe 
          src={`https://www.tiktok.com/embed/v3/${id}`} 
          style={{ width: '100%', height: '600px', border: 'none' }}
          allowFullScreen
        />
      )}
    </div>
  );
};

interface MarkdownParserProps {
  content?: string;
}

interface MarkdownParseronentProps {
  children?: React.ReactNode;
  href?: string;
  src?: string;
  alt?: string;
  width?: string;
  height?: string;
  title?: string;
  className?: string;
  id?: string;
  'data-tweet-id'?: string;
  'data-youtube-id'?: string;
  'data-youtube-title'?: string;
  'data-tiktok-id'?: string;
  'data-tiktok-username'?: string;
  url?: string;
  button_title?: string;
  [key: string]: unknown;
}

interface ReactElement {
  type: unknown;
  props: {
    children?: string | ReactElement | (string | ReactElement)[];
    [key: string]: unknown;
  };
}

interface HeadingElementProps extends MarkdownParseronentProps {
  children?: React.ReactNode;
}

// Define a type for Markdown component props to avoid using 'any'
type MarkdownCustomComponents = {
  [key: string]: React.ComponentType<MarkdownParseronentProps>;
}

// Helper function to process markdown inside HTML elements
const processMarkdownInHTML = (content: string): string => {
  // Regex to find HTML tags with markdown content inside
  // This looks for divs with content that might contain markdown images
  const htmlWithMarkdownRegex = /<div([^>]*)>([\s\S]*?)<\/div>/g;

  return content.replace(htmlWithMarkdownRegex, (match: string, attributes: string, innerContent: string) => {
    // Process markdown image syntax inside HTML
    const processedInnerContent = innerContent.replace(/!\[(.*?)\]\((.*?)\)/g, (imgMatch: string, alt: string, src: string) => {
      // Encode the URL to handle spaces and special characters
      const encodedSrc = src.replace(/ /g, '%20');
      // Return the image with proper HTML format
      return `<img src="${encodedSrc}" alt="${alt || ''}" />`;
    });

    // Return the div with processed content
    return `<div${attributes}>${processedInnerContent}</div>`;
  });
};

const MarkdownParser = ({ content = "" }: MarkdownParserProps) => {
  const headingCountRef = useRef(-2);

  // First process markdown inside HTML elements
  const htmlProcessedContent = processMarkdownInHTML(content);

  // Fix markdown image links directly in the content (before further processing)
  const fixedImagesContent = htmlProcessedContent.replace(
    /!\[(.*?)\]\((.*?)\)/g, 
    (match: string, alt: string, src: string) => {
      // Encode the URL to handle spaces and special characters
      const encodedSrc = src.replace(/ /g, '%20');
      return `![${alt}](${encodedSrc})`;
    }
  );

  // Then process the content to handle custom tags
  const processedContent = fixedImagesContent
    .replace(/<div \/>/g, "")
    // Process tweet tags to avoid parsing issues
    .replace(/<tweet id="(.*?)".*?\/>/g, '<div data-tweet-id="$1" class="tweet-embed"></div>')
    // Handle tweet tags with closing tags
    .replace(/<tweet id="(.*?)".*?>(.*?)<\/tweet>/g, '<div data-tweet-id="$1" class="tweet-embed">$2</div>')
    // Process youtube tags
    .replace(/<youtube id="(.*?)"(?: title="(.*?)")?.*?\/>/g, '<div data-youtube-id="$1" data-youtube-title="$2" class="youtube-embed"></div>')
    // Handle youtube tags with closing tags
    .replace(/<youtube id="(.*?)"(?: title="(.*?)")?.*?>(.*?)<\/youtube>/g, '<div data-youtube-id="$1" data-youtube-title="$2" class="youtube-embed">$3</div>')
    // Process tiktok tags
    .replace(/<tiktok id="(.*?)"(?: username="(.*?)")?.*?\/>/g, '<div data-tiktok-id="$1" data-tiktok-username="$2" class="tiktok-embed"></div>')
    // Handle tiktok tags with closing tags
    .replace(/<tiktok id="(.*?)"(?: username="(.*?)")?.*?>(.*?)<\/tiktok>/g, '<div data-tiktok-id="$1" data-tiktok-username="$2" class="tiktok-embed">$3</div>')
    // Process ==highlight== syntax to convert to custom highlight spans
    .replace(/==([^=]+?)==/g, '<span class="highlighted">$1</span>');

  const MarkdownParseronents: MarkdownCustomComponents = {
    blockquote: ({ children, ...props }: MarkdownParseronentProps) => {
      return <blockquote className="markdown-blockquote" {...props}>{children}</blockquote>;
    },
    h2: ({ children, ...props }: HeadingElementProps) => {
      // Increment the heading count
      headingCountRef.current += 1;

      if (!children) return <h2 {...props}></h2>;

      const childrenArray = Array.isArray(children)
        ? children
        : [children];
      const heading = childrenArray
        .flatMap((element: unknown) =>
          typeof element === 'string'
            ? element
            : element && typeof element === 'object' && 'type' in element &&
              'props' in element && typeof (element as ReactElement).props?.children === 'string'
              ? (element as ReactElement).props.children
              : []
        )
        .join('');

      const slug = generateSlug(heading);

      return (
        <>
          <h2 id={slug}>
            <a href={`#${slug}`}>{children}</a>
          </h2>
        </>
      );
    },
    h3: ({ children, ...props }: HeadingElementProps) => {
      if (!children) return <h3 {...props}></h3>;

      const childrenArray = Array.isArray(children)
        ? children
        : [children];
      const heading = childrenArray
        .flatMap((element: unknown) =>
          typeof element === 'string'
            ? element
            : element && typeof element === 'object' && 'type' in element &&
              'props' in element && typeof (element as ReactElement).props?.children === 'string'
              ? (element as ReactElement).props.children
              : []
        )
        .join('');

      const slug = generateSlug(heading);

      return (
        <h3 id={slug}>
          <a href={`#${slug}`}>{children}</a>
        </h3>
      );
    },
    img: ({ src, alt }: MarkdownParseronentProps) => {
      if (!src) return null;
      const imgProps: CustomImgProps = {
        src,
        alt,
      };
      return <CustomImg {...imgProps} />;
    },
    a: ({ href, children }: MarkdownParseronentProps) => {
      if (!href) return <span>{children}</span>;

      const isInternalLink = href.startsWith('');
      const isInternalLink_v2 = href.includes(process.env.WEBSITE_URL || '');
      const isAnchorLink = href.startsWith('#');

      if (isInternalLink) {
        return (
          <Link href={href} prefetch={false}>
            {children}
          </Link>
        );
      }

      if (isInternalLink_v2 && process.env.WEBSITE_URL) {
        return (
          <Link
            href={href.replace(process.env.WEBSITE_URL, '')}
            prefetch={false}
          >
            <a>{children}</a>
          </Link>
        );
      }

      if (isAnchorLink) {
        return <a href={href}>{children}</a>;
      }

      return (
        <a target="_blank" rel="noopener noreferrer" href={href}>
          {children}
        </a>
      );
    },
    buttonexternalv1: ({ url, button_title }: MarkdownParseronentProps) => {
      return <ButtonExternalV1 url={url || ''} button_title={button_title} />;
    },
    div: ({ className, children, ...props }: MarkdownParseronentProps) => {
      // Handle tweet embeds
      if (className === 'tweet-embed' && props['data-tweet-id']) {
        return <TweetEmbed id={props['data-tweet-id'] as string} />;
      }

      // Handle YouTube embeds
      if (className === 'youtube-embed' && props['data-youtube-id']) {
        return <YoutubeEmbed
          id={props['data-youtube-id'] as string}
          title={props['data-youtube-title'] as string | undefined}
        />;
      }

      // Handle TikTok embeds
      if (className === 'tiktok-embed' && props['data-tiktok-id']) {
        return <TikTokEmbed
          id={props['data-tiktok-id'] as string}
          username={props['data-tiktok-username'] as string | undefined}
        />;
      }

      // Default div rendering
      return <div className={className} {...props}>{children}</div>;
    },
    tweet: ({ id }: MarkdownParseronentProps) => {
      if (typeof id !== 'string') return null;
      return <TweetEmbed id={id} />;
    },
    iframe: ({ src, width, height, title }: MarkdownParseronentProps) => {
      if (!src) return null;
      return (
        <div className="iframe-container">
          <iframe
            src={src}
            width={width || "100%"}
            height={height || "400"}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={title || "Embedded content"}
          />
        </div>
      );
    },
    youtube: ({ id, title }: MarkdownParseronentProps) => {
      if (typeof id !== 'string') return null;
      return <YoutubeEmbed id={id} title={title as string | undefined} />;
    },
    tiktok: ({ id, username }: MarkdownParseronentProps) => {
      if (typeof id !== 'string') return null;
      return <TikTokEmbed id={id} username={username as string | undefined} />;
    },
    table: ({ children, ...props }: MarkdownParseronentProps) => {
      return <div><table {...props}>{children}</table></div>;
    },
    thead: ({ children, ...props }: MarkdownParseronentProps) => {
      return <thead {...props}>{children}</thead>;
    },
    tbody: ({ children, ...props }: MarkdownParseronentProps) => {
      return <tbody {...props}>{children}</tbody>;
    },
    tr: ({ children, ...props }: MarkdownParseronentProps) => {
      return <tr {...props}>{children}</tr>;
    },
    th: ({ children, ...props }: MarkdownParseronentProps) => {
      return <th {...props}>{children}</th>;
    },
    td: ({ children, ...props }: MarkdownParseronentProps) => {
      return <td {...props}>{children}</td>;
    },
    p: ({ children, ...props }: MarkdownParseronentProps) => {
      return (
        <p {...props}>
          {children}
        </p>
      );
    },
    span: ({ className, children, ...props }: MarkdownParseronentProps) => {
      if (className === 'highlighted') {
        return <span className="highlighted-text" {...props}>{children}</span>;
      }
      return <span className={className} {...props}>{children}</span>;
    },
    code: ({ inline, className, children, ...props }: MarkdownParseronentProps) => {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';

      const content = String(children);

      // Check if the content is actually a markdown table
      // This prevents tables from being rendered as code blocks
      if (!inline && isMarkdownTable(content)) {
        return <div>{content}</div>;
      }

      // For regular code blocks
      return !inline ? (
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={language || 'text'}
          PreTag="div"
          {...props}
        >
          {content.replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
  };

  return (
    <Markdown
      rehypePlugins={[rehypeRaw]}
      remarkPlugins={[remarkGfm]}
      components={MarkdownParseronents}
    >
      {processedContent}
    </Markdown>
  );
};

export { MarkdownParser };