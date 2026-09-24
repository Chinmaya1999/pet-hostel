import { Camera, Footprints, House, Pill, Sparkles, Stethoscope, UtensilsCrossed, PawPrint } from 'lucide-react';
import { IMAGES } from './media';

export const ICONS = { Home: House, House, UtensilsCrossed, Footprints, Sparkles, Pill, Stethoscope, Camera, PawPrint };

// Mirrors the seeded services so the marketing pages render even before the API responds.
export const SERVICES = [
  { slug: 'accommodation', name: 'Accommodation', icon: 'Home', accent: '#FF6B4A', image: IMAGES.cavalierPillow, short: 'Safe, cozy suites for overnight or multi-day stays.', features: ['Private suites', '24/7 on-site staff', 'Separate cat & dog wings', 'CCTV secured'], price: 0, unit: 'included' },
  { slug: 'food', name: 'Food & Water', icon: 'UtensilsCrossed', accent: '#FFB547', image: IMAGES.puppyBowl, short: 'Meals served exactly the way your pet likes them.', features: ['Your feeding schedule', 'Premium menu available', 'Special diets', 'Filtered water'], price: 0, unit: 'included' },
  { slug: 'walks', name: 'Walking & Exercise', icon: 'Footprints', accent: '#3DD9B3', image: IMAGES.fluffyRun, short: 'Daily walks, zoomies and supervised group play.', features: ['Trail walks', 'Supervised group play', 'Agility course', 'Fetch & splash pool'], price: 199, unit: 'per-day' },
  { slug: 'grooming', name: 'Grooming', icon: 'Sparkles', accent: '#8B7CF6', image: IMAGES.grooming, short: 'Bath, brush, nail trim — go home looking fabulous.', features: ['Warm bath & dry', 'Brush-out', 'Nail trim', 'Ear cleaning'], price: 799, unit: 'per-session' },
  { slug: 'medication', name: 'Medication & Care', icon: 'Pill', accent: '#FF7EB6', image: IMAGES.catHighFive, short: 'Prescribed medicines given on time, every time.', features: ['Oral & topical meds', 'Insulin injections', 'Logged dosages', 'Senior pet care'], price: 99, unit: 'per-day' },
  { slug: 'health', name: 'Health Monitoring', icon: 'Stethoscope', accent: '#5AB8FF', image: IMAGES.frenchieLying, short: 'Daily wellness checks with a vet on call.', features: ['Daily wellness check', 'Vet on call 24/7', 'Weight tracking', 'Instant owner alerts'], price: 0, unit: 'included' },
  { slug: 'updates', name: 'Photo & Video Updates', icon: 'Camera', accent: '#FF6B4A', image: IMAGES.readingDog, short: 'Daily pawgress reports right in your dashboard.', features: ['Daily photo report', 'Mood & meal log', 'Live cam (Penthouse)', 'Video calls on request'], price: 0, unit: 'included' },
];

export const FAQS = [
  { q: 'What exactly is a pet hostel?', a: 'A pet hostel is a temporary hotel for pets. When you travel, work long hours or simply can’t look after your pet for a few days, they stay with us — with their own suite, meals, walks, play, grooming, medication and daily updates sent to you.' },
  { q: 'Which vaccinations are required?', a: 'Dogs need up-to-date Rabies and DHPPi (plus Kennel Cough recommended). Cats need Rabies and FVRCP. Please bring the vaccination card at check-in, or upload it to your pet’s profile.' },
  { q: 'Can I bring my pet’s own food and toys?', a: 'Absolutely — and we encourage it! Familiar food prevents tummy upsets and a favourite toy or blanket helps them settle in faster. We’ll follow your feeding instructions to the gram.' },
  { q: 'How will I know my pet is okay?', a: 'Every day our carers post a “pawgress report” to your dashboard with photos, mood, meals, walks and any health notes. Penthouse guests also get a 24/7 HD live cam.' },
  { q: 'What happens if my pet gets sick?', a: 'Our partner vet is on call 24/7 and visits daily. If anything changes we call you straight away, follow your vet’s instructions, and log everything in your booking.' },
  { q: 'Do dogs and cats stay together?', a: 'No — cats have their own quiet, dog-free wing with climbing towers and window perches, so they stay calm and stress-free.' },
  { q: 'What is your cancellation policy?', a: 'Pending and confirmed bookings can be cancelled from your dashboard for free up to 48 hours before check-in, and any payment is refunded in full.' },
];

export const TRIP_DAYS = [
  { day: 'Day 1', title: 'Check-in & settle in', text: 'A warm welcome, a sniff-around tour, and your pet’s bed, bowls and toys set up just like home.', image: IMAGES.cavalierPillow, emoji: '🏡' },
  { day: 'Day 2', title: 'Walks & new friends', text: 'Morning trail walk, supervised group play in the turf yard, and a long afternoon nap.', image: IMAGES.puppyRun, emoji: '🐕' },
  { day: 'Day 3', title: 'Spa day', text: 'Warm bath, brush-out and nail trim. Fluffiest guest on the property — photos in your dashboard.', image: IMAGES.grooming, emoji: '✨' },
  { day: 'Day 4', title: 'Vet check & zoomies', text: 'Daily wellness check from our vet, medicines on time, then fetch in the splash pool.', image: IMAGES.fluffyRun, emoji: '🩺' },
  { day: 'Day 5', title: 'Happy reunion', text: 'Freshly groomed, well-fed and wagging — ready for the best hug of the week.', image: IMAGES.corgiHearts, emoji: '🧡' },
];

export const FALLBACK_REVIEWS = [
  { _id: 'r1', name: 'Ananya Sharma', petName: 'Bruno', petType: 'Golden Retriever', rating: 5, avatar: 'https://i.pravatar.cc/150?img=47', comment: 'We went to Goa for 5 days and got a photo of Bruno every single morning. He came back happier than when he left!' },
  { _id: 'r2', name: 'Rahul Verma', petName: 'Mochi', petType: 'Persian Cat', rating: 5, avatar: 'https://i.pravatar.cc/150?img=12', comment: 'Mochi is picky and anxious. The cat-only loft was so calm, and they followed her feeding plan to the gram.' },
  { _id: 'r3', name: 'Priya Nair', petName: 'Coco', petType: 'Beagle', rating: 5, avatar: 'https://i.pravatar.cc/150?img=32', comment: 'The live webcam in the Penthouse is a game-changer. I watched Coco nap on her mini sofa during my work trip.' },
];
