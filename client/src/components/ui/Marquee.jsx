export default function Marquee({ items, className = '', reverse = false }) {
  const row = [...items, ...items];
  return (
    <div className={`mask-fade-x flex overflow-hidden ${className}`}>
      <div className="flex shrink-0 animate-marquee items-center gap-10 pr-10" style={{ animationDirection: reverse ? 'reverse' : 'normal' }}>
        {row.map((item, i) => (
          <span key={i} className="flex shrink-0 items-center gap-10">
            {item}
            <span className="text-coral">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
