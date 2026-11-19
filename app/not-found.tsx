import type { Metadata } from 'next';
import { EmptyPint } from '../components/brewery-art';
import { SiteLink } from '../components/site-link';

export const metadata: Metadata = { title: 'Page not found', robots: { index: false } };

export default function NotFound() {
  return <section className="sunburst rule-double" aria-labelledby="not-found-heading">
    <div className="wrap grid items-center gap-10 py-20 md:grid-cols-[1.2fr_1fr]">
      <div>
        <span className="ornament" aria-hidden="true"><span /></span>
        <p className="eyebrow">Error 404</p>
        <h1 id="not-found-heading" className="mt-3 text-[clamp(2.2rem,5.5vw,4rem)] uppercase">This keg’s kicked</h1>
        <p className="my-6 max-w-lg text-lg text-muted">The page you poured for isn’t here. It may have moved, or the link has a typo.</p>
        <div className="flex flex-wrap gap-4">
          <SiteLink href="/taps/" className="button">See what’s on tap</SiteLink>
          <SiteLink href="/" className="button button-quiet">Back to the taproom</SiteLink>
        </div>
      </div>
      <EmptyPint />
    </div>
  </section>;
}
