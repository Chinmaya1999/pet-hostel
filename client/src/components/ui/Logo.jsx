import { Link } from 'react-router-dom';

export function PawIcon({ className = 'h-5 w-5', fill = 'currentColor', ...rest }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill={fill} aria-hidden {...rest}>
      <ellipse cx="32" cy="42" rx="13" ry="11" />
      <ellipse cx="16" cy="27" rx="6" ry="7.5" />
      <ellipse cx="48" cy="27" rx="6" ry="7.5" />
      <ellipse cx="25" cy="15" rx="5.5" ry="7" />
      <ellipse cx="39" cy="15" rx="5.5" ry="7" />
    </svg>
  );
}

export default function Logo({ light = false }) {
  return (
    <Link to="/" className="group flex items-center gap-2.5" aria-label="Wuffelune home">
      <span className="grid h-10 w-10 place-items-center rounded-2xl bg-coral text-cream shadow-glow transition-transform duration-500 group-hover:rotate-[-12deg] group-hover:scale-110">
        <PawIcon className="h-5 w-5" />
      </span>
      <span className={`font-display text-2xl font-bold tracking-tight ${light ? 'text-cream' : 'text-ink'}`}>
        Wuffe<span className="text-coral">lune</span>
      </span>
    </Link>
  );
}
