import { NextResponse } from 'next/server';
import { generateSitemapXml } from '@/reblog/services/sitemap';

export async function GET() {
  const sitemapXml = await generateSitemapXml();
  
  return new NextResponse(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
} 