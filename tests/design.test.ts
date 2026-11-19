import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { LABELS } from '../content/taps.ts';

// WCAG AA checks for the palette defined in app/tailwind.input.css.
const css = readFileSync(new URL('../app/tailwind.input.css', import.meta.url), 'utf8');
const block = (selector: string) => {
  const start = css.indexOf(selector);
  assert.ok(start >= 0, `missing ${selector} block`);
  return css.slice(start, css.indexOf('}', start));
};
const token = (source: string, name: string) => {
  const match = source.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`));
  assert.ok(match, `--${name} must be a #rrggbb colour`);
  return match![1];
};
const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map(v => v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const themes = { light: block(':root {'), 'media dark': block(':root:not(.light) {'), 'explicit dark': block(':root.dark {') };

test('every label colourway meets WCAG AA for its text', () => {
  const labels = block('--label-navy:');
  for (const label of LABELS) {
    const ratio = contrast(token(labels, `label-${label}`), token(labels, `label-${label}-ink`));
    assert.ok(ratio >= 4.5, `label ${label}: ${ratio.toFixed(2)}:1`);
  }
});

test('primary buttons carry white text and body text is readable in every theme', () => {
  for (const [name, source] of Object.entries(themes)) {
    assert.equal(token(source, 'on-accent').toLowerCase(), '#ffffff', `${name}: primary text must be white`);
    for (const [fg, bg, min] of [['on-accent', 'accent', 4.5], ['text', 'bg', 7], ['muted', 'bg', 4.5], ['muted', 'surface', 4.5],
      ['accent-ink', 'bg', 4.5], ['accent-ink', 'surface', 4.5], ['sign-ink', 'sign', 7], ['sign-muted', 'sign', 4.5], ['brass', 'sign', 4.5],
      ['flourish', 'bg', 4.5], ['flourish', 'surface', 4.5], ['flourish', 'raised', 4.5], ['muted', 'raised', 4.5]] as const) {
      const ratio = contrast(token(source, fg), token(source, bg));
      assert.ok(ratio >= min, `${name}: --${fg} on --${bg} is ${ratio.toFixed(2)}:1`);
    }
  }
});

test('media and explicit dark themes stay in sync', () => {
  const values = (source: string) => [...source.matchAll(/--([\w-]+):\s*([^;]+);/g)].map(m => `${m[1]}=${m[2].trim()}`).sort();
  assert.deepEqual(values(themes['media dark']), values(themes['explicit dark']));
});
