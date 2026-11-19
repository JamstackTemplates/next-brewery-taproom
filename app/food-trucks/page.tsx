import type { Metadata } from 'next';
import { business } from '../../content/business';
import { schedule, trucks } from '../../content/food-trucks';
import { DietaryTags, TruckLineup } from '../../components/food-trucks';
import { PageHead } from '../../components/page-head';
import { Notice, Section } from '../../components/section';
import { TimeZoneNote } from '../../components/time-zone-note';
import { pageMetadata } from '../../lib/metadata';

export const metadata: Metadata = pageMetadata({
  path: '/food-trucks/',
  title: 'Food trucks',
  description: 'Who’s parked outside Tall Tales this week: barbecue, tacos, pierogi, plant-based burgers and Thai noodles on a nightly rotation.',
});

export default function FoodTrucksPage() {
  return <>
    <PageHead eyebrow="Parked outside" title="Food trucks">
      <p>
        We pour, they cook. Independent trucks rotate nightly and take their own payment at the window.
        Bring your food inside or out to the patio.
      </p>
    </PageHead>

    <Section id="line-up">
      <Section.Heading sectionId="line-up" eyebrow="Serving times">This week’s line-up</Section.Heading>
      <TruckLineup schedule={schedule} trucks={trucks} hours={business.hours} caption="Food truck line-up by day"
        closedLabel="Taproom closed" noTruckLabel="No truck booked: outside food welcome" />
      <TimeZoneNote />
    </Section>

    <Section id="roster" tone="raised">
      <Section.Heading sectionId="roster" eyebrow="The regulars">Truck roster</Section.Heading>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {trucks.map(truck => (
          <article key={truck.id} className="panel flex flex-col p-6 sm:p-7">
            <p className="eyebrow">{truck.cuisine}</p>
            <h3 className="mt-2 text-xl uppercase">{truck.name}</h3>
            <p className="mt-3 text-muted">{truck.description}</p>
            <DietaryTags tags={truck.dietary} />
          </article>
        ))}
      </div>
    </Section>

    <div className="wrap pt-12">
      <Notice tone="plain">
        <p>Line-ups can change with weather or breakdowns. Outside food is welcome when no truck is scheduled.</p>
      </Notice>
    </div>
  </>;
}
