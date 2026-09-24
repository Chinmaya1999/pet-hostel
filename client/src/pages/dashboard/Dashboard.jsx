import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CalendarHeart, Camera, Home, PawPrint, Pencil, Plus, Trash2, User } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../lib/api';
import useFetch from '../../lib/useFetch';
import { useAuth } from '../../context/AuthContext';
import { fmtDate, inr, MOODS, SPECIES_EMOJI, STATUS_STYLES, timeAgo } from '../../lib/format';
import Modal from '../../components/ui/Modal';
import PetForm from '../../components/ui/PetForm';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import UpdateCard from './UpdateCard';

const TABS = [
  { id: 'overview', label: 'Overview', icon: Home },
  { id: 'pets', label: 'My pets', icon: PawPrint },
  { id: 'bookings', label: 'Bookings', icon: CalendarHeart },
  { id: 'updates', label: 'Daily updates', icon: Camera },
  { id: 'profile', label: 'Profile', icon: User },
];

export default function Dashboard() {
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') || 'overview';
  const setTab = (t) => setParams({ tab: t });
  const { user } = useAuth();

  const pets = useFetch('/pets', []);
  const bookings = useFetch('/bookings/mine', []);
  const feed = useFetch('/updates/feed', []);

  return (
    <section className="container-x pt-32 pb-16">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="font-bold text-muted">{greeting()},</p>
          <h1 className="text-5xl font-bold sm:text-6xl">
            {user.name.split(' ')[0]} <span className="inline-block animate-float">👋</span>
          </h1>
        </div>
        <Link to="/book" className="btn-primary self-start md:self-auto"><Plus className="h-4 w-4" /> New booking</Link>
      </div>

      <div className="no-scrollbar mt-10 flex gap-2 overflow-x-auto rounded-full bg-white p-1.5 shadow-soft md:inline-flex">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`relative flex shrink-0 items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition ${tab === t.id ? 'text-cream' : 'text-ink-2 hover:text-coral'}`}>
            {tab === t.id && <motion.span layoutId="dash-tab" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
            <t.icon className="relative h-4 w-4" />
            <span className="relative">{t.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="mt-8">
          {tab === 'overview' && <Overview pets={pets} bookings={bookings} feed={feed} setTab={setTab} />}
          {tab === 'pets' && <Pets pets={pets} autoOpen={params.get('new') === '1'} />}
          {tab === 'bookings' && <Bookings bookings={bookings} />}
          {tab === 'updates' && <Feed feed={feed} />}
          {tab === 'profile' && <Profile />}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
}

function Overview({ pets, bookings, feed, setTab }) {
  if (bookings.loading || pets.loading) return <Spinner />;
  const active = bookings.data.find((b) => b.status === 'checked-in');
  const upcoming = bookings.data.filter((b) => ['pending', 'confirmed'].includes(b.status)).sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn));
  const latest = feed.data.find((u) => active && u.booking === active._id) || feed.data[0];
  const totalNights = bookings.data.filter((b) => b.status !== 'cancelled').reduce((s, b) => s + b.nights, 0);

  const stats = [
    { label: 'Pets', value: pets.data.length, emoji: '🐾', color: 'bg-coral/10' },
    { label: 'Upcoming stays', value: upcoming.length, emoji: '📅', color: 'bg-sky/10' },
    { label: 'Nights with us', value: totalNights, emoji: '🌙', color: 'bg-lilac/10' },
    { label: 'Updates received', value: feed.data.length, emoji: '📸', color: 'bg-mint/10' },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <div className="grid grid-cols-2 gap-4 lg:col-span-12 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="card flex items-center gap-4 p-5">
            <span className={`grid h-14 w-14 place-items-center rounded-2xl text-2xl ${s.color}`}>{s.emoji}</span>
            <div>
              <p className="font-display text-3xl font-bold">{s.value}</p>
              <p className="text-xs font-bold text-muted">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="lg:col-span-7">
        {active ? (
          <div className="relative flex min-h-[26rem] flex-col justify-end overflow-hidden rounded-4xl bg-ink text-cream shadow-2xl">
            <img src={latest?.photo || active.suite.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-transparent" />
            <div className="absolute top-5 left-5 flex items-center gap-2">
              <span className="chip bg-mint text-ink"><span className="h-2 w-2 animate-pulse rounded-full bg-ink" /> Staying with us now</span>
            </div>
            <div className="relative p-6 pt-20">
              <div className="flex items-center gap-3">
                <img src={active.pet.photo} alt="" className="h-14 w-14 rounded-2xl border-2 border-cream object-cover" />
                <div>
                  <h3 className="text-3xl font-bold">{active.pet.name} is in the {active.suite.name}</h3>
                  <p className="text-sm text-cream/70">Until {fmtDate(active.checkOut)}</p>
                </div>
              </div>
              {latest && (
                <p className="mt-4 rounded-2xl bg-cream/10 p-4 text-sm backdrop-blur">
                  <strong>{MOODS[latest.mood]?.emoji} {latest.title || 'Latest update'}</strong> · {timeAgo(latest.createdAt)}
                  <br />
                  <span className="text-cream/80">{latest.message}</span>
                </p>
              )}
              <Link to={`/dashboard/bookings/${active._id}`} className="btn-primary mt-4">See all updates <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        ) : (
          <EmptyState emoji="🏖️" title="No one’s staying right now" text="Planning a trip? Book a suite and we’ll send you updates every day." action={<Link to="/book" className="btn-primary mt-2">Book a stay</Link>} />
        )}
      </div>

      <div className="lg:col-span-5">
        <div className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-2xl font-bold">Coming up</h3>
            <button onClick={() => setTab('bookings')} className="text-sm font-bold text-coral">View all</button>
          </div>
          {upcoming.length ? (
            <ul className="space-y-3">
              {upcoming.slice(0, 4).map((b) => (
                <li key={b._id}>
                  <Link to={`/dashboard/bookings/${b._id}`} className="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-cream">
                    <img src={b.pet.photo} alt="" className="h-12 w-12 rounded-xl object-cover" />
                    <div className="flex-1">
                      <p className="font-bold">{b.pet.name} · {b.suite.name}</p>
                      <p className="text-xs text-muted">{fmtDate(b.checkIn)} → {fmtDate(b.checkOut)}</p>
                    </div>
                    <span className={`chip capitalize ${STATUS_STYLES[b.status]}`}>{b.status}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-6 text-center text-sm text-muted">No upcoming stays.</p>
          )}
        </div>
        <div className="card mt-6 p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-2xl font-bold">Your pack</h3>
            <button onClick={() => setTab('pets')} className="text-sm font-bold text-coral">Manage</button>
          </div>
          <div className="flex -space-x-3">
            {pets.data.map((p) => <img key={p._id} src={p.photo} alt={p.name} title={p.name} className="h-14 w-14 rounded-full border-4 border-white object-cover transition hover:z-10 hover:-translate-y-1" />)}
            <button onClick={() => setTab('pets')} className="grid h-14 w-14 place-items-center rounded-full border-4 border-white bg-cream text-coral" aria-label="Add pet"><Plus className="h-5 w-5" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Pets({ pets, autoOpen }) {
  const [editing, setEditing] = useState(autoOpen ? {} : null);
  const remove = async (p) => {
    if (!confirm(`Remove ${p.name}'s profile?`)) return;
    try {
      await api.delete(`/pets/${p._id}`);
      pets.setData(pets.data.filter((x) => x._id !== p._id));
      toast.success(`${p.name} removed`);
    } catch (e) {
      toast.error(e.message);
    }
  };

  if (pets.loading) return <Spinner />;
  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {pets.data.map((p, i) => (
          <motion.div key={p._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="card group overflow-hidden p-2.5">
            <div className="relative h-56 overflow-hidden rounded-[1.6rem]">
              <img src={p.photo} alt={p.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 transition group-hover:opacity-100">
                <button onClick={() => setEditing(p)} className="grid h-10 w-10 place-items-center rounded-full bg-white shadow" aria-label={`Edit ${p.name}`}><Pencil className="h-4 w-4" /></button>
                <button onClick={() => remove(p)} className="grid h-10 w-10 place-items-center rounded-full bg-white text-coral shadow" aria-label={`Remove ${p.name}`}><Trash2 className="h-4 w-4" /></button>
              </div>
              {p.vaccinated && <span className="chip absolute bottom-3 left-3 bg-mint text-ink">💉 Vaccinated</span>}
            </div>
            <div className="p-4">
              <div className="flex items-baseline justify-between">
                <h3 className="text-3xl font-bold">{p.name}</h3>
                <span className="text-2xl">{SPECIES_EMOJI[p.species]}</span>
              </div>
              <p className="text-sm font-semibold text-muted">
                {[p.breed, p.age != null && `${p.age} yrs`, p.weight && `${p.weight} kg`, p.gender !== 'unknown' && p.gender].filter(Boolean).join(' · ')}
              </p>
              <dl className="mt-4 space-y-2 text-sm">
                {p.feedingInstructions && <Info k="🍽️ Food" v={p.feedingInstructions} />}
                {p.medications && <Info k="💊 Meds" v={p.medications} />}
                {p.allergies && <Info k="⚠️ Allergies" v={p.allergies} />}
              </dl>
            </div>
          </motion.div>
        ))}
        <button onClick={() => setEditing({})} className="flex min-h-80 flex-col items-center justify-center gap-3 rounded-4xl border-2 border-dashed border-ink/15 text-muted transition hover:border-coral hover:bg-white hover:text-coral">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-white shadow-soft"><Plus className="h-7 w-7" /></span>
          <span className="font-display text-xl font-bold">Add a pet</span>
        </button>
      </div>
      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title={editing?._id ? `Edit ${editing.name}` : 'Add a pet 🐾'} wide>
        {editing && (
          <PetForm
            pet={editing._id ? editing : null}
            onCancel={() => setEditing(null)}
            onSaved={(saved) => {
              pets.setData(editing._id ? pets.data.map((x) => (x._id === saved._id ? saved : x)) : [saved, ...pets.data]);
              setEditing(null);
            }}
          />
        )}
      </Modal>
    </>
  );
}

function Info({ k, v }) {
  return (
    <div className="rounded-xl bg-cream px-3 py-2">
      <dt className="text-xs font-bold text-muted">{k}</dt>
      <dd className="font-medium">{v}</dd>
    </div>
  );
}

function Bookings({ bookings }) {
  const [filter, setFilter] = useState('all');
  if (bookings.loading) return <Spinner />;
  if (!bookings.data.length) return <EmptyState emoji="📅" title="No bookings yet" text="Your pet’s first holiday is just a few clicks away." action={<Link to="/book" className="btn-primary mt-2">Book a stay</Link>} />;

  const list = filter === 'all' ? bookings.data : bookings.data.filter((b) => b.status === filter);
  const cancel = async (b) => {
    if (!confirm(`Cancel ${b.pet.name}'s stay on ${fmtDate(b.checkIn)}?`)) return;
    try {
      const { data } = await api.patch(`/bookings/${b._id}/cancel`);
      bookings.setData(bookings.data.map((x) => (x._id === data._id ? data : x)));
      toast.success('Booking cancelled');
    } catch (e) {
      toast.error(e.message);
    }
  };

  return (
    <>
      <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto">
        {['all', 'pending', 'confirmed', 'checked-in', 'completed', 'cancelled'].map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold capitalize transition ${filter === s ? 'bg-ink text-cream' : 'bg-white'}`}>{s}</button>
        ))}
      </div>
      <div className="space-y-4">
        {list.map((b, i) => (
          <motion.div key={b._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="card flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
            <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-2xl sm:w-40">
              <img src={b.suite.image} alt="" className="h-full w-full object-cover" />
              <img src={b.pet.photo} alt="" className="absolute bottom-2 left-2 h-10 w-10 rounded-xl border-2 border-white object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-2xl font-bold">{b.pet.name} · {b.suite.name}</h3>
                <span className={`chip capitalize ${STATUS_STYLES[b.status]}`}>{b.status}</span>
              </div>
              <p className="mt-1 text-sm text-muted">{fmtDate(b.checkIn)} → {fmtDate(b.checkOut)} · {b.nights} nights · Ref {b.reference}</p>
              {b.services.length > 0 && <p className="mt-1 text-xs font-semibold text-ink-2">+ {b.services.map((s) => s.name).join(', ')}</p>}
            </div>
            <div className="flex items-center gap-3 sm:flex-col sm:items-end">
              <p className="font-display text-2xl font-bold">{inr(b.totalPrice)}</p>
              <div className="flex gap-2">
                {['pending', 'confirmed'].includes(b.status) && <button onClick={() => cancel(b)} className="rounded-full px-4 py-2 text-xs font-bold text-coral hover:bg-coral/10">Cancel</button>}
                <Link to={`/dashboard/bookings/${b._id}`} className="btn-dark !px-4 !py-2 text-xs">Details</Link>
              </div>
            </div>
          </motion.div>
        ))}
        {!list.length && <p className="py-10 text-center text-muted">No {filter} bookings.</p>}
      </div>
    </>
  );
}

function Feed({ feed }) {
  if (feed.loading) return <Spinner />;
  if (!feed.data.length) return <EmptyState emoji="📸" title="No updates yet" text="When your pet stays with us, daily photo reports appear here." />;
  return (
    <div className="relative mx-auto max-w-3xl">
      <div className="absolute top-0 bottom-0 left-6 w-0.5 bg-gradient-to-b from-coral via-sun to-lilac" />
      <div className="space-y-8">
        {feed.data.map((u, i) => <UpdateCard key={u._id} update={u} index={i} showPet />)}
      </div>
    </div>
  );
}

function Profile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: user.name, phone: user.phone || '', address: user.address || '', avatar: user.avatar || '', password: '' });
  const [busy, setBusy] = useState(false);
  useEffect(() => setForm((f) => ({ ...f, name: user.name })), [user.name]);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      await updateProfile(payload);
      setForm((f) => ({ ...f, password: '' }));
      toast.success('Profile saved');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="card mx-auto max-w-2xl space-y-5 p-6 sm:p-10">
      <div className="flex items-center gap-4">
        <img src={form.avatar || `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(user.name)}`} alt="" className="h-20 w-20 rounded-3xl object-cover" />
        <div>
          <h3 className="text-2xl font-bold">{user.name}</h3>
          <p className="text-sm text-muted">{user.email}</p>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="label" htmlFor="pf-name">Name</label><input id="pf-name" className="input" value={form.name} onChange={set('name')} /></div>
        <div><label className="label" htmlFor="pf-phone">Phone</label><input id="pf-phone" className="input" value={form.phone} onChange={set('phone')} /></div>
      </div>
      <div><label className="label" htmlFor="pf-addr">Address</label><input id="pf-addr" className="input" value={form.address} onChange={set('address')} /></div>
      <div><label className="label" htmlFor="pf-av">Avatar URL</label><input id="pf-av" className="input" value={form.avatar} onChange={set('avatar')} placeholder="https://…" /></div>
      <div><label className="label" htmlFor="pf-pw">New password</label><input id="pf-pw" type="password" minLength={6} className="input" value={form.password} onChange={set('password')} placeholder="Leave blank to keep current" /></div>
      <button disabled={busy} className="btn-primary w-full">{busy ? 'Saving…' : 'Save profile'}</button>
    </form>
  );
}
