import { useState } from 'react';
import { motion } from 'framer-motion';
import { PawIcon } from './Logo';

const COLORS = ['#FF6B4A', '#FFB547', '#3DD9B3', '#8B7CF6', '#5AB8FF', '#FF7EB6'];

/** A one-shot burst of paw prints. */
export default function Confetti({ count = 36 }) {
  const [pieces] = useState(() =>
    Array.from({ length: count }, (_, i) => {
      const peak = -(200 + Math.random() * 500);
      return {
        x: (Math.random() - 0.5) * 1200,
        y: [0, peak, peak + 900],
        rotate: Math.random() * 720 - 360,
        scale: 0.6 + Math.random(),
        duration: 2.6 + Math.random(),
        color: COLORS[i % COLORS.length],
      };
    })
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] overflow-hidden" aria-hidden>
      {pieces.map((p, i) => (
        <motion.div
          key={i}
          className="absolute top-1/2 left-1/2"
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.4 }}
          animate={{ x: p.x, y: p.y, opacity: [1, 1, 0], rotate: p.rotate, scale: p.scale }}
          transition={{ duration: p.duration, ease: 'easeOut' }}
        >
          <PawIcon className="h-6 w-6" fill={p.color} />
        </motion.div>
      ))}
    </div>
  );
}
