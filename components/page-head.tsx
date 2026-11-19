import type { ReactNode } from 'react';

/** Heading block for inner pages on a sunburst: ornament, eyebrow, wood-type title and a lede, closed by a double rule. */
export function PageHead({ eyebrow, title, children, id, before, aside }: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  id?: string;
  /** Optional illustration above the eyebrow. */
  before?: ReactNode;
  /** Optional status block beside the heading on wide screens (e.g. the open badge). */
  aside?: ReactNode;
}) {
  return (
    <header className="sunburst rule-double">
      <div className="wrap grid gap-6 pt-[clamp(2.5rem,6vw,4.5rem)] pb-[clamp(2rem,4vw,3rem)] md:grid-cols-[1fr_auto] md:items-end">
        <div>
          {before}
          <span className="ornament" aria-hidden="true"><span /></span>
          <p className="eyebrow">{eyebrow}</p>
          <h1 id={id} className="mt-3 mb-5 max-w-[18ch] text-[clamp(2.2rem,5.5vw,4rem)] uppercase">{title}</h1>
          {children ? <div className="max-w-(--measure) text-[clamp(1.08rem,1.6vw,1.25rem)] text-muted">{children}</div> : null}
        </div>
        {aside ? <div>{aside}</div> : null}
      </div>
    </header>
  );
}
