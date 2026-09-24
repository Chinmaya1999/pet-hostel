import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import SuiteCard from '../ui/SuiteCard';
import Reveal from '../ui/Reveal';
import Spinner from '../ui/Spinner';
import useFetch from '../../lib/useFetch';

export default function SuitesPreview() {
  const { data: suites, loading, error } = useFetch('/suites', []);
  const featured = suites.filter((s) => s.featured).slice(0, 4);

  return (
    <section className="container-x py-24">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading align="left" eyebrow="Suites" title="Pick their" highlight="perfect room." subtitle="From calm cat lofts to a penthouse with a live cam — every suite is cleaned twice a day and climate controlled." />
        <Reveal className="mb-14">
          <Link to="/suites" className="btn-ghost group">
            All suites & pricing <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </Reveal>
      </div>
      {loading ? (
        <Spinner label="Fluffing the pillows…" />
      ) : error ? (
        <p className="rounded-3xl bg-white p-8 text-center text-muted">Suites will appear once the API is running. ({error})</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((s, i) => (
            <Reveal key={s._id} delay={i * 0.1}>
              <SuiteCard suite={s} />
            </Reveal>
          ))}
        </div>
      )}
    </section>
  );
}
