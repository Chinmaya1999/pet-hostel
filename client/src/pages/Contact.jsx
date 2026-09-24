import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Mail, MapPin, Phone, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import PageHero from '../components/layout/PageHero';
import Reveal from '../components/ui/Reveal';
import api from '../lib/api';
import { IMAGES } from '../data/media';

const info = [
  { icon: MapPin, title: 'Visit us', text: '21 Green Lane, Bandra West, Mumbai 400050', color: '#FF6B4A' },
  { icon: Phone, title: 'Call 24/7', text: '+91 98765 43210', color: '#3DD9B3' },
  { icon: Mail, title: 'Email', text: 'hello@wuffelune.com', color: '#8B7CF6' },
  { icon: Clock, title: 'Drop-off hours', text: 'Every day, 8am – 8pm', color: '#FFB547' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'Booking enquiry', message: '' });
  const [sending, setSending] = useState(false);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      const { data } = await api.post('/contact', form);
      toast.success(data.message);
      setForm({ name: '', email: '', phone: '', subject: 'Booking enquiry', message: '' });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <PageHero eyebrow="Say hello" title="Come meet" highlight="the pack." subtitle="Book a free tour, ask about availability, or just tell us about your pet. We reply within a few hours." image={IMAGES.corgiHearts} />
      <section className="container-x grid gap-10 py-10 lg:grid-cols-12">
        <div className="grid content-start gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
          {info.map((i, idx) => (
            <Reveal key={i.title} delay={idx * 0.08} className="card flex items-center gap-4 p-5">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-white" style={{ background: i.color }}>
                <i.icon className="h-6 w-6" />
              </span>
              <div>
                <p className="text-xs font-extrabold tracking-widest text-muted uppercase">{i.title}</p>
                <p className="font-bold">{i.text}</p>
              </div>
            </Reveal>
          ))}
          <Reveal className="overflow-hidden rounded-4xl shadow-soft sm:col-span-2 lg:col-span-1">
            <iframe
              title="Wuffelune location"
              src="https://www.openstreetmap.org/export/embed.html?bbox=72.82%2C19.05%2C72.845%2C19.07&layer=mapnik&marker=19.06%2C72.833"
              className="h-56 w-full border-0 grayscale-[30%]"
              loading="lazy"
            />
          </Reveal>
        </div>

        <Reveal from="right" className="lg:col-span-7">
          <form onSubmit={submit} className="card space-y-5 p-6 sm:p-10">
            <h2 className="text-3xl font-bold">Send us a message 💌</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <div><label className="label" htmlFor="c-name">Your name</label><input id="c-name" required className="input" value={form.name} onChange={set('name')} placeholder="Ananya Sharma" /></div>
              <div><label className="label" htmlFor="c-email">Email</label><input id="c-email" required type="email" className="input" value={form.email} onChange={set('email')} placeholder="you@email.com" /></div>
              <div><label className="label" htmlFor="c-phone">Phone</label><input id="c-phone" className="input" value={form.phone} onChange={set('phone')} placeholder="+91" /></div>
              <div>
                <label className="label" htmlFor="c-subject">Topic</label>
                <select id="c-subject" className="input" value={form.subject} onChange={set('subject')}>
                  {['Booking enquiry', 'Book a tour', 'Grooming', 'Special care needs', 'Something else'].map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div><label className="label" htmlFor="c-msg">Message</label><textarea id="c-msg" required rows={5} className="input resize-none" value={form.message} onChange={set('message')} placeholder="Tell us about your pet and your dates…" /></div>
            <motion.button whileTap={{ scale: 0.97 }} disabled={sending} className="btn-primary w-full !py-4 text-base">
              {sending ? 'Sending…' : <>Send message <Send className="h-4 w-4" /></>}
            </motion.button>
          </form>
        </Reveal>
      </section>
    </>
  );
}
