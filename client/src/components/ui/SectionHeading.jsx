import Reveal, { SplitText } from './Reveal';

export default function SectionHeading({ eyebrow, title, highlight, subtitle, align = 'center', light = false }) {
  const center = align === 'center';
  return (
    <div className={`mb-14 flex flex-col gap-4 ${center ? 'mx-auto max-w-3xl items-center text-center' : 'max-w-2xl'}`}>
      {eyebrow && (
        <Reveal from="fade">
          <span className="eyebrow">{eyebrow}</span>
        </Reveal>
      )}
      <h2 className={`text-4xl leading-[1.05] font-bold sm:text-5xl lg:text-6xl ${light ? 'text-cream' : 'text-ink'}`}>
        <SplitText text={title} />
        {highlight && (
          <>
            {' '}
            <SplitText text={highlight} delay={0.2} wordClassName="text-gradient italic" />
          </>
        )}
      </h2>
      {subtitle && (
        <Reveal delay={0.2}>
          <p className={`text-base leading-relaxed sm:text-lg ${light ? 'text-cream/70' : 'text-muted'}`}>{subtitle}</p>
        </Reveal>
      )}
    </div>
  );
}
