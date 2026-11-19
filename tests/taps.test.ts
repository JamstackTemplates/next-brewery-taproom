import assert from 'node:assert/strict';
import { test } from 'node:test';
import { beers, formatPrice, pouringNow, tapBoard, validateBeers, type Beer } from '../content/taps.ts';

const edit = (id: string, change: Partial<Beer>) => beers.map(beer => beer.id === id ? { ...beer, ...change } : beer);
const fails = (list: Beer[], pattern: RegExp) => assert.throws(() => validateBeers(list), pattern);

test('the published tap list is valid', () => {
  assert.doesNotThrow(() => validateBeers(beers));
  assert.equal(beers.length, 12);
});

test('ids must be unique and URL-safe, naming the beer', () => {
  fails(edit('rivet-pale', { id: 'foundry-pils' }), /"foundry-pils": id is used by more than one beer/);
  fails(edit('rivet-pale', { id: 'Rivet Pale' }), /"Rivet Pale": id must be lowercase/);
});

test('two on-tap beers on one tap name both ids; kicked kegs can share a tap', () => {
  fails(edit('fog-machine', { tap: 3 }), /"tall-tale-ipa" and "fog-machine" are both on tap 3/);
  assert.doesNotThrow(() => validateBeers(edit('graveyard-shift-stout', { tap: 9 })));
  fails(edit('lathe-porter', { tap: 13 }), /"lathe-porter": tap must be a whole number from 1 to 12/);
  fails(edit('lathe-porter', { tap: 2.5 }), /"lathe-porter": tap/);
});

test('ABV, IBU and the non-alcoholic limit are checked per beer', () => {
  fails(edit('big-iron-dipa', { abv: 15.5 }), /"big-iron-dipa": abv must be 0–15/);
  fails(edit('big-iron-dipa', { abv: 8.55 }), /"big-iron-dipa": abv .*one decimal/);
  fails(edit('clock-out-na', { abv: 0.5 }), /"clock-out-na": non-alcoholic beers must be below 0.5% ABV/);
  fails(edit('tall-tale-ipa', { ibu: 130 }), /"tall-tale-ipa": ibu/);
  assert.equal(beers.find(beer => beer.id === 'spark-gap-sour')!.ibu, undefined);
});

test('labels, families and availability come from fixed sets', () => {
  fails(edit('rivet-pale', { label: 'pink' as never }), /"rivet-pale": label "pink"/);
  fails(edit('rivet-pale', { styleFamily: 'wheat' as never }), /"rivet-pale": styleFamily "wheat"/);
  fails(edit('rivet-pale', { availability: 'sold-out' as never }), /"rivet-pale": availability "sold-out"/);
  fails(edit('rivet-pale', { description: ' ' }), /"rivet-pale": description is required/);
});

test('prices are positive cents rising from taster to crowler; pints are required at 10% ABV or below', () => {
  const pils = beers.find(beer => beer.id === 'foundry-pils')!;
  fails(edit('foundry-pils', { prices: { ...pils.prices, pint: 7.5 } }), /"foundry-pils": prices.pint must be positive whole cents/);
  fails(edit('foundry-pils', { prices: { ...pils.prices, crowler: 600 } }), /"foundry-pils": prices.crowler must cost more than prices.pint/);
  fails(edit('foundry-pils', { prices: { taster: 300, half: 450 } }), /"foundry-pils": prices.pint is required at 10% ABV or below/);
  assert.doesNotThrow(() => validateBeers(edit('tall-order-barleywine', { prices: { taster: 500, half: 700 } })));
  assert.equal(formatPrice(700), '$7');
  assert.equal(formatPrice(450), '$4.50');
});

test('owner edit: re-tapping a kicked keg puts it on the board in tap order', () => {
  const list = edit('graveyard-shift-stout', { availability: 'on-tap' });
  assert.doesNotThrow(() => validateBeers(list));
  const pouring = pouringNow(list).map(beer => beer.id);
  assert.equal(pouring.length, 11);
  assert.equal(pouring.indexOf('graveyard-shift-stout'), pouring.indexOf('lathe-porter') + 1);
  assert.deepEqual(tapBoard(beers).map(beer => beer.availability).slice(-2), ['coming-soon', 'kicked']);
});
