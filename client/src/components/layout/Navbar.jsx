import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarHeart, ChevronDown, LayoutDashboard, LogOut, Menu, ShieldCheck, X } from 'lucide-react';
import Logo from '../ui/Logo';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/suites', label: 'Suites' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const menuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMenu(false);
  }, [pathname]);

  useEffect(() => {
    const close = (e) => menuRef.current && !menuRef.current.contains(e.target) && setMenu(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const dash = user?.role === 'admin' ? '/admin' : '/dashboard';

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5">
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-full px-3 py-2 pl-4 transition-all duration-500 ${
          scrolled ? 'glass shadow-soft' : 'bg-transparent'
        }`}
      >
        <Logo />

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.to === '/'} className="relative block px-4 py-2 text-sm font-bold text-ink-2 transition hover:text-coral">
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span layoutId="nav-pill" className="absolute inset-0 -z-10 rounded-full bg-white shadow-soft" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />
                    )}
                    <span className={isActive ? 'text-coral' : ''}>{l.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="relative" ref={menuRef}>
              <button onClick={() => setMenu((m) => !m)} className="flex items-center gap-2 rounded-full bg-white py-1 pr-3 pl-1 shadow-soft transition hover:shadow-lg">
                <img src={user.avatar || `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(user.name)}`} alt="" className="h-8 w-8 rounded-full object-cover" />
                <span className="hidden text-sm font-bold sm:block">{user.name.split(' ')[0]}</span>
                <ChevronDown className={`h-4 w-4 transition ${menu ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {menu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    className="absolute right-0 mt-3 w-56 overflow-hidden rounded-3xl bg-white p-2 shadow-2xl"
                  >
                    <div className="px-3 py-2">
                      <p className="text-sm font-bold">{user.name}</p>
                      <p className="truncate text-xs text-muted">{user.email}</p>
                    </div>
                    <MenuItem to={dash} icon={user.role === 'admin' ? ShieldCheck : LayoutDashboard}>{user.role === 'admin' ? 'Admin panel' : 'My dashboard'}</MenuItem>
                    {user.role !== 'admin' && <MenuItem to="/book" icon={CalendarHeart}>Book a stay</MenuItem>}
                    <button
                      onClick={() => { logout(); navigate('/'); }}
                      className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold text-coral transition hover:bg-coral/10"
                    >
                      <LogOut className="h-4 w-4" /> Log out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="hidden px-4 py-2 text-sm font-bold text-ink-2 hover:text-coral sm:block">
              Log in
            </Link>
          )}
          {user?.role !== 'admin' && (
            <Link to="/book" className="btn-primary hidden !py-2.5 sm:inline-flex">
              Book a stay
            </Link>
          )}
          <button onClick={() => setOpen(true)} className="grid h-11 w-11 place-items-center rounded-full bg-ink text-cream lg:hidden" aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex flex-col bg-ink p-6 text-cream lg:hidden"
            initial={{ clipPath: 'circle(0% at 95% 5%)' }}
            animate={{ clipPath: 'circle(150% at 95% 5%)' }}
            exit={{ clipPath: 'circle(0% at 95% 5%)' }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className="flex items-center justify-between">
              <Logo light />
              <button onClick={() => setOpen(false)} className="grid h-11 w-11 place-items-center rounded-full bg-cream text-ink" aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <ul className="mt-12 flex flex-col gap-2">
              {[...links, ...(user ? [{ to: dash, label: 'Dashboard' }] : [{ to: '/login', label: 'Log in' }])].map((l, i) => (
                <motion.li key={l.to} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.05 }}>
                  <NavLink to={l.to} end={l.to === '/'} className={({ isActive }) => `font-display text-4xl font-bold ${isActive ? 'text-coral' : ''}`}>
                    {l.label}
                  </NavLink>
                </motion.li>
              ))}
            </ul>
            {user?.role !== 'admin' && <Link to="/book" className="btn-primary mt-auto w-full !py-4 text-base">Book a stay 🐾</Link>}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function MenuItem({ to, icon: Icon, children }) {
  return (
    <Link to={to} className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition hover:bg-cream">
      <Icon className="h-4 w-4 text-coral" /> {children}
    </Link>
  );
}
