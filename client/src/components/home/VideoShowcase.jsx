import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Play } from 'lucide-react';
import { IMAGES, VIDEOS } from '../../data/media';

/** Full-bleed looping video that grows from a card into the full viewport as you scroll. */
export default function VideoShowcase({ onPlay }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.82, 1]);
  const radius = useTransform(scrollYProgress, [0, 1], [64, 28]);
  const textY = useTransform(scrollYProgress, [0, 1], [80, 0]);

  return (
    <section ref={ref} className="px-3 py-12 sm:px-5">
      <motion.div style={{ scale, borderRadius: radius }} className="relative mx-auto h-[80vh] min-h-[520px] max-w-[1600px] overflow-hidden bg-ink">
        <video className="absolute inset-0 h-full w-full object-cover" src={VIDEOS.corgiBall} poster={IMAGES.corgi} autoPlay muted loop playsInline preload="metadata" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-ink/10" />
        <motion.div style={{ y: textY }} className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-6 p-6 text-cream sm:p-14 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="chip bg-coral text-white">▶ Life at Wuffelune</span>
            <h2 className="mt-4 max-w-3xl text-4xl leading-[1] font-bold sm:text-6xl lg:text-7xl">
              Every tail deserves <span className="italic text-sun">a holiday</span> too.
            </h2>
          </div>
          <button onClick={onPlay} className="group flex shrink-0 items-center gap-4">
            <span className="relative grid h-24 w-24 place-items-center rounded-full bg-cream text-ink transition duration-500 group-hover:scale-110">
              <span className="absolute inset-0 animate-ping rounded-full bg-cream/30" />
              <Play className="h-8 w-8 fill-coral text-coral" />
            </span>
            <span className="text-left text-sm font-bold">
              Watch the
              <br />
              full tour
            </span>
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
