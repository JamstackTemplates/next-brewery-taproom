import type { Metadata } from 'next';
import { business, formatTour } from '../content/business';
import { schedule, trucks } from '../content/food-trucks';
import { beers, pouringNow } from '../content/taps';
import { TonightTruck } from '../components/food-trucks';
import { Hero } from '../components/hero';
import { Notice, Plate, Section, Split, Tiles } from '../components/section';
import { SiteLink } from '../components/site-link';
import { TapCard } from '../components/tap-card';
import { Address, Directions, HoursTable } from '../components/visit-details';
import { pageMetadata } from '../lib/metadata';
import { site } from '../lib/site';
import { businessStructuredData, jsonLd } from '../lib/structured-data';

export const metadata: Metadata = pageMetadata({ path: '/', description: site.description || business.introduction });

export default function HomePage() {
  const pouring = pouringNow(beers);
  return <>
    <Hero>
      <Hero.Eyebrow>Tall Tales Brewing Co. · Downtown Portland taproom</Hero.Eyebrow>
      <Hero.Heading>Brewed in the back. Poured up front.</Hero.Heading>
      <Hero.Introduction>
        Twelve taps in an old brick brewhouse, pouring beer brewed twenty feet behind the bar,
        with a different food truck parked outside every night we’re open.
      </Hero.Introduction>
      <Hero.Status>Tue–Sun · closed Mondays</Hero.Status>
      <Hero.Actions>
        <Hero.Primary href="/taps/">See what’s on tap</Hero.Primary>
        <Hero.Secondary href="/visit/">Plan your visit</Hero.Secondary>
      </Hero.Actions>
    </Hero>

    <Section id="pouring-now">
      <Section.Heading sectionId="pouring-now" eyebrow={`${pouring.length} of 12 taps pouring`}>Pouring now</Section.Heading>
      <Section.Intro>A first look at the board. The full list has tasting notes, pour sizes and prices.</Section.Intro>
      <div className="tap-grid grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
        {pouring.slice(0, 6).map(beer => <TapCard key={beer.id} beer={beer} compact />)}
      </div>
      <Section.More href="/taps/">See the full tap list</Section.More>
    </Section>

    <Section id="tonights-truck" tone="raised">
      <Split>
        <div>
          <Section.Heading sectionId="tonights-truck" eyebrow="Parked outside">Tonight’s truck</Section.Heading>
          <p className="max-w-md text-lg text-muted">
            We pour, they cook. Independent trucks rotate nightly and take their own payment.
            Order at the window and bring it inside.
          </p>
        </div>
        <TonightTruck schedule={schedule} trucks={trucks} hours={business.hours}
          closedText="Taproom closed today. See you Tuesday." noTruckText="No truck tonight. Outside food is welcome.">
          <SiteLink href="/food-trucks/" className="text-link">This week’s line-up</SiteLink>
        </TonightTruck>
      </Split>
    </Section>

    <Section id="find-us">
      <Section.Heading sectionId="find-us" eyebrow="Pioneer Square, downtown">Find the taproom</Section.Heading>
      <Split>
        <Plate title="Address">
          <Address />
          <Directions />
          <p><SiteLink href="/visit/" className="text-link">Visiting, tours and taproom rules</SiteLink></p>
        </Plate>
        <Plate title="Taproom hours">
          <HoursTable caption="Weekly taproom hours" />
        </Plate>
      </Split>
    </Section>

    <Section id="tours-events-kegs" tone="raised">
      <Section.Heading sectionId="tours-events-kegs" eyebrow="Beyond the bar">Tours, events & kegs</Section.Heading>
      <Tiles>
        <Tiles.Tile number="01" title="Brewhouse tours">
          <p>Walk the brewhouse with a brewer, from grain room to bright tanks, then taste from the source.</p>
          <p className="tabular text-sm text-ink">{formatTour()}</p>
          <Tiles.Link href="/contact/">Send an enquiry</Tiles.Link>
        </Tiles.Tile>
        <Tiles.Tile number="02" title="Private hire">
          <p>Take over the mezzanine or the whole taproom for a team night, birthday or launch.</p>
          <Tiles.Link href="/contact/">Send an enquiry</Tiles.Link>
        </Tiles.Tile>
        <Tiles.Tile number="03" title="Wholesale kegs">
          <p>Pour Tall Tales at your bar or restaurant. Half and sixth barrels, delivered around Portland.</p>
          <Tiles.Link href="/contact/">Send an enquiry</Tiles.Link>
        </Tiles.Tile>
      </Tiles>
    </Section>

    <div className="wrap pt-12">
      <Notice><p data-responsible-service>{business.responsibleService}</p></Notice>
    </div>

    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(businessStructuredData()) }} />
  </>;
}
