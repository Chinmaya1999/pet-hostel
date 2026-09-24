import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BedDouble, CalendarHeart, Camera, IndianRupee, LayoutDashboard, Mail, MailOpen, PawPrint, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import useFetch from '../../lib/useFetch';
import { fmtDate, inr, MOODS, SPECIES_EMOJI, STATUS_STYLES, timeAgo } from '../../lib/format';
import { IMAGES } from '../../data/media';
import Spinner from '../../components/ui/Spinner';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';

const TABS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'bookings', label: 'Bookings', icon: CalendarHeart },
  { id: 'suites', label: 'Suites', icon: BedDouble },
  { id: 'messages', label: 'Messages', icon: Mail },
];
const STATUSES = ['pending', 'confirmed', 'checked-in', 'completed', 'cancelled'];

export default function Admin() {
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') || 'overview';
  const bookings = useFetch('/bookings', []);
  const [posting, setPosting] = useState(null);

  return (
    <section className="container-x pt-32 pb-16">
      <span className="eyebrow">Admin panel</span>
      <h1 className="mt-3 text-5xl font-bold sm:text-6xl">Hostel <span className="text-gradient italic">HQ.</span></h1>

      <div className="no-scrollbar mt-8 flex gap-2 overflow-x-auto rounded-full bg-white p-1.5 shadow-soft md:inline-flex">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setParams({ tab: t.id })} className={`relative flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold ${tab === t.id ? 'text-cream' : 'text-ink-2 hover:text-coral'}`}>
            {tab === t.id && <motion.span layoutId="admin-tab" className="absolute inset-0 rounded-full bg-ink" />}
            <t.icon className="relative h-4 w-4" /><span className="relative">{t.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="mt-8">
          {tab === 'overview' && <Overview bookings={bookings} onPost={setPosting} />}
          {tab === 'bookings' && <BookingsTable bookings={bookings} onPost={setPosting} />}
          {tab === 'suites' && <SuitesAdmin />}
          {tab === 'messages' && <Messages />}
        </motion.div>
      </AnimatePresence>

      <Modal open={Boolean(posting)} onClose={() => setPosting(null)} title={posting ? `Update for ${posting.pet.name}` : ''} wide>
        {posting && <UpdateForm booking={posting} onDone={() => setPosting(null)} />}
      </Modal>
    </section>
  );
}

