'use client';
import { useEffect, useState } from 'react';
import { AVAILABILITY, STYLE_FAMILIES, tapBoard, type Availability, type Beer, type StyleFamily } from '../content/taps';
import { TapCard } from './tap-card';

type Filter = StyleFamily | 'all';

/**
 * The full tap list grouped by availability, with a style filter.
 * Without JavaScript the buttons are not rendered and every beer is visible.
 * The selected style is kept in ?style= so a filtered board can be shared.
 */
export function TapBoard({ beers, groups, filterLabel }: {
  beers: readonly Beer[];
  /** Group headings in board order. */
  groups: Record<Availability, string>;
  /** Accessible name for the filter buttons. */
  filterLabel: string;
}) {
  const [enhanced, setEnhanced] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');

  useEffect(() => {
    setEnhanced(true);
    const style = new URLSearchParams(window.location.search).get('style');
    if (style && style in STYLE_FAMILIES) setFilter(style as StyleFamily);
  }, []);

  function choose(next: Filter) {
    setFilter(next);
    const url = new URL(window.location.href);
    if (next === 'all') url.searchParams.delete('style'); else url.searchParams.set('style', next);
    window.history.replaceState(window.history.state, '', url);
  }

  const visible = tapBoard(beers).filter(beer => filter === 'all' || beer.styleFamily === filter);
  const pouring = visible.filter(beer => beer.availability === 'on-tap').length;
  const options: [Filter, string][] = [['all', 'All'], ...Object.entries(STYLE_FAMILIES) as [StyleFamily, string][]];

  return (
    <div>
      {enhanced ? (
        <div className="no-print mb-8 flex flex-wrap items-center gap-2" role="group" aria-label={filterLabel}>
          {options.map(([value, text]) => (
            <button key={value} type="button" className="filter-button" aria-pressed={filter === value} onClick={() => choose(value)}>{text}</button>
          ))}
          <p className="tabular ml-auto text-sm text-muted" role="status" aria-live="polite">
            {visible.length === 0 ? 'Nothing in this style right now.' : `${pouring} pouring · ${visible.length} listed`}
          </p>
        </div>
      ) : null}
      {AVAILABILITY.map(availability => {
        const items = visible.filter(beer => beer.availability === availability);
        if (!items.length) return null;
        return (
          <section key={availability} aria-labelledby={`group-${availability}`} className="mb-12">
            <h2 id={`group-${availability}`} className="mb-5 flex items-center gap-3 text-2xl uppercase tracking-[.03em]">
              <span className="ornament mb-0! w-14!" aria-hidden="true"><span /></span>
              {groups[availability]}
              <span className="tabular font-sans text-lg font-bold text-muted">({items.length})</span>
            </h2>
            <div className="tap-grid grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map(beer => <TapCard key={beer.id} beer={beer} />)}
            </div>
          </section>
        );
      })}
    </div>
  );
}
