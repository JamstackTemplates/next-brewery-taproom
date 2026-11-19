import assert from 'node:assert/strict';
import { test } from 'node:test';
import { business, formatAddress, formatTour, validateBusiness } from '../content/business.ts';
import { businessStructuredData, jsonLd } from '../lib/structured-data.ts';

test('business content has actionable required fields', () => {
  for (const key of ['name', 'tagline', 'introduction', 'email', 'responsibleService'] as const) assert.ok(business[key].trim(), `business.${key}: required`);
  assert.match(business.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'business.email: valid public email required');
  for (const key of ['street', 'locality', 'region', 'postalCode', 'country'] as const) assert.ok(business.address[key].trim(), `business.address.${key}: required`);
  assert.ok(business.directions.length, 'business.directions: add at least one note');
  assert.ok(business.enquiries.title.trim(), 'business.enquiries.title: required');
  assert.ok(business.enquiries.introduction.trim(), 'business.enquiries.introduction: required');
  assert.ok(business.enquiries.usefulToInclude.length, 'business.enquiries.usefulToInclude: include message guidance');
  for (const tip of business.enquiries.usefulToInclude) assert.ok(tip.trim(), 'business.enquiries.usefulToInclude: empty tip');
});

test('responsible-service wording covers the drinking age and under-21 rule', () => {
  assert.match(business.responsibleService, /21\+ to drink/);
  assert.match(business.responsibleService, /Under 21s welcome with an adult until 8pm/);
});

test('enquiry copy never claims a booking, order or payment is confirmed', () => {
  assert.match(business.enquiries.introduction, /until we reply to confirm/);
  for (const text of [business.enquiries.introduction, ...business.enquiries.usefulToInclude]) {
    assert.doesNotMatch(text, /\b(confirmed|booked for you|reserved|pay|payment|checkout|order online)\b/i, text);
  }
});

test('tour details are validated against Saturday hours and formatted from data', () => {
  assert.doesNotThrow(() => validateBusiness(business));
  assert.equal(formatTour(), 'Saturdays at 13:00 and 15:00 · 45 minutes · 4 tasters · $18 per person');
  assert.throws(() => validateBusiness({ ...business, tour: { ...business.tour, times: ['22:30'] } }), /22:30 tour on Saturday must run within 12:00–23:00/);
  assert.throws(() => validateBusiness({ ...business, tour: { ...business.tour, days: ['Monday'] } }), /closed on Monday/);
  assert.throws(() => validateBusiness({ ...business, tour: { ...business.tour, priceCents: 18.5 } }), /priceCents/);
});

test('Brewery structured data derives from content', () => {
  const data = businessStructuredData();
  assert.equal(data['@type'], 'Brewery');
  assert.equal(data.address.streetAddress, business.address.street);
  assert.ok(formatAddress().includes(business.address.postalCode));
  assert.equal(data.openingHoursSpecification.length, business.hours.filter(day => day.opens).length);
  assert.ok(!data.openingHoursSpecification.some(spec => spec.dayOfWeek.endsWith('Monday')), 'Monday is closed');
  assert.ok(!('servesCuisine' in data), 'food comes from independent trucks');
});

test('inline JSON-LD escapes closing script content without changing values', () => {
  const value = { name: '</script><script>alert(1)</script>', text: '< & >' };
  const encoded = jsonLd(value);
  assert.ok(!encoded.includes('<'), 'JSON-LD must escape <');
  assert.deepEqual(JSON.parse(encoded), value);
});
