import { motion } from 'framer-motion';
import { Footprints, HeartPulse, Pill, UtensilsCrossed } from 'lucide-react';
import { fmtDate, MOODS, timeAgo } from '../../lib/format';

export default function UpdateCard({ update: u, index = 0, showPet = false, onDelete }) {
  const mood = MOODS[u.mood] || MOODS.happy;
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: Math.min(index, 4) * 0.06 }}
      className="relative pl-16"
    >
      <span className="absolute top-5 left-2 grid h-9 w-9 place-items-center rounded-full border-4 border-cream text-base shadow" style={{ background: mood.color }}>
        {mood.emoji}
      </span>
      <div className="card overflow-hidden">
        {u.photo && (
          <div className="relative h-64 overflow-hidden sm:h-80">
            <img src={u.photo} alt="" loading="lazy" className="h-full w-full object-cover" />
            {showPet && u.pet && (
              <span className="chip absolute top-4 left-4 bg-white/90 backdrop-blur">
                <img src={u.pet.photo} alt="" className="h-5 w-5 rounded-full object-cover" /> {u.pet.name}
              </span>
            )}
          </div>
        )}
        <div className="p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-2xl font-bold">{u.title || 'Daily update'}</h3>
            <span className="text-xs font-bold text-muted" title={fmtDate(u.createdAt)}>{timeAgo(u.createdAt)}</span>
          </div>
          <p className="mt-2 leading-relaxed text-ink-2">{u.message}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="chip" style={{ background: `${mood.color}22`, color: '#1F1535' }}>{mood.emoji} {mood.label}</span>
            <span className={`chip ${u.ateBreakfast && u.ateDinner ? 'bg-mint/15' : 'bg-sun/15'}`}>
              <UtensilsCrossed className="h-3 w-3" /> {u.ateBreakfast && u.ateDinner ? 'Ate all meals' : u.ateBreakfast || u.ateDinner ? 'Ate some meals' : 'Low appetite'}
            </span>
            <span className="chip bg-sky/15"><Footprints className="h-3 w-3" /> {u.walks} walk{u.walks === 1 ? '' : 's'}</span>
            {u.medsGiven && <span className="chip bg-rose/15"><Pill className="h-3 w-3" /> Meds given</span>}
          </div>
          {u.healthNote && (
            <p className="mt-4 flex items-start gap-2 rounded-2xl bg-cream p-3 text-sm">
              <HeartPulse className="mt-0.5 h-4 w-4 shrink-0 text-coral" /> {u.healthNote}
            </p>
          )}
          <div className="mt-4 flex items-center justify-between text-xs text-muted">
            <span>Posted by {u.author?.name || 'Wuffelune team'}</span>
            {onDelete && <button onClick={() => onDelete(u)} className="font-bold text-coral hover:underline">Delete</button>}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
