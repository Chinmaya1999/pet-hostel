import { motion } from 'framer-motion';

const variants = {
  up: { hidden: { opacity: 0, y: 48 }, show: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -48 }, show: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 48 }, show: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.9 }, show: { opacity: 1, scale: 1 } },
  fade: { hidden: { opacity: 0 }, show: { opacity: 1 } },
};

export default function Reveal({ children, from = 'up', delay = 0, duration = 0.8, className = '', as = 'div', once = true, amount = 0.2 }) {
  const Tag = motion[as] || motion.div;
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={variants[from]}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  );
}

/** Splits a string into words that rise in one after another. */
export function SplitText({ text, className = '', wordClassName = '', delay = 0, stagger = 0.06 }) {
  return (
    <span className={className} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-top" aria-hidden>
          <motion.span
            className={`inline-block ${wordClassName}`}
            initial={{ y: '110%', rotate: 6 }}
            whileInView={{ y: '0%', rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: delay + i * stagger, ease: [0.22, 1, 0.36, 1] }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}