function Overview({ bookings, onPost }) {
  const { data: s, loading } = useFetch('/admin/stats');
  if (loading || !s) return <Spinner />;
  const guests = bookings.data.filter((b) => b.status === 'checked-in');
  const tiles = [
    { label: 'Revenue (confirmed+)', value: inr(s.revenue), icon: IndianRupee, color: '#FF6B4A' },
    { label: 'Guests in house', value: `${s.currentGuests} / ${s.totalUnits}`, icon: PawPrint, color: '#3DD9B3', sub: `${s.occupancy}% occupancy` },
    { label: 'Pet parents', value: s.owners, icon: Users, color: '#8B7CF6', sub: `${s.pets} pets registered` },
    { label: 'New messages', value: s.newMessages, icon: Mail, color: '#FFB547' },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="grid grid-cols-2 gap-4 lg:col-span-12 lg:grid-cols-4">
        {tiles.map((t, i) => (
          <motion.div key={t.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="card p-5">
            <span className="grid h-11 w-11 place-items-center rounded-2xl text-white" style={{ background: t.color }}><t.icon className="h-5 w-5" /></span>
            <p className="mt-4 font-display text-3xl font-bold">{t.value}</p>
            <p className="text-xs font-bold text-muted">{t.label}</p>
            {t.sub && <p className="mt-1 text-xs text-muted">{t.sub}</p>}
          </motion.div>
        ))}
      </div>

      <div className="card p-6 lg:col-span-7">
        <h3 className="text-2xl font-bold">Booking value by check-in month</h3>
        <p className="text-sm text-muted">Last 6 months, excluding cancellations</p>
        <RevenueChart data={s.monthly} />
        <div className="mt-6 grid grid-cols-5 gap-2">
          {STATUSES.map((st) => (
            <div key={st} className={`rounded-2xl p-3 text-center ${STATUS_STYLES[st]}`}>
              <p className="font-display text-2xl font-bold text-ink">{s.byStatus[st] || 0}</p>
              <p className="text-[11px] font-bold capitalize">{st}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card p-6 lg:col-span-5">
        <h3 className="text-2xl font-bold">In the house today</h3>
        {guests.length ? (
          <ul className="mt-4 space-y-3">
            {guests.map((b) => (
              <li key={b._id} className="flex items-center gap-3 rounded-2xl bg-cream p-3">
                <img src={b.pet.photo} alt="" className="h-12 w-12 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="font-bold">{b.pet.name} <span className="text-muted">· {b.suite.name}</span></p>
                  <p className="text-xs text-muted">Owner {b.owner.name} · out {fmtDate(b.checkOut)}</p>
                </div>
                <button onClick={() => onPost(b)} className="btn-primary !px-3 !py-2 text-xs"><Camera className="h-3.5 w-3.5" /> Update</button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-10 text-center text-sm text-muted">No guests checked in.</p>
        )}
      </div>
    </div>
  );
}

/** Single-series bar chart: one hue, rounded data-ends, hover tooltip, recessive grid. */
function RevenueChart({ data }) {
  const [hover, setHover] = useState(null);
  if (!data.length) return <p className="py-16 text-center text-sm text-muted">No bookings in this period yet.</p>;
  const max = Math.max(...data.map((d) => d.revenue)) || 1;
  const monthName = (m) => new Date(`${m}-01`).toLocaleDateString('en-IN', { month: 'short' });

  return (
    <div className="relative mt-6">
      <div className="relative flex h-56 items-end gap-3 border-b border-ink/15">
        {[0.25, 0.5, 0.75, 1].map((g) => (
          <div key={g} className="pointer-events-none absolute inset-x-0 border-t border-ink/[0.06]" style={{ bottom: `${g * 100}%` }} />
        ))}
        {data.map((d, i) => (
          <div
            key={d.month}
            className="relative flex h-full flex-1 cursor-default items-end justify-center"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(d.revenue / max) * 100}%` }}
              transition={{ duration: 0.8, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-12 rounded-t-[4px] bg-coral transition-opacity"
              style={{ opacity: hover === null || hover === i ? 1 : 0.45 }}
            />
            {hover === i && (
              <div className="absolute bottom-full z-10 mb-2 rounded-xl bg-ink px-3 py-2 text-xs whitespace-nowrap text-cream shadow-lg">
                <p className="font-bold">{inr(d.revenue)}</p>
                <p className="text-cream/70">{d.count} booking{d.count === 1 ? '' : 's'} · {monthName(d.month)}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-3">
        {data.map((d) => <p key={d.month} className="flex-1 text-center text-xs font-bold text-muted">{monthName(d.month)}</p>)}
      </div>
    </div>
  );
}

function BookingsTable({ bookings, onPost }) {
  const [filter, setFilter] = useState('all');
  if (bookings.loading) return <Spinner />;
  const list = filter === 'all' ? bookings.data : bookings.data.filter((b) => b.status === filter);

  const patch = async (b, body) => {
    try {
      const { data } = await api.patch(`/bookings/${b._id}/status`, body);
      bookings.setData(bookings.data.map((x) => (x._id === data._id ? data : x)));
      toast.success('Booking updated');
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <>
      <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto">
        {['all', ...STATUSES].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold capitalize ${filter === s ? 'bg-ink text-cream' : 'bg-white'}`}>
            {s} {s !== 'all' && <span className="opacity-60">({bookings.data.filter((b) => b.status === s).length})</span>}
          </button>
        ))}
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-ink/5 text-xs tracking-wider text-muted uppercase">
            <tr><th className="p-4">Guest</th><th className="p-4">Owner</th><th className="p-4">Dates</th><th className="p-4">Total</th><th className="p-4">Status</th><th className="p-4">Payment</th><th className="p-4" /></tr>
          </thead>
          <tbody>
            {list.map((b) => (
              <tr key={b._id} className="border-b border-ink/5 transition hover:bg-cream/60">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={b.pet.photo} alt="" className="h-10 w-10 rounded-xl object-cover" />
                    <div><p className="font-bold">{b.pet.name} {SPECIES_EMOJI[b.pet.species]}</p><p className="text-xs text-muted">{b.suite.name}</p></div>
                  </div>
                </td>
                <td className="p-4"><p className="font-semibold">{b.owner.name}</p><p className="text-xs text-muted">{b.owner.phone || b.owner.email}</p></td>
                <td className="p-4 whitespace-nowrap">{fmtDate(b.checkIn, { day: 'numeric', month: 'short' })} → {fmtDate(b.checkOut, { day: 'numeric', month: 'short' })}<p className="text-xs text-muted">{b.nights} nights</p></td>
                <td className="p-4 font-bold">{inr(b.totalPrice)}</td>
                <td className="p-4">
                  <select aria-label="Status" value={b.status} onChange={(e) => patch(b, { status: e.target.value })} className={`rounded-full border-0 px-3 py-1.5 text-xs font-bold capitalize ${STATUS_STYLES[b.status]}`}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-4">
                  <select aria-label="Payment" value={b.paymentStatus} onChange={(e) => patch(b, { paymentStatus: e.target.value })} className="rounded-full border-0 bg-cream px-3 py-1.5 text-xs font-bold capitalize">
                    {['unpaid', 'paid', 'refunded'].map((s) => <option key={s}>{s}</option>)}
                  </select>
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    {b.status === 'checked-in' && <button onClick={() => onPost(b)} className="btn-primary !px-3 !py-2 text-xs"><Camera className="h-3.5 w-3.5" /> Update</button>}
                    <Link to={`/dashboard/bookings/${b._id}`} className="btn-ghost !px-3 !py-2 text-xs">View</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!list.length && <p className="p-10 text-center text-muted">No bookings.</p>}
      </div>
    </>
  );
}

const PHOTO_CHOICES = [IMAGES.puppyRun, IMAGES.grooming, IMAGES.fluffyRun, IMAGES.cavalierPillow, IMAGES.catBlanket, IMAGES.husky, IMAGES.puppyBowl, IMAGES.beachDog].map((u) => u.replace('w=1200', 'w=900'));

function UpdateForm({ booking, onDone }) {
  const [form, setForm] = useState({ title: '', message: '', mood: 'happy', ateBreakfast: true, ateDinner: true, walks: 2, medsGiven: Boolean(booking.pet.medications), healthNote: '', photo: PHOTO_CHOICES[0] });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post('/updates', { ...form, walks: Number(form.walks), booking: booking._id });
      toast.success(`Update sent to ${booking.owner.name.split(' ')[0]} 📸`);
      onDone();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <span className="label">Mood</span>
        <div className="flex flex-wrap gap-2">
          {Object.entries(MOODS).map(([k, m]) => (
            <button type="button" key={k} onClick={() => setForm({ ...form, mood: k })} className={`rounded-full px-4 py-2 text-sm font-bold transition ${form.mood === k ? 'text-ink shadow-soft' : 'bg-white text-muted'}`} style={form.mood === k ? { background: m.color } : undefined}>
              {m.emoji} {m.label}
            </button>
          ))}
        </div>
      </div>
      <div><label className="label" htmlFor="u-title">Title</label><input id="u-title" className="input" value={form.title} onChange={set('title')} placeholder="Zoomies in the yard 🎾" /></div>
      <div><label className="label" htmlFor="u-msg">Message *</label><textarea id="u-msg" required rows={3} className="input resize-none" value={form.message} onChange={set('message')} placeholder={`How is ${booking.pet.name} doing today?`} /></div>
      <div className="grid gap-3 sm:grid-cols-4">
        <label className="flex items-center gap-2 rounded-2xl bg-white p-3 text-sm font-semibold"><input type="checkbox" className="h-4 w-4 accent-coral" checked={form.ateBreakfast} onChange={set('ateBreakfast')} /> Breakfast</label>
        <label className="flex items-center gap-2 rounded-2xl bg-white p-3 text-sm font-semibold"><input type="checkbox" className="h-4 w-4 accent-coral" checked={form.ateDinner} onChange={set('ateDinner')} /> Dinner</label>
        <label className="flex items-center gap-2 rounded-2xl bg-white p-3 text-sm font-semibold"><input type="checkbox" className="h-4 w-4 accent-coral" checked={form.medsGiven} onChange={set('medsGiven')} /> Meds</label>
        <label className="flex items-center gap-2 rounded-2xl bg-white p-3 text-sm font-semibold">Walks <input type="number" min="0" max="6" className="w-12 rounded-lg bg-cream px-2 py-1" value={form.walks} onChange={set('walks')} /></label>
      </div>
      <div><label className="label" htmlFor="u-health">Health note</label><input id="u-health" className="input" value={form.healthNote} onChange={set('healthNote')} placeholder="Weight stable, coat healthy…" /></div>
      <div>
        <span className="label">Photo</span>
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
          {PHOTO_CHOICES.map((p) => (
            <button type="button" key={p} onClick={() => setForm({ ...form, photo: p })} className={`aspect-square overflow-hidden rounded-xl ${form.photo === p ? 'ring-3 ring-coral' : 'opacity-60 hover:opacity-100'}`}>
              <img src={p.replace('w=900', 'w=150')} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
        <input className="input mt-2" value={form.photo} onChange={set('photo')} placeholder="…or paste an image URL" aria-label="Photo URL" />
      </div>
      <button disabled={busy} className="btn-primary w-full !py-4">{busy ? 'Posting…' : 'Post update to owner 📸'}</button>
    </form>
  );
}

function SuitesAdmin() {
  const { data: suites, loading, setData } = useFetch('/suites', []);
  const [drafts, setDrafts] = useState({});
  if (loading) return <Spinner />;

  const save = async (s) => {
    try {
      const { data } = await api.put(`/suites/${s._id}`, drafts[s._id]);
      setData(suites.map((x) => (x._id === data._id ? data : x)));
      setDrafts((d) => ({ ...d, [s._id]: undefined }));
      toast.success(`${data.name} saved`);
    } catch (e) {
      toast.error(e.message);
    }
  };
  const edit = (s, k, v) => setDrafts((d) => ({ ...d, [s._id]: { ...d[s._id], [k]: v } }));

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {suites.map((s) => {
        const d = drafts[s._id] || {};
        return (
          <div key={s._id} className="card flex gap-4 p-4">
            <img src={s.image.replace('w=1200', 'w=300')} alt="" className="h-28 w-28 shrink-0 rounded-2xl object-cover" />
            <div className="flex-1 space-y-3">
              <p className="font-display text-xl font-bold">{s.name}</p>
              <div className="grid grid-cols-2 gap-2">
                <label className="text-xs font-bold text-muted">₹ / night<input type="number" min="0" className="input mt-1 !py-2" value={d.pricePerNight ?? s.pricePerNight} onChange={(e) => edit(s, 'pricePerNight', Number(e.target.value))} /></label>
                <label className="text-xs font-bold text-muted">Rooms<input type="number" min="1" className="input mt-1 !py-2" value={d.units ?? s.units} onChange={(e) => edit(s, 'units', Number(e.target.value))} /></label>
              </div>
              {drafts[s._id] && <button onClick={() => save(s)} className="btn-primary !py-2 text-xs">Save changes</button>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Messages() {
  const { data, loading, setData } = useFetch('/contact', []);
  if (loading) return <Spinner />;
  if (!data.length) return <EmptyState emoji="📭" title="Inbox zero" text="No messages yet." />;

  const mark = async (m, status) => {
    try {
      const { data: upd } = await api.patch(`/contact/${m._id}`, { status });
      setData(data.map((x) => (x._id === upd._id ? upd : x)));
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <div className="space-y-3">
      {data.map((m) => (
        <div key={m._id} className={`card flex flex-col gap-3 p-5 sm:flex-row sm:items-start ${m.status === 'new' ? 'ring-2 ring-coral/40' : ''}`}>
          <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${m.status === 'new' ? 'bg-coral text-white' : 'bg-cream text-muted'}`}>
            {m.status === 'new' ? <Mail className="h-5 w-5" /> : <MailOpen className="h-5 w-5" />}
          </span>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-bold">{m.name}</p>
              <span className="text-xs text-muted">{m.email}{m.phone && ` · ${m.phone}`}</span>
              <span className="chip bg-cream">{m.subject}</span>
            </div>
            <p className="mt-2 text-sm text-ink-2">{m.message}</p>
            <p className="mt-2 text-xs text-muted">{timeAgo(m.createdAt)}</p>
          </div>
          <div className="flex gap-2">
            {m.status === 'new' && <button onClick={() => mark(m, 'read')} className="btn-ghost !px-3 !py-2 text-xs">Mark read</button>}
            <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || 'Your Wuffelune enquiry')}`} onClick={() => mark(m, 'replied')} className="btn-dark !px-3 !py-2 text-xs">Reply</a>
          </div>
        </div>
      ))}
    </div>
  );
}
