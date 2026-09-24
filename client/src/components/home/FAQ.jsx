import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';
import { FAQS } from '../../data/content';
import { IMAGES } from '../../data/media';

export default function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section className="container-x grid gap-12 py-24 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <SectionHeading align="left" eyebrow="FAQ" title="Questions?" highlight="We’ve got answers." />
        <Reveal from="left" className="relative hidden lg:block">
          <img src={IMAGES.readingDog} alt="A dog wearing glasses" className="h-96 w-full rounded-5xl object-cover" />
          <div className="absolute -right-4 -bottom-6 max-w-[240px] rounded-3xl bg-ink p-5 text-cream shadow-2xl">
            <p className="font-display text-lg font-bold">Still curious?</p>
            <p className="mt-1 text-sm text-cream/70">Call us on +91 98765 43210 — a human answers 24/7.</p>
          </div>
        </Reveal>
      </div>
      <div className="space-y-3 lg:col-span-7">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <Reveal key={f.q} delay={i * 0.05}>
              <div className={`rounded-3xl transition-colors duration-300 ${isOpen ? 'bg-white shadow-soft' : 'bg-white/50 hover:bg-white'}`}>
                <button onClick={() => setOpen(isOpen ? -1 : i)} className="flex w-full items-center justify-between gap-4 p-6 text-left" aria-expanded={isOpen}>
                  <span className="font-display text-xl font-bold">{f.q}</span>
                  <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${isOpen ? 'bg-coral text-white' : 'bg-ink/5'}`}>
                    <Plus className="h-5 w-5" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35 }} className="overflow-hidden">
                      <p className="px-6 pb-6 leading-relaxed text-muted">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
