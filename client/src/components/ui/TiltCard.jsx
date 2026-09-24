import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

/** 3D tilt-on-hover wrapper with a moving glare highlight. */
export default function TiltCard({ children, className = '', intensity = 12, glare = true }) {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });
  const rotateX = useTransform(sy, [0, 1], [intensity, -intensity]);
  const rotateY = useTransform(sx, [0, 1], [-intensity, intensity]);
  const glareBg = useTransform([sx, sy], ([gx, gy]) => `radial-gradient(circle at ${gx * 100}% ${gy * 100}%, rgba(255,255,255,0.45), transparent 55%)`);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width);
    y.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ rotateX, rotateY, transformPerspective: 1000, transformStyle: 'preserve-3d' }}
      className={`relative ${className}`}
    >
      {children}
      {glare && <motion.div style={{ background: glareBg }} className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-soft-light" />}
    </motion.div>
  );
}
