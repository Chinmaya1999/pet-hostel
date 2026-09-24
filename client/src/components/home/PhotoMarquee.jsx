import { IMAGES } from '../../data/media';

const rowA = [
  [IMAGES.corgi, 'Corgis'], [IMAGES.catBlue, 'Cats'], [IMAGES.husky, 'Huskies'], [IMAGES.pug, 'Pugs'],
  [IMAGES.kitten, 'Kittens'], [IMAGES.aussiePup, 'Puppies'], [IMAGES.bunny, 'Bunnies'], [IMAGES.frenchieShirt, 'Frenchies'],
];
const rowB = [
  [IMAGES.orangeCat, 'Tabbies'], [IMAGES.beagle, 'Beagles'], [IMAGES.catGreen, 'Rescues'], [IMAGES.schnauzer, 'Seniors'],
  [IMAGES.jackRussell, 'Terriers'], [IMAGES.flowerDog, 'Retrievers'], [IMAGES.lickDog, 'Labradors'], [IMAGES.frenchieLying, 'Nappers'],
];

function Row({ images, reverse }) {
  const list = [...images, ...images];
  return (
    <div className="mask-fade-x flex overflow-hidden">
      <div className="flex shrink-0 animate-marquee gap-5 pr-5" style={{ animationDirection: reverse ? 'reverse' : 'normal', animationDuration: '55s' }}>
        {list.map(([src, label], i) => (
          <div key={i} className="group relative h-40 w-56 shrink-0 overflow-hidden rounded-4xl sm:h-52 sm:w-72">
            <img src={src.replace('w=1200', 'w=500')} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
            <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-extrabold backdrop-blur">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PhotoMarquee() {
  return (
    <section className="relative -rotate-2 space-y-5 py-10" aria-label="Our guests">
      <Row images={rowA} />
      <Row images={rowB} reverse />
    </section>
  );
}
