import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Check, Maximize2, Users } from 'lucide-react';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import Reveal from '../components/ui/Reveal';
import useFetch from '../lib/useFetch';
import { inr, SPECIES_EMOJI } from '../lib/format';

export default function SuiteDetail() {
  const { slug } = useParams();
  const { data: suite, loading, error } = useFetch(`/suites/${slug}`);
  const [idx, setIdx] = useState(0);

  if (loading) return <div className="pt-40"><Spinner /></div>;
  if (error || !suite) return <div className="container-x pt-40"><EmptyState emoji="🙈" title="Suite not found" text={error} action={<Link to="/suites" className="btn-primary">Back to suites</Link>} /></div>;

  const images = [suite.image, ...(suite.gallery || [])];

  return (
    <section className="container-x pt-32 pb-16">
      <Link to="/suites" className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-coral">
        <ArrowLeft className="h-4 w-4" /> All suites
      </Link>
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="relative h-[420px] overflow-hidden rounded-5xl bg-ink sm:h-[540px]">
            <AnimatePresence mode="popLayout">
              <motion.img key={images[idx]} src={images[idx]} alt={suite.name} initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.7 }} className="absolute inset-0 h-full w-full object-cover" />
            </AnimatePresence>
          </div>
          <div className="mt-4 flex gap-3">
            {images.map((src, i) => (
              <button key={src} onClick={() => setIdx(i)} className={`h-20 w-28 overflow-hidden rounded-2xl transition ${i === idx ? 'ring-4 ring-coral' : 'opacity-60 hover:opacity-100'}`}>
                <img src={src.replace('w=1200', 'w=300')} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
        <Reveal from="right" className="lg:col-span-5">
          <div className="flex flex-wrap gap-2">
            {suite.species.map((sp) => <span key={sp} className="chip bg-white capitalize shadow-sm">{SPECIES_EMOJI[sp]} {sp}</span>)}
          </div>
          <h1 className="mt-4 text-5xl font-bold sm:text-6xl">{suite.name}</h1>
          <p className="mt-2 text-lg font-semibold" style={{ color: suite.accent }}>{suite.tagline}</p>
          <p className="mt-5 leading-relaxed text-muted">{suite.description}</p>
          <div className="mt-6 flex gap-6 text-sm font-bold text-ink-2">
            <span className="flex items-center gap-2"><Maximize2 className="h-4 w-4 text-coral" /> {suite.size}</span>
            <span className="flex items-center gap-2"><Users className="h-4 w-4 text-coral" /> {suite.units} rooms of this type</span>
          </div>
          <h3 className="mt-8 font-sans text-xs font-extrabold tracking-widest text-muted uppercase">Amenities</h3>
          <ul className="mt-3 grid grid-cols-2 gap-3">
            {suite.amenities.map((a) => (
              <li key={a} className="flex items-center gap-2 text-sm font-semibold">
                <Check className="h-4 w-4 shrink-0 text-mint" /> {a}
              </li>
            ))}
          </ul>
          <div className="card mt-8 flex items-center justify-between gap-4 p-6">
            <p>
              <span className="font-display text-4xl font-bold" style={{ color: suite.accent }}>{inr(suite.pricePerNight)}</span>
              <span className="text-muted"> / night</span>
            </p>
            <Link to={`/book?suite=${suite._id}`} className="btn-primary">Book this suite</Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
