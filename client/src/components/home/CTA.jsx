import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Reveal from '../ui/Reveal';
import Magnetic from '../ui/Magnetic';
import { IMAGES, VIDEOS } from '../../data/media';

export default function CTA() {
  return (
    <section className="container-x py-12">
      <Reveal from="scale" className="relative overflow-hidden rounded-5xl bg-ink px-6 py-20 text-center text-cream sm:px-16 sm:py-28">
        <video src={VIDEOS.puppies} poster={IMAGES.aussiePup} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-br from-coral/60 via-ink/60 to-lilac/60" />
        <div className="relative mx-auto max-w-3xl">
          <p className="text-5xl">🐶🐱🐰</p>
          <h2 className="mt-6 text-4xl leading-[1] font-bold sm:text-6xl lg:text-7xl">Going away? They’ll barely notice.</h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-cream/80">Holiday season fills fast. Reserve their suite today — free cancellation up to 48 hours before check-in.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Magnetic>
              <Link to="/book" className="btn-primary group !px-9 !py-4 text-base">
                Book their stay <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
              </Link>
            </Magnetic>
            <Link to="/contact" className="btn !border-2 !border-cream/30 !px-9 !py-4 text-base text-cream hover:!bg-cream hover:!text-ink">
              Plan a visit
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
