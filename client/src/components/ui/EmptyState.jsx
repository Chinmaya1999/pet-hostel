export default function EmptyState({ emoji = '🐾', title, text, action }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-4xl border-2 border-dashed border-ink/10 bg-white/60 px-6 py-14 text-center">
      <div className="text-5xl animate-float">{emoji}</div>
      <h3 className="text-2xl font-bold">{title}</h3>
      {text && <p className="max-w-sm text-sm text-muted">{text}</p>}
      {action}
    </div>
  );
}
