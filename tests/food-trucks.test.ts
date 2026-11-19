import assert from 'node:assert/strict';
import { test } from 'node:test';
import { business } from '../content/business.ts';
import { schedule, truckById, trucks, validateFoodTrucks, type ScheduleEntry } from '../content/food-trucks.ts';

const on = (day: string, change: Partial<ScheduleEntry>) => schedule.map(entry => entry.day === day ? { ...entry, ...change } : entry);
const fails = (days: ScheduleEntry[], pattern: RegExp, list = trucks) => assert.throws(() => validateFoodTrucks(list, days, business.hours), pattern);

test('the published trucks and line-up are valid', () => {
  assert.doesNotThrow(() => validateFoodTrucks(trucks, schedule, business.hours));
  assert.equal(truckById('night-noodle')?.name, 'Night Noodle Co.');
});

test('truck ids are unique and every scheduled truck exists', () => {
  fails(schedule, /"pierogi-rig": id is used by more than one truck/, [...trucks, { ...trucks[2] }]);
  fails(on('Wednesday', { truckId: 'pizza-van' }), /schedule Wednesday: truckId "pizza-van" isn't in trucks/);
});

test('exactly seven days, each once', () => {
  fails(schedule.slice(1), /seven days/);
  fails([...schedule.slice(0, 6), { ...schedule[0] }], /Sunday must occur exactly once|Monday must occur exactly once/);
});

test('serving windows sit inside taproom hours, and closed days have no truck', () => {
  fails(on('Tuesday', { serves: { from: '14:00', until: '21:00' } }), /schedule Tuesday: serves 14:00–21:00 must sit inside taproom hours 15:00–22:00/);
  fails(on('Sunday', { serves: { from: '12:00', until: '20:30' } }), /schedule Sunday/);
  fails(on('Friday', { serves: { from: '22:00', until: '15:00' } }), /schedule Friday: serves must start before it ends/);
  fails(on('Monday', { truckId: 'two-wheel-tacos', serves: { from: '16:00', until: '20:00' } }), /schedule Monday: the taproom is closed/);
  fails(on('Thursday', { serves: undefined }), /schedule Thursday: serves needs HH:MM/);
});

test('owner edit: swapping a night’s truck is a single valid change', () => {
  const swapped = on('Thursday', { truckId: 'smoke-signal-bbq' });
  assert.doesNotThrow(() => validateFoodTrucks(trucks, swapped, business.hours));
  assert.equal(swapped.find(entry => entry.day === 'Thursday')!.truckId, 'smoke-signal-bbq');
  assert.doesNotThrow(() => validateFoodTrucks(trucks, on('Wednesday', { truckId: null, serves: undefined }), business.hours));
});
