import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/** Soft trailing cursor ring that grows over interactive elements (desktop only). */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 400, damping: 35 });
  const sy = useSpring(y, { stiffness: 400, damping: 35 });

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    setEnabled(fine);
    if (!fine) return;
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setHover(Boolean(e.target.closest?.('a, button, [role="button"], input, select, textarea, label')));
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [x, y]);

  if (!enabled) return null;
  return (
    <>
      <motion.div
        style={{ x: sx, y: sy }}
        animate={{ scale: hover ? 1.9 : 1, opacity: 1 }}
        className="pointer-events-none fixed top-0 left-0 z-[90] -mt-5 -ml-5 h-10 w-10 rounded-full border-2 border-coral/70 mix-blend-multiply"
      />
      <motion.div style={{ x, y }} className="pointer-events-none fixed top-0 left-0 z-[90] -mt-1 -ml-1 h-2 w-2 rounded-full bg-coral" />
    </>
  );
}
