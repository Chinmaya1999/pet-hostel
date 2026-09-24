import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PawIcon } from '../ui/Logo';

/** Paw-print trail intro that plays once per session. */
export default function Preloader() {
  const [show, setShow] = useState(() => {
    try {
      return !sessionStorage.getItem('wl_intro');
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => {
      setShow(false);
      try { sessionStorage.setItem('wl_intro', '1'); } catch { /* ignore */ }
    }, 2100);
    return () => clearTimeout(t);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-ink"
          exit={{ clipPath: 'circle(0% at 50% 50%)' }}
          initial={{ clipPath: 'circle(150% at 50% 50%)' }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex gap-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.3, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: i % 2 ? -10 : 10 }}
                transition={{ delay: i * 0.16, type: 'spring', stiffness: 300, damping: 14 }}
              >
                <PawIcon className="h-9 w-9 text-coral" style={{ transform: `rotate(${i % 2 ? 20 : -20}deg)` }} />
              </motion.div>
            ))}
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="font-display text-4xl font-bold text-cream sm:text-5xl"
          >
            Wuffe<span className="text-coral">lune</span>
          </motion.h1>
          <motion.div className="h-1 w-48 overflow-hidden rounded-full bg-cream/10">
            <motion.div className="h-full bg-gradient-to-r from-coral to-sun" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1.8, ease: 'easeInOut' }} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
