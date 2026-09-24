import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import Logo from '../components/ui/Logo';

export default function AuthLayout({ video, poster, quote, children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-ink lg:block">
        <video src={video} poster={poster} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
        <div className="absolute top-8 left-8">
          <Logo light />
        </div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass absolute right-8 bottom-8 left-8 rounded-4xl !bg-white/10 p-7 text-cream">
          <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-sun text-sun" />)}</div>
          <p className="mt-3 font-display text-2xl leading-snug">“{quote.text}”</p>
          <p className="mt-3 text-sm font-bold text-cream/70">— {quote.by}</p>
        </motion.div>
      </div>
      <div className="relative flex items-center justify-center overflow-hidden px-4 py-12 sm:px-8">
        <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 animate-blob bg-sun/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 animate-blob bg-lilac/25 blur-3xl [animation-delay:-4s]" />
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative w-full max-w-md">
          <div className="mb-10 lg:hidden"><Logo /></div>
          {children}
        </motion.div>
      </div>
    </div>
  );
}
