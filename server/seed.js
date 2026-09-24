import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';
import Pet from './models/Pet.js';
import Suite from './models/Suite.js';
import Service from './models/Service.js';
import Booking from './models/Booking.js';
import Update from './models/Update.js';
import Review from './models/Review.js';
import Contact from './models/Contact.js';

const img = (id, w = 1200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
const DAY = 86400000;
const day = (offset) => {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  return new Date(d.getTime() + offset * DAY);
};

const suites = [
  {
    name: 'Cozy Cat Loft', slug: 'cozy-cat-loft', species: ['cat'], pricePerNight: 899, size: '40 sq ft', units: 8,
    tagline: 'Vertical playground for curious climbers',
    description: 'A quiet, dog-free loft with multi-level climbing towers, window perches overlooking our bird garden, and a private hideaway cubby. Calming pheromone diffusers keep stress low.',
    amenities: ['Climbing tower', 'Window perch', 'Dog-free wing', 'Pheromone diffuser', 'Premium litter'],
    image: img('1494256997604-768d1f608cac'), gallery: [img('1574158622682-e40e69881006'), img('1592194996308-7b43878e84a6')],
    accent: '#8B7CF6', featured: true,
  },
  {
    name: 'Classic Kennel Suite', slug: 'classic-suite', species: ['dog'], pricePerNight: 1199, size: '60 sq ft', units: 12,
    tagline: 'Everything a good pup needs',
    description: 'Spacious, climate-controlled suite with an orthopedic bed, fresh water station and three outdoor play sessions a day in our turf yards.',
    amenities: ['Orthopedic bed', 'Climate control', '3 play sessions', 'Filtered water', 'Daily photo update'],
    image: img('1587300003388-59208cc962cb'), gallery: [img('1543466835-00a7907e9de1'), img('1561037404-61cd46aa615b')],
    accent: '#3DD9B3', featured: true,
  },
  {
    name: 'Garden Villa', slug: 'garden-villa', species: ['dog'], pricePerNight: 1899, size: '110 sq ft', units: 6,
    tagline: 'Private patio with a view of the green',
    description: 'A villa-style room with its own covered patio opening onto the garden, a raised cot, toy basket and an evening cuddle session with your pet’s favourite carer.',
    amenities: ['Private patio', 'Raised cot', 'Toy basket', 'Evening cuddle time', 'Webcam access'],
    image: img('1548199973-03cce0bbc87b'), gallery: [img('1576201836106-db1758fd1c97'), img('1534361960057-19889db9621e')],
    accent: '#FFB547', featured: true,
  },
  {
    name: 'Royal Paw Penthouse', slug: 'royal-penthouse', species: ['dog', 'cat'], pricePerNight: 2999, size: '180 sq ft', units: 3,
    tagline: 'Five-star luxury with a 24/7 live cam',
    description: 'Our most indulgent stay: a real mini-sofa, TV with calming pet channels, 24/7 HD webcam, gourmet menu, a daily spa brush-out and a dedicated butler-carer.',
    amenities: ['24/7 HD webcam', 'Mini sofa & TV', 'Gourmet menu', 'Daily spa brush-out', 'Dedicated carer', 'Video call with you'],
    image: img('1560807707-8cc77767d783'), gallery: [img('1583337130417-3346a1be7dee'), img('1535930749574-1399327ce78f')],
    accent: '#FF6B4A', featured: true,
  },
  {
    name: 'Bunny & Small Pet Nook', slug: 'small-pet-nook', species: ['rabbit', 'bird', 'other'], pricePerNight: 599, size: '30 sq ft', units: 6,
    tagline: 'Calm corner for little companions',
    description: 'A peaceful, predator-free nook for rabbits, guinea pigs and birds with fresh hay, veggies and daily floor-time in a secure run.',
    amenities: ['Fresh hay & greens', 'Secure play run', 'Quiet room', 'Daily health check'],
    image: img('1591382386627-349b692688ff'), gallery: [img('1585110396000-c9ffd4e4b308'), img('1452857297128-d9c29adba80b')],
    accent: '#5AB8FF',
  },
];

const services = [
  {
    name: 'Accommodation', slug: 'accommodation', icon: 'Home', order: 1, price: 0, unit: 'included', accent: '#FF6B4A',
    short: 'Safe, cozy suites for overnight or multi-day stays.',
    description: 'Climate-controlled private suites with orthopedic bedding, separate cat and dog wings, and 24/7 on-site staff so your pet is never alone.',
    features: ['Private suites', '24/7 on-site staff', 'Separate cat & dog wings', 'CCTV secured'],
    image: img('1560807707-8cc77767d783'),
  },
  {
    name: 'Food & Water', slug: 'food', icon: 'UtensilsCrossed', order: 2, price: 0, unit: 'included', accent: '#FFB547',
    short: 'Meals served exactly the way your pet likes them.',
    description: 'We follow your feeding plan to the gram — your food or our premium menu — with filtered water refreshed throughout the day.',
    features: ['Your feeding schedule', 'Premium menu available', 'Special diets', 'Filtered water'],
    image: img('1507146426996-ef05306b995a'),
  },
  {
    name: 'Walking & Exercise', slug: 'walks', icon: 'Footprints', order: 3, price: 199, unit: 'per-day', accent: '#3DD9B3',
    short: 'Daily walks, zoomies and supervised group play.',
    description: 'Extra one-on-one trail walks on top of the included play sessions, plus agility and fetch in our fenced turf yards.',
    features: ['Trail walks', 'Supervised group play', 'Agility course', 'Fetch & splash pool'],
    image: img('1534361960057-19889db9621e'),
  },
  {
    name: 'Grooming', slug: 'grooming', icon: 'Sparkles', order: 4, price: 799, unit: 'per-session', accent: '#8B7CF6',
    short: 'Bath, brush, nail trim — go home looking fabulous.',
    description: 'Full spa session by certified groomers: warm bath, blow-dry, brush-out, nail trim, ear cleaning and a spritz of pet-safe cologne.',
    features: ['Warm bath & dry', 'Brush-out', 'Nail trim', 'Ear cleaning'],
    image: img('1516734212186-a967f81ad0d7'),
  },
  {
    name: 'Medication & Care', slug: 'medication', icon: 'Pill', order: 5, price: 99, unit: 'per-day', accent: '#FF7EB6',
    short: 'Prescribed medicines given on time, every time.',
    description: 'Tablets, drops, injections and special care routines handled by trained staff and logged in your pet’s care record.',
    features: ['Oral & topical meds', 'Insulin injections', 'Logged dosages', 'Senior pet care'],
    image: img('1415369629372-26f2fe60c467'),
  },
  {
    name: 'Health Monitoring', slug: 'health', icon: 'Stethoscope', order: 6, price: 0, unit: 'included', accent: '#5AB8FF',
    short: 'Daily wellness checks with a vet on call.',
    description: 'Every guest gets a daily check of appetite, energy, coat and stool. Our partner vet is on call 24/7 and we contact you immediately if anything changes.',
    features: ['Daily wellness check', 'Vet on call 24/7', 'Weight tracking', 'Instant owner alerts'],
    image: img('1583512603805-3cc6b41f3edb'),
  },
  {
    name: 'Photo & Video Updates', slug: 'updates', icon: 'Camera', order: 7, price: 0, unit: 'included', accent: '#FF6B4A',
    short: 'Daily pawgress reports right in your dashboard.',
    description: 'Photos, mood, meals and walks posted to your dashboard every day — upgrade to a Penthouse for a 24/7 live webcam.',
    features: ['Daily photo report', 'Mood & meal log', 'Live cam (Penthouse)', 'Video calls on request'],
    image: img('1535930749574-1399327ce78f'),
  },
];

const reviews = [
  { name: 'Ananya Sharma', petName: 'Bruno', petType: 'Golden Retriever', rating: 5, avatar: 'https://i.pravatar.cc/150?img=47', comment: 'We went to Goa for 5 days and got a photo of Bruno every single morning. He came back happier than when he left — and smelling amazing after his spa day!' },
  { name: 'Rahul Verma', petName: 'Mochi', petType: 'Persian Cat', rating: 5, avatar: 'https://i.pravatar.cc/150?img=12', comment: 'Mochi is picky and anxious. The cat-only loft was so calm, and the staff followed her feeding plan to the gram. Finally a place I trust.' },
  { name: 'Priya Nair', petName: 'Coco', petType: 'Beagle', rating: 5, avatar: 'https://i.pravatar.cc/150?img=32', comment: 'The live webcam in the Penthouse is a game-changer. I watched Coco nap on her mini sofa during my work trip. Worth every rupee.' },
  { name: 'Karan Mehta', petName: 'Tyson', petType: 'Indie Dog', rating: 4, avatar: 'https://i.pravatar.cc/150?img=15', comment: 'Tyson needs daily insulin and they handled it perfectly with logged dosages in the dashboard. Super professional team.' },
  { name: 'Sneha Iyer', petName: 'Luna', petType: 'Husky', rating: 5, avatar: 'https://i.pravatar.cc/150?img=44', comment: 'Luna has SO much energy and they actually tired her out! Trail walks + splash pool = one very happy husky.' },
  { name: 'Arjun Reddy', petName: 'Pepper', petType: 'Holland Lop', rating: 5, avatar: 'https://i.pravatar.cc/150?img=53', comment: 'Hard to find boarding for a rabbit. The small pet nook was quiet and clean, and Pepper got fresh greens daily.' },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('🌱 Seeding Wuffelune database…');
  await Promise.all([User, Pet, Suite, Service, Booking, Update, Review, Contact].map((m) => m.deleteMany({})));

  const [admin, owner] = await User.create([
    { name: 'Hostel Admin', email: 'admin@wuffelune.com', password: 'admin123', role: 'admin', phone: '+91 98765 43210', avatar: 'https://i.pravatar.cc/150?img=68' },
    { name: 'Demo Owner', email: 'demo@wuffelune.com', password: 'demo123', phone: '+91 91234 56789', address: 'Bandra West, Mumbai', avatar: 'https://i.pravatar.cc/150?img=5' },
  ]);

  const suiteDocs = await Suite.create(suites);
  const serviceDocs = await Service.create(services);
  await Review.create(reviews);
  const S = Object.fromEntries(suiteDocs.map((s) => [s.slug, s]));
  const SV = Object.fromEntries(serviceDocs.map((s) => [s.slug, s]));

  const [bruno, mochi, coco] = await Pet.create([
    { owner: owner._id, name: 'Bruno', species: 'dog', breed: 'Golden Retriever', age: 4, weight: 29, gender: 'male', vaccinated: true, photo: img('1558788353-f76d92427f16', 600), feedingInstructions: '2 cups kibble at 8am and 7pm. One carrot treat after walks.', allergies: 'Chicken', vetName: 'Dr. Kapoor', vetPhone: '+91 99887 77665' },
    { owner: owner._id, name: 'Mochi', species: 'cat', breed: 'Persian', age: 3, weight: 4.2, gender: 'female', vaccinated: true, photo: img('1574158622682-e40e69881006', 600), feedingInstructions: 'Half pouch wet food twice a day. Dry food free-feed.', medications: 'Hairball gel every other day' },
    { owner: owner._id, name: 'Coco', species: 'dog', breed: 'Beagle', age: 2, weight: 11, gender: 'female', vaccinated: true, photo: img('1543466835-00a7907e9de1', 600), feedingInstructions: '1 cup twice a day — she WILL beg, stay strong!' },
  ]);

  const line = (svc, nights) => {
    const qty = svc.unit === 'per-day' ? nights : 1;
    return { service: svc._id, name: svc.name, price: svc.price, unit: svc.unit, qty, subtotal: svc.price * qty };
  };
  const mk = (pet, suite, inOff, nights, svcs, status, paymentStatus) => {
    const lines = svcs.map((s) => line(s, nights));
    const suiteSubtotal = suite.pricePerNight * nights;
    const servicesSubtotal = lines.reduce((a, l) => a + l.subtotal, 0);
    const tax = Math.round((suiteSubtotal + servicesSubtotal) * 0.05);
    return {
      owner: owner._id, pet: pet._id, suite: suite._id, checkIn: day(inOff), checkOut: day(inOff + nights), nights,
      services: lines, suiteSubtotal, servicesSubtotal, tax, totalPrice: suiteSubtotal + servicesSubtotal + tax,
      status, paymentStatus, emergencyContact: { name: 'Riya (sister)', phone: '+91 90000 11111' },
      specialInstructions: 'Loves belly rubs. Scared of thunder — please keep the radio on.',
    };
  };

  const [current] = await Booking.create([
    mk(bruno, S['garden-villa'], -2, 5, [SV.walks, SV.grooming], 'checked-in', 'paid'),
    mk(mochi, S['cozy-cat-loft'], 10, 4, [SV.medication], 'confirmed', 'paid'),
    mk(coco, S['royal-penthouse'], 21, 3, [SV.grooming], 'pending', 'unpaid'),
    mk(coco, S['classic-suite'], -40, 6, [SV.walks], 'completed', 'paid'),
    mk(bruno, S['classic-suite'], -75, 3, [], 'completed', 'paid'),
  ]);

  await Update.create([
    { booking: current._id, pet: bruno._id, author: admin._id, title: 'Check-in day! 🏡', message: 'Bruno arrived with a big waggy tail. He sniffed every corner of his villa and has already claimed the patio as his throne.', mood: 'playful', walks: 2, photo: img('1548199973-03cce0bbc87b', 900), createdAt: day(-2) },
    { booking: current._id, pet: bruno._id, author: admin._id, title: 'Spa day ✨', message: 'Full grooming session today — bath, blow-dry and nail trim. He was a total gentleman and is now the fluffiest boy on the property.', mood: 'calm', walks: 3, photo: img('1516734212186-a967f81ad0d7', 900), healthNote: 'Weight stable at 29kg. Coat and skin healthy.', createdAt: day(-1) },
    { booking: current._id, pet: bruno._id, author: admin._id, title: 'Zoomies in the yard 🎾', message: 'Morning trail walk and 40 minutes of fetch. Ate every last bite of breakfast (chicken-free, as instructed!). Now napping in the sun.', mood: 'happy', walks: 3, photo: img('1576201836106-db1758fd1c97', 900) },
  ]);

  await Contact.create({ name: 'Vikram Singh', email: 'vikram@example.com', phone: '+91 98111 22233', subject: 'Diwali availability', message: 'Hi! Do you have a Garden Villa free for my Labrador over the Diwali week?' });

  console.log('✅ Seed complete');
  console.log('   Admin → admin@wuffelune.com / admin123');
  console.log('   Owner → demo@wuffelune.com  / demo123');
  await mongoose.disconnect();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
