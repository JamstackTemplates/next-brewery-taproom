import { business, formatAddress } from '../content/business.ts';
import { DAYS } from './hours.ts';
import { mapSearchUrl } from './maps.ts';
import { absoluteUrl } from './paths.ts';
import { site } from './site.ts';

/** schema.org Brewery derived from content/business.ts. Food comes from independent trucks, so no servesCuisine. */
export function businessStructuredData() {
  const url = absoluteUrl('/');
  const { address } = business;
  return {
    '@context': 'https://schema.org',
    '@type': 'Brewery',
    name: business.name,
    description: business.introduction,
    email: business.email,
    ...(business.phone ? { telephone: business.phone } : {}),
    ...(url ? { url, image: `${site.url}/og.png` } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.street,
      addressLocality: address.locality,
      addressRegion: address.region,
      postalCode: address.postalCode,
      addressCountry: address.country,
    },
    hasMap: mapSearchUrl(formatAddress()),
    openingHoursSpecification: DAYS.flatMap(day => {
      const entry = business.hours.find(value => value.day === day);
      return entry?.opens ? [{
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: `https://schema.org/${day}`,
        opens: entry.opens,
        closes: entry.closes,
      }] : [];
    }),
  };
}

/** Prevent content containing a closing script tag from escaping JSON-LD. */
export function jsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
