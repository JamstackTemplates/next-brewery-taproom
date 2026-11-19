# Local verification

Verified locally for the Tall Tales Brewing Co. gallery sample (`next-brewery-taproom`) on 2026-11-18:

- `npm ci` and `npm install` (self-hosted font packages) report no vulnerabilities.
- `npm run check` passes: 50 Node tests, typecheck and the static export (`/`, `/taps/`, `/food-trucks/`,
  `/visit/`, `/contact/`, 404, sitemap, robots, icon).
- Unconfigured build: no `<jamstacks-support-form>` host or `embed.js` on any page; Contact shows the email
  fallback. Canonical URLs, sitemap and `og:image` use `https://next-brewery-taproom.jamstacks.net/`.
- Configured project-path build (`JAMSTACKS_SITE=demo-site`, `PAGES_BASE_PATH=/brew`,
  `PAGES_BASE_URL=https://owner.github.io/brew/`): one host and one bootstrap only on Contact; all internal
  links, canonical URLs and `og:image` carry `/brew`. In Playwright, Home → Contact and Contact → Visit were
  full document loads. The demo site ID doesn't exist on the CDN, so the page showed its "couldn’t be loaded,
  please email" notice; no delivery was tested.
- Browser checks (Playwright/Chromium): light and dark at 1440px and 360–375px, no horizontal overflow; skip
  link first in tab order; style filter updates `?style=` and the live count; `?style=sour` restores on load.
  With JavaScript disabled: all 12 beers, no filter buttons, neutral "Taproom hours" badge and the full
  weekly truck list.
- Owner edit: setting `graveyard-shift-stout` to `on-tap` rebuilt with "11 of 12 taps pouring" on Home and the
  stout under the board's on-tap group without the kicked stamp. Home previews the first six taps only, so the
  tap-10 stout appears on Taps, not as a Home card. Putting `fog-machine` on tap 3 failed the build with
  `taps: "tall-tale-ipa" and "fog-machine" are both on tap 3`. Data was restored afterwards.
- Gallery: `public/og.png` (1200×630) and `jamstacks/home-{light,dark}.jpg` captured after a fresh normal build;
  `node --test jamstacks/config.test.mjs` passes.
- Vintage restyle (same day): new fonts (Alfa Slab One, Vollkorn, Yesteryear, all OFL 1.1, pinned 5.3.0),
  paper/enamel/brass tokens and renamed label inks (`navy`, `mustard`, `hop`, `oxblood`, `cream`, `stout`).
  `tests/design.test.ts` now also checks oxblood ornament text and brass on the sign. Re-checked in Chromium:
  light/dark at 1440px and 375px with no horizontal overflow, kicked/coming-soon cards, 404 and print. `public/og.png`
  and the gallery captures were regenerated after a fresh normal build.
- Cellar decoration (same day): hero pint and barrel, barrel rack above the footer, hop-and-barley wallpaper on kraft
  bands and the Taps tap tower. Re-checked light/dark at 1440px and 375px (no overflow) and regenerated `public/og.png`
  and the gallery captures.
- Hero illustration (same day): `public/brewery-light.webp` replaces the SVG badge, pint and barrel, served from
  800/1200/1600px resized copies with `srcset`, in both themes. Checked at 375, 1024 and 1440px, light and dark;
  `public/og.png` and the gallery captures regenerated.
- Not performed: remote deployment, GitHub Pages settings, DNS, or real enquiry delivery. The Google map
  iframe did not render in the headless capture environment, so check it in a normal browser.
