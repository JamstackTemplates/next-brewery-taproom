// Tall Tales Brewing Co. is a fictitious brewery used as a Jamstacks gallery sample.
// Every detail here is placeholder data. Replace it with the real taproom's details before publishing.
// The address is a public landmark (Pioneer Courthouse Square, Portland) so the map has something to show.
// Plain strings only: text is rendered as text, never as HTML.
import { validateHours, type Day, type OpeningHours } from '../lib/hours.ts';

export interface BusinessAddress {
  street: string;
  locality: string;
  /** State or region code, e.g. OR. */
  region: string;
  postalCode: string;
  /** ISO 3166-1 alpha-2 country code, e.g. US. */
  country: string;
}

export interface BreweryTour {
  /** Days tours run; each must be an open day in `hours`. */
  days: Day[];
  /** Local HH:MM start times; each tour must finish before closing. */
  times: string[];
  /** Tour length in minutes. */
  minutes: number;
  /** Price per person in USD cents (1800 = $18.00). */
  priceCents: number;
  /** Tasters included in the price. */
  tasters: number;
}

export interface Business {
  /** Public display name; also update site.config.json's name when renaming. */
  name: string;
  /** Short brand line used in metadata, the footer and the OG image alt text. */
  tagline: string;
  /** Plain-text introduction used by fallback metadata and structured data. */
  introduction: string;
  /** Public contact address, never a private notification destination. */
  email: string;
  /** Public number; blank hides it. */
  phone: string;
  /** Premises address; also the map query. */
  address: BusinessAddress;
  /** Short "getting here" notes shown on Home and Visit. */
  directions: string[];
  /** Seven same-day records in the site.config.json time zone. Overnight hours are unsupported. */
  hours: OpeningHours[];
  /** Brewhouse tour details shown on Visit. Tours are enquiries until the brewery replies. */
  tour: BreweryTour;
  /** Responsible-service line shown on Home, Visit and in the footer. */
  responsibleService: string;
  /** Contact copy; the hosted form supports name, email and message only. */
  enquiries: {
    /** Contact page heading. */
    title: string;
    /** No booking, payment or delivery promises. */
    introduction: string;
    /** Suggestions for the message, not additional form inputs. */
    usefulToInclude: string[];
  };
}

export const business: Business = {
  name: 'Tall Tales Brewing Co.',
  tagline: 'Brewed in the back. Poured up front.',
  introduction: 'Tall Tales Brewing Co. pours small-batch beer from a vintage brick taproom in downtown Portland, with a rotating food truck every night we’re open.',
  email: 'taproom@example.com',
  phone: '(503) 555-0187',
  address: {
    street: '701 SW 6th Ave',
    locality: 'Portland',
    region: 'OR',
    postalCode: '97204',
    country: 'US',
  },
  directions: [
    'MAX light rail: Pioneer Square North and South stops are a one-minute walk.',
    'Bike racks out front. There’s no on-site parking, so the SmartPark garages are your best bet.',
  ],
  hours: [
    { day: 'Monday' },
    { day: 'Tuesday', opens: '15:00', closes: '22:00' },
    { day: 'Wednesday', opens: '15:00', closes: '22:00' },
    { day: 'Thursday', opens: '15:00', closes: '22:00' },
    { day: 'Friday', opens: '14:00', closes: '23:00' },
    { day: 'Saturday', opens: '12:00', closes: '23:00' },
    { day: 'Sunday', opens: '12:00', closes: '20:00' },
  ],
  tour: { days: ['Saturday'], times: ['13:00', '15:00'], minutes: 45, priceCents: 1800, tasters: 4 },
  responsibleService: '21+ to drink. Under 21s welcome with an adult until 8pm. Please drink responsibly and plan your ride home.',
  enquiries: {
    title: 'Tours, events & kegs',
    introduction: 'Ask about a brewhouse tour, a private event or wholesale kegs. Nothing is booked until we reply to confirm availability.',
    usefulToInclude: [
      'What you’re asking about: a tour, a private event or wholesale kegs',
      'For tours and events: your preferred date, time and group size',
      'For wholesale: your venue name and location, the beers you’re interested in and keg sizes',
    ],
  },
};

/** One line, e.g. "701 SW 6th Ave, Portland, OR 97204". Used for display and the map query. */
export function formatAddress(address: BusinessAddress = business.address): string {
  return `${address.street}, ${address.locality}, ${address.region} ${address.postalCode}`;
}

/** e.g. "Saturdays at 13:00 and 15:00 · 45 minutes · 4 tasters · $18 per person". */
export function formatTour(tour: BreweryTour = business.tour): string {
  const list = (items: string[]) => items.length > 1 ? `${items.slice(0, -1).join(', ')} and ${items.at(-1)}` : items[0];
  const price = tour.priceCents % 100 === 0 ? `$${tour.priceCents / 100}` : `$${(tour.priceCents / 100).toFixed(2)}`;
  return `${list(tour.days.map(day => `${day}s`))} at ${list(tour.times)} · ${tour.minutes} minutes · ${tour.tasters} tasters · ${price} per person`;
}

const minutesOf = (clock: string) => Number(clock.slice(0, 2)) * 60 + Number(clock.slice(3));

/** Throws with the field to fix. Runs on import so a bad edit fails the build. */
export function validateBusiness(value: Business): void {
  validateHours(value.hours);
  const { tour } = value;
  if (!Number.isInteger(tour.priceCents) || tour.priceCents <= 0) throw new Error('business.tour.priceCents: positive whole cents required');
  if (!Number.isInteger(tour.minutes) || tour.minutes <= 0) throw new Error('business.tour.minutes: positive whole minutes required');
  for (const day of tour.days) {
    const hours = value.hours.find(entry => entry.day === day);
    if (!hours?.opens || !hours.closes) throw new Error(`business.tour.days: the taproom is closed on ${day}`);
    for (const time of tour.times) {
      if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) throw new Error(`business.tour.times: "${time}" must be HH:MM`);
      if (minutesOf(time) < minutesOf(hours.opens) || minutesOf(time) + tour.minutes > minutesOf(hours.closes)) {
        throw new Error(`business.tour.times: the ${time} tour on ${day} must run within ${hours.opens}–${hours.closes}`);
      }
    }
  }
}

validateBusiness(business);
