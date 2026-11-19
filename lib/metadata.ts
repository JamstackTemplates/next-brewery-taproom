import type { Metadata } from 'next';
import { business } from '../content/business.ts';
import { absoluteUrl } from './paths.ts';
import { site } from './site.ts';

// metadataBase already includes any base path, so resolve against the deployed URL directly.
const ogImage = { url: site.url ? `${site.url}/og.png` : '/og.png', width: 1200, height: 630, alt: `${business.name}: ${business.tagline}` };

/**
 * Per-page title, description, canonical URL and social cards.
 * Next.js replaces (not merges) a parent's openGraph, so every page restates the shared image here.
 */
export function pageMetadata({ path, title, description }: { path?: string; title?: string; description: string }): Metadata {
  // Without a path (root layout defaults, 404) no canonical or og:url is emitted.
  const url = path ? absoluteUrl(path) : undefined;
  const socialTitle = title ? `${title} — ${business.name}` : business.name;
  return {
    ...(title ? { title } : {}),
    description,
    ...(url ? { alternates: { canonical: url } } : {}),
    openGraph: {
      type: 'website', siteName: business.name, title: socialTitle, description,
      ...(url ? { url } : {}), images: [ogImage],
    },
    twitter: { card: 'summary_large_image', title: socialTitle, description, images: [ogImage.url] },
  };
}
