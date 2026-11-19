'use client';
import { useEffect, useState } from 'react';
import { zonedNow } from '../lib/hours';
import { site } from '../lib/site';

/**
 * The weekday and minutes in the business time zone (site.config.json), refreshed every minute.
 * Always null during the static build and before hydration, so no-JS output stays neutral.
 */
export function useBusinessNow() {
  const [now, setNow] = useState<ReturnType<typeof zonedNow>>(null);
  useEffect(() => {
    const update = () => setNow(zonedNow(site.timeZone));
    update();
    const timer = setInterval(update, 60_000);
    return () => clearInterval(timer);
  }, []);
  return now;
}
