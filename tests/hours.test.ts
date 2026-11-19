import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DAYS, openingLabel, validateHours, type OpeningHours } from '../lib/hours.ts';

const hours: OpeningHours[] = DAYS.map(day => day === 'Monday' ? { day } : { day, opens: '09:00', closes: '17:00' });
const at = (date: string, zone = 'America/New_York') => openingLabel(hours, zone, new Date(date));
test('opening inclusive, closing exclusive; business zone wins over visitor zone', () => {
  assert.equal(at('2026-11-17T13:59:00Z'), 'Closed · opens today at 09:00');
  assert.equal(at('2026-11-17T14:00:00Z'), 'Open now · until 17:00');
  assert.equal(at('2026-11-17T22:00:00Z'), 'Closed · opens Wednesday at 09:00');
  assert.equal(at('2026-11-17T14:00:00Z', 'Asia/Tokyo'), 'Closed · opens Wednesday at 09:00');
});
test('closed weekdays and week wrap find the next service', () => {
  assert.equal(at('2026-11-16T18:00:00Z'), 'Closed · opens Tuesday at 09:00');
  assert.equal(at('2026-11-15T23:00:00Z'), 'Closed · opens Tuesday at 09:00');
  assert.equal(openingLabel(DAYS.map(day => ({ day })), 'UTC'), 'Closed · see opening hours');
});
test('missing/invalid zones stay neutral and DST changes preserve local service times', () => {
  assert.equal(at('2026-11-17T14:00:00Z', ''), 'See opening hours');
  assert.equal(at('2026-11-17T14:00:00Z', 'Mars/Base'), 'See opening hours');
  assert.equal(at('2026-03-08T12:59:00Z'), 'Closed · opens today at 09:00');
  assert.equal(at('2026-03-08T13:00:00Z'), 'Open now · until 17:00');
  assert.equal(at('2026-11-01T13:59:00Z'), 'Closed · opens today at 09:00');
  assert.equal(at('2026-11-01T14:00:00Z'), 'Open now · until 17:00');
});
test('invalid/incomplete/overnight intervals name the weekday to fix', () => {
  assert.doesNotThrow(() => validateHours(hours));
  for (const opens of ['24:00', '9:00', '18:00']) assert.throws(() => validateHours(hours.map(x => x.day === 'Tuesday' ? { ...x, opens } : x)), /Tuesday/);
  assert.throws(() => validateHours(hours.slice(1)), /Monday/);
  assert.throws(() => validateHours(hours.map(x => x.day === 'Tuesday' ? { ...x, closes: undefined } : x)), /Tuesday/);
});

import { business } from '../content/business.ts';
const taproom = (date: string) => openingLabel(business.hours, 'America/Los_Angeles', new Date(date));
test('taproom hours: Tuesday 15:00 opens, 22:00 closes, Monday is closed all day', () => {
  assert.equal(taproom('2026-11-17T22:59:00Z'), 'Closed · opens today at 15:00');
  assert.equal(taproom('2026-11-17T23:00:00Z'), 'Open now · until 22:00');
  assert.equal(taproom('2026-11-18T05:59:00Z'), 'Open now · until 22:00');
  assert.equal(taproom('2026-11-18T06:00:00Z'), 'Closed · opens Wednesday at 15:00');
  assert.equal(taproom('2026-11-16T20:00:00Z'), 'Closed · opens Tuesday at 15:00');
  assert.equal(taproom('2026-11-17T02:00:00Z'), 'Closed · opens Tuesday at 15:00');
});
test('taproom hours: Saturday 12:00 opening holds across both Pacific DST changes', () => {
  for (const [before, at] of [
    ['2026-03-07T19:59:00Z', '2026-03-07T20:00:00Z'], // PST, before spring forward
    ['2026-03-14T18:59:00Z', '2026-03-14T19:00:00Z'], // PDT, after spring forward
    ['2026-10-31T18:59:00Z', '2026-10-31T19:00:00Z'], // PDT, before fall back
    ['2026-11-07T19:59:00Z', '2026-11-07T20:00:00Z'], // PST, after fall back
  ]) {
    assert.equal(taproom(before), 'Closed · opens today at 12:00', before);
    assert.equal(taproom(at), 'Open now · until 23:00', at);
  }
});
test('taproom hours stay same-day: an overnight Friday fails validation', () => {
  assert.throws(() => validateHours(business.hours.map(x => x.day === 'Friday' ? { ...x, closes: '01:00' } : x)), /Friday/);
});
