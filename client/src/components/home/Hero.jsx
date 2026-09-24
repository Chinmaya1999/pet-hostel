import { lazy, Suspense, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play, Star, Stethoscope, Volume2, VolumeX } from 'lucide-react';
import { SplitText } from '../ui/Reveal';
import Magnetic from '../ui/Magnetic';
import { IMAGES } from '../../data/media';
import { PawIcon } from '../ui/Logo';

const HeroScene = lazy(() => import('../three/HeroScene'));

const avatars = [47, 12, 32, 15, 44].map((n) => `https://i.pravatar.cc/80?img=${n}`);

export default function Hero({ onPlayVideo }) {
  const ref = useRef(null);
  const [muted, setMuted] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden pt-28 pb-16 lg:pt-32">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[-10%] right-[-10%] h-[42rem] w-[42rem] animate-blob bg-gradient-to-br from-sun/50 to-coral/40 blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-15%] h-[34rem] w-[34rem] animate-blob bg-gradient-to-tr from-lilac/35 to-sky/30 blur-3xl [animation-delay:-6s]" />
        <div className="absolute top-1/3 left-1/3 h-72 w-72 animate-blob bg-mint/25 blur-3xl [animation-delay:-3s]" />
        {/* Decorative scattered paws */}
        {[['8%', '22%', -20], ['46%', '12%', 15], ['4%', '78%', 30], ['58%', '88%', -10]].map(([l, t, r], i) => (
          <PawIcon key={i} className="absolute h-8 w-8 text-ink/[0.06]" style={{ left: l, top: t, transform: `rotate(${r}deg)` }} />
        ))}
      </div>

      <div className="container-x grid items-center gap-6 lg:grid-cols-2">
        {/* Copy */}
        <motion.div style={{ opacity: fade, y: copyY }} className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass inline-flex items-center gap-3 rounded-full py-1.5 pr-4 pl-1.5 shadow-soft"
          >
            <span className="flex items-center gap-1 rounded-full bg-ink px-3 py-1 text-xs font-bold text-cream">
              <Star className="h-3 w-3 fill-sun text-sun" /> 4.9
            </span>
            <span className="text-xs font-bold text-ink-2 sm:text-sm">Loved by 2,400+ pet parents in Mumbai</span>
          </motion.div>

          <h1 className="mt-6 text-[3.2rem] leading-[0.95] font-bold text-ink sm:text-7xl xl:text-[5.5rem]">
            <SplitText text="A five-star" delay={0.4} />
            <br />
            <span className="relative inline-block">
              <SplitText text="stay" delay={0.55} wordClassName="text-gradient italic" />
              <motion.svg viewBox="0 0 200 20" className="absolute -bottom-1 left-0 w-full" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}>
                <motion.path
                  d="M2 14 Q 50 2 100 12 T 198 8"
                  fill="none"
                  stroke="#FF6B4A"
                  strokeWidth="5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 1.2, duration: 0.9, ease: 'easeInOut' }}
                />
              </motion.svg>
            </span>{' '}
            <SplitText text="for your best friend." delay={0.65} />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-6 max-w-lg text-lg leading-relaxed text-muted"
          >
            Travelling, working late or away for a while? Your dog, cat or bunny gets a cozy suite, home-style meals, walks, grooming,
            medication and a vet on call — with <strong className="text-ink">photo updates every day</strong>.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.15 }} className="mt-8 flex flex-wrap items-center gap-4">
            <Magnetic>
              <Link to="/book" className="btn-primary group !px-8 !py-4 text-base">
                Book a stay
                <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </Link>
            </Magnetic>
            <button onClick={onPlayVideo} className="group flex items-center gap-3 font-bold">
              <span className="relative grid h-14 w-14 place-items-center rounded-full bg-white shadow-soft transition group-hover:scale-110">
                <span className="absolute inset-0 animate-ping rounded-full bg-coral/25" />
                <Play className="relative h-5 w-5 fill-coral text-coral" />
              </span>
              Take the tour
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.35 }} className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              {avatars.map((a, i) => (
                <img key={a} src={a} alt="" className="h-11 w-11 rounded-full border-[3px] border-cream object-cover" style={{ zIndex: 5 - i }} />
              ))}
            </div>
            <div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-sun text-sun" />)}
              </div>
              <p className="text-sm font-semibold text-muted">12,000+ happy nights hosted</p>
            </div>
          </motion.div>
        </motion.div>

        {/* 3D stage */}
        <div className="relative h-[460px] sm:h-[560px] lg:h-[640px]">
          {/* Opaque stage card: the WebGL canvas never composites over the page, so it can't flash. */}
          <div className="absolute inset-x-0 inset-y-[4%] overflow-hidden rounded-[3rem] bg-[#FFE9D6] shadow-[0_40px_80px_-30px_rgba(255,107,74,0.55)] ring-8 ring-white/70 sm:inset-x-[3%]">
            <Suspense fallback={<div className="grid h-full place-items-center"><PawIcon className="h-10 w-10 animate-bounce text-coral" /></div>}>
              <HeroScene muted={muted} />
            </Suspense>
          </div>

          {/* Floating glass cards */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.5, type: 'spring' }}
            className="absolute top-[10%] border border-white bg-white/95 left-0 flex animate-float items-center gap-3 rounded-3xl p-3 pr-5 shadow-soft sm:left-[-4%]"
          >
            <img src={IMAGES.golden.replace('w=1200', 'w=120')} alt="" className="h-12 w-12 rounded-2xl object-cover" />
            <div>
              <p className="text-xs font-bold text-muted">Live update · 2m ago</p>
              <p className="text-sm font-extrabold">Bruno finished breakfast 🍗</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.7, type: 'spring' }}
            className="absolute right-0 border border-white bg-white/95 bottom-[-1%] hidden animate-float sm:flex items-center gap-3 rounded-3xl p-3 pr-5 shadow-soft [animation-delay:-2s] sm:right-[-2%]"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-mint text-white"><Stethoscope className="h-5 w-5" /></span>
            <div>
              <p className="text-sm font-extrabold">Vet on call 24/7</p>
              <p className="text-xs font-semibold text-muted">Daily wellness checks</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9, type: 'spring' }}
            className="absolute bottom-[1%] left-[6%] flex items-center gap-1 rounded-full bg-ink p-1 pl-4 text-xs font-bold text-cream shadow-soft"
          >
            <span className="pr-2">Tap a pet to hear them 🐶🐱🐰🦜</span>
            <button
              onClick={() => setMuted((m) => !m)}
              className="grid h-8 w-8 place-items-center rounded-full bg-cream/15 transition hover:bg-coral"
              aria-label={muted ? 'Turn pet sounds on' : 'Mute pet sounds'}
              aria-pressed={muted}
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-mint" />}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs font-bold tracking-widest text-muted uppercase lg:flex"
      >
        Scroll
        <span className="flex h-10 w-6 justify-center rounded-full border-2 border-ink/20 pt-2">
          <motion.span animate={{ y: [0, 12, 0] }} transition={{ repeat: Infinity, duration: 1.6 }} className="h-2 w-1 rounded-full bg-coral" />
        </span>
      </motion.div>
    </section>
  );
}
