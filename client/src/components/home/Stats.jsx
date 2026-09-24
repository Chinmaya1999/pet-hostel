import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'framer-motion';
import Reveal from '../ui/Reveal';

const stats = [
  { value: 12000, suffix: '+', label: 'Happy nights hosted', color: 'text-coral' },
  { value: 2400, suffix: '+', label: 'Pet parents trust us', color: 'text-lilac' },
  { value: 24, suffix: '/7', label: 'Care & vet on call', color: 'text-mint' },
  { value: 4.9, suffix: '★', label: 'Average rating', color: 'text-sun', decimals: 1 },
];

function Counter({ value, decimals = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, value, { duration: 2, ease: [0.22, 1, 0.36, 1], onUpdate: setN });
    return () => c.stop();
  }, [inView, value]);
  return <span ref={ref}>{n.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</span>;
}

export default function Stats() {
  return (
    <section className="container-x py-16">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.1} className="card flex flex-col items-center gap-1 px-4 py-10 text-center">
            <p className={`font-display text-5xl font-bold sm:text-6xl ${s.color}`}>
              <Counter value={s.value} decimals={s.decimals} />
              {s.suffix}
            </p>
            <p className="text-sm font-bold text-muted">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
