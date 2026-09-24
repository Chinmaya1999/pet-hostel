import { lazy, Suspense } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import SmoothScroll from './components/layout/SmoothScroll';
import ScrollProgress from './components/layout/ScrollProgress';
import CustomCursor from './components/layout/CustomCursor';
import Preloader from './components/layout/Preloader';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Spinner from './components/ui/Spinner';
import Home from './pages/Home';

const Services = lazy(() => import('./pages/Services'));
const Suites = lazy(() => import('./pages/Suites'));
const SuiteDetail = lazy(() => import('./pages/SuiteDetail'));
const Gallery = lazy(() => import('./pages/Gallery'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Book = lazy(() => import('./pages/Book'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const BookingDetail = lazy(() => import('./pages/dashboard/BookingDetail'));
const Admin = lazy(() => import('./pages/admin/Admin'));
const NotFound = lazy(() => import('./pages/NotFound'));

function Page({ children }) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-[70vh]"
    >
      {children}
    </motion.main>
  );
}

export default function App() {
  const location = useLocation();
  const bare = ['/login', '/register'].includes(location.pathname);

  return (
    <div className="grain">
      <Preloader />
      <SmoothScroll />
      <ScrollProgress />
      <CustomCursor />
      {!bare && <Navbar />}
      <Suspense fallback={<div className="pt-40"><Spinner label="Loading…" /></div>}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Page><Home /></Page>} />
            <Route path="/services" element={<Page><Services /></Page>} />
            <Route path="/suites" element={<Page><Suites /></Page>} />
            <Route path="/suites/:slug" element={<Page><SuiteDetail /></Page>} />
            <Route path="/gallery" element={<Page><Gallery /></Page>} />
            <Route path="/about" element={<Page><About /></Page>} />
            <Route path="/contact" element={<Page><Contact /></Page>} />
            <Route path="/login" element={<Page><Login /></Page>} />
            <Route path="/register" element={<Page><Register /></Page>} />
            <Route path="/book" element={<ProtectedRoute role="owner"><Page><Book /></Page></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute role="owner"><Page><Dashboard /></Page></ProtectedRoute>} />
            <Route path="/dashboard/bookings/:id" element={<ProtectedRoute><Page><BookingDetail /></Page></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute role="admin"><Page><Admin /></Page></ProtectedRoute>} />
            <Route path="*" element={<Page><NotFound /></Page>} />
          </Routes>
        </AnimatePresence>
      </Suspense>
      {!bare && <Footer />}
    </div>
  );
}
