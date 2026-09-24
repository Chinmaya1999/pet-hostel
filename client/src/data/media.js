// Curated, verified media. Images: Unsplash. Videos: Mixkit (free license).
export const img = (id, w = 1200) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
const vid = (id) => `https://assets.mixkit.co/videos/${id}/${id}-720.mp4`;

export const IMAGES = {
  heroDuo: img('1548199973-03cce0bbc87b', 1600),
  beagle: img('1543466835-00a7907e9de1'),
  catGreen: img('1514888286974-6c03e2ca1dba'),
  frenchieShirt: img('1583511655857-d19b40a7a54e'),
  pug: img('1517849845537-4d257902454a'),
  aussieBeach: img('1587300003388-59208cc962cb'),
  dogCatCuddle: img('1450778869180-41d0601e046e', 1400),
  catBlue: img('1574158622682-e40e69881006'),
  grooming: img('1516734212186-a967f81ad0d7'),
  grassDog: img('1588943211346-0908a1fb0b01'),
  kitten: img('1592194996308-7b43878e84a6'),
  puppyBowl: img('1507146426996-ef05306b995a'),
  corgi: img('1537151625747-768eb6cf92b2'),
  jackRussell: img('1561037404-61cd46aa615b'),
  orangeCat: img('1596854407944-bf87f6fdd49e'),
  golden: img('1558788353-f76d92427f16'),
  puppyRun: img('1576201836106-db1758fd1c97'),
  streetDog: img('1477884213360-7e9d7dcc1e48'),
  aussiePup: img('1601979031925-424e53b6caaa'),
  flowerDog: img('1552053831-71594a27632d'),
  readingDog: img('1535930749574-1399327ce78f'),
  catHighFive: img('1415369629372-26f2fe60c467'),
  cavalierPillow: img('1560807707-8cc77767d783'),
  schnauzer: img('1591769225440-811ad7d6eab3'),
  catBlanket: img('1494256997604-768d1f608cac'),
  husky: img('1605568427561-40dd23c2acea'),
  frenchieHoodie: img('1583337130417-3346a1be7dee'),
  beachDog: img('1530281700549-e82e7bf110d6'),
  forestDog: img('1544568100-847a948585b9'),
  frenchieLying: img('1583512603805-3cc6b41f3edb'),
  fluffyRun: img('1534361960057-19889db9621e'),
  lickDog: img('1518717758536-85ae29035b6d'),
  catDogGrass: img('1623387641168-d9803ddd3f35'),
  corgiHearts: img('1612536057832-2ff7ead58194'),
  bunny: img('1591382386627-349b692688ff'),
};

export const VIDEOS = {
  corgiBall: vid(45868),
  pugRun: vid(45843),
  riverCatch: vid(1494),
  parkWalk: vid(1532),
  puppies: vid(1210),
  petting: vid(1478),
  smiling: vid(1552),
  catPlay: vid(1779),
};

export const GALLERY = [
  { src: IMAGES.puppyRun, tag: 'Playtime', h: 'tall' },
  { src: IMAGES.catBlue, tag: 'Cat Loft', h: 'short' },
  { src: IMAGES.frenchieHoodie, tag: 'Suite life', h: 'short' },
  { src: IMAGES.husky, tag: 'Yard zoomies', h: 'tall' },
  { src: IMAGES.grooming, tag: 'Spa day', h: 'short' },
  { src: IMAGES.catBlanket, tag: 'Nap o’clock', h: 'tall' },
  { src: IMAGES.beachDog, tag: 'Beach walk', h: 'short' },
  { src: IMAGES.corgiHearts, tag: 'Love', h: 'short' },
  { src: IMAGES.aussiePup, tag: 'New friends', h: 'tall' },
  { src: IMAGES.catDogGrass, tag: 'Besties', h: 'short' },
  { src: IMAGES.fluffyRun, tag: 'Exercise', h: 'tall' },
  { src: IMAGES.bunny, tag: 'Small pets', h: 'short' },
  { src: IMAGES.readingDog, tag: 'Story time', h: 'short' },
  { src: IMAGES.pug, tag: 'Pug life', h: 'tall' },
  { src: IMAGES.kitten, tag: 'Kitten corner', h: 'short' },
  { src: IMAGES.forestDog, tag: 'Trail walks', h: 'short' },
];

export const PET_PHOTO_PRESETS = [
  IMAGES.golden, IMAGES.beagle, IMAGES.corgi, IMAGES.pug, IMAGES.husky, IMAGES.jackRussell,
  IMAGES.catBlue, IMAGES.orangeCat, IMAGES.kitten, IMAGES.catGreen, IMAGES.bunny, IMAGES.frenchieShirt,
].map((u) => u.replace('w=1200', 'w=600'));
