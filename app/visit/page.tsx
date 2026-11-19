import type { Metadata } from 'next';
import { business, formatAddress, formatTour } from '../../content/business';
import { GoogleMap } from '../../components/google-map';
import { OpenBadge } from '../../components/open-badge';
import { PageHead } from '../../components/page-head';
import { Notice, Plate, Section, Split } from '../../components/section';
import { SiteLink } from '../../components/site-link';
import { Address, Checklist, Directions, HoursTable } from '../../components/visit-details';
import { pageMetadata } from '../../lib/metadata';

export const metadata: Metadata = pageMetadata({
  path: '/visit/',
  title: 'Visit',
  description: 'Tall Tales taproom hours, address and directions near Pioneer Square in downtown Portland, plus taproom rules and Saturday brewhouse tours.',
});

export default function VisitPage() {
  return <>
    <PageHead eyebrow="Plan your visit" title="Visit the taproom"
      aside={<div className="sign rounded-[3px] border-2 border-brass bg-sign px-4 py-3 shadow-[inset_0_0_0_3px_var(--sign),inset_0_0_0_4px_var(--brass)]"><OpenBadge hours={business.hours} className="text-sign-ink" /></div>}>
      <p>A century-old brick brewhouse a minute from Pioneer Square. Walk in, find a stool, order at the bar.</p>
    </PageHead>

    <Section id="where-when">
      <Section.Heading sectionId="where-when" eyebrow="Where & when">Address & hours</Section.Heading>
      <Split>
        <Plate title="Address">
          <Address>Get directions in Google Maps</Address>
          {business.phone ? <p>Call the bar: <a className="text-link" href={`tel:${business.phone.replace(/[^\d+]/g, '')}`}>{business.phone}</a></p> : null}
        </Plate>
        <Plate title="Taproom hours">
          <HoursTable caption="Weekly taproom hours" />
        </Plate>
      </Split>
      <div className="mt-8 border-[3px] border-rule">
        <GoogleMap address={formatAddress()} title="Map showing the Tall Tales taproom near Pioneer Courthouse Square, Portland" />
      </div>
    </Section>

    <Section id="getting-here" tone="raised">
      <Split>
        <div>
          <Section.Heading sectionId="getting-here" eyebrow="Transit, bikes & parking">Getting here</Section.Heading>
          <Directions />
        </div>
        <div>
          <span className="ornament" aria-hidden="true"><span /></span>
          <h2 className="mt-2 mb-8 text-[clamp(1.7rem,3.6vw,2.6rem)] uppercase">Taproom rules</h2>
          <Checklist>
            <li>21+ to drink. We check ID at the bar, every time.</li>
            <li>Under 21s are welcome with an adult until 8pm.</li>
            <li>Dogs are welcome on the patio.</li>
            <li>Last call is 30 minutes before close.</li>
          </Checklist>
        </div>
      </Split>
    </Section>

    <Section id="tours">
      <Section.Heading sectionId="tours" eyebrow="Saturdays">Brewhouse tours</Section.Heading>
      <Split>
        <div className="grid content-start gap-4 text-lg">
          <p>
            Walk the brewhouse with one of our brewers: the grain room, the mash tun, the fermenters and the
            bright tanks feeding the taps. Finish with tasters poured straight from the source.
          </p>
          <p className="tabular font-bold">{formatTour()}</p>
        </div>
        <Plate title="Ask about a tour">
          <p>
            Tours are small, so send an enquiry with your preferred Saturday, time and group size.
            A tour isn’t booked until we reply to confirm a place.
          </p>
          <p><SiteLink href="/contact/" className="button">Send a tour enquiry</SiteLink></p>
        </Plate>
      </Split>
    </Section>

    <div className="wrap">
      <Notice><p data-responsible-service>{business.responsibleService}</p></Notice>
    </div>
  </>;
}
