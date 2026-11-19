# Tall Tales Brewing Co.

A static Next.js website for **Tall Tales Brewing Co.**, a fictitious small-batch brewery with an
vintage brick taproom in downtown Portland. It is a sample for the Jamstacks gallery
(`next-brewery-taproom`): vintage bottle-label art, a tap list with ABV, IBU and style, a nightly food-truck
line-up, taproom hours with an open-now badge, and a hosted enquiry form for tours, events and
wholesale kegs.

**Everything in `content/` is sample data**, including the name, email, phone and hours. The address is
a public landmark (Pioneer Courthouse Square) so the map has a pin. Replace all of it before
publishing a real taproom's site.

## Run it locally

Node 24 or later and npm are required.

```sh
npm ci
npm run dev        # http://localhost:3000
npm run check      # tests, typecheck and static export to out/
```

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Hero with open-now status, six "Pouring now" cans, tonight's truck, address and hours, tours/events/kegs, responsible-service strip, Brewery JSON-LD |
| `/taps/` | Full tap board grouped as pouring now, coming soon and kicked, with a style filter, pour sizes and the allergen note |
| `/food-trucks/` | This week's line-up (today highlighted in the browser) and the truck roster |
| `/visit/` | Address, hours, map, getting here, taproom rules and Saturday brewhouse tours |
| `/contact/` | Hosted enquiry form when configured; the public email is always visible |
| `/404.html` | "This keg's kicked" error page |

## Common edits

| To change… | Edit |
| --- | --- |
| A keg kicks, or a new one goes on | `content/taps.ts`: set the beer's `availability` to `kicked`, `on-tap` or `coming-soon` |
| A tap number | `content/taps.ts`: `tap` (1–12). Two `on-tap` beers can't share a tap |
| A new beer | `content/taps.ts`: copy an entry, give it a new unique `id`, and fill in every field |
| A price | `content/taps.ts`: `prices` in whole US cents (`750` is $7.50) |
| Tonight's food truck | `content/food-trucks.ts`: change `truckId` on that day in `schedule` |
| A new truck | `content/food-trucks.ts`: add it to `trucks`, then reference its `id` from `schedule` |
| Hours, address, email, phone, tours | `content/business.ts` |
| Headings, intros, buttons and notes | The route's `app/**/page.tsx`, e.g. `<Hero.Heading>` in `app/page.tsx` |
| Name, description, domain, time zone | `site.config.json` (and `business.name`) |

Every collection is validated when it's imported. A mistake stops `npm run check` and the build with
a message that names the item, for example:

```
taps: "tall-tale-ipa" and "fog-machine" are both on tap 3
food-trucks: schedule Tuesday: serves 14:00–21:00 must sit inside taproom hours 15:00–22:00
```

### Beer fields (`content/taps.ts`)

| Field | Meaning |
| --- | --- |
| `id` | Stable URL-safe slug, unique; don't change it once published |
| `tap` | Tap number 1–12; unique among `on-tap` beers |
| `name`, `style`, `description` | Printed on the can card; description is one sentence |
| `styleFamily` | Filter group: `lager`, `hoppy`, `sour`, `dark`, `non-alcoholic` (below 0.5% ABV) |
| `abv` | Percent, 0–15, one decimal place. The brass gauge under the label fills from 0 to 12% |
| `ibu` | 0–120, optional (left out for sours) |
| `label` | Label ink colourway: `navy`, `mustard`, `hop`, `oxblood`, `cream`, `stout` |
| `glutenReduced` | `true` adds a "Gluten-reduced" note to the card |
| `availability` | `on-tap`, `coming-soon` or `kicked`; the board orders them in that order |
| `prices` | Whole cents for `taster` (5 oz), `half` (8 oz), `pint` (16 oz), `crowler` (32 oz to go). Must rise in that order. `pint` may be left out only above 10% ABV; leave out `crowler` if a beer isn't sold to go |

### Food truck fields (`content/food-trucks.ts`)

`trucks` have an `id`, `name`, `cuisine`, `description` and `dietary` tags (`vegetarian`,
`vegan-options`, `gluten-free-options`). `schedule` has exactly one entry per weekday with a `truckId`
(or `null`) and a `serves` window that must sit inside that day's taproom hours. No truck can be
scheduled on a closed day.

## Files

