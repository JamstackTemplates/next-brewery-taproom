import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { ThemeProvider } from 'jamstacks';
import { ThemeScript } from 'jamstacks/server';
import '@fontsource/alfa-slab-one';
import '@fontsource-variable/vollkorn';
import '@fontsource-variable/vollkorn/wght-italic.css';
import '@fontsource/yesteryear';
import { SiteHeader } from '../components/site-header';
import { SiteFooter } from '../components/site-footer';
import { business } from '../content/business';
import { pageMetadata } from '../lib/metadata';
import { site } from '../lib/site';
import './tailwind.input.css';

const description = site.description || business.introduction;

export const metadata: Metadata = {
  ...pageMetadata({ description }),
  title: { default: `${business.name} · Taproom & food trucks`, template: `%s — ${business.name}` },
  ...(site.url ? { metadataBase: new URL(`${site.url}/`) } : {}),
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1f3a2c' },
    { media: '(prefers-color-scheme: dark)', color: '#0f1f17' },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return <html lang="en-US" suppressHydrationWarning>
    <head><ThemeScript /></head>
    <body><ThemeProvider>
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteHeader /><main id="main" tabIndex={-1}>{children}</main><SiteFooter />
    </ThemeProvider></body>
  </html>;
}
