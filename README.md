# 🐾 Wuffelune — MERN Pet Hostel

A full-stack pet boarding app: owners register pets and book suites. Staff post daily photo "pawgress reports". Admins manage bookings, suites and messages.

**Stack:** MongoDB · Express · React 19 (Vite) · Node — plus Tailwind CSS v4, Framer Motion, Three.js (React Three Fiber) and Lenis smooth scroll.

## Quick start

```bash
npm run install:all      # installs root, server and client deps
npm run seed             # ⚠️ wipes the app's collections and loads demo data
npm run dev              # API on :5050 + web on :5173
```

Configure `server/.env` (copy from `server/.env.example`). Set `MONGO_URI` to a local MongoDB or an Atlas connection string.

| Demo account | Email | Password |
|---|---|---|
| Pet owner | demo@wuffelune.com | demo123 |
| Admin | admin@wuffelune.com | admin123 |

The login page has one-click buttons for both.

## Features

- **Home:** a realistic 3D pet hostel scene: a Labrador, a sleeping tabby cat, a bunny and a macaw. Tap any pet to hear its real sound (bark, meow, squeak, chirp), with a mute toggle. Also: a video hero tour, a scroll-scaling video section, a "5-day trip" pet hostel explainer, services bento, a live-update phone mockup, testimonial marquees, a parallax gallery and an FAQ.
- **Booking wizard:** pet → dates & suite (live availability) → add-ons → confirm. Prices are calculated on the server (suite × nights + add-ons + 5% GST). It blocks overbooking, double-booking the same pet, past dates, and suites that don't fit the species.
- **Owner dashboard:** overview with the current stay, pet profiles (food, meds, allergies, vet), bookings with cancellation, a daily-updates timeline, and profile editing.
- **Admin HQ:** revenue and occupancy stats, a bookings table with status and payment controls, a form to post daily updates (mood, meals, walks, meds, photo), suite price and room-count editing, and a contact inbox.

## API

`/api/auth` (register, login, me) · `/api/pets` · `/api/suites` (+ `/availability`) · `/api/services` · `/api/bookings` (`/quote`, `/mine`, `/:id/cancel`, `/:id/status`) · `/api/updates` (`/feed`, `/booking/:id`) · `/api/reviews` · `/api/contact` · `/api/admin/stats`

## Production

```bash
npm run build && npm start   # Express serves client/dist on the API port
```

Media: photos from Unsplash; videos and pet sounds from Mixkit (free licenses). 3D pets (all CC-BY 4.0, credited in the footer and `client/public/models/CREDITS.txt`): Labrador by kenchoo, Sleeping cat (3D scan) by Alben Tan, Rabbit by dinomaster, Parrot by SDPM Esare.
