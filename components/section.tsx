import type { ReactNode } from 'react';
import { SiteLink } from './site-link';

type ContentProps = { children: ReactNode };

/** Page section with an ornamented heading. `tone="raised"` sits on a kraft-paper band between double rules. */
function SectionBlock({ id, tone = 'plain', children }: ContentProps & { id: string; tone?: 'plain' | 'raised' }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={tone === 'raised' ? 'wallpaper border-y-[6px] border-double border-rule bg-raised' : ''}>
      <div className="wrap py-[clamp(3rem,7vw,5.5rem)]">{children}</div>
    </section>
  );
}

/** Heading row; the id is derived from the parent section's id. */
function Heading({ sectionId, eyebrow, children }: ContentProps & { sectionId: string; eyebrow?: string }) {
  return (
    <div className="mb-8">
      <span className="ornament" aria-hidden="true"><span /></span>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 id={`${sectionId}-heading`} className="mt-2 text-[clamp(1.7rem,3.6vw,2.6rem)] uppercase">{children}</h2>
    </div>
  );
}

function Intro({ children }: ContentProps) {
  return <p className="-mt-4 mb-8 max-w-(--measure) text-lg text-muted">{children}</p>;
}

function More({ href, children }: ContentProps & { href: string }) {
  return <p className="mt-10"><SiteLink href={href} className="button button-quiet">{children} <span aria-hidden="true">→</span></SiteLink></p>;
}

export const Section = Object.assign(SectionBlock, { Heading, Intro, More });

/** Two-column split used inside sections. */
export function Split({ children }: ContentProps) {
  return <div className="grid gap-8 md:grid-cols-2 md:gap-10">{children}</div>;
}

/** Letterpress panel with an optional heading. */
export function Plate({ title, children, className = '' }: ContentProps & { title?: ReactNode; className?: string }) {
  return (
    <div className={`panel p-6 sm:p-8 ${className}`}>
      {title ? <h3 className="mb-3 border-b border-dotted border-rule pb-2 text-lg uppercase tracking-[.03em]">{title}</h3> : null}
      <div className="grid gap-3">{children}</div>
    </div>
  );
}

/** Grid of info tiles, e.g. tours, events and kegs. */
function TileGrid({ children }: ContentProps) {
  return <div className="grid gap-6 md:grid-cols-3">{children}</div>;
}

function Tile({ number, title, children }: ContentProps & { number: string; title: ReactNode }) {
  return (
    <article className="panel flex flex-col p-6 text-center sm:p-8">
      <p className="mx-auto grid size-16 place-items-center rounded-full border-2 border-flourish font-display text-2xl leading-none text-flourish shadow-[inset_0_0_0_3px_var(--surface),inset_0_0_0_4px_var(--flourish)]" aria-hidden="true">{number}</p>
      <h3 className="mt-4 text-xl uppercase tracking-[.03em]">{title}</h3>
      <div className="mt-3 grid flex-1 content-start gap-3 text-muted">{children}</div>
    </article>
  );
}

function TileLink({ href, children }: ContentProps & { href: string }) {
  return <p className="mt-auto pt-3"><SiteLink href={href} className="text-link">{children}</SiteLink></p>;
}

export const Tiles = Object.assign(TileGrid, { Tile, Link: TileLink });

/** Full-width notice card: responsible service, allergens and other small print visitors must see. */
export function Notice({ children, tone = 'brass' }: ContentProps & { tone?: 'brass' | 'plain' }) {
  return (
    <div className={tone === 'brass'
      ? 'flex items-start gap-4 rounded-[3px] border-2 border-[#2a1a10] bg-[#d6a23a] p-5 font-bold text-[#2a1a10] shadow-[inset_0_0_0_4px_#d6a23a,inset_0_0_0_5px_#2a1a10]'
      : 'panel flex items-start gap-4 p-5'}>
      <span aria-hidden="true" className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full border-2 border-current font-display text-sm">!</span>
      <div className="grid gap-1">{children}</div>
    </div>
  );
}
