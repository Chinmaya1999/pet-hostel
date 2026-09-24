import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plane } from 'lucide-react';
import Reveal from '../ui/Reveal';
import SectionHeading from '../ui/SectionHeading';
import { TRIP_DAYS } from '../../data/content';

const DURATION = 4500;

export default function WhatIsHostel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % TRIP_DAYS.length), DURATION);
    return () => clearTimeout(t);
  }, [active, paused]);

  const day = TRIP_DAYS[active];

  return (
    <section className="container-x py-24">
      <SectionHeading
        eyebrow="Pet hostel 101"
        title="A temporary hotel,"
        highlight="just for pets."
        subtitle="Heading off on a 5-day trip and can’t take your dog along? Leave them with us — we take care of everything until you’re back. Here’s what those five days look like."
      />

      <div className="grid gap-8 lg:grid-cols-12" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
        {/* Day selector */}
        <Reveal from="left" className="flex flex-col gap-3 lg:col-span-5">
          <div className="mb-2 flex items-center gap-3 rounded-3xl bg-ink p-5 text-cream">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-coral"><Plane className="h-5 w-5" /></span>
            <p className="text-sm">
              <strong className="font-display text-lg">You: 5 days in Goa 🏖️</strong>
              <br />
              <span className="text-cream/60">Your pet: 5 days of pampering at Wuffelune.</span>
            </p>
          </div>
          {TRIP_DAYS.map((d, i) => (
            <button
              key={d.day}
              onClick={() => setActive(i)}
              className={`relative overflow-hidden rounded-3xl p-5 text-left transition-all duration-500 ${
                i === active ? 'bg-white shadow-soft' : 'bg-transparent hover:bg-white/50'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-xl transition ${i === active ? 'bg-coral/15 scale-110' : 'bg-ink/5'}`}>
                  {d.emoji}
                </span>
                <div>
                  <p className="text-xs font-extrabold tracking-widest text-coral uppercase">{d.day}</p>
                  <p className="font-display text-xl font-bold">{d.title}</p>
                </div>
              </div>
              {i === active && (
                <motion.span
                  key={`bar-${active}-${paused}`}
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-coral to-sun"
                  initial={{ width: '0%' }}
                  animate={{ width: paused ? '0%' : '100%' }}
                  transition={{ duration: paused ? 0 : DURATION / 1000, ease: 'linear' }}
                />
              )}
            </button>
          ))}
        </Reveal>

        {/* Visual */}
        <Reveal from="right" className="lg:col-span-7">
          <div className="relative h-[420px] overflow-hidden rounded-5xl bg-ink sm:h-[560px]">
            <AnimatePresence mode="popLayout">
              <motion.img
                key={day.image}
                src={day.image}
                alt={day.title}
                initial={{ opacity: 0, scale: 1.15 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-x-0 bottom-0 p-6 text-cream sm:p-10"
              >
                <span className="chip bg-cream/15 text-cream backdrop-blur">{day.day} of 5</span>
                <h3 className="mt-3 text-3xl font-bold sm:text-5xl">{day.title}</h3>
                <p className="mt-3 max-w-lg text-cream/80">{day.text}</p>
              </motion.div>
            </AnimatePresence>
            <div className="absolute top-6 right-6 flex gap-1.5">
              {TRIP_DAYS.map((_, i) => (
                <span key={i} className={`h-2 rounded-full transition-all duration-500 ${i === active ? 'w-8 bg-coral' : 'w-2 bg-cream/50'}`} />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
