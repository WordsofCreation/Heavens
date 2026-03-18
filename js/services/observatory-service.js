import { getAstronomyObjects } from './object-service.js';

const JOURNEYS = [
  {
    id: 'brightest-stars',
    title: 'Start with the brightest stars',
    eyebrow: 'Guided journey',
    description: 'Meet the stars that shape first impressions of the sky and compare how nearness, size, and intrinsic power all affect what your eyes notice.',
    theme: 'Brightness',
    accent: 'linear-gradient(135deg, rgba(240,210,138,0.9), rgba(135,171,255,0.45))',
    objectIds: ['sirius', 'vega', 'rigel', 'betelgeuse', 'canopus'],
    steps: [
      'Begin with Sirius to see how distance and luminosity combine into overwhelming brightness.',
      'Compare Vega and Rigel to separate hot color from true power.',
      'Finish with Betelgeuse to see why a cool-looking star can still dominate a winter constellation.'
    ]
  },
  {
    id: 'stars-by-color',
    title: 'Explore stars by color',
    eyebrow: 'Guided journey',
    description: 'Use color as an entry point into stellar physics, from hot blue-white stars to cooler orange giants and the subtle tones of a calibration star like Polaris.',
    theme: 'Color and temperature',
    accent: 'linear-gradient(135deg, rgba(135,171,255,0.88), rgba(255,141,122,0.52))',
    objectIds: ['rigel', 'sirius', 'vega', 'polaris', 'betelgeuse', 'aldebaran'],
    steps: [
      'Follow the blue-white stars first: Rigel, Sirius, and Vega.',
      'Pause at Polaris to notice the shift toward a gentler yellow-white tone.',
      'End with Betelgeuse and Aldebaran to connect orange-red light with cooler stellar surfaces.'
    ]
  },
  {
    id: 'follow-the-light',
    title: 'How light becomes knowledge',
    eyebrow: 'Science sequence',
    description: 'Trace how astronomers move from color and brightness to spectra, distance, chemistry, and the history written into starlight.',
    theme: 'Observing method',
    accent: 'linear-gradient(135deg, rgba(162,132,255,0.82), rgba(91,215,255,0.4))',
    objectIds: ['sirius', 'polaris', 'orion-nebula', 'andromeda-galaxy'],
    steps: [
      'Read color as a temperature clue in Sirius.',
      'Use Polaris to connect pulsation with distance measurement.',
      'Switch to Orion Nebula to see how glowing gas changes the meaning of color and spectra.',
      'End at Andromeda to scale the same ideas up to an entire galaxy.'
    ]
  },
  {
    id: 'winter-sky',
    title: 'Trace the winter sky',
    eyebrow: 'Seasonal route',
    description: 'Walk through Orion and its neighbors as a coherent sky region, linking landmark stars with one of the nearest stellar nurseries.',
    theme: 'Sky region',
    accent: 'linear-gradient(135deg, rgba(255,166,119,0.75), rgba(135,171,255,0.42))',
    objectIds: ['betelgeuse', 'bellatrix', 'rigel', 'orion-nebula', 'sirius', 'aldebaran'],
    steps: [
      'Build Orion from Betelgeuse, Bellatrix, and Rigel.',
      'Drop into the Orion Nebula to find star birth inside the same region.',
      'Extend outward to Sirius and Aldebaran to see how winter patterns organize the sky.'
    ]
  },
  {
    id: 'naked-eye-favorites',
    title: 'Find naked-eye favorites',
    eyebrow: 'Observing route',
    description: 'A welcoming route for observers using only their eyes, designed around bright stars and deep-sky landmarks that reward patient viewing.',
    theme: 'Naked-eye observing',
    accent: 'linear-gradient(135deg, rgba(240,210,138,0.85), rgba(119,164,255,0.35))',
    objectIds: ['sirius', 'betelgeuse', 'rigel', 'vega', 'polaris', 'pleiades', 'andromeda-galaxy'],
    steps: [
      'Start with easy landmark stars for orientation.',
      'Use Pleiades and Andromeda to practice looking for extended, softer light.',
      'Return to Polaris as a navigation anchor for the whole session.'
    ]
  }
];

const STORY_PANELS = [
  {
    id: 'eyes-seeing',
    title: 'What your eyes are seeing',
    body: 'Your eyes mostly register contrast, brightness, and a star\'s broad color. They do not deliver chemistry directly, but they do tell you where to ask the next scientific question.',
    kicker: 'Story panel'
  },
  {
    id: 'astronomers-measure',
    title: 'What astronomers measure',
    body: 'Astronomers turn faint light into spectra, timing curves, and images with calibrated brightness. Those measurements reveal temperature, motion, size, composition, and distance.',
    kicker: 'Story panel'
  },
  {
    id: 'light-knowledge',
    title: 'How light becomes knowledge',
    body: 'A photon carries clues about where it came from and what it crossed on the way to us. When enough photons are collected carefully, appearance becomes evidence.',
    kicker: 'Story panel'
  },
  {
    id: 'star-colors',
    title: 'Why stars have different colors',
    body: 'Color is closely tied to temperature. Hotter stellar surfaces emit proportionally more blue-white light, while cooler surfaces lean gold, orange, or red.',
    kicker: 'Story panel'
  },
  {
    id: 'stellar-deaths',
    title: 'Why some stars die in explosions',
    body: 'The most massive stars burn through fuel quickly and end with unstable cores. When gravity wins and the core collapses, the outer star can erupt as a supernova.',
    kicker: 'Story panel'
  },
  {
    id: 'distance-meaning',
    title: 'What distance means in astronomy',
    body: 'Distance changes more than a number on a fact card. It changes the age of the light you receive, the scale you are thinking about, and how carefully you must interpret brightness.',
    kicker: 'Story panel'
  }
];

