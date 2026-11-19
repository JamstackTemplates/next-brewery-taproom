import type { ReactNode } from 'react';
import { business } from '../content/business';
import { asset } from '../lib/paths';
import { OpenBadge } from './open-badge';
import { SiteLink } from './site-link';

type ContentProps = { children: ReactNode };

const HERO_WIDTHS = [800, 1200, 1600] as const;

/** Home first screen: copy and actions on the left, the taproom illustration in a double-ruled frame on the right. */
function HeroSection({ children }: ContentProps) {
  return (
    <section className="sunburst rule-double" aria-labelledby="hero-heading">
      <div className="wrap grid items-center gap-10 py-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-[1fr_1.12fr] lg:gap-12">
        <div>{children}</div>
        <figure className="hero-art panel p-2 shadow-[0_14px_30px_-12px_rgb(42_26_16_/_.45)]">
          <img className="hero-image block h-auto w-full rounded-[2px]"
            src={asset('/brewery-light-1200.webp')}
            srcSet={HERO_WIDTHS.map(width => `${asset(`/brewery-light-${width}.webp`)} ${width}w`).join(', ')}
            sizes="(min-width: 76rem) 38rem, (min-width: 64rem) 52vw, calc(100vw - 2rem)"
            width={2400} height={1792} fetchPriority="high" decoding="async"
            alt={`Illustration of the ${business.name} taproom: gold lettering on a brick wall above a pint of amber ale, brass taps, a copper kettle and oak barrels.`} />
        </figure>
      </div>
    </section>
  );
}

function Eyebrow({ children }: ContentProps) {
  return <><span className="ornament" aria-hidden="true"><span /></span><p className="eyebrow">{children}</p></>;
}

function Heading({ children }: ContentProps) {
  return <h1 id="hero-heading" className="mt-4 text-[clamp(2.3rem,5.2vw,4rem)] uppercase leading-[1.02]">{children}</h1>;
}

function Introduction({ children }: ContentProps) {
  return <p className="mt-6 max-w-xl text-[clamp(1.08rem,1.7vw,1.3rem)] text-muted">{children}</p>;
}

/** Live status on a small enamel plaque beside the heading: open-now badge and the weekly pattern. */
function Status({ children }: ContentProps) {
  return (
    <div className="sign mt-7 inline-flex flex-wrap items-center gap-x-4 gap-y-1 rounded-[3px] border-2 border-brass bg-sign px-4 py-2.5 text-sign-ink shadow-[inset_0_0_0_3px_var(--sign),inset_0_0_0_4px_var(--brass)]">
      <OpenBadge hours={business.hours} className="text-sign-ink" />
      <span className="text-sm text-sign-muted">{children}</span>
    </div>
  );
}

function Actions({ children }: ContentProps) {
  return <div className="mt-8 flex flex-wrap items-center gap-4">{children}</div>;
}

function Primary({ href, children }: ContentProps & { href: string }) {
  return <SiteLink href={href} className="button">{children}</SiteLink>;
}

function Secondary({ href, children }: ContentProps & { href: string }) {
  return <SiteLink href={href} className="button button-quiet">{children}</SiteLink>;
}

export const Hero = Object.assign(HeroSection, { Eyebrow, Heading, Introduction, Status, Actions, Primary, Secondary });
