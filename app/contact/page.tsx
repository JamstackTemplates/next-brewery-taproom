import type { Metadata } from 'next';
import { business } from '../../content/business';
import { CopyEmail } from '../../components/copy-email';
import { JamstacksSupportForm } from '../../components/jamstacks-support-form';
import { PageHead } from '../../components/page-head';
import { Plate } from '../../components/section';
import { pageMetadata } from '../../lib/metadata';
import { site } from '../../lib/site';

export const metadata: Metadata = pageMetadata({ path: '/contact/', title: 'Contact', description: business.enquiries.introduction });

export default function ContactPage() {
  const hosted = Boolean(site.jamstacksSite && site.jamstacksEmbedUrl);
  return <>
    <PageHead eyebrow="Enquiries" title={business.enquiries.title}><p>{business.enquiries.introduction}</p></PageHead>
    <div className="wrap grid gap-10 pt-10 md:grid-cols-[1.4fr_1fr]">
      <section aria-labelledby="enquiry-heading" className="panel p-6 sm:p-8">
        <h2 id="enquiry-heading" className="mb-2 text-2xl uppercase">Send an enquiry</h2>
        <p className="mb-6 text-muted">
          Tours, private events and wholesale kegs are all subject to availability. Sending a message doesn’t
          book anything; we’ll reply to confirm availability and next steps.
        </p>
        {hosted ? <JamstacksSupportForm siteId={site.jamstacksSite} embedUrl={site.jamstacksEmbedUrl} email={business.email} />
          : <div className="border-[3px] border-rule bg-raised p-6">
            <h3 className="text-lg uppercase">Write to us directly</h3>
            <p className="mt-3">The enquiry form isn’t connected yet. Email <a className="text-link wrap-anywhere" href={`mailto:${business.email}`}>{business.email}</a> and we’ll reply from there.</p>
          </div>}
      </section>
      <aside aria-label="Contact details" className="grid content-start gap-6">
        <Plate title="Email">
          <a className="text-link wrap-anywhere text-lg" href={`mailto:${business.email}`}>{business.email}</a>
          <div className="flex flex-wrap items-center gap-3"><CopyEmail email={business.email} /></div>
          {business.phone ? <p>Or call the bar during opening hours: <a className="text-link" href={`tel:${business.phone.replace(/[^\d+]/g, '')}`}>{business.phone}</a></p> : null}
        </Plate>
        <Plate title="Useful to include">
          <ul className="grid gap-2 text-muted">{business.enquiries.usefulToInclude.map(tip => <li key={tip} className="flex gap-3">
            <span aria-hidden="true" className="mt-2.5 size-2 shrink-0 rotate-45 bg-flourish" />{tip}</li>)}</ul>
          <p className="text-sm text-muted">The form asks for your name, email and message, so put these details in the message.</p>
        </Plate>
      </aside>
    </div>
  </>;
}
