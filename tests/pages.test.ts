import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import { ROUTES } from '../lib/routes.ts';

// Source-level checks for copy rules that must hold on specific pages.
const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const pages = { home: 'app/page.tsx', taps: 'app/taps/page.tsx', trucks: 'app/food-trucks/page.tsx', visit: 'app/visit/page.tsx', contact: 'app/contact/page.tsx', notFound: 'app/not-found.tsx' };

test('every route has a page and is in the sitemap list', () => {
  for (const route of ROUTES) {
    const file = route === '/' ? 'app/page.tsx' : `app${route}page.tsx`;
    assert.ok(existsSync(new URL(`../${file}`, import.meta.url)), `${route}: missing ${file}`);
    assert.ok(new RegExp(`pageMetadata\\(\\{\\s*path: '${route}'`).test(read(file)), `${route}: needs per-page metadata with its own canonical path`);
  }
});

test('responsible-service wording appears on Home, Visit and in the footer', () => {
  for (const file of [pages.home, pages.visit, 'components/site-footer.tsx']) {
    assert.match(read(file), /data-responsible-service>\{business\.responsibleService\}/, file);
  }
});

test('the allergen note appears on Taps', () => {
  assert.match(read(pages.taps), /All our beers contain gluten from barley or wheat unless marked otherwise\./);
});

test('no page offers online ordering, confirmed bookings or payment', () => {
  for (const file of [...Object.values(pages), 'content/business.ts']) {
    const source = read(file);
    assert.doesNotMatch(source, /order online|buy now|checkout|pay now|book now|you’re booked|you are booked|booking confirmed|order confirmed|reservation confirmed/i, file);
  }
  assert.match(read(pages.contact), /doesn’t\s+book anything/);
  assert.match(read(pages.visit), /isn’t booked until we reply/);
});
