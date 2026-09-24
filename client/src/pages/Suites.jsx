import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageHero from '../components/layout/PageHero';
import SuiteCard from '../components/ui/SuiteCard';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import CTA from '../components/home/CTA';
import useFetch from '../lib/useFetch';
import { IMAGES } from '../data/media';

const filters = [
  { id: 'all', label: 'All suites', emoji: '✨' },
  { id: 'dog', label: 'Dogs', emoji: '🐶' },
  { id: 'cat', label: 'Cats', emoji: '🐱' },
  { id: 'rabbit', label: 'Small pets', emoji: '🐰' },
];

export default function Suites() {
  const { data: suites, loading, error } = useFetch('/suites', []);
  const [filter, setFilter] = useState('all');
  const list = useMemo(() => (filter === 'all' ? suites : suites.filter((s) => s.species.includes(filter))), [suites, filter]);

  return (
    <>
      <PageHero
        eyebrow="Suites & pricing"
        title="Rooms they’ll"
        highlight="never want to leave."
        subtitle="Every suite includes meals, daily health checks, play sessions and photo updates. Add walks, grooming or medication when you book."
        image={IMAGES.cavalierPillow}
      />
      <section className="container-x py-10">
        <div className="no-scrollbar mb-10 flex gap-2 overflow-x-auto">
          {filters.map((f) => (
            <button key={f.id} onClick={() => setFilter(f.id)} className={`relative shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition ${filter === f.id ? 'text-white' : 'bg-white text-ink-2 hover:bg-white/70'}`}>
              {filter === f.id && <motion.span layoutId="suite-filter" className="absolute inset-0 rounded-full bg-ink" />}
              <span className="relative">{f.emoji} {f.label}</span>
            </button>
          ))}
        </div>
        {loading ? (
          <Spinner label="Fluffing the pillows…" />
        ) : error ? (
          <EmptyState emoji="🔌" title="Couldn’t load suites" text={error} />
        ) : (
          <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {list.map((s) => (
                <motion.div key={s._id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4 }}>
                  <SuiteCard suite={s} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>
      <CTA />
    </>
  );
}
