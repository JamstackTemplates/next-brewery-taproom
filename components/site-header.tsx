import { DarkModeToggle } from 'jamstacks';
import { business } from '../content/business';
import { HopBadge } from './brewery-art';
import { OpenBadge } from './open-badge';
import { SiteLink } from './site-link';

const NAV = [
  { href: '/taps/', label: 'Taps' },
  { href: '/food-trucks/', label: 'Food trucks' },
  { href: '/visit/', label: 'Visit' },
  { href: '/contact/', label: 'Contact' },
];

/** Green enamel sign in both modes, edged with a brass pinstripe. Nav wraps to its own row on phones. */
export function SiteHeader() {
  return <header className="sign border-b-[5px] border-double border-brass bg-sign text-sign-ink">
    <div className="wrap flex flex-wrap items-center gap-x-6 gap-y-1 py-3 md:min-h-22 md:flex-nowrap">
      <SiteLink href="/" className="mr-auto flex items-center gap-3 no-underline hover:no-underline">
        <HopBadge className="size-12 shrink-0" />
        <span className="leading-none">
          <span className="block whitespace-nowrap font-display text-[1.3rem] uppercase tracking-[.04em]">Tall Tales</span>
          <span className="script block text-[1.2rem] text-brass">Brewing Co.</span>
        </span>
      </SiteLink>
      <span className="hidden xl:block"><OpenBadge hours={business.hours} className="text-sign-muted" /></span>
      <DarkModeToggle />
      <nav aria-label="Main" className="order-last -mx-2 flex w-full flex-wrap gap-x-0.5 pb-1 md:order-none md:mx-0 md:w-auto md:pb-0">
        {NAV.map(item => (
          <SiteLink key={item.href} href={item.href} markCurrent="page"
            className="whitespace-nowrap px-2 py-2 text-[.82rem] font-bold uppercase tracking-[.14em] text-sign-ink no-underline hover:text-brass hover:underline sm:px-3 sm:text-[.9rem]">
            {item.label}
          </SiteLink>
        ))}
      </nav>
    </div>
  </header>;
}
