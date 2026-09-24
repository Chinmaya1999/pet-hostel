import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Phone, ShieldAlert } from 'lucide-react';
import useFetch from '../../lib/useFetch';
import { useAuth } from '../../context/AuthContext';
import { fmtDate, inr, SPECIES_EMOJI, STATUS_STYLES } from '../../lib/format';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import UpdateCard from './UpdateCard';

const FLOW = ['pending', 'confirmed', 'checked-in', 'completed'];

export default function BookingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { data: b, loading, error } = useFetch(`/bookings/${id}`);
  const { data: updates } = useFetch(`/updates/booking/${id}`, []);

  if (loading) return <div className="pt-40"><Spinner /></div>;
  if (error || !b) return <div className="container-x pt-40"><EmptyState emoji="🙈" title="Booking not found" text={error} /></div>;

  const back = user.role === 'admin' ? '/admin?tab=bookings' : '/dashboard?tab=bookings';
  const stepIdx = FLOW.indexOf(b.status);
  const now = Date.now();
  const progress = b.status === 'checked-in' ? Math.min(100, Math.max(0, ((now - new Date(b.checkIn)) / (new Date(b.checkOut) - new Date(b.checkIn))) * 100)) : b.status === 'completed' ? 100 : 0;

  return (
    <section className="container-x pt-32 pb-16">
      <Link to={back} className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-coral"><ArrowLeft className="h-4 w-4" /> Back</Link>

      {/* Header card */}
      <div className="relative overflow-hidden rounded-5xl bg-ink text-cream">
        <img src={b.suite.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-transparent" />
        <div className="relative flex flex-col gap-6 p-6 sm:p-10 md:flex-row md:items-center">
          <motion.img initial={{ scale: 0.8, rotate: -8 }} animate={{ scale: 1, rotate: -4 }} src={b.pet.photo} alt="" className="h-32 w-32 rounded-4xl border-4 border-cream object-cover shadow-2xl" />
          <div className="flex-1">
            <span className={`chip capitalize ${STATUS_STYLES[b.status]} !bg-cream`}>{b.status}</span>
            <h1 className="mt-3 text-4xl font-bold sm:text-5xl">{b.pet.name}’s stay {SPECIES_EMOJI[b.pet.species]}</h1>
            <p className="mt-2 text-cream/70">{b.suite.name} · {fmtDate(b.checkIn)} → {fmtDate(b.checkOut)} · {b.nights} nights · Ref {b.reference}</p>
            {b.status === 'checked-in' && (
              <div className="mt-5 max-w-md">
                <div className="mb-1 flex justify-between text-xs font-bold text-cream/60"><span>Check-in</span><span>{Math.round(progress)}% of the stay</span><span>Home time</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-cream/15">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1.2 }} className="h-full rounded-full bg-gradient-to-r from-mint to-sun" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Status tracker */}
      {b.status !== 'cancelled' && (
        <ol className="mt-8 grid grid-cols-4 gap-2">
          {FLOW.map((s, i) => (
            <li key={s} className="text-center">
              <div className={`h-2 rounded-full ${i <= stepIdx ? 'bg-coral' : 'bg-ink/10'}`} />
              <p className={`mt-2 text-xs font-bold capitalize ${i <= stepIdx ? 'text-ink' : 'text-muted'}`}>{s}</p>
            </li>
          ))}
        </ol>
      )}

      <div className="mt-10 grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <h2 className="mb-6 text-3xl font-bold">Pawgress reports 📸</h2>
          {updates.length ? (
            <div className="relative">
              <div className="absolute top-0 bottom-0 left-6 w-0.5 bg-gradient-to-b from-coral via-sun to-lilac" />
              <div className="space-y-8">{updates.map((u, i) => <UpdateCard key={u._id} update={u} index={i} />)}</div>
            </div>
          ) : (
            <EmptyState emoji="📷" title="No updates yet" text={b.status === 'checked-in' ? 'The first report is on its way!' : 'Daily updates start the day your pet checks in.'} />
          )}
        </div>

        <aside className="space-y-6 lg:col-span-4">
          <div className="card p-6">
            <h3 className="text-2xl font-bold">Invoice</h3>
            <dl className="mt-4 space-y-2 text-sm">
              <Line k={`${b.suite.name} × ${b.nights}`} v={inr(b.suiteSubtotal)} />
              {b.services.map((s) => <Line key={s.name} k={`${s.name}${s.qty > 1 ? ` × ${s.qty}` : ''}`} v={inr(s.subtotal)} />)}
              <Line k="GST (5%)" v={inr(b.tax)} />
              <div className="my-3 h-px bg-ink/10" />
              <div className="flex justify-between"><dt className="font-bold">Total</dt><dd className="font-display text-2xl font-bold text-coral">{inr(b.totalPrice)}</dd></div>
              <p className={`chip mt-2 capitalize ${b.paymentStatus === 'paid' ? 'bg-mint/15' : 'bg-sun/15'}`}>{b.paymentStatus}</p>
            </dl>
          </div>
          <div className="card p-6 text-sm">
            <h3 className="text-2xl font-bold">Care notes</h3>
            {b.pet.feedingInstructions && <p className="mt-3"><strong>🍽️ Feeding:</strong> {b.pet.feedingInstructions}</p>}
            {b.pet.medications && <p className="mt-2"><strong>💊 Meds:</strong> {b.pet.medications}</p>}
            {b.pet.allergies && <p className="mt-2"><strong>⚠️ Allergies:</strong> {b.pet.allergies}</p>}
            {b.specialInstructions && <p className="mt-2"><strong>📝 Notes:</strong> {b.specialInstructions}</p>}
            {b.emergencyContact?.name && (
              <p className="mt-4 flex items-center gap-2 rounded-2xl bg-coral/10 p-3"><ShieldAlert className="h-4 w-4 text-coral" /> {b.emergencyContact.name} · {b.emergencyContact.phone}</p>
            )}
          </div>
          <a href="tel:+919876543210" className="btn-dark w-full"><Phone className="h-4 w-4" /> Call the hostel</a>
        </aside>
      </div>
    </section>
  );
}

function Line({ k, v }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{k}</dt>
      <dd className="font-bold">{v}</dd>
    </div>
  );
}
