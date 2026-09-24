import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IMAGES } from '../data/media';

export default function NotFound() {
  return (
    <section className="container-x flex min-h-[80vh] flex-col items-center justify-center pt-32 text-center">
      <motion.img initial={{ rotate: -10, scale: 0.8 }} animate={{ rotate: 0, scale: 1 }} transition={{ type: 'spring' }} src={IMAGES.schnauzer.replace('w=1200', 'w=500')} alt="Confused dog" className="h-56 w-56 rounded-full object-cover shadow-2xl" />
      <h1 className="mt-8 text-7xl font-bold sm:text-9xl"><span className="text-gradient">404</span></h1>
      <p className="mt-4 text-xl font-semibold">Ruh-roh! This page ran off to chase a squirrel. 🐿️</p>
      <Link to="/" className="btn-primary mt-8">Take me home</Link>
    </section>
  );
}