| File | Owns |
| --- | --- |
| `content/business.ts` | Name, contact details, address, directions, hours, tour details, responsible-service line, enquiry copy |
| `content/taps.ts` | The tap list, style families, can colourways, pour sizes and validation |
| `content/food-trucks.ts` | Trucks, the weekly schedule and validation |
| `app/page.tsx`, `app/<route>/page.tsx` | Page composition and editable copy |
| `components/tap-card.tsx`, `tap-board.tsx` | The bottle-label card and the filterable tap board |
| `components/brewery-art.tsx` | SVG artwork: hop badge (logo) and empty pint (404) |
| `components/cellar-art.tsx` | SVG cellar art: barrel rack above the footer, tap tower (Taps) |
| `public/brewery-light.webp` | Hero illustration (2400×1792 original); `brewery-light-{800,1200,1600}.webp` are the sizes the page serves. Used in both themes, slightly dimmed in dark mode |
| `components/food-trucks.tsx`, `open-badge.tsx`, `use-business-now.ts` | Browser-only time-dependent displays |
| `components/site-header.tsx`, `site-footer.tsx`, `page-head.tsx`, `hero.tsx`, `section.tsx`, `visit-details.tsx` | Shell and section components |
| `app/tailwind.input.css` | Colour tokens (light, automatic dark, explicit dark), label ink colourways, shared component styles |
| `lib/structured-data.ts` | schema.org `Brewery` derived from `content/business.ts` |
| `lib/metadata.ts`, `lib/routes.ts` | Per-page metadata and the route list used by the sitemap |
| `site.config.json` | Public name, description, hostname, time zone and Jamstacks integration |
| `public/og.png` | 1200×630 social image |

## Design and behavior

"Old brewery label": aged label paper with a fine grain, sunburst rays, letterpress double rules,
a brewery-green enamel-sign header and footer edged in brass, and oxblood ornaments. Each beer is a
vintage bottle label printed in one of six old inks, with the style in sign-writer's script, an ABV/IBU
ribbon and a rubber "Kicked" stamp. The hero is a hand-painted taproom illustration with the brewery name in gold
lettering, a rack of stacked barrels runs above the footer, kraft bands carry an engraved hop-and-barley
wallpaper and the Taps page has a tap tower. Dark mode is a lamplit cellar in deep browns. Fonts are self-hosted
from npm, all under the SIL Open Font License 1.1: **Alfa Slab One** (wood-type headings and beer
names), **Vollkorn** (body, with italics) and **Yesteryear** (script accents), via `@fontsource/*` and
`@fontsource-variable/vollkorn`. The primary brewery green carries white button text at 10:1 in light
mode and 6.5:1 in dark. `tests/design.test.ts` checks every label colourway and theme pairing against WCAG AA.

Time-dependent output runs only in the browser in the `site.config.json` time zone
(`America/Los_Angeles`), refreshing every minute:

- the open-now badge (header, Home hero and Visit)
- tonight's truck on Home
- today's highlighted row on Food trucks

Static and no-JavaScript output stays neutral: "Taproom hours", the full weekly line-up and the full
hours table. Hours are same-day only; overnight intervals fail validation. The Taps style filter
appears only with JavaScript and keeps the choice in `?style=`. Without it, every beer is shown.
Reduced motion disables the ABV gauge "pour" animation. Print styles drop navigation, the map and the art.

## Public configuration

```json
{
  "name": "Tall Tales Brewing Co.",
  "description": "Tall Tales Brewing Co. pours small-batch beer from …",
  "domain": "next-brewery-taproom.jamstacks.net",
  "timeZone": "America/Los_Angeles",
  "jamstacks": { "siteId": "", "cdnUrl": "https://cdn.jamstacks.net" }
}
```

This gallery sample uses its folder name plus `.jamstacks.net` as the demo domain; replace it with
your own domain. Do not invent canonical URLs when
the deployed address is unknown.

