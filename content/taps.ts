// The tap list. This is the file staff edit most: kick a keg, tap a new one, change a price.
// Each beer is one object. Validation runs on import, so a mistake fails the build with the beer's id.

/** Filter groups on /taps/, in display order, with their button labels. */
export const STYLE_FAMILIES = {
  lager: 'Lager & Pils',
  hoppy: 'Pale & IPA',
  sour: 'Sour & Wild',
  dark: 'Dark',
  'non-alcoholic': 'Non-alcoholic',
} as const;
export type StyleFamily = keyof typeof STYLE_FAMILIES;

/** Label colourways (vintage print inks). Colours live in app/tailwind.input.css (--label-<key> and --label-<key>-ink). */
export const LABELS = ['navy', 'mustard', 'hop', 'oxblood', 'cream', 'stout'] as const;
export type Label = typeof LABELS[number];

/** on-tap: pouring now · coming-soon: announced, not yet tapped · kicked: keg is empty. */
export const AVAILABILITY = ['on-tap', 'coming-soon', 'kicked'] as const;
export type Availability = typeof AVAILABILITY[number];

/** Pour sizes in the order shown on each can and in the legend. */
export const POURS = [
  { key: 'taster', name: 'Taster', size: '5 oz' },
  { key: 'half', name: 'Half pint', size: '8 oz' },
  { key: 'pint', name: 'Pint', size: '16 oz' },
  { key: 'crowler', name: 'Crowler to go', size: '32 oz' },
] as const;
export type Pour = typeof POURS[number]['key'];

export interface Beer {
  /** Stable URL-safe slug, unique across the list. Don't change it once published. */
  id: string;
  /** Tap number 1–12. Two `on-tap` beers can't share a tap. */
  tap: number;
  name: string;
  /** Style as printed on the can, e.g. "West Coast IPA". */
  style: string;
  /** Which filter group the beer appears under. */
  styleFamily: StyleFamily;
  /** Alcohol by volume in percent, 0–15, one decimal place. Non-alcoholic must be below 0.5. */
  abv: number;
  /** Bitterness 0–120. Leave out for sours and beers where it isn't meaningful. */
  ibu?: number;
  /** One sentence of tasting notes. */
  description: string;
  /** Label colourway for the beer's card. */
  label: Label;
  /** True only when the beer is brewed to be gluten-reduced. */
  glutenReduced: boolean;
  availability: Availability;
  /**
   * USD whole cents (700 = $7.00), rising from taster to crowler.
   * `pint` may be left out only above 10% ABV. Leave out `crowler` when the beer isn't sold to go.
   */
  prices: { taster: number; half: number; pint?: number; crowler?: number };
}

