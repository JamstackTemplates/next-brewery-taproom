'use client';
import { useEffect, useState } from 'react';
import { openingLabel, type OpeningHours } from '../lib/hours';
import { site } from '../lib/site';

/**
 * Open-now status computed in the browser in the business zone and refreshed every minute.
 * Static and no-JS output is the neutral `fallback`, so hours are never asserted at build time.
 */
export function OpenBadge({ hours, fallback = 'Taproom hours', className = '' }: {
  hours: readonly OpeningHours[]; fallback?: string; className?: string;
}) {
  const [label, setLabel] = useState(fallback);
  useEffect(() => {
    const update = () => {
      const next = openingLabel(hours, site.timeZone);
      setLabel(next === 'See opening hours' ? fallback : next);
    };
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, [hours, fallback]);
  const state = label.startsWith('Open now') ? 'open' : label.startsWith('Closed') ? 'closed' : 'neutral';
  return (
    <span className={`inline-flex items-center gap-2 text-[.82rem] font-bold uppercase tracking-[.12em] ${className}`} data-state={state}>
      <span aria-hidden="true" className={`size-2.5 rounded-full border-2 border-current ${state === 'open' ? 'bg-[#3fbf5a]' : state === 'closed' ? 'bg-[#c1272d]' : 'bg-transparent'}`} />
      <span>{label}</span>
    </span>
  );
}
