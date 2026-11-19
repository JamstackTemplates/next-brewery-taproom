/* Printed-ink palette for the artwork. Fixed in both modes, like an enamel sign. */
const GREEN = '#1f3a2c';
const BRASS = '#c8952f';
const PAPER = '#ecdcb6';
const INK = '#2a1a10';

/** Rows of overlapping bracts, top to bottom, for a hop cone centred on (cx, top) at scale s. */
function hopBracts(cx: number, top: number, s: number) {
  const rows = [3, 4, 3, 4, 3, 2, 1];
  const w = 24 * s, h = 30 * s, step = 15 * s;
  return rows.flatMap((count, row) => Array.from({ length: count }, (_, i) => {
    const x = cx + (i - (count - 1) / 2) * w * .78;
    const y = top + row * step;
    return `M${x - w / 2} ${y}Q${x - w / 2} ${y + h * .85} ${x} ${y + h}Q${x + w / 2} ${y + h * .85} ${x + w / 2} ${y}Q${x} ${y - h * .3} ${x - w / 2} ${y}Z`;
  }));
}

/** A hop cone with its stem and a leaf, as SVG children. */
function Hop({ cx, top, s = 1, fill, stroke }: { cx: number; top: number; s?: number; fill: string; stroke: string }) {
  return <g>
    <path d={`M${cx} ${top + 4 * s}C${cx} ${top - 14 * s} ${cx + 8 * s} ${top - 22 * s} ${cx + 16 * s} ${top - 28 * s}`} fill="none" stroke={stroke} strokeWidth={3 * s} strokeLinecap="round" />
    <path d={`M${cx + 6 * s} ${top - 14 * s}C${cx + 22 * s} ${top - 30 * s} ${cx + 44 * s} ${top - 22 * s} ${cx + 52 * s} ${top - 8 * s}C${cx + 36 * s} ${top - 2 * s} ${cx + 18 * s} ${top - 4 * s} ${cx + 6 * s} ${top - 14 * s}Z`}
      fill={fill} stroke={stroke} strokeWidth={2.5 * s} strokeLinejoin="round" />
    <path d={`M${cx + 10 * s} ${top - 14 * s}Q${cx + 30 * s} ${top - 16 * s} ${cx + 48 * s} ${top - 9 * s}`} fill="none" stroke={stroke} strokeWidth={1.5 * s} />
    {hopBracts(cx, top, s).map((d, i) => <path key={i} d={d} fill={fill} stroke={stroke} strokeWidth={2.5 * s} strokeLinejoin="round" />)}
  </g>;
}

/** Small hop badge for the header logo. */
export function HopBadge({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
      <circle cx="50" cy="50" r="47" fill={PAPER} stroke={BRASS} strokeWidth="5" />
      <circle cx="50" cy="50" r="39" fill="none" stroke={GREEN} strokeWidth="2" />
      <Hop cx={47} top={36} s={.62} fill="#7d9a4a" stroke={INK} />
    </svg>
  );
}

/** 404: an empty nonic pint glass with a last ring of foam. */
export function EmptyPint() {
  return (
    <div className="relative mx-auto w-full max-w-[16rem]" aria-hidden="true">
      <svg viewBox="0 0 200 260" className="w-full">
        <ellipse cx="100" cy="246" rx="70" ry="9" fill="var(--rule)" opacity=".18" />
        <path d="M44 18h112l-5 52q12 10 0 22l-13 140q-1 8-9 8H71q-8 0-9-8L49 92q-12-12 0-22z" fill="var(--surface)" stroke="var(--rule)" strokeWidth="5" strokeLinejoin="round" />
        <path d="M66 214q34 8 68 0" fill="none" stroke={BRASS} strokeWidth="4" strokeLinecap="round" opacity=".8" />
        <path d="M60 40l2 26M64 104l8 108" stroke="var(--rule)" strokeWidth="3" strokeLinecap="round" opacity=".25" />
        <g transform="translate(70 118) scale(.6)"><HopBadgeInner /></g>
      </svg>
    </div>
  );
}

function HopBadgeInner() {
  return <>
    <circle cx="50" cy="50" r="47" fill="none" stroke={BRASS} strokeWidth="4" />
    <Hop cx={47} top={36} s={.62} fill="none" stroke="var(--rule)" />
  </>;
}
