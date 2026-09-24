import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function VideoModal({ open, onClose, src, poster }) {
  useEffect(() => {
    if (!open) return;
    const k = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[95] grid place-items-center bg-ink/90 p-4 backdrop-blur" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <button onClick={onClose} className="absolute top-5 right-5 grid h-12 w-12 place-items-center rounded-full bg-cream text-ink transition hover:rotate-90" aria-label="Close video">
            <X className="h-5 w-5" />
          </button>
          <motion.video
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 24 }}
            src={src}
            poster={poster}
            controls
            autoPlay
            playsInline
            className="aspect-video w-full max-w-5xl rounded-4xl bg-black shadow-2xl"
          />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
