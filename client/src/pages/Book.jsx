import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CalendarDays, Check, Plus, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../lib/api';
import useFetch from '../lib/useFetch';
import { inr, fmtDate, SPECIES_EMOJI, toInputDate } from '../lib/format';
import { ICONS } from '../data/content';
import Modal from '../components/ui/Modal';
import PetForm from '../components/ui/PetForm';
import Spinner from '../components/ui/Spinner';
import Confetti from '../components/ui/Confetti';

const STEPS = ['Your pet', 'Dates & suite', 'Extras', 'Confirm'];
const today = new Date();
const addDays = (d, n) => new Date(new Date(d).getTime() + n * 86400000);

export default function Book() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { data: pets, loading: petsLoading, setData: setPets } = useFetch('/pets', []);
  const { data: suites } = useFetch('/suites', []);
  const { data: services } = useFetch('/services', []);

  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [addPet, setAddPet] = useState(false);
  const [form, setForm] = useState({
    pet: '',
    suite: params.get('suite') || '',
    checkIn: toInputDate(addDays(today, 3)),
    checkOut: toInputDate(addDays(today, 8)),
    services: [],
    specialInstructions: '',
    emergencyContact: { name: '', phone: '' },
  });
  const [availability, setAvailability] = useState({});
  const [quote, setQuote] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(null);

  const pet = pets.find((p) => p._id === form.pet);
  const suite = suites.find((s) => s._id === form.suite);
  const addOns = services.filter((s) => s.unit !== 'included');
  const included = services.filter((s) => s.unit === 'included');
  const eligibleSuites = useMemo(() => (pet ? suites.filter((s) => s.species.includes(pet.species)) : suites), [suites, pet]);

  // Preselect the only pet.
  useEffect(() => {
    if (!form.pet && pets.length === 1) setForm((f) => ({ ...f, pet: pets[0]._id }));
  }, [pets, form.pet]);

  // Drop a suite that doesn't suit the chosen pet.
  useEffect(() => {
    if (pet && suite && !suite.species.includes(pet.species)) setForm((f) => ({ ...f, suite: '' }));
  }, [pet, suite]);

  // Live availability for the chosen dates.
  useEffect(() => {
    if (!form.checkIn || !form.checkOut || form.checkOut <= form.checkIn) return;
    api
      .get('/suites/availability', { params: { checkIn: form.checkIn, checkOut: form.checkOut } })
      .then(({ data }) => setAvailability(Object.fromEntries(data.map((a) => [a.suite, a.available]))))
      .catch(() => setAvailability({}));
  }, [form.checkIn, form.checkOut]);

  // Server-side quote whenever the inputs change.
  useEffect(() => {
    if (!form.pet || !form.suite || form.checkOut <= form.checkIn) return setQuote(null);
    const t = setTimeout(() => {
      api
        .post('/bookings/quote', { petId: form.pet, suiteId: form.suite, checkIn: form.checkIn, checkOut: form.checkOut, services: form.services })
        .then(({ data }) => setQuote(data))
        .catch((e) => setQuote({ error: e.message }));
    }, 250);
    return () => clearTimeout(t);
  }, [form.pet, form.suite, form.checkIn, form.checkOut, form.services]);

  const nights = Math.max(0, Math.round((new Date(form.checkOut) - new Date(form.checkIn)) / 86400000));
  const canNext = [
    Boolean(form.pet),
    Boolean(form.suite) && nights > 0 && availability[form.suite] !== 0 && !quote?.error,
    true,
    true,
  ][step];

  const go = (d) => {
    setDir(d);
    setStep((s) => Math.min(STEPS.length - 1, Math.max(0, s + d)));
  };

  const toggleService = (id) =>
    setForm((f) => ({ ...f, services: f.services.includes(id) ? f.services.filter((x) => x !== id) : [...f.services, id] }));

  const confirm = async () => {
    setSubmitting(true);
    try {
      const { data } = await api.post('/bookings', {
        petId: form.pet, suiteId: form.suite, checkIn: form.checkIn, checkOut: form.checkOut,
        services: form.services, specialInstructions: form.specialInstructions, emergencyContact: form.emergencyContact,
      });
      setDone(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <section className="container-x flex min-h-[80vh] items-center justify-center pt-32 pb-16">
        <Confetti />
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', damping: 14 }} className="card max-w-lg p-10 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }} className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-mint text-white shadow-2xl">
            <Check className="h-12 w-12" strokeWidth={3} />
          </motion.div>
          <h1 className="mt-6 text-4xl font-bold">Booking requested! 🎉</h1>
          <p className="mt-3 text-muted">
            {done.pet.name}’s stay in the <strong className="text-ink">{done.suite.name}</strong> from {fmtDate(done.checkIn)} to {fmtDate(done.checkOut)} is pending confirmation.
            We’ll confirm within a couple of hours.
          </p>
          <p className="mt-4 inline-block rounded-full bg-cream px-4 py-2 font-mono text-sm font-bold">Ref: {done.reference}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to={`/dashboard/bookings/${done._id}`} className="btn-primary flex-1">View booking</Link>
            <button onClick={() => navigate('/dashboard')} className="btn-ghost flex-1">Go to dashboard</button>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="container-x pt-32 pb-16">
      <div className="mb-10">
        <span className="eyebrow">Book a stay</span>
        <h1 className="mt-4 text-5xl font-bold sm:text-6xl">
          Plan their <span className="text-gradient italic">holiday.</span>
        </h1>
      </div>

      {/* Stepper */}
      <ol className="mb-10 flex items-center gap-2 sm:gap-4">
        {STEPS.map((s, i) => (
          <li key={s} className="flex flex-1 items-center gap-2 sm:gap-3">
            <motion.span
              animate={{ scale: i === step ? 1.1 : 1, backgroundColor: i <= step ? '#FF6B4A' : '#FFFFFF', color: i <= step ? '#fff' : '#6F6485' }}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-extrabold shadow-soft"
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </motion.span>
            <span className={`hidden text-sm font-bold md:block ${i === step ? 'text-ink' : 'text-muted'}`}>{s}</span>
            {i < STEPS.length - 1 && (
              <span className="h-1 flex-1 overflow-hidden rounded-full bg-ink/10">
                <motion.span className="block h-full bg-coral" animate={{ width: i < step ? '100%' : '0%' }} transition={{ duration: 0.5 }} />
              </span>
            )}
          </li>
        ))}
      </ol>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="card relative min-h-[420px] overflow-hidden p-6 sm:p-8">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={step}
                custom={dir}
                initial={{ opacity: 0, x: dir * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -60 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                {step === 0 && (
                  <>
                    <h2 className="text-3xl font-bold">Who’s coming to stay?</h2>
                    <p className="mt-1 text-muted">Pick a pet or add a new one.</p>
                    {petsLoading ? (
                      <Spinner />
                    ) : (
                      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {pets.map((p) => {
                          const active = form.pet === p._id;
                          return (
                            <motion.button
                              key={p._id}
                              whileHover={{ y: -4 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={() => setForm({ ...form, pet: p._id })}
                              className={`relative overflow-hidden rounded-3xl border-3 bg-cream p-3 text-left transition ${active ? 'border-coral shadow-glow' : 'border-transparent'}`}
                            >
                              <img src={p.photo} alt="" className="h-36 w-full rounded-2xl object-cover" />
                              <p className="mt-3 font-display text-xl font-bold">{p.name}</p>
                              <p className="text-xs font-semibold text-muted capitalize">{SPECIES_EMOJI[p.species]} {p.breed || p.species}</p>
                              {active && (
                                <motion.span layoutId="pet-check" className="absolute top-5 right-5 grid h-8 w-8 place-items-center rounded-full bg-coral text-white">
                                  <Check className="h-4 w-4" />
                                </motion.span>
                              )}
                            </motion.button>
                          );
                        })}
                        <button onClick={() => setAddPet(true)} className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-ink/15 text-muted transition hover:border-coral hover:text-coral">
                          <span className="grid h-14 w-14 place-items-center rounded-full bg-cream"><Plus className="h-6 w-6" /></span>
                          <span className="font-bold">Add a pet</span>
                        </button>
                      </div>
                    )}
                  </>
                )}

                {step === 1 && (
                  <>
                    <h2 className="text-3xl font-bold">When and where?</h2>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="label" htmlFor="b-in">Check-in</label>
                        <input id="b-in" type="date" className="input" min={toInputDate(today)} value={form.checkIn}
                          onChange={(e) => {
                            const checkIn = e.target.value;
                            setForm((f) => ({ ...f, checkIn, checkOut: f.checkOut <= checkIn ? toInputDate(addDays(checkIn, 1)) : f.checkOut }));
                          }} />
                      </div>
                      <div>
                        <label className="label" htmlFor="b-out">Check-out</label>
                        <input id="b-out" type="date" className="input" min={toInputDate(addDays(form.checkIn, 1))} value={form.checkOut} onChange={(e) => setForm({ ...form, checkOut: e.target.value })} />
                      </div>
                    </div>
                    <p className="mt-3 flex items-center gap-2 text-sm font-bold text-coral">
                      <CalendarDays className="h-4 w-4" /> {nights} night{nights === 1 ? '' : 's'}
                    </p>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      {eligibleSuites.map((s) => {
                        const left = availability[s._id];
                        const full = left === 0;
                        const active = form.suite === s._id;
                        return (
                          <button
                            key={s._id}
                            disabled={full}
                            onClick={() => setForm({ ...form, suite: s._id })}
                            className={`group relative flex gap-4 overflow-hidden rounded-3xl border-3 bg-cream p-3 text-left transition disabled:opacity-50 ${active ? 'border-coral shadow-glow' : 'border-transparent hover:border-ink/10'}`}
                          >
                            <img src={s.image.replace('w=1200', 'w=300')} alt="" className="h-24 w-24 shrink-0 rounded-2xl object-cover" />
                            <div className="flex-1">
                              <p className="font-display text-lg leading-tight font-bold">{s.name}</p>
                              <p className="mt-1 text-sm font-bold" style={{ color: s.accent }}>{inr(s.pricePerNight)}<span className="text-muted"> /night</span></p>
                              <p className={`mt-2 text-xs font-bold ${full ? 'text-coral' : left !== undefined && left <= 2 ? 'text-[#b87400]' : 'text-mint'}`}>
                                {left === undefined ? '' : full ? 'Fully booked' : left <= 2 ? `Only ${left} left!` : `${left} available`}
                              </p>
                            </div>
                            {active && <span className="absolute top-3 right-3 grid h-7 w-7 place-items-center rounded-full bg-coral text-white"><Check className="h-4 w-4" /></span>}
                          </button>
                        );
                      })}
                    </div>
                    {quote?.error && <p className="mt-4 rounded-2xl bg-coral/10 p-4 text-sm font-semibold text-coral">{quote.error}</p>}
                  </>
                )}

                {step === 2 && (
                  <>
                    <h2 className="text-3xl font-bold">Any extras?</h2>
                    <p className="mt-1 text-muted">Already included: {included.map((s) => s.name).join(', ')}.</p>
                    <div className="mt-6 grid gap-3">
                      {addOns.map((s) => {
                        const Icon = ICONS[s.icon] || Sparkles;
                        const on = form.services.includes(s._id);
                        return (
                          <button key={s._id} onClick={() => toggleService(s._id)} className={`flex items-center gap-4 rounded-3xl border-3 p-4 text-left transition ${on ? 'border-coral bg-coral/5' : 'border-transparent bg-cream hover:border-ink/10'}`}>
                            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white" style={{ background: s.accent }}><Icon className="h-5 w-5" /></span>
                            <div className="flex-1">
                              <p className="font-bold">{s.name}</p>
                              <p className="text-sm text-muted">{s.short}</p>
                            </div>
                            <p className="text-right text-sm font-bold whitespace-nowrap">
                              {inr(s.price)}
                              <span className="block text-xs text-muted">{s.unit === 'per-day' ? 'per day' : 'per session'}</span>
                            </p>
                            <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 transition ${on ? 'border-coral bg-coral text-white' : 'border-ink/20'}`}>{on && <Check className="h-4 w-4" />}</span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="mt-6">
                      <label className="label" htmlFor="b-notes">Special instructions</label>
                      <textarea id="b-notes" rows={3} className="input resize-none" value={form.specialInstructions} onChange={(e) => setForm({ ...form, specialInstructions: e.target.value })} placeholder="Loves belly rubs, scared of thunder…" />
                    </div>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div><label className="label" htmlFor="b-ecn">Emergency contact</label><input id="b-ecn" className="input" value={form.emergencyContact.name} onChange={(e) => setForm({ ...form, emergencyContact: { ...form.emergencyContact, name: e.target.value } })} placeholder="Name" /></div>
                      <div><label className="label" htmlFor="b-ecp">Their phone</label><input id="b-ecp" className="input" value={form.emergencyContact.phone} onChange={(e) => setForm({ ...form, emergencyContact: { ...form.emergencyContact, phone: e.target.value } })} placeholder="+91" /></div>
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <h2 className="text-3xl font-bold">Looks paw-fect?</h2>
                    <div className="mt-6 flex flex-col gap-5 rounded-3xl bg-cream p-5 sm:flex-row">
                      <img src={suite?.image} alt="" className="h-40 w-full rounded-2xl object-cover sm:w-56" />
                      <div className="space-y-2 text-sm">
                        <p className="font-display text-2xl font-bold">{pet?.name} × {suite?.name}</p>
                        <p><strong>Dates:</strong> {fmtDate(form.checkIn)} → {fmtDate(form.checkOut)} ({nights} nights)</p>
                        <p><strong>Extras:</strong> {quote?.services?.length ? quote.services.map((s) => s.name).join(', ') : 'None'}</p>
                        {form.specialInstructions && <p><strong>Notes:</strong> {form.specialInstructions}</p>}
                        {pet?.feedingInstructions && <p><strong>Feeding plan:</strong> {pet.feedingInstructions}</p>}
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-muted">Pay at check-in. Free cancellation up to 48 hours before arrival.</p>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex justify-between gap-3">
            <button onClick={() => go(-1)} disabled={step === 0} className="btn-ghost"><ArrowLeft className="h-4 w-4" /> Back</button>
            {step < STEPS.length - 1 ? (
              <button onClick={() => go(1)} disabled={!canNext} className="btn-primary">Continue <ArrowRight className="h-4 w-4" /></button>
            ) : (
              <button onClick={confirm} disabled={submitting || !quote || quote.error} className="btn-primary !px-8">{submitting ? 'Booking…' : 'Confirm booking 🐾'}</button>
            )}
          </div>
        </div>

        {/* Summary */}
        <aside className="lg:col-span-4">
          <div className="sticky top-28 overflow-hidden rounded-4xl bg-ink text-cream shadow-2xl">
            <div className="relative h-36">
              <img src={suite?.image || pet?.photo || 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80'} alt="" className="h-full w-full object-cover opacity-70" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink to-transparent" />
              {pet && <img src={pet.photo} alt="" className="absolute -bottom-6 left-6 h-16 w-16 rounded-2xl border-4 border-ink object-cover" />}
            </div>
            <div className="space-y-3 p-6 pt-10 text-sm">
              <h3 className="text-2xl font-bold">Your stay</h3>
              <Row label="Guest" value={pet ? `${pet.name} ${SPECIES_EMOJI[pet.species]}` : '—'} />
              <Row label="Suite" value={suite?.name || '—'} />
              <Row label="Dates" value={nights > 0 ? `${fmtDate(form.checkIn, { day: 'numeric', month: 'short' })} → ${fmtDate(form.checkOut, { day: 'numeric', month: 'short' })}` : '—'} />
              <div className="my-4 h-px bg-cream/10" />
              {quote && !quote.error ? (
                <>
                  <Row label={`${inr(suite?.pricePerNight)} × ${quote.nights} nights`} value={inr(quote.suiteSubtotal)} />
                  {quote.services.map((s) => <Row key={s.name} label={`${s.name}${s.qty > 1 ? ` × ${s.qty}` : ''}`} value={inr(s.subtotal)} />)}
                  <Row label="GST (5%)" value={inr(quote.tax)} />
                  <div className="my-4 h-px bg-cream/10" />
                  <div className="flex items-end justify-between">
                    <span className="font-bold text-cream/60">Total</span>
                    <motion.span key={quote.totalPrice} initial={{ scale: 1.2, color: '#FFB547' }} animate={{ scale: 1, color: '#FFF8F0' }} className="font-display text-4xl font-bold">
                      {inr(quote.totalPrice)}
                    </motion.span>
                  </div>
                </>
              ) : (
                <p className="text-cream/50">Choose a pet, suite and dates to see your price.</p>
              )}
            </div>
          </div>
        </aside>
      </div>

      <Modal open={addPet} onClose={() => setAddPet(false)} title="Add a pet 🐾" wide>
        <PetForm
          onCancel={() => setAddPet(false)}
          onSaved={(p) => {
            setPets([p, ...pets]);
            setForm((f) => ({ ...f, pet: p._id }));
            setAddPet(false);
          }}
        />
      </Modal>
    </section>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-cream/60">{label}</span>
      <span className="text-right font-bold">{value}</span>
    </div>
  );
}