| Environment variable | Public build-time meaning |
| --- | --- |
| `JAMSTACKS_SITE` | Website ID; blank retains file default, absent ID gives email fallback |
| `NEXT_PUBLIC_JAMSTACKS_CDN_URL` | CDN asset base; default `https://cdn.jamstacks.net` |
| `NEXT_PUBLIC_SITE_DOMAIN` | Hostname overriding config domain |
| `SITE_TIME_ZONE` | IANA zone overriding config timeZone |
| `PAGES_BASE_PATH` | Project path such as `/preview`; blank for custom domain/root |
| `PAGES_BASE_URL` | Actual Pages origin and path; takes precedence for canonical URLs |
| `JAMSTACKS_ALLOW_LOCAL_CDN` | Explicit localhost-only testing opt-in; disallowed in Actions |

Copy .env.example to .env.local for Next.js local work. All listed values are public. Never add tokens,
SMTP credentials or publishing keys. Newer dependencies should stay within reviewed majors; update
package.json and package-lock.json together, then run the full checks.

## Contact contract

The real `<jamstacks-support-form>` host and one `{cdn}/sites/{siteId}/embed.js` bootstrap appear only
on Contact when configured. Without a site ID there is no embed host/request. Email remains visible
in either case. The hosted runtime owns name/email/message fields, validation, submission and results.
Never register the element locally, substitute a form or intercept submission. Contact navigation uses
full document loads via SiteLink because the runtime has no remount API. Copy must describe an enquiry,
not a confirmed booking/order/payment; no attachments or extra input fields.

For local Jamstacks development, configure an explicit local CDN URL and
`JAMSTACKS_ALLOW_LOCAL_CDN=1`; remote builds reject localhost. A locally loaded component does not prove
real message delivery. Test delivery separately against a configured site/backend.

## Checks and preview

```sh
npm run check
PAGES_BASE_PATH=/preview PAGES_BASE_URL=https://owner.github.io/preview npm run build
npm start -- --base /preview --port 3000
```

Tests cover config/provisioner compatibility, embed state, business content and tour rules, tap and
food-truck validation (including the common owner edits), taproom hours with their boundaries and
Pacific DST changes, palette contrast, page copy rules (21+ wording, allergens, enquiry-only
language) and structured-data escaping. Typecheck uses Next's generated route types.
When changing the Contact integration, base paths or canonical URLs, check the exported HTML and
sitemap. Verify both configured and unconfigured Contact with the corresponding build settings.
Test light/dark at desktop and mobile widths, keyboard navigation, unknown routes, repeated Contact
navigation and any added browser interactions. Return to a normal build before capturing final assets.

## GitHub Pages deployment

`.github/workflows/pages.yml` uses npm ci, tests, typecheck and static export. It preserves Jamstacks'
`provisioning_id` dispatch input
and correlated run name. It builds pull requests without deploying, and publishes main/manual runs.
Configure Pages to use GitHub Actions and set its custom domain to the same value as site.config.json.
DNS is managed separately; for template demos the CNAME targets `jamstacktemplates.github.io`.
Do not add public/CNAME. Enable HTTPS after the certificate is ready. This starter performs no remote setup.

## Content Security Policy

A host-level CSP must permit same-origin Next.js scripts/assets, the inline theme bootstrap (using an
appropriate hash/nonce policy), the configured Jamstacks CDN scripts/assets and the published form's
API connection origin. Derive actual directives from the deployed component. Optional maps require
`frame-src https://www.google.com`. Apply CSP at the host; static export cannot set response headers
through a running Next.js server. Do not put private credentials into CSP or relax policies blindly.

## Publishing assets and structure

`app/`, `components/`, `content/`, `lib/` and `types/` are the website. `scripts/` includes static
preview and verification, `tests/` covers customer behavior, and `.github/` supplies deployment.
`jamstacks/` is removable gallery-only source metadata. Ordinary builds, tests and Pages work after
it is deleted. To publish a gallery template, create [its manifest](jamstacks/README.md) and capture
genuine screenshots before running its separate publishing test:

```sh
node /home/mythz/src/mythz/jamstacks.net/tools/template-screenshots/capture.mjs \
  --template /path/to/next-type-style --modes light,dark --executable /usr/bin/chromium
node --test jamstacks/config.test.mjs
```

Before publication: replace neutral content and shell; validate industry data/schema and all links;
choose licensed fonts; verify both themes/base-path/embed states; create a neutral 1200×630 public/og.png
from the finished design and wire metadata; replace the icon; generate gallery captures and validate;
confirm domain/Pages settings and HTTPS; remove `plan/` after review. The website must not import or
link the planning folder. No stock screenshot or OG image is supplied as if it were final.
