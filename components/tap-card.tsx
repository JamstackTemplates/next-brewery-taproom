import { formatPrice, POURS, type Beer } from '../content/taps';

const GAUGE_MAX_ABV = 12;

/**
 * One beer as a vintage bottle label: tap number, name in wood type, the style in sign-writer's script
 * and a ribbon with ABV and IBU, framed by printed double rules in the beer's ink colour. Below it,
 * a brass strength gauge, then tasting notes and pour prices. `compact` drops the notes and prices.
 */
export function TapCard({ beer, compact = false, headingLevel = 3 }: { beer: Beer; compact?: boolean; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  const fill = Math.min(beer.abv / GAUGE_MAX_ABV, 1) * 100;
  return (
    <article className="label-card" data-label={beer.label} data-state={beer.availability} data-family={beer.styleFamily}>
      <div className="label-card__face">
        <p className="label-card__no">Tap No.<b className="tabular">{String(beer.tap).padStart(2, '0')}</b></p>
        <Heading className="label-card__name">{beer.name}</Heading>
        <p className="label-card__style">{beer.style}</p>
        <p className="label-card__ribbon tabular">
          {beer.abv.toFixed(1)}% ABV<span aria-hidden="true"> · </span><span className="sr-only">, </span>
          {beer.ibu === undefined ? '— IBU' : `${beer.ibu} IBU`}
        </p>
        {beer.availability === 'kicked' ? <p className="stamp">Kicked</p> : null}
        {beer.availability === 'coming-soon' ? <p className="soon-tag">Coming soon</p> : null}
      </div>
      <div className="label-card__base">
        <div className="gauge" role="img" aria-label={`Strength: ${beer.abv.toFixed(1)}% ABV`}>
          <span style={{ width: `${fill}%` }} />
        </div>
      </div>
      {compact ? null : (
        <div className="label-card__body flex flex-1 flex-col gap-3 px-4 pt-1 pb-4">
          <p className="leading-snug">{beer.description}</p>
          {beer.glutenReduced ? <p className="text-xs font-bold uppercase tracking-widest text-muted">Gluten-reduced</p> : null}
          <dl className="tabular mt-auto grid grid-cols-2 gap-x-4 gap-y-1 border-t border-dotted border-rule pt-3 text-[.9rem]">
            {POURS.map(pour => beer.prices[pour.key] === undefined ? null : (
              <div key={pour.key} className="flex justify-between gap-2">
                <dt className="text-muted">{pour.key === 'crowler' ? 'Crowler' : pour.size}</dt>
                <dd className="font-bold">{formatPrice(beer.prices[pour.key]!)}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </article>
  );
}
