import { useId } from 'react';
import type { Label } from '../content/taps';

/*
 * Cellar artwork: a barrel rack and a tap tower. Decorative only (aria-hidden).
 * Wood and brass are printed colours, the same in both modes.
 */
const OAK = '#a36b36';
const OAK_LIGHT = '#c48a4f';
const OAK_DARK = '#6b4322';
const IRON = '#2e2622';
const BRASS = '#c8952f';
const BRASS_LIGHT = '#e8c06a';
const INK = '#2a1a10';
const FOAM = '#fbf3df';

/** One barrel head (round end) at (cx, cy) for the rack pattern. */
function BarrelHead({ cx, cy }: { cx: number; cy: number }) {
  return <g>
    <circle cx={cx} cy={cy} r="53" fill={IRON} />
    <circle cx={cx} cy={cy} r="46" fill={OAK} />
    {[-30, -15, 0, 15, 30].map(dx => {
      const half = Math.sqrt(46 * 46 - dx * dx);
      return <line key={dx} x1={cx + dx} x2={cx + dx} y1={cy - half} y2={cy + half} stroke={OAK_DARK} strokeWidth="2" />;
    })}
    <circle cx={cx} cy={cy} r="39" fill="none" stroke={OAK_DARK} strokeWidth="1.5" opacity=".7" />
    <path d={`M${cx - 36} ${cy - 18}A40 40 0 0 1 ${cx + 6} ${cy - 40}`} fill="none" stroke={OAK_LIGHT} strokeWidth="3" strokeLinecap="round" opacity=".7" />
    <circle cx={cx} cy={cy + 26} r="5" fill={BRASS} stroke={INK} strokeWidth="1.5" />
  </g>;
}

/**
 * Barrel room: two rows of oak barrel heads stacked on a timber rail, tiled across the full width.
 * Sits above the footer on every page.
 */
export function BarrelRack({ className = '' }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg className={className} width="100%" height="148" aria-hidden="true" focusable="false">
      <defs>
        <pattern id={`rack-${id}`} width="112" height="212" patternUnits="userSpaceOnUse" patternTransform="scale(.7)">
          <BarrelHead cx={0} cy={56} />
          <BarrelHead cx={112} cy={56} />
          <BarrelHead cx={56} cy={147} />
          <rect x="0" y="196" width="112" height="16" fill={OAK_DARK} />
          <rect x="0" y="196" width="112" height="3" fill={OAK_LIGHT} opacity=".6" />
          <path d="M0 212h112" stroke={INK} strokeWidth="2" />
        </pattern>
      </defs>
      <rect width="100%" height="148" fill={`url(#rack-${id})`} />
    </svg>
  );
}

/** A brass tap tower with one handle per label ink, for the Taps page head. */
export function TapTower({ labels, className = '' }: { labels: readonly Label[]; className?: string }) {
  const step = 46;
  const width = labels.length * step + 24;
  return (
    <svg viewBox={`0 0 ${width} 200`} className={className} aria-hidden="true" focusable="false">
      {labels.map((label, i) => {
        const x = 12 + step / 2 + i * step;
        return <g key={label}>
          {/* handle */}
          <path d={`M${x - 9} 18q9-8 18 0l-3 82h-12z`} fill={`var(--label-${label})`} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
          <rect x={x - 8} y="38" width="16" height="34" rx="1.5" fill={FOAM} stroke={INK} strokeWidth="1.5" />
          <text x={x} y="60" textAnchor="middle" fontFamily="var(--font-display)" fontSize="8.5" fill={INK}>{String(i + 1).padStart(2, '0')}</text>
          <rect x={x - 5} y="100" width="10" height="20" fill={BRASS} stroke={INK} strokeWidth="2" />
          {/* faucet */}
          <path d={`M${x - 7} 136h14v8h-4v22q0 4-3 4t-3-4v-22h-4z`} fill={BRASS} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        </g>;
      })}
      <rect x="4" y="118" width={width - 8} height="20" rx="10" fill={BRASS} stroke={INK} strokeWidth="3" />
      <rect x="14" y="122" width={width - 28} height="4" rx="2" fill={BRASS_LIGHT} opacity=".8" />
      {/* drip tray */}
      <rect x="2" y="182" width={width - 4} height="12" rx="2" fill={IRON} stroke={INK} strokeWidth="2" />
      <path d={`M10 188H${width - 10}`} stroke="#6d635c" strokeWidth="2" strokeDasharray="3 4" />
    </svg>
  );
}
