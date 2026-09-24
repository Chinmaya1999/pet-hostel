import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import { GALLERY } from '../../data/media';

export default function GalleryParallax() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-60, 120]);
  const y3 = useTransform(scrollYProgress, [0, 1], [40, -240]);
  const cols = [GALLERY.slice(0, 3), GALLERY.slice(3, 6), GALLERY.slice(6, 9), GALLERY.slice(9, 12)];
  const ys = [y1, y2, y3, y2];

  return (
    <section ref={ref} className="relative overflow-hidden py-24">
      <div className="container-x">
        <SectionHeading eyebrow="Gallery" title="A day in the" highlight="life of our guests." />
      </div>
      <div className="container-x grid h-[720px] grid-cols-2 gap-4 overflow-hidden md:grid-cols-4">
        {cols.map((col, i) => (
          <motion.div key={i} style={{ y: ys[i] }} className={`flex flex-col gap-4 ${i > 1 ? 'hidden md:flex' : ''}`}>
            {col.map((g) => (
              <div key={g.src} className="group relative overflow-hidden rounded-4xl">
                <img src={g.src.replace('w=1200', 'w=700')} alt={g.tag} loading="lazy" className={`w-full object-cover transition duration-[1.2s] group-hover:scale-110 ${g.h === 'tall' ? 'h-80' : 'h-56'}`} />
                <span className="chip absolute bottom-3 left-3 bg-white/90 backdrop-blur">{g.tag}</span>
              </div>
            ))}
          </motion.div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-cream to-transparent" />
      <div className="relative -mt-20 flex justify-center">
        <Link to="/gallery" className="btn-dark group !px-8 !py-4">
          See the full gallery <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
