import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, ShieldCheck, User } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from './AuthLayout';
import { useAuth } from '../context/AuthContext';
import { IMAGES, VIDEOS } from '../data/media';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  const doLogin = async (email, password) => {
    setBusy(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}! 🐾`);
      navigate(state?.from || (user.role === 'admin' ? '/admin' : '/dashboard'), { replace: true });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout video={VIDEOS.petting} poster={IMAGES.golden} quote={{ text: 'The daily photos made my whole trip. I actually relaxed on holiday for once.', by: 'Ananya, Bruno’s mum' }}>
      <h1 className="text-5xl font-bold">Welcome <span className="text-gradient italic">back.</span></h1>
      <p className="mt-3 text-muted">Log in to see your pet’s daily updates and manage bookings.</p>

      <div className="mt-8 grid grid-cols-2 gap-3">
        <button type="button" disabled={busy} onClick={() => doLogin('demo@wuffelune.com', 'demo123')} className="flex items-center gap-2 rounded-2xl border-2 border-dashed border-coral/40 bg-coral/5 p-3 text-left text-sm font-bold transition hover:bg-coral/10">
          <User className="h-4 w-4 text-coral" /> Demo pet owner
        </button>
        <button type="button" disabled={busy} onClick={() => doLogin('admin@wuffelune.com', 'admin123')} className="flex items-center gap-2 rounded-2xl border-2 border-dashed border-lilac/50 bg-lilac/5 p-3 text-left text-sm font-bold transition hover:bg-lilac/10">
          <ShieldCheck className="h-4 w-4 text-lilac" /> Demo admin
        </button>
      </div>
      <div className="my-6 flex items-center gap-4 text-xs font-bold text-muted"><span className="h-px flex-1 bg-ink/10" />OR<span className="h-px flex-1 bg-ink/10" /></div>

      <form onSubmit={(e) => { e.preventDefault(); doLogin(form.email, form.password); }} className="space-y-4">
        <div>
          <label className="label" htmlFor="l-email">Email</label>
          <input id="l-email" type="email" required autoComplete="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
        </div>
        <div>
          <label className="label" htmlFor="l-pass">Password</label>
          <div className="relative">
            <input id="l-pass" type={show ? 'text' : 'password'} required autoComplete="current-password" className="input pr-12" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" />
            <button type="button" onClick={() => setShow(!show)} className="absolute top-1/2 right-4 -translate-y-1/2 text-muted" aria-label={show ? 'Hide password' : 'Show password'}>
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <button disabled={busy} className="btn-primary group w-full !py-4 text-base">
          {busy ? 'Logging in…' : <>Log in <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></>}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        New to Wuffelune? <Link to="/register" className="font-bold text-coral hover:underline">Create an account</Link>
      </p>
      <p className="mt-2 text-center text-sm"><Link to="/" className="font-semibold text-muted hover:text-ink">← Back to home</Link></p>
    </AuthLayout>
  );
}
