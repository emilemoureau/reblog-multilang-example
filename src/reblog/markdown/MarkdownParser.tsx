"use client"

import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import Link from 'next/link';
import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export const generateSlug = (str: string | undefined): string => {
  if (!str) return '';
  
  str = str.replace(/^\s+|\s+$/g, '');
  str = str.toLowerCase();
  const from = 'àáãäâèéëêìíïîòóöôùúüûñç·/_,:;';
  const to = 'aaaaaeeeeiiiioooouuuunc------';

  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  return str;
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
  return (
    <Image
      src={rest.src}
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

const MarkdownParser = ({ content = "" }: MarkdownParserProps) => {
  const headingCountRef = useRef(-2);

  // Process the content to handle custom tags
  const processedContent = content
    .replace(/<div \/>/g, "")
    .replace(/<strong>/g, "**")
    .replace(/<\/strong>/g, "**")
    // Process tweet tags to avoid parsing issues
    .replace(/<tweet id="(.*?)".*?\/>/g, '<div data-tweet-id="$1" class="tweet-embed"></div>')
    // Handle tweet tags with closing tags
    .replace(/<tweet id="(.*?)".*?>(.*?)<\/tweet>/g, '<div data-tweet-id="$1" class="tweet-embed">$2</div>')
    // Process youtube tags
    .replace(/<youtube id="(.*?)"(?: title="(.*?)")?.*?\/>/g, '<div data-youtube-id="$1" data-youtube-title="$2" class="youtube-embed"></div>')
    // Handle youtube tags with closing tags
    .replace(/<youtube id="(.*?)"(?: title="(.*?)")?.*?>(.*?)<\/youtube>/g, '<div data-youtube-id="$1" data-youtube-title="$2" class="youtube-embed">$3</div>')
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
            <a>{children}</a>
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