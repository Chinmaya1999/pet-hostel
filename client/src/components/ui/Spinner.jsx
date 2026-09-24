import { PawIcon } from './Logo';

export default function Spinner({ label = 'Fetching…', className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-16 text-muted ${className}`}>
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <PawIcon key={i} className="h-5 w-5 animate-bounce text-coral" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
      <p className="text-sm font-semibold">{label}</p>
    </div>
  );
}
