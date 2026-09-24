import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock, Mail, MapPin, Phone, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import Logo, { PawIcon } from '../ui/Logo';
import Marquee from '../ui/Marquee';

const social = [
  { label: 'Instagram', d: 'M12 2.2c3.2 0 3.6 0 4.8.1 3.3.1 4.8 1.7 4.9 4.9.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 3.2-1.7 4.8-4.9 4.9-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-3.3-.1-4.8-1.7-4.9-4.9C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8C2.4 3.9 3.9 2.4 7.2 2.3 8.4 2.2 8.8 2.2 12 2.2zm0 4.9a4.9 4.9 0 1 0 0 9.8 4.9 4.9 0 0 0 0-9.8zm0 8.1a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zm5.1-9.4a1.2 1.2 0 1 0 0 2.3 1.2 1.2 0 0 0 0-2.3z' },
  { label: 'Facebook', d: 'M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z' },
  { label: 'YouTube', d: 'M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z' },
  { label: 'X', d: 'M18.2 2.3h3.4l-7.4 8.4 8.7 11.5h-6.8l-5.3-7-6.1 7H1.3l7.9-9L.9 2.3h7l4.8 6.4 5.5-6.4zm-1.2 17.9h1.9L7.1 4.2H5.1l11.9 16z' },
];

const cols = [
  { title: 'Explore', links: [['Services', '/services'], ['Suites & pricing', '/suites'], ['Gallery', '/gallery'], ['About us', '/about']] },
  { title: 'Guests', links: [['Book a stay', '/book'], ['My dashboard', '/dashboard'], ['Daily updates', '/dashboard'], ['Contact', '/contact']] },
];

export default function Footer() {
  const [email, setEmail] = useState('');

  return (
    <footer className="relative mt-24 overflow-hidden rounded-t-[3rem] bg-ink text-cream">
      <div className="border-b border-cream/10 py-6">
        <Marquee
          items={['Boarding', 'Daycare', 'Grooming', 'Walks', 'Vet on call', 'Live cams', 'Cat lofts', 'Daily photos'].map((t) => (
            <span key={t} className="font-display text-3xl font-bold whitespace-nowrap text-cream/80 sm:text-5xl">{t}</span>
          ))}
        />
      </div>

      <div className="container-x grid gap-12 py-16 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo light />
          <p className="mt-5 max-w-sm text-cream/60">
            A five-star home-away-from-home for dogs, cats and small pets. Loved care, daily updates, and a vet always on call.
          </p>
          <div className="mt-6 flex gap-3">
            {social.map((s) => (
              <a key={s.label} href="#" aria-label={s.label} className="grid h-11 w-11 place-items-center rounded-full bg-cream/10 transition hover:-translate-y-1 hover:bg-coral">
                <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="currentColor"><path d={s.d} /></svg>
              </a>
            ))}
          </div>
        </div>

        {cols.map((c) => (
          <div key={c.title} className="lg:col-span-2">
            <h4 className="mb-4 font-sans text-xs font-extrabold tracking-[0.2em] text-cream/40 uppercase">{c.title}</h4>
            <ul className="space-y-3">
              {c.links.map(([label, to]) => (
                <li key={label}>
                  <Link to={to} className="group inline-flex items-center gap-1 text-cream/80 transition hover:text-coral">
                    {label}
                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="lg:col-span-4">
          <h4 className="mb-4 font-sans text-xs font-extrabold tracking-[0.2em] text-cream/40 uppercase">The Pawsletter</h4>
          <p className="mb-4 text-cream/60">Monthly pet-care tips and early-bird holiday slots.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!email.includes('@')) return toast.error('Please enter a valid email');
              toast.success('You’re on the list! 🐾');
              setEmail('');
            }}
            className="flex gap-2 rounded-full bg-cream/10 p-1.5"
          >
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="you@email.com"
              aria-label="Email address"
              className="min-w-0 flex-1 bg-transparent px-4 text-sm text-cream placeholder:text-cream/40 focus:outline-none"
            />
            <button className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-coral transition hover:rotate-12" aria-label="Subscribe">
              <Send className="h-4 w-4" />
            </button>
          </form>
          <ul className="mt-6 space-y-2.5 text-sm text-cream/70">
            <li className="flex items-center gap-3"><MapPin className="h-4 w-4 text-coral" /> 21 Green Lane, Bandra West, Mumbai</li>
            <li className="flex items-center gap-3"><Phone className="h-4 w-4 text-coral" /> +91 98765 43210</li>
            <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-coral" /> hello@wuffelune.com</li>
            <li className="flex items-center gap-3"><Clock className="h-4 w-4 text-coral" /> Check-in 8am – 8pm · Care 24/7</li>
          </ul>
        </div>
      </div>

      <div className="container-x relative">
        <p className="pointer-events-none font-display text-[22vw] leading-[0.8] font-bold tracking-tighter text-cream/[0.04] select-none">Wuffelune</p>
        <PawIcon className="absolute right-10 bottom-10 h-16 w-16 rotate-12 animate-float text-coral/60" />
      </div>
      <div className="container-x flex flex-col items-center justify-between gap-3 border-t border-cream/10 py-6 text-xs text-cream/40 sm:flex-row">
        <p>© {new Date().getFullYear()} Wuffelune Pet Hostel. Made with 🧡 for pets.</p>
        <p className="max-w-3xl text-center sm:text-right">
          Photos: Unsplash · Videos &amp; sounds: Mixkit · 3D models (
          <a href="http://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer" className="underline hover:text-coral">CC-BY 4.0</a>):{' '}
          <a href="https://sketchfab.com/3d-models/labrador-dog-1f56cfbab07e4fe49b5d9e521c82073a" target="_blank" rel="noreferrer" className="underline hover:text-coral">Labrador</a> by kenchoo,{' '}
          <a href="https://sketchfab.com/3d-models/sleeping-cat-on-the-bed-1-3d-scan-ae07a741be6944e8ba5e2657069d3aaf" target="_blank" rel="noreferrer" className="underline hover:text-coral">Sleeping cat</a> by Alben Tan,{' '}
          <a href="https://sketchfab.com/3d-models/rabbit-animation-cute-94c09e85fa8f410b9459e56505e417d7" target="_blank" rel="noreferrer" className="underline hover:text-coral">Rabbit</a> by dinomaster,{' '}
          <a href="https://sketchfab.com/3d-models/parrot-eedf3a271ae742129282ff74ab8603f9" target="_blank" rel="noreferrer" className="underline hover:text-coral">Parrot</a> by SDPM Esare
        </p>
      </div>
    </footer>
  );
}