export const beers: Beer[] = [
  {
    id: 'foundry-pils', tap: 1, name: 'Foundry Pils', style: 'German Pilsner', styleFamily: 'lager',
    abv: 4.9, ibu: 34, label: 'mustard', glutenReduced: false, availability: 'on-tap',
    description: 'Crisp, floral and dry, the beer we drink after a shift.',
    prices: { taster: 300, half: 450, pint: 700, crowler: 1400 },
  },
  {
    id: 'night-shift-lager', tap: 2, name: 'Night Shift', style: 'Mexican-style Lager', styleFamily: 'lager',
    abv: 4.6, ibu: 18, label: 'cream', glutenReduced: false, availability: 'on-tap',
    description: 'Flaked corn, a clean snap and a squeeze of lime. Built for taco night.',
    prices: { taster: 300, half: 450, pint: 650, crowler: 1300 },
  },
  {
    id: 'tall-tale-ipa', tap: 3, name: 'Tall Tale IPA', style: 'West Coast IPA', styleFamily: 'hoppy',
    abv: 6.8, ibu: 65, label: 'hop', glutenReduced: false, availability: 'on-tap',
    description: 'Pine, grapefruit pith and a firm bitter finish. Our flagship.',
    prices: { taster: 300, half: 500, pint: 800, crowler: 1600 },
  },
  {
    id: 'fog-machine', tap: 4, name: 'Fog Machine', style: 'Hazy IPA', styleFamily: 'hoppy',
    abv: 6.4, ibu: 40, label: 'navy', glutenReduced: false, availability: 'on-tap',
    description: 'Soft oats, mango and stone fruit, juicy and low on bite.',
    prices: { taster: 300, half: 500, pint: 800, crowler: 1700 },
  },
  {
    id: 'rivet-pale', tap: 5, name: 'Rivet Pale', style: 'American Pale Ale', styleFamily: 'hoppy',
    abv: 5.4, ibu: 42, label: 'oxblood', glutenReduced: false, availability: 'on-tap',
    description: 'Orange peel and biscuit malt, balanced enough for a second round.',
    prices: { taster: 300, half: 450, pint: 750, crowler: 1500 },
  },
  {
    id: 'big-iron-dipa', tap: 6, name: 'Big Iron', style: 'Double IPA', styleFamily: 'hoppy',
    abv: 8.5, ibu: 85, label: 'stout', glutenReduced: false, availability: 'on-tap',
    description: 'Resin, dank citrus and a warming backbone. Pour it slow.',
    prices: { taster: 400, half: 600, pint: 950 },
  },
  {
    id: 'spark-gap-sour', tap: 7, name: 'Spark Gap', style: 'Raspberry Kettle Sour', styleFamily: 'sour',
    abv: 5.2, label: 'oxblood', glutenReduced: false, availability: 'on-tap',
    description: 'Tart, bright pink and loaded with Oregon raspberries.',
    prices: { taster: 350, half: 550, pint: 850, crowler: 1700 },
  },
  {
    id: 'shop-rag-saison', tap: 8, name: 'Shop Rag', style: 'Farmhouse Saison', styleFamily: 'sour',
    abv: 6.2, ibu: 28, label: 'mustard', glutenReduced: false, availability: 'on-tap',
    description: 'Peppery farmhouse yeast, hay and a bone-dry finish.',
    prices: { taster: 300, half: 500, pint: 800, crowler: 1600 },
  },
  {
    id: 'lathe-porter', tap: 9, name: 'Lathe', style: 'Robust Porter', styleFamily: 'dark',
    abv: 6.0, ibu: 38, label: 'stout', glutenReduced: false, availability: 'on-tap',
    description: 'Dark chocolate, toasted bread and a little smoke.',
    prices: { taster: 300, half: 500, pint: 750, crowler: 1500 },
  },
  {
    id: 'graveyard-shift-stout', tap: 10, name: 'Graveyard Shift', style: 'Oatmeal Coffee Stout', styleFamily: 'dark',
    abv: 7.2, ibu: 45, label: 'cream', glutenReduced: false, availability: 'kicked',
    description: 'Cold-brew coffee from down the block over a silky oat body.',
    prices: { taster: 350, half: 550, pint: 850, crowler: 1700 },
  },
  {
    id: 'clock-out-na', tap: 11, name: 'Clock Out', style: 'Non-alcoholic Hoppy Lager', styleFamily: 'non-alcoholic',
    abv: 0.4, ibu: 25, label: 'hop', glutenReduced: false, availability: 'on-tap',
    description: 'All the citrus hop snap, none of the morning after.',
    prices: { taster: 200, half: 350, pint: 550 },
  },
  {
    id: 'tall-order-barleywine', tap: 12, name: 'Tall Order', style: 'English Barleywine', styleFamily: 'dark',
    abv: 11.2, ibu: 70, label: 'navy', glutenReduced: false, availability: 'coming-soon',
    description: 'Toffee, dried fig and a long warming finish. Served in small pours.',
    prices: { taster: 500, half: 700 },
  },
];

/** Beers pouring now, in tap order. */
export function pouringNow(list: readonly Beer[] = beers): Beer[] {
  return list.filter(beer => beer.availability === 'on-tap').sort((a, b) => a.tap - b.tap);
}

