import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { CalendarCheck, ClipboardList, HeartHandshake, Smartphone } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';

const steps = [
  { icon: ClipboardList, title: 'Create a pet profile', text: 'Add your pet’s food plan, meds, allergies and vet details once — we’ll follow it to the letter.', color: '#FF6B4A' },
  { icon: CalendarCheck, title: 'Pick dates & suite', text: 'Choose a suite, add walks or grooming, and see the full price instantly. No hidden fees.', color: '#FFB547' },
  { icon: HeartHandshake, title: 'Drop off with a hug', text: 'A meet-and-greet with your carer, a tour of the suite, and a smooth, stress-free settle-in.', color: '#3DD9B3' },
  { icon: Smartphone, title: 'Get daily updates', text: 'Photos, mood, meals and walks land in your dashboard every day until the happy reunion.', color: '#8B7CF6' },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const width = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section className="relative overflow-hidden bg-ink py-28 text-cream">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[60rem] -translate-x-1/2 rounded-full bg-coral/20 blur-3xl" />
      <div className="container-x relative" ref={ref}>
        <SectionHeading light eyebrow="How it works" title="Booking takes" highlight="two minutes." subtitle="Four simple steps from “I have a trip” to “my pet is having the time of their life.”" />
        <div className="relative">
          <div className="absolute top-10 right-[12%] left-[12%] hidden h-0.5 bg-cream/10 lg:block">
            <motion.div style={{ width }} className="h-full bg-gradient-to-r from-coral via-sun to-lilac" />
          </div>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: i * 0.15, duration: 0.7 }}
                className="relative flex flex-col items-center text-center"
              >
                <motion.div
                  whileHover={{ rotate: -8, scale: 1.08 }}
                  className="relative z-10 grid h-20 w-20 place-items-center rounded-3xl shadow-2xl"
                  style={{ background: s.color, boxShadow: `0 20px 50px -15px ${s.color}` }}
                >
                  <s.icon className="h-8 w-8 text-white" />
                  <span className="absolute -top-2 -right-2 grid h-8 w-8 place-items-center rounded-full bg-cream text-sm font-extrabold text-ink">{i + 1}</span>
                </motion.div>
                <h3 className="mt-6 text-2xl font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/60">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
