import { Quote, Star } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import useFetch from '../../lib/useFetch';
import { FALLBACK_REVIEWS } from '../../data/content';

function Card({ r }) {
  return (
    <figure className="relative w-[340px] shrink-0 rounded-4xl bg-white p-7 shadow-soft sm:w-[400px]">
      <Quote className="absolute top-6 right-6 h-10 w-10 text-coral/15" />
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} className={`h-4 w-4 ${i < r.rating ? 'fill-sun text-sun' : 'text-ink/15'}`} />
        ))}
      </div>
      <blockquote className="mt-4 text-[15px] leading-relaxed text-ink-2">“{r.comment}”</blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <img src={r.avatar || `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(r.name)}`} alt="" className="h-12 w-12 rounded-full object-cover" />
        <div>
          <p className="font-extrabold">{r.name}</p>
          {r.petName && <p className="text-xs font-semibold text-muted">Parent of {r.petName}{r.petType ? ` · ${r.petType}` : ''}</p>}
        </div>
      </figcaption>
    </figure>
  );
}

export default function Testimonials() {
  const { data } = useFetch('/reviews', []);
  const reviews = data?.length ? data : FALLBACK_REVIEWS;
  const half = Math.ceil(reviews.length / 2);
  const rows = [reviews.slice(0, half), reviews.slice(half).length ? reviews.slice(half) : reviews];

  return (
    <section className="overflow-hidden py-24">
      <div className="container-x">
        <SectionHeading eyebrow="Happy tails" title="Pet parents" highlight="say it best." />
      </div>
      <div className="space-y-6">
        {rows.map((row, idx) => {
          const list = [...row, ...row, ...row];
          return (
            <div key={idx} className="mask-fade-x group flex overflow-hidden">
              <div
                className="flex shrink-0 animate-marquee gap-6 pr-6 group-hover:[animation-play-state:paused]"
                style={{ animationDirection: idx ? 'reverse' : 'normal', animationDuration: '60s' }}
              >
                {[...list, ...list].map((r, i) => <Card key={`${r._id}-${i}`} r={r} />)}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
