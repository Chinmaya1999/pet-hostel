export const inr = (n = 0) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

export const fmtDate = (d, opts = { day: 'numeric', month: 'short', year: 'numeric' }) =>
  d ? new Date(d).toLocaleDateString('en-IN', opts) : '—';

export const timeAgo = (d) => {
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 60) return 'just now';
  const units = [['year', 31536000], ['month', 2592000], ['day', 86400], ['hour', 3600], ['minute', 60]];
  for (const [u, sec] of units) {
    const v = Math.floor(s / sec);
    if (v >= 1) return `${v} ${u}${v > 1 ? 's' : ''} ago`;
  }
  return 'just now';
};

export const toInputDate = (d) => {
  const x = new Date(d);
  x.setMinutes(x.getMinutes() - x.getTimezoneOffset());
  return x.toISOString().slice(0, 10);
};

export const STATUS_STYLES = {
  pending: 'bg-sun/15 text-[#b87400]',
  confirmed: 'bg-sky/15 text-[#1c6fb0]',
  'checked-in': 'bg-mint/15 text-[#0d8a6a]',
  completed: 'bg-lilac/15 text-[#5b4bd1]',
  cancelled: 'bg-ink/10 text-muted',
};

export const MOODS = {
  happy: { emoji: '😄', label: 'Happy', color: '#FFB547' },
  playful: { emoji: '🎾', label: 'Playful', color: '#3DD9B3' },
  calm: { emoji: '😌', label: 'Calm', color: '#5AB8FF' },
  sleepy: { emoji: '😴', label: 'Sleepy', color: '#8B7CF6' },
  anxious: { emoji: '🥺', label: 'A bit anxious', color: '#FF7EB6' },
};

export const SPECIES_EMOJI = { dog: '🐶', cat: '🐱', rabbit: '🐰', bird: '🐦', other: '🐾' };
