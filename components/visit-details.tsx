import type { ReactNode } from 'react';
import { business, formatAddress } from '../content/business';
import { DAYS, type OpeningHours } from '../lib/hours';
import { mapDirectionsUrl } from '../lib/maps';
import { TimeZoneNote } from './time-zone-note';

/** Weekly hours table from content/business.ts; static, so it is the same with or without JavaScript. */
export function HoursTable({ hours = business.hours, caption }: { hours?: readonly OpeningHours[]; caption: string }) {
  return (
    <div>
      <table className="ledger">
        <caption className="sr-only">{caption}</caption>
        <tbody>
          {DAYS.map(day => {
            const entry = hours.find(value => value.day === day)!;
            return <tr key={day}>
              <th scope="row" className="font-bold">{day}</th>
              <td className="tabular text-right">{entry.opens ? `${entry.opens}–${entry.closes}` : 'Closed'}</td>
            </tr>;
          })}
        </tbody>
      </table>
      <TimeZoneNote />
    </div>
  );
}

/** Street address with a directions link. */
export function Address({ children }: { children?: ReactNode }) {
  const line = formatAddress();
  return (
    <div className="grid gap-2">
      <address className="font-display text-lg not-italic leading-snug tracking-[.02em]">
        {business.address.street}<br />{business.address.locality}, {business.address.region} {business.address.postalCode}
      </address>
      <p><a className="text-link" href={mapDirectionsUrl(line)} rel="noopener">{children ?? 'Get directions'}</a></p>
    </div>
  );
}

/** "Getting here" notes from content/business.ts. */
export function Directions() {
  return <Checklist>{business.directions.map(note => <li key={note}>{note}</li>)}</Checklist>;
}

/** Small list with square bullets for page-authored items. */
export function Checklist({ children }: { children: ReactNode }) {
  return <ul className="grid gap-2 [&>li]:flex [&>li]:gap-3 [&>li]:before:mt-2.5 [&>li]:before:size-2 [&>li]:before:shrink-0 [&>li]:before:rotate-45 [&>li]:before:bg-flourish [&>li]:before:content-['']">{children}</ul>;
}
