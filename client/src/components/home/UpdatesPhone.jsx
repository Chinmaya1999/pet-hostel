import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, Footprints, Pill, UtensilsCrossed } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../ui/Reveal';
import { IMAGES, VIDEOS } from '../../data/media';

const feed = [
  { time: '8:05 AM', text: 'Breakfast done — licked the bowl clean! 🍗', icon: UtensilsCrossed, color: '#FFB547' },
  { time: '9:30 AM', text: '45 min trail walk with 3 new friends 🐕', icon: Footprints, color: '#3DD9B3' },
  { time: '1:00 PM', text: 'Joint supplement given on time 💊', icon: Pill, color: '#FF7EB6' },
  { time: '4:15 PM', text: 'Splash pool zoomies. Very wet. Very happy.', icon: Bell, color: '#5AB8FF' },
];

const perks = [
  ['📸', 'Daily photo report', 'At least one gorgeous photo every day, posted to your dashboard.'],
  ['🍽️', 'Meal & walk log', 'See exactly when they ate, how much, and every walk they took.'],
  ['😄', 'Mood tracker', 'Happy, playful, sleepy — our carers log how your pet is feeling.'],
  ['🩺', 'Health notes', 'Weight, meds and wellness checks, with instant alerts if anything changes.'],
];

export default function UpdatesPhone() {
  const [count, setCount] = useState(1);
  useEffect(() => {
    const t = setInterval(() => setCount((c) => (c >= feed.length ? 1 : c + 1)), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="container-x grid items-center gap-16 py-24 lg:grid-cols-2">
      <div>
        <SectionHeading align="left" eyebrow="Pawgress reports" title="Never miss a" highlight="single wag." subtitle="The #1 worry when you’re away is “are they okay?”. Our daily updates answer it before you even ask." />
        <div className="grid gap-4 sm:grid-cols-2">
          {perks.map(([emoji, title, text], i) => (
            <Reveal key={title} delay={i * 0.08} className="rounded-3xl bg-white p-5 shadow-soft">
              <span className="text-3xl">{emoji}</span>
              <h4 className="mt-3 font-sans text-base font-extrabold">{title}</h4>
              <p className="mt-1 text-sm text-muted">{text}</p>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Phone mockup */}
      <Reveal from="scale" className="relative mx-auto">
        <div className="absolute -inset-10 animate-blob bg-gradient-to-br from-lilac/40 via-coral/30 to-sun/40 blur-2xl" />
        <motion.div
          whileHover={{ rotateY: -8, rotateX: 4 }}
          style={{ transformPerspective: 1200 }}
          className="relative w-[300px] rounded-[3rem] border-[10px] border-ink bg-ink shadow-2xl sm:w-[340px]"
        >
          <div className="absolute top-2 left-1/2 z-20 h-6 w-28 -translate-x-1/2 rounded-full bg-ink" />
          <div className="relative h-[620px] overflow-hidden rounded-[2.3rem] bg-cream">
            <div className="relative h-56">
              <video src={VIDEOS.pugRun} poster={IMAGES.pug} autoPlay muted loop playsInline className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-cream via-transparent to-transparent" />
              <span className="chip absolute top-10 left-4 bg-coral text-white">
                <span className="h-2 w-2 animate-pulse rounded-full bg-white" /> LIVE
              </span>
            </div>
            <div className="-mt-10 px-4">
              <div className="relative flex items-center gap-3 rounded-2xl bg-white p-3 shadow-soft">
                <img src={IMAGES.pug.replace('w=1200', 'w=120')} alt="" className="h-11 w-11 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-extrabold">Biscuit’s day · Day 3</p>
                  <p className="text-xs font-semibold text-mint">😄 Feeling playful</p>
                </div>
              </div>
              <div className="mt-4 space-y-2.5">
                <AnimatePresence initial={false}>
                  {feed.slice(0, count).map((f) => (
                    <motion.div
                      key={f.time}
                      layout
                      initial={{ opacity: 0, x: 40, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-start gap-3 rounded-2xl bg-white p-3 shadow-sm"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white" style={{ background: f.color }}>
                        <f.icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-[11px] font-bold text-muted">{f.time}</p>
                        <p className="text-sm leading-snug font-semibold">{f.text}</p>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </Reveal>
    </section>
  );
}
