import type { Metadata } from 'next';
import { beers, LABELS, POURS } from '../../content/taps';
import { TapTower } from '../../components/cellar-art';
import { PageHead } from '../../components/page-head';
import { Notice, Plate } from '../../components/section';
import { TapBoard } from '../../components/tap-board';
import { pageMetadata } from '../../lib/metadata';

export const metadata: Metadata = pageMetadata({
  path: '/taps/',
  title: 'On tap',
  description: 'The Tall Tales tap list: twelve taps of house-brewed lagers, IPAs, sours and dark beers with ABV, IBU, style and pour prices.',
});

export default function TapsPage() {
  return <>
    <PageHead eyebrow="The tap board" title="On tap"
      aside={<TapTower labels={LABELS} className="hero-art hidden w-[19rem] md:block lg:w-[22rem]" />}>
      <p>The board changes week to week as kegs kick and new batches come off the tanks. Staff update this list when a keg changes.</p>
    </PageHead>

    <div className="wrap pt-10">
      <TapBoard beers={beers} filterLabel="Filter by style"
        groups={{ 'on-tap': 'Pouring now', 'coming-soon': 'Coming soon', kicked: 'Kicked' }} />

      <div className="grid gap-6 md:grid-cols-[1.2fr_1fr]">
        <Plate title="Pours & prices">
          <ul className="tabular grid gap-x-8 gap-y-1.5 sm:grid-cols-2">
            {POURS.map(pour => <li key={pour.key} className="flex justify-between gap-4 border-b border-line pb-1.5">
              <span>{pour.name}</span><span className="font-bold">{pour.size}</span>
            </li>)}
          </ul>
          <p className="text-muted">
            Prices include tax. Crowlers are sealed to go; we can’t serve them in the taproom.
            Some strong beers pour in tasters and half pints only.
          </p>
        </Plate>
        <Notice tone="plain">
          <p className="font-bold">Allergens</p>
          <p>All our beers contain gluten from barley or wheat unless marked otherwise. Ask the bar about specific ingredients.</p>
        </Notice>
      </div>
    </div>
  </>;
}