const SKY_CONNECTIONS = [
  ['betelgeuse', 'bellatrix'],
  ['bellatrix', 'rigel'],
  ['betelgeuse', 'orion-nebula'],
  ['orion-nebula', 'rigel'],
  ['betelgeuse', 'aldebaran'],
  ['aldebaran', 'pleiades'],
  ['vega', 'deneb'],
  ['deneb', 'altair'],
  ['vega', 'altair'],
  ['polaris', 'vega'],
  ['andromeda-galaxy', 'pleiades'],
  ['sirius', 'rigel'],
  ['canopus', 'sirius'],
  ['arcturus', 'antares']
];

const CONSTELLATION_REGIONS = [
  {
    id: 'orion',
    name: 'Orion',
    title: 'Orion: a theatre of stellar life',
    note: 'Orion combines a red supergiant, blue supergiants, and a bright stellar nursery in one memorable region, which makes it ideal for teaching stellar evolution in context.',
    objectIds: ['betelgeuse', 'bellatrix', 'rigel', 'orion-nebula'],
    cultural: 'Many cultures recognized Orion-like hunter figures because of its bold geometry and bright stars.'
  },
  {
    id: 'lyra',
    name: 'Lyra',
    title: 'Lyra: precision and calibration',
    note: 'Lyra is compact but scientifically rich thanks to Vega, a star that helped define photometric standards used to compare brightness.',
    objectIds: ['vega'],
    cultural: 'Its compact harp-like outline helped it endure as a recognizable northern constellation.'
  },
  {
    id: 'ursa-minor',
    name: 'Ursa Minor',
    title: 'Ursa Minor: finding direction',
    note: 'Ursa Minor matters because Polaris sits near the north celestial pole, connecting sky patterns to orientation and Earth\'s rotation.',
    objectIds: ['polaris'],
    cultural: 'Navigation traditions across centuries relied on the pole star as a dependable directional guide.'
  },
  {
    id: 'andromeda',
    name: 'Andromeda',
    title: 'Andromeda: seeing beyond the Milky Way',
    note: 'This region introduces galaxy-scale thinking through the Andromeda Galaxy, a naked-eye reminder that the universe stretches far beyond our own star system.',
    objectIds: ['andromeda-galaxy'],
    cultural: 'The area links classical constellation mythology with one of the most profound deep-sky sights visible without equipment.'
  }
];

function buildSkyNodes(objects) {
  const layout = {
    sirius: { x: 22, y: 62, size: 5.8 },
    canopus: { x: 14, y: 82, size: 4.4 },
    betelgeuse: { x: 42, y: 38, size: 5.6 },
    bellatrix: { x: 48, y: 42, size: 4.1 },
    rigel: { x: 47, y: 58, size: 5.3 },
    orion-nebula: { x: 44, y: 50, size: 4.4 },
    aldebaran: { x: 60, y: 34, size: 4.5 },
    pleiades: { x: 67, y: 26, size: 4.2 },
    polaris: { x: 76, y: 14, size: 4.5 },
    vega: { x: 79, y: 33, size: 4.9 },
    deneb: { x: 88, y: 28, size: 4.7 },
    altair: { x: 85, y: 48, size: 4.6 },
    andromeda-galaxy: { x: 71, y: 18, size: 4.9 },
    arcturus: { x: 73, y: 62, size: 5 },
    capella: { x: 58, y: 18, size: 4.8 },
    antares: { x: 63, y: 70, size: 5.1 }
  };

  return objects
    .filter((object) => layout[object.id])
    .map((object) => ({
      ...object,
      regionId: CONSTELLATION_REGIONS.find((region) => region.objectIds.includes(object.id))?.id || null,
      ...layout[object.id]
    }));
}

export async function getObservatoryData() {
  const objects = await getAstronomyObjects();
  const skyNodes = buildSkyNodes(objects);

  const journeys = JOURNEYS.map((journey) => ({
    ...journey,
    objects: journey.objectIds.map((id) => skyNodes.find((object) => object.id === id)).filter(Boolean)
  }));

  const regions = CONSTELLATION_REGIONS.map((region) => ({
    ...region,
    objects: region.objectIds.map((id) => skyNodes.find((object) => object.id === id)).filter(Boolean)
  }));

  const tonightJourney = journeys[0];

  const skyConnections = SKY_CONNECTIONS.map(([fromId, toId]) => ({
    fromId,
    toId,
    from: skyNodes.find((object) => object.id === fromId),
    to: skyNodes.find((object) => object.id === toId)
  })).filter((connection) => connection.from && connection.to);

  return {
    skyNodes,
    skyConnections,
    journeys,
    regions,
    storyPanels: STORY_PANELS,
    tonightJourney
  };
}
