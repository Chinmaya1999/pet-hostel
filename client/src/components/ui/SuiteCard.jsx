import { Link } from 'react-router-dom';
import { ArrowRight, Maximize2 } from 'lucide-react';
import TiltCard from './TiltCard';
import { inr, SPECIES_EMOJI } from '../../lib/format';

export default function SuiteCard({ suite, cta = true }) {
  return (
    <TiltCard intensity={5} className="group h-full rounded-4xl">
      <article className="card flex h-full flex-col overflow-hidden p-2.5">
        <div className="relative h-60 overflow-hidden rounded-[1.6rem]">
          <img src={suite.image} alt={suite.name} loading="lazy" className="h-full w-full object-cover transition duration-[1.2s] group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
          <div className="absolute top-3 left-3 flex gap-1.5">
            {suite.species?.map((sp) => (
              <span key={sp} className="chip bg-white/90 capitalize backdrop-blur">{SPECIES_EMOJI[sp]} {sp}</span>
            ))}
          </div>
          {suite.featured && <span className="chip absolute top-3 right-3 text-white" style={{ background: suite.accent }}>★ Popular</span>}
          <p className="absolute bottom-3 left-4 flex items-center gap-1.5 text-xs font-bold text-cream">
            <Maximize2 className="h-3.5 w-3.5" /> {suite.size}
          </p>
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h3 className="text-2xl font-bold">{suite.name}</h3>
          <p className="mt-1 text-sm text-muted">{suite.tagline}</p>
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {suite.amenities?.slice(0, 3).map((a) => (
              <li key={a} className="chip bg-cream text-ink-2">{a}</li>
            ))}
          </ul>
          <div className="mt-auto flex items-end justify-between pt-6">
            <p>
              <span className="font-display text-3xl font-bold" style={{ color: suite.accent }}>{inr(suite.pricePerNight)}</span>
              <span className="text-sm font-semibold text-muted"> / night</span>
            </p>
            {cta && (
              <Link to={`/suites/${suite.slug}`} className="grid h-12 w-12 place-items-center rounded-full bg-ink text-cream transition group-hover:w-28 group-hover:bg-coral" aria-label={`View ${suite.name}`}>
                <span className="flex items-center gap-1 text-sm font-bold">
                  <span className="hidden group-hover:inline">View</span>
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            )}
          </div>
        </div>
      </article>
    </TiltCard>
  );
}
