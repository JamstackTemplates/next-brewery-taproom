import { business, formatAddress } from '../content/business';
import { HopBadge } from './brewery-art';
import { BarrelRack } from './cellar-art';
import { SiteLink } from './site-link';

/** Enamel sign footer: address, hours and the responsible-service line inside a brass-ruled frame. */
export function SiteFooter() {
  return <>
  <BarrelRack className="no-print mt-20 block" />
  <footer className="sign border-t-[5px] border-double border-brass bg-sign text-sign-ink">
    <div className="wrap py-12">
      <div className="grid gap-8 rounded-[3px] border-2 border-brass p-6 shadow-[inset_0_0_0_4px_var(--sign),inset_0_0_0_5px_var(--brass)] sm:p-9 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <p className="flex items-center gap-3">
            <HopBadge className="size-11 shrink-0" />
            <span className="leading-none"><span className="block font-display text-xl uppercase tracking-[.04em]">Tall Tales</span>
              <span className="script block text-lg text-brass">Brewing Co.</span></span>
          </p>
          <p className="mt-3 italic text-sign-muted">{business.tagline}</p>
          <p className="mt-4">{formatAddress()}</p>
          <p className="mt-1"><a className="text-sign-ink underline" href={`mailto:${business.email}`}>{business.email}</a>
            {business.phone ? <> · <a className="text-sign-ink underline" href={`tel:${business.phone.replace(/[^\d+]/g, '')}`}>{business.phone}</a></> : null}</p>
        </div>
        <div>
          <p className="eyebrow text-brass!">Taproom hours</p>
          <ul className="tabular mt-3 grid gap-0.5 text-sm">
            {business.hours.map(entry => <li key={entry.day} className="flex justify-between gap-4 border-b border-dotted border-white/15 pb-0.5">
              <span>{entry.day.slice(0, 3)}</span><span>{entry.opens ? `${entry.opens}–${entry.closes}` : 'Closed'}</span>
            </li>)}
          </ul>
        </div>
        <nav aria-label="Footer">
          <p className="eyebrow text-brass!">Around the brewery</p>
          <ul className="mt-3 grid gap-1.5">
            <li><SiteLink className="text-sign-ink" href="/taps/">On tap</SiteLink></li>
            <li><SiteLink className="text-sign-ink" href="/food-trucks/">Food trucks</SiteLink></li>
            <li><SiteLink className="text-sign-ink" href="/visit/">Visit & tours</SiteLink></li>
            <li><SiteLink className="text-sign-ink" href="/contact/">Events & wholesale enquiries</SiteLink></li>
          </ul>
        </nav>
      </div>
      <div className="mt-6 flex flex-wrap justify-between gap-4 text-sm text-sign-muted">
        <p data-responsible-service>{business.responsibleService}</p>
        <span title="Made with love by jamstacks.net">with <span role="img" aria-label="love">❤️</span> <a className="text-sign-muted underline-offset-2 hover:text-brass" href="https://jamstacks.net">jamstacks.net</a></span>
      </div>
    </div>
  </footer>
  </>;
}
