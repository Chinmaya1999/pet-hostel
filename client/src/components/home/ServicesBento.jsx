import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, Check } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import TiltCard from '../ui/TiltCard';
import { ICONS, SERVICES } from '../../data/content';

const layout = [
  'md:col-span-2 md:row-span-2',
  'md:col-span-1',
  'md:col-span-1',
  'md:col-span-1',
  'md:col-span-1',
  'md:col-span-2',
  'md:col-span-2',
];

export default function ServicesBento() {
  return (
    <section className="container-x py-24" id="services">
      <SectionHeading
        eyebrow="Everything included"
        title="Care that covers"
        highlight="every whisker."
        subtitle="From the first sniff to the last cuddle, here’s what every guest gets during their stay."
      />
      <div className="grid auto-rows-[260px] gap-5 md:grid-cols-4">
        {SERVICES.map((s, i) => {
          const Icon = ICONS[s.icon];
          const big = i === 0;
          return (
            <motion.div
              key={s.slug}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: (i % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={layout[i]}
            >
              <TiltCard intensity={6} className="group h-full overflow-hidden rounded-4xl">
                <Link to="/services" className="relative block h-full overflow-hidden rounded-4xl bg-ink">
                  <img src={s.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-[1.2s] group-hover:scale-110 group-hover:opacity-60" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
                  <div className="relative flex h-full flex-col justify-between p-6 text-cream">
                    <div className="flex items-start justify-between">
                      <span className="grid h-14 w-14 place-items-center rounded-2xl shadow-lg transition duration-500 group-hover:rotate-[-10deg]" style={{ background: s.accent }}>
                        <Icon className="h-6 w-6 text-white" />
                      </span>
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-cream/15 backdrop-blur transition group-hover:rotate-45 group-hover:bg-coral">
                        <ArrowUpRight className="h-5 w-5" />
                      </span>
                    </div>
                    <div>
                      <h3 className={`font-bold ${big ? 'text-4xl sm:text-5xl' : 'text-2xl'}`}>{s.name}</h3>
                      <p className="mt-2 max-w-md text-sm text-cream/75">{s.short}</p>
                      <ul className={`mt-4 flex-wrap gap-2 ${big ? 'flex' : 'hidden group-hover:flex'}`}>
                        {s.features.map((f) => (
                          <li key={f} className="chip bg-cream/15 text-cream backdrop-blur">
                            <Check className="h-3 w-3" /> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Link>
              </TiltCard>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
