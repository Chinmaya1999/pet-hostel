import { useState } from 'react';
import Hero from '../components/home/Hero';
import PhotoMarquee from '../components/home/PhotoMarquee';
import WhatIsHostel from '../components/home/WhatIsHostel';
import ServicesBento from '../components/home/ServicesBento';
import VideoShowcase from '../components/home/VideoShowcase';
import Stats from '../components/home/Stats';
import HowItWorks from '../components/home/HowItWorks';
import SuitesPreview from '../components/home/SuitesPreview';
import UpdatesPhone from '../components/home/UpdatesPhone';
import Testimonials from '../components/home/Testimonials';
import GalleryParallax from '../components/home/GalleryParallax';
import FAQ from '../components/home/FAQ';
import CTA from '../components/home/CTA';
import VideoModal from '../components/ui/VideoModal';
import { IMAGES, VIDEOS } from '../data/media';

export default function Home() {
  const [video, setVideo] = useState(null);
  return (
    <>
      <Hero onPlayVideo={() => setVideo(VIDEOS.parkWalk)} />
      <PhotoMarquee />
      <WhatIsHostel />
      <ServicesBento />
      <VideoShowcase onPlay={() => setVideo(VIDEOS.riverCatch)} />
      <Stats />
      <HowItWorks />
      <SuitesPreview />
      <UpdatesPhone />
      <Testimonials />
      <GalleryParallax />
      <FAQ />
      <CTA />
      <VideoModal open={Boolean(video)} src={video} poster={IMAGES.heroDuo} onClose={() => setVideo(null)} />
    </>
  );
}
