import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, X } from 'lucide-react';
import PageHero from '../components/layout/PageHero';
import Reveal from '../components/ui/Reveal';
import VideoModal from '../components/ui/VideoModal';
import { GALLERY, IMAGES, VIDEOS } from '../data/media';

const clips = [
  { src: VIDEOS.corgiBall, poster: IMAGES.corgi, title: 'Fetch o’clock' },
  { src: VIDEOS.pugRun, poster: IMAGES.pug, title: 'Pug zoomies' },
  { src: VIDEOS.riverCatch, poster: IMAGES.beachDog, title: 'Splash & catch' },
  { src: VIDEOS.catPlay, poster: IMAGES.kitten, title: 'Cat loft playtime' },
];

function HoverVideo({ clip, onOpen }) {
  return (
    <button
      onClick={onOpen}
      className="group relative h-72 overflow-hidden rounded-4xl bg-ink text-left"
      onMouseEnter={(e) => e.currentTarget.querySelector('video')?.play().catch(() => {})}
      onMouseLeave={(e) => e.currentTarget.querySelector('video')?.pause()}
    >
      <video src={clip.src} poster={clip.poster} muted loop playsInline preload="none" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
      <span className="absolute top-4 right-4 grid h-12 w-12 place-items-center rounded-full bg-cream/90 transition group-hover:scale-110">
        <Play className="h-5 w-5 fill-coral text-coral" />
      </span>
      <p className="absolute bottom-5 left-5 font-display text-2xl font-bold text-cream">{clip.title}</p>
    </button>
  );
}

export default function Gallery() {
  const [tag, setTag] = useState('All');
  const [light, setLight] = useState(-1);
  const [video, setVideo] = useState(null);
  const tags = ['All', ...new Set(GALLERY.map((g) => g.tag))].slice(0, 9);
  const list = tag === 'All' ? GALLERY : GALLERY.filter((g) => g.tag === tag);
  const go = (d) => setLight((i) => (i + d + list.length) % list.length);

  return (
    <>
      <PageHero eyebrow="Gallery" title="Snapshots of" highlight="pure joy." subtitle="Real moments from our yards, lofts and spa. Hover a clip to play it, tap a photo to see it full-size." image={IMAGES.catDogGrass} />

      <section className="container-x py-10">
        <h2 className="mb-6 text-3xl font-bold">🎬 Clips</h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {clips.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.08}>
              <HoverVideo clip={c} onOpen={() => setVideo(c)} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-x py-10">
        <div className="no-scrollbar mb-8 flex gap-2 overflow-x-auto">
          {tags.map((t) => (
            <button key={t} onClick={() => setTag(t)} className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition ${tag === t ? 'bg-ink text-cream' : 'bg-white hover:bg-white/70'}`}>
              {t}
            </button>
          ))}
        </div>
        <motion.div layout className="columns-2 gap-4 md:columns-3 lg:columns-4">
          <AnimatePresence>
            {list.map((g, i) => (
              <motion.button
                layout
                key={g.src}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: i * 0.03 }}
                onClick={() => setLight(i)}
                className="group relative mb-4 block w-full overflow-hidden rounded-3xl"
              >
                <img src={g.src.replace('w=1200', 'w=700')} alt={g.tag} loading="lazy" className={`w-full object-cover transition duration-700 group-hover:scale-110 ${g.h === 'tall' ? 'h-96' : 'h-60'}`} />
                <div className="absolute inset-0 bg-ink/0 transition group-hover:bg-ink/30" />
                <span className="chip absolute bottom-3 left-3 translate-y-10 bg-white/90 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">{g.tag}</span>
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      <AnimatePresence>
        {light >= 0 && (
          <motion.div className="fixed inset-0 z-[95] grid place-items-center bg-ink/95 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setLight(-1)}>
            <button className="absolute top-5 right-5 grid h-12 w-12 place-items-center rounded-full bg-cream" aria-label="Close"><X className="h-5 w-5" /></button>
            <button onClick={(e) => { e.stopPropagation(); go(-1); }} className="absolute left-4 grid h-12 w-12 place-items-center rounded-full bg-cream/15 text-cream hover:bg-coral" aria-label="Previous"><ChevronLeft /></button>
            <button onClick={(e) => { e.stopPropagation(); go(1); }} className="absolute right-4 grid h-12 w-12 place-items-center rounded-full bg-cream/15 text-cream hover:bg-coral" aria-label="Next"><ChevronRight /></button>
            <motion.img key={list[light].src} src={list[light].src.replace('w=1200', 'w=1600')} alt="" onClick={(e) => e.stopPropagation()} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-h-[85vh] max-w-[90vw] rounded-4xl object-contain" />
          </motion.div>
        )}
      </AnimatePresence>
      <VideoModal open={Boolean(video)} src={video?.src} poster={video?.poster} onClose={() => setVideo(null)} />
    </>
  );
}
