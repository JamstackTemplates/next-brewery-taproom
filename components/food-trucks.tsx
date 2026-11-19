'use client';
import type { ReactNode } from 'react';
import { DIETARY, truckById, type FoodTruck, type ScheduleEntry } from '../content/food-trucks';
import type { OpeningHours } from '../lib/hours';
import { useBusinessNow } from './use-business-now';

const short = (day: string) => day.slice(0, 3);
const isClosed = (hours: readonly OpeningHours[], day: string) => !hours.find(entry => entry.day === day)?.opens;

/** Seven-day line-up table. Today's row is highlighted only in the browser, in the business zone. */
export function TruckLineup({ schedule, trucks, hours, closedLabel, noTruckLabel, caption }: {
  schedule: readonly ScheduleEntry[];
  trucks: readonly FoodTruck[];
  hours: readonly OpeningHours[];
  closedLabel: string;
  noTruckLabel: string;
  caption: string;
}) {
  const now = useBusinessNow();
  return (
    <div className="panel overflow-x-auto p-3 sm:p-5">
      <table className="ledger">
        <caption className="sr-only">{caption}</caption>
        <thead className="sr-only"><tr><th scope="col">Day</th><th scope="col">Truck</th><th scope="col">Serving</th></tr></thead>
        <tbody>
          {schedule.map(entry => {
            const truck = truckById(entry.truckId, trucks);
            const today = now?.day === entry.day;
            return (
              <tr key={entry.day} data-today={today ? 'true' : undefined}>
                <th scope="row" className="tabular w-16 font-bold uppercase">
                  {short(entry.day)}{today ? <span className="sr-only"> (today)</span> : null}
                </th>
                <td>
                  {truck ? <>
                    <span className="font-display tracking-[.02em]">{truck.name}</span>
                    <span className="block text-sm opacity-80">{truck.cuisine}</span>
                  </> : <span className="font-bold">{isClosed(hours, entry.day) ? closedLabel : noTruckLabel}</span>}
                </td>
                <td className="tabular whitespace-nowrap text-right">{entry.serves ? `${entry.serves.from}–${entry.serves.until}` : '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/**
 * Home "Tonight's truck". With JavaScript: today's truck in the business zone.
 * Before hydration and without JavaScript: the whole week's line-up, so nothing is asserted statically.
 */
export function TonightTruck({ schedule, trucks, hours, children, closedText, noTruckText }: {
  schedule: readonly ScheduleEntry[];
  trucks: readonly FoodTruck[];
  hours: readonly OpeningHours[];
  /** Link to the full line-up. */
  children: ReactNode;
  closedText: string;
  noTruckText: string;
}) {
  const now = useBusinessNow();
  const entry = now ? schedule.find(value => value.day === now.day) : undefined;
  const truck = entry ? truckById(entry.truckId, trucks) : undefined;
  return (
    <div className="panel p-6 sm:p-8">
      {entry ? (
        truck ? <div>
          <p className="eyebrow">Today · {entry.serves!.from}–{entry.serves!.until}</p>
          <p className="mt-2 font-display text-3xl uppercase leading-tight tracking-[.02em]">{truck.name}</p>
          <p className="script mt-1 text-2xl text-flourish">{truck.cuisine}</p>
          <p className="mt-3 text-muted">{truck.description}</p>
          <DietaryTags tags={truck.dietary} />
        </div> : <p className="font-display text-2xl">{isClosed(hours, entry.day) ? closedText : noTruckText}</p>
      ) : (
        <ul className="grid gap-2">
          {schedule.map(value => {
            const listed = truckById(value.truckId, trucks);
            return <li key={value.day} className="flex flex-wrap gap-x-3 border-b border-line pb-2 last:border-0">
              <span className="tabular w-12 font-bold uppercase">{short(value.day)}</span>
              <span>{listed ? <><span className="font-bold">{listed.name}</span> <span className="text-muted">· {listed.cuisine}</span></> : <span className="text-muted">{isClosed(hours, value.day) ? closedText : noTruckText}</span>}</span>
            </li>;
          })}
        </ul>
      )}
      <div className="mt-6">{children}</div>
    </div>
  );
}

export function DietaryTags({ tags }: { tags: readonly FoodTruck['dietary'][number][] }) {
  if (!tags.length) return null;
  return (
    <ul className="mt-4 flex flex-wrap gap-2" aria-label="Dietary options">
      {tags.map(tag => <li key={tag} className="tag">{DIETARY[tag]}</li>)}
    </ul>
  );
}
