import { motion } from 'framer-motion';
import { SplitText } from '../ui/Reveal';

/** Shared header for inner pages: title + image collage with blob accents. */
export default function PageHero({ eyebrow, title, highlight, subtitle, image, children }) {
  return (
    <section className="relative overflow-hidden pt-36 pb-16 sm:pt-44">
      <div className="pointer-events-none absolute -top-20 -right-20 h-[26rem] w-[26rem] animate-blob bg-sun/30 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -left-32 h-80 w-80 animate-blob bg-lilac/20 blur-3xl [animation-delay:-5s]" />
      <div className="container-x relative grid items-center gap-12 lg:grid-cols-2">
        <div>
          {eyebrow && (
            <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="eyebrow">
              {eyebrow}
            </motion.span>
          )}
          <h1 className="mt-5 text-5xl leading-[1] font-bold sm:text-6xl lg:text-7xl">
            <SplitText text={title} />
            {highlight && <SplitText text={highlight} delay={0.25} wordClassName="text-gradient italic" />}
          </h1>
          {subtitle && (
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-6 max-w-xl text-lg text-muted">
              {subtitle}
            </motion.p>
          )}
          {children}
        </div>
        {image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 4 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto aspect-[4/3] w-full max-w-xl"
          >
            <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-5xl bg-coral" />
            <img src={image} alt="" className="relative h-full w-full rounded-5xl object-cover shadow-2xl" />
          </motion.div>
        )}
      </div>
    </section>
  );
}
