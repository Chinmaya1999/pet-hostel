import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import AuthLayout from './AuthLayout';
import { useAuth } from '../context/AuthContext';
import { IMAGES, VIDEOS } from '../data/media';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setBusy(true);
    try {
      const user = await register(form);
      toast.success(`Welcome to the pack, ${user.name.split(' ')[0]}! 🎉`);
      navigate('/dashboard?tab=pets&new=1');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthLayout video={VIDEOS.puppies} poster={IMAGES.aussiePup} quote={{ text: 'Booking took two minutes and Luna came home tired and happy. Best husky hotel in town.', by: 'Sneha, Luna’s mum' }}>
      <h1 className="text-5xl font-bold">Join the <span className="text-gradient italic">pack.</span></h1>
      <p className="mt-3 text-muted">Create an account to add your pets and book their first stay.</p>
      <form onSubmit={submit} className="mt-8 space-y-4">
        <div><label className="label" htmlFor="r-name">Full name</label><input id="r-name" required className="input" value={form.name} onChange={set('name')} placeholder="Ananya Sharma" /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label" htmlFor="r-email">Email</label><input id="r-email" required type="email" autoComplete="email" className="input" value={form.email} onChange={set('email')} placeholder="you@email.com" /></div>
          <div><label className="label" htmlFor="r-phone">Phone</label><input id="r-phone" className="input" value={form.phone} onChange={set('phone')} placeholder="+91" /></div>
        </div>
        <div><label className="label" htmlFor="r-pass">Password</label><input id="r-pass" required type="password" autoComplete="new-password" minLength={6} className="input" value={form.password} onChange={set('password')} placeholder="At least 6 characters" /></div>
        <button disabled={busy} className="btn-primary group w-full !py-4 text-base">
          {busy ? 'Creating account…' : <>Create account <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></>}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        Already have an account? <Link to="/login" className="font-bold text-coral hover:underline">Log in</Link>
      </p>
    </AuthLayout>
  );
}