/** All beers in board order: on tap, then coming soon, then kicked; tap order within each. */
export function tapBoard(list: readonly Beer[] = beers): Beer[] {
  const rank = (beer: Beer) => AVAILABILITY.indexOf(beer.availability);
  return [...list].sort((a, b) => rank(a) - rank(b) || a.tap - b.tap);
}

/** "$7", "$4.50". */
export function formatPrice(cents: number): string {
  return cents % 100 === 0 ? `$${cents / 100}` : `$${(cents / 100).toFixed(2)}`;
}

/** Throws with the beer id and field to fix. */
export function validateBeers(list: readonly Beer[]): void {
  const ids = new Set<string>();
  const taps = new Map<number, string>();
  for (const beer of list) {
    const where = `taps: "${beer.id || beer.name || '(unnamed beer)'}"`;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(beer.id)) throw new Error(`${where}: id must be lowercase letters, numbers and hyphens`);
    if (ids.has(beer.id)) throw new Error(`${where}: id is used by more than one beer`);
    ids.add(beer.id);
    for (const field of ['name', 'style', 'description'] as const) {
      if (typeof beer[field] !== 'string' || !beer[field].trim()) throw new Error(`${where}: ${field} is required`);
    }
    if (!Number.isInteger(beer.tap) || beer.tap < 1 || beer.tap > 12) throw new Error(`${where}: tap must be a whole number from 1 to 12`);
    if (!(beer.styleFamily in STYLE_FAMILIES)) throw new Error(`${where}: styleFamily "${beer.styleFamily}" must be one of ${Object.keys(STYLE_FAMILIES).join(', ')}`);
    if (!LABELS.includes(beer.label)) throw new Error(`${where}: label "${beer.label}" must be one of ${LABELS.join(', ')}`);
    if (!AVAILABILITY.includes(beer.availability)) throw new Error(`${where}: availability "${beer.availability}" must be one of ${AVAILABILITY.join(', ')}`);
    if (typeof beer.glutenReduced !== 'boolean') throw new Error(`${where}: glutenReduced must be true or false`);
    if (!Number.isFinite(beer.abv) || beer.abv < 0 || beer.abv > 15 || Math.round(beer.abv * 10) !== beer.abv * 10) {
      throw new Error(`${where}: abv must be 0–15 with at most one decimal place`);
    }
    if (beer.styleFamily === 'non-alcoholic' && beer.abv >= 0.5) throw new Error(`${where}: non-alcoholic beers must be below 0.5% ABV`);
    if (beer.ibu !== undefined && (!Number.isInteger(beer.ibu) || beer.ibu < 0 || beer.ibu > 120)) throw new Error(`${where}: ibu must be a whole number from 0 to 120`);

    const present = POURS.flatMap(pour => beer.prices[pour.key] === undefined ? [] : [[pour.key, beer.prices[pour.key]!] as const]);
    for (const [pour, cents] of present) {
      if (!Number.isInteger(cents) || cents <= 0) throw new Error(`${where}: prices.${pour} must be positive whole cents`);
    }
    for (const required of ['taster', 'half'] as const) {
      if (beer.prices[required] === undefined) throw new Error(`${where}: prices.${required} is required`);
    }
    if (beer.abv <= 10 && beer.prices.pint === undefined) throw new Error(`${where}: prices.pint is required at 10% ABV or below`);
    for (let i = 1; i < present.length; i++) {
      if (present[i][1] <= present[i - 1][1]) throw new Error(`${where}: prices.${present[i][0]} must cost more than prices.${present[i - 1][0]}`);
    }

    if (beer.availability === 'on-tap') {
      const other = taps.get(beer.tap);
      if (other) throw new Error(`taps: "${other}" and "${beer.id}" are both on tap ${beer.tap}`);
      taps.set(beer.tap, beer.id);
    }
  }
}

validateBeers(beers);
