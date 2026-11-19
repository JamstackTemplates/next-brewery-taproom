// Food trucks parked outside the taproom. Trucks are independent and take their own payment.
// To swap tonight's truck, change `truckId` on that day in `schedule`. Validation runs on import.
import { business } from './business.ts';
import { clockMinutes, DAYS, type Day, type OpeningHours } from '../lib/hours.ts';

export const DIETARY = {
  vegetarian: 'Vegetarian',
  'vegan-options': 'Vegan options',
  'gluten-free-options': 'Gluten-free options',
} as const;
export type Dietary = keyof typeof DIETARY;

export interface FoodTruck {
  /** Stable URL-safe slug, referenced by `schedule`. */
  id: string;
  name: string;
  cuisine: string;
  /** One line about the food. */
  description: string;
  dietary: Dietary[];
}

export interface ScheduleEntry {
  day: Day;
  /** A truck id, or null when the taproom is closed or nobody is booked. */
  truckId: string | null;
  /** Local HH:MM serving window; required with a truck and must sit inside the day's taproom hours. */
  serves?: { from: string; until: string };
}

export const trucks: FoodTruck[] = [
  {
    id: 'smoke-signal-bbq', name: 'Smoke Signal BBQ', cuisine: 'Texas-style barbecue',
    description: 'Post-oak brisket, burnt ends and jalapeño cheddar sausage by the half pound.',
    dietary: ['gluten-free-options'],
  },
  {
    id: 'two-wheel-tacos', name: 'Two Wheel Tacos', cuisine: 'Mexican street tacos',
    description: 'Al pastor off the trompo, crispy mushroom tacos and hand-pressed tortillas.',
    dietary: ['vegetarian', 'gluten-free-options'],
  },
  {
    id: 'pierogi-rig', name: 'The Pierogi Rig', cuisine: 'Polish dumplings',
    description: 'Potato-cheddar and sauerkraut pierogi, pan-fried with onions and sour cream.',
    dietary: ['vegetarian'],
  },
  {
    id: 'green-machine', name: 'Green Machine', cuisine: 'Plant-based burgers',
    description: 'Smash-style plant burgers, loaded fries and a very good black bean melt.',
    dietary: ['vegetarian', 'vegan-options'],
  },
  {
    id: 'night-noodle', name: 'Night Noodle Co.', cuisine: 'Thai noodles and curries',
    description: 'Wok-charred pad see ew, khao soi and a green curry that bites back.',
    dietary: ['vegan-options', 'gluten-free-options'],
  },
];

export const schedule: ScheduleEntry[] = [
  { day: 'Monday', truckId: null },
  { day: 'Tuesday', truckId: 'two-wheel-tacos', serves: { from: '16:00', until: '21:00' } },
  { day: 'Wednesday', truckId: 'pierogi-rig', serves: { from: '16:00', until: '21:00' } },
  { day: 'Thursday', truckId: 'green-machine', serves: { from: '16:00', until: '21:00' } },
  { day: 'Friday', truckId: 'smoke-signal-bbq', serves: { from: '15:00', until: '22:00' } },
  { day: 'Saturday', truckId: 'night-noodle', serves: { from: '12:00', until: '22:00' } },
  { day: 'Sunday', truckId: 'two-wheel-tacos', serves: { from: '12:00', until: '19:00' } },
];

export function truckById(id: string | null, list: readonly FoodTruck[] = trucks): FoodTruck | undefined {
  return id ? list.find(truck => truck.id === id) : undefined;
}

const clock = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Throws with the truck id or weekday to fix. */
export function validateFoodTrucks(list: readonly FoodTruck[], days: readonly ScheduleEntry[], hours: readonly OpeningHours[]): void {
  const ids = new Set<string>();
  for (const truck of list) {
    const where = `food-trucks: "${truck.id || truck.name || '(unnamed truck)'}"`;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(truck.id)) throw new Error(`${where}: id must be lowercase letters, numbers and hyphens`);
    if (ids.has(truck.id)) throw new Error(`${where}: id is used by more than one truck`);
    ids.add(truck.id);
    for (const field of ['name', 'cuisine', 'description'] as const) {
      if (!truck[field]?.trim()) throw new Error(`${where}: ${field} is required`);
    }
    for (const tag of truck.dietary) if (!(tag in DIETARY)) throw new Error(`${where}: dietary tag "${tag}" must be one of ${Object.keys(DIETARY).join(', ')}`);
  }
  if (days.length !== 7) throw new Error('food-trucks: schedule needs exactly seven days');
  for (const day of DAYS) {
    const matches = days.filter(entry => entry.day === day);
    if (matches.length !== 1) throw new Error(`food-trucks: schedule ${day} must occur exactly once`);
    const entry = matches[0];
    const open = hours.find(value => value.day === day);
    if (entry.truckId === null) continue;
    const where = `food-trucks: schedule ${day}`;
    if (!ids.has(entry.truckId)) throw new Error(`${where}: truckId "${entry.truckId}" isn't in trucks`);
    if (!open?.opens || !open.closes) throw new Error(`${where}: the taproom is closed, so no truck can be scheduled`);
    const serves = entry.serves;
    if (!serves || !clock.test(serves.from) || !clock.test(serves.until)) throw new Error(`${where}: serves needs HH:MM from and until`);
    const from = clockMinutes(serves.from), until = clockMinutes(serves.until);
    if (from >= until) throw new Error(`${where}: serves must start before it ends`);
    if (from < clockMinutes(open.opens) || until > clockMinutes(open.closes)) {
      throw new Error(`${where}: serves ${serves.from}–${serves.until} must sit inside taproom hours ${open.opens}–${open.closes}`);
    }
  }
}

validateFoodTrucks(trucks, schedule, business.hours);
