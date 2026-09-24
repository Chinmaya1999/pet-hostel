import { Award, Heart, ShieldCheck, Sparkles } from 'lucide-react';
import PageHero from '../components/layout/PageHero';
import SectionHeading from '../components/ui/SectionHeading';
import Reveal from '../components/ui/Reveal';
import TiltCard from '../components/ui/TiltCard';
import Stats from '../components/home/Stats';
import CTA from '../components/home/CTA';
import { IMAGES, VIDEOS } from '../data/media';

const values = [
  { icon: Heart, title: 'Love first', text: 'Every carer is a pet parent. We hire for kindness, then train for skill.', color: '#FF6B4A' },
  { icon: ShieldCheck, title: 'Safety always', text: 'CCTV, fire safety, secure fencing, separate cat & dog wings and a vet on call 24/7.', color: '#3DD9B3' },
  { icon: Sparkles, title: 'Spotless clean', text: 'Suites sanitised twice a day with pet-safe products. Fresh bedding every day.', color: '#8B7CF6' },
  { icon: Award, title: 'Certified team', text: 'Pet first-aid certified staff, professional groomers and trained dog handlers.', color: '#FFB547' },
];

const team = [
  { name: 'Dr. Meera Kapoor', role: 'Resident Vet', img: 'https://i.pravatar.cc/400?img=45', pet: IMAGES.golden },
  { name: 'Rohan Das', role: 'Head of Care', img: 'https://i.pravatar.cc/400?img=59', pet: IMAGES.husky },
  { name: 'Aisha Khan', role: 'Cat Whisperer', img: 'https://i.pravatar.cc/400?img=49', pet: IMAGES.catBlue },
  { name: 'Vikram Joshi', role: 'Master Groomer', img: 'https://i.pravatar.cc/400?img=60', pet: IMAGES.schnauzer },
];

export default function About() {
  return (
    <>
      <PageHero eyebrow="Our story" title="Built by pet parents," highlight="for pet parents." subtitle="Wuffelune started in 2019 when our founder couldn’t find anywhere she trusted to leave her anxious rescue, Toffee. So she built it." image={IMAGES.heroDuo} />

      <section className="container-x grid items-center gap-12 py-16 lg:grid-cols-2">
        <Reveal from="left" className="relative h-[480px] overflow-hidden rounded-5xl">
          <video src={VIDEOS.petting} poster={IMAGES.dogCatCuddle} autoPlay muted loop playsInline className="h-full w-full object-cover" />
        </Reveal>
        <Reveal from="right">
          <h2 className="text-4xl font-bold sm:text-5xl">Not a kennel. <span className="text-gradient italic">A second home.</span></h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            Traditional kennels felt cold and noisy. We wanted somewhere that felt like a friend’s house — with sunny yards, soft beds,
            real routines and people who actually know your pet’s name (and their favourite belly-rub spot).
          </p>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Today we care for dogs, cats, rabbits and birds across 35 suites, with a team of 22 carers, groomers and a resident vet. And
            yes — Toffee still visits every week to supervise.
          </p>
        </Reveal>
      </section>

      <Stats />

      <section className="container-x py-20">
        <SectionHeading eyebrow="What we stand for" title="Our" highlight="promises." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.08}>
              <TiltCard className="card h-full p-7">
                <span className="grid h-14 w-14 place-items-center rounded-2xl text-white" style={{ background: v.color }}>
                  <v.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-2xl font-bold">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{v.text}</p>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-x py-20">
        <SectionHeading eyebrow="The pack" title="Meet the" highlight="humans." subtitle="Hover to meet their four-legged sidekicks." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.08} className="group text-center">
              <div className="relative mx-auto h-72 overflow-hidden rounded-5xl">
                <img src={m.img} alt={m.name} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110 group-hover:opacity-0" />
                <img src={m.pet.replace('w=1200', 'w=500')} alt="" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-0 transition duration-700 group-hover:scale-100 group-hover:opacity-100" />
              </div>
              <h3 className="mt-4 text-2xl font-bold">{m.name}</h3>
              <p className="text-sm font-bold text-coral">{m.role}</p>
            </Reveal>
          ))}
        </div>
      </section>
      <CTA />
    </>
  );
}
