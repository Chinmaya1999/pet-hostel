import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import PageHero from '../components/layout/PageHero';
import Reveal from '../components/ui/Reveal';
import CTA from '../components/home/CTA';
import useFetch from '../lib/useFetch';
import { inr } from '../lib/format';
import { ICONS, SERVICES } from '../data/content';
import { IMAGES } from '../data/media';

const unitLabel = { included: 'Included', 'per-day': '/ day', 'per-session': '/ session' };

export default function Services() {
  const { data } = useFetch('/services', []);
  const services = data?.length ? data : SERVICES;

  return (
    <>
      <PageHero
        eyebrow="Our services"
        title="Everything they need,"
        highlight="all under one roof."
        subtitle="Accommodation, meals, walks, grooming, medication, health monitoring and daily updates — care that feels like home, run like a five-star hotel."
        image={IMAGES.dogCatCuddle}
      />

      <section className="container-x space-y-24 py-16">
        {services.map((s, i) => {
          const Icon = ICONS[s.icon] || ICONS.PawPrint;
          const flip = i % 2 === 1;
          return (
            <div key={s.slug} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
              <Reveal from={flip ? 'right' : 'left'} className={`relative ${flip ? 'lg:order-2' : ''}`}>
                <div className="absolute -inset-4 rotate-3 rounded-5xl opacity-25" style={{ background: s.accent }} />
                <motion.img
                  whileHover={{ scale: 1.02, rotate: flip ? 1 : -1 }}
                  src={s.image}
                  alt={s.name}
                  loading="lazy"
                  className="relative h-[380px] w-full rounded-5xl object-cover shadow-2xl sm:h-[460px]"
                />
                <span className="absolute -bottom-6 left-8 grid h-20 w-20 place-items-center rounded-3xl shadow-2xl" style={{ background: s.accent }}>
                  <Icon className="h-9 w-9 text-white" />
                </span>
              </Reveal>
              <Reveal from={flip ? 'left' : 'right'}>
                <p className="font-display text-7xl font-bold text-ink/[0.07]">0{i + 1}</p>
                <h2 className="-mt-8 text-4xl font-bold sm:text-5xl">{s.name}</h2>
                <p className="mt-4 text-lg leading-relaxed text-muted">{s.description || s.short}</p>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {s.features?.map((f) => (
                    <li key={f} className="flex items-center gap-3 font-semibold">
                      <span className="grid h-7 w-7 place-items-center rounded-full" style={{ background: `${s.accent}22`, color: s.accent }}>
                        <Check className="h-4 w-4" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <span className="rounded-full bg-white px-5 py-3 font-bold shadow-soft">
                    {s.unit === 'included' ? '✓ Included with every stay' : <>{inr(s.price)} <span className="text-muted">{unitLabel[s.unit]}</span></>}
                  </span>
                  <Link to="/book" className="group flex items-center gap-2 font-bold text-coral">
                    Book now <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                  </Link>
                </div>
              </Reveal>
            </div>
          );
        })}
      </section>
      <CTA />
    </>
  );
}
