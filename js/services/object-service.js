import { loadObjects } from '../data-loader.js';
import { getScienceContent, getScienceTopics } from './science-content-service.js';

let cachedObjects = null;

function parseRaToDegrees(ra) {
  const [h = 0, m = 0, s = 0] = String(ra).split(/[:\s]+/).map(Number);
  return (h + m / 60 + s / 3600) * 15;
}

function parseDecToDegrees(dec) {
  const parts = String(dec).trim().split(/[:\s]+/);
  const sign = String(parts[0]).startsWith('-') ? -1 : 1;
  const [d = 0, m = 0, s = 0] = parts.map((part) => Math.abs(Number(part)));
  return sign * (d + m / 60 + s / 3600);
}

function angularDistance(a, b) {
  const ra1 = (a.raDegrees * Math.PI) / 180;
  const dec1 = (a.decDegrees * Math.PI) / 180;
  const ra2 = (b.raDegrees * Math.PI) / 180;
  const dec2 = (b.decDegrees * Math.PI) / 180;

  const cosine = Math.sin(dec1) * Math.sin(dec2) + Math.cos(dec1) * Math.cos(dec2) * Math.cos(ra1 - ra2);
  return Math.acos(Math.min(1, Math.max(-1, cosine))) * (180 / Math.PI);
}

function deriveTopicIds(object) {
  const ids = new Set();
  const type = `${object.type} ${object.category}`.toLowerCase();
  ids.add('understanding-starlight');

  if (object.spectralClass && object.spectralClass !== 'Not applicable') ids.add('stellar-classification');
  if (type.includes('nebula') || type.includes('supergiant') || type.includes('giant')) ids.add('stellar-life-cycle');
  if (type.includes('cepheid') || type.includes('galaxy') || object.distanceLightYears > 100) ids.add('distances-in-space');
  if (['polaris', 'betelgeuse', 'rigel', 'pleiades'].includes(object.id)) ids.add('sky-navigation');
  if (['sun', 'polaris', 'barnards-star', 'sombrero-galaxy', 'andromeda-galaxy'].includes(object.id)) ids.add('how-astronomers-know');

  return [...ids];
}

function buildIntro(object) {
  return `${object.summary} In Heavens, ${object.name} is treated as both a visual destination and a science case study, linking what you can notice in the sky with what astronomers infer from light, distance, and structure.`;
}

function buildLightLearning(object) {
  const spectralText = object.spectralClass && object.spectralClass !== 'Not applicable'
    ? `${object.name}'s spectral class, ${object.spectralClass}, helps place it on the temperature and luminosity landscape that astronomers use to compare stars.`
    : `${object.name} is not primarily described by a stellar spectral class, so astronomers lean more heavily on emitted light from gas, dust, or large-scale structure to interpret what is happening.`;

  return `${object.lightStory} ${spectralText} Its reported color of ${object.color.toLowerCase()} and approximate temperature of ${object.temperatureK ? `${object.temperatureK.toLocaleString()} K` : 'an observationally inferred thermal profile'} work together as a readable clue to the physics behind the glow.`;
}

function buildUniverseFit(object) {
  const distanceNote = object.distanceLightYears < 1
    ? 'Because it is part of our immediate cosmic neighborhood, it helps calibrate bigger astronomical ideas against something comparatively close.'
    : object.distanceLightYears < 1000
      ? 'At this distance it still belongs to the nearby Milky Way environment, making it a bridge between naked-eye observing and stellar astrophysics.'
      : 'Its great distance widens the perspective from individual stars to the architecture of star-forming regions or galaxies.';

  return `${object.name} sits in ${object.constellation}, giving observers a practical way to locate it on the sky. ${distanceNote} Its classification as a ${object.type.toLowerCase()} shows where it belongs in the broader story of stellar evolution and cosmic structure.`;
}

function buildAstronomerCare(object) {
  return `${object.importance} Astronomers care about ${object.name} because it can be compared with other objects in the catalog to test ideas about brightness, scale, composition, and change over time. Even a familiar showpiece becomes more valuable when it serves as evidence inside a larger scientific pattern.`;
}

function buildFurtherReading(object, topicIds) {
  return [
    {
      title: `Read the science behind ${object.name}`,
      description: `A guided explanation of how light, spectra, and brightness help astronomers interpret ${object.name} without losing the wonder of seeing it in the sky.`,
      href: '../learn.html#path-understanding-starlight',
      label: 'Open the starlight pathway',
      kind: 'Further reading'
    },
    {
      title: `Place ${object.name} in a bigger cosmic story`,
      description: `Use Heavens' learning pathways to connect this object with classification, distance, lifecycle, and observing skills.`,
      href: topicIds.includes('stellar-life-cycle') ? '../learn.html#path-stellar-life-cycle' : '../learn.html#path-how-astronomers-know',
      label: 'Continue learning',
      kind: 'Related topic'
    }
  ];
}

function buildResearchInspiration(object, topicIds) {
  const cards = [
    {
      title: `Ask a research-style question about ${object.name}`,
      description: `What measurements would most improve our understanding of ${object.name}: better spectra, distance estimates, long-term brightness monitoring, or wider environmental imaging?`,
      href: '../discover.html#research-spotlight',
      label: 'Visit Discover',
      kind: 'Research inspiration'
    }
  ];

  if (topicIds.includes('distances-in-space')) {
    cards.push({
      title: 'Follow the distance ladder connection',
      description: `Use ${object.name} to think about how astronomers connect local calibration objects to much larger cosmic scales.`,
      href: '../learn.html#path-distances-in-space',
      label: 'Study distances in space',
      kind: 'Research inspiration'
    });
  }

  return cards;
}

function buildObserveNext(object, objects) {
  return findRelatedObjects(object, objects, 3).map((candidate) => ({
    id: candidate.id,
    title: candidate.name,
    description: `${candidate.type} in ${candidate.constellation}. Compare its distance, color, and role in the sky with ${object.name}.`,
    href: `./${candidate.id}.html`,
    label: 'Open object page'
  }));
}

function enrichObject(object, topics) {
  const raDegrees = parseRaToDegrees(object.ra);
  const decDegrees = parseDecToDegrees(object.dec);
  const topicIds = deriveTopicIds(object);
  const relatedTopics = topics.filter((topic) => topicIds.includes(topic.id));

  return {
    ...object,
    raDegrees,
    decDegrees,
    coordinatesLabel: `${object.ra}, ${object.dec}`,
    searchText: [object.name, object.type, object.constellation, object.summary, ...relatedTopics.map((topic) => topic.title)].join(' ').toLowerCase(),
    scienceTopicIds: topicIds,
    introDescription: buildIntro(object),
    whatWeLearnFromItsLight: buildLightLearning(object),
    howItFitsInTheUniverse: buildUniverseFit(object),
    whyAstronomersCare: buildAstronomerCare(object),
    relatedTopicCards: relatedTopics,
    keyFacts: [
      { label: 'Object type', value: object.type },
      { label: 'Constellation', value: object.constellation },
      { label: 'Approximate distance', value: object.distance },
      { label: 'Spectral class', value: object.spectralClass || 'Not applicable' },
      { label: 'Color and temperature', value: `${object.color}${object.temperatureK ? ` · ${object.temperatureK.toLocaleString()} K` : ''}` }
    ]
  };
}

export async function getAstronomyObjects() {
  if (!cachedObjects) {
    const [objects, topics] = await Promise.all([loadObjects(), getScienceTopics()]);
    cachedObjects = objects.map((object) => enrichObject(object, topics));
    cachedObjects = cachedObjects.map((object) => ({
      ...object,
      relatedObjectIds: findRelatedObjects(object, cachedObjects, 3).map((item) => item.id),
      furtherReading: buildFurtherReading(object, object.scienceTopicIds),
      researchInspiration: buildResearchInspiration(object, object.scienceTopicIds),
      observeNext: buildObserveNext(object, cachedObjects)
    }));
  }
  return cachedObjects;
}

export async function getObjectById(id) {
  const objects = await getAstronomyObjects();
  return objects.find((object) => object.id === id) || null;
}

export async function getFeaturedRegions() {
  const objects = await getAstronomyObjects();
  return [
    {
      id: 'orion-corridor',
      title: "Featured Region of the Sky: Orion's corridor",
      description: 'Jump between Orion\'s brilliant stars and the Orion Nebula to compare star birth with stellar evolution in one part of the sky.',
      objects: objects.filter((object) => ['betelgeuse', 'rigel', 'bellatrix', 'orion-nebula'].includes(object.id))
    },
    {
      id: 'summer-triangle',
      title: 'Featured Region of the Sky: Summer Triangle',
      description: 'Learn how distance, temperature, and luminosity change across three bright stars that share the same seasonal landmark.',
      objects: objects.filter((object) => ['vega', 'deneb', 'altair'].includes(object.id))
    }
  ];
}

export function findRelatedObjects(object, objects, limit = 3) {
  if (!object) return [];
  return objects
    .filter((candidate) => candidate.id !== object.id)
    .map((candidate) => ({ candidate, distance: angularDistance(object, candidate) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit)
    .map(({ candidate, distance }) => ({ ...candidate, angularDistance: `${distance.toFixed(1)}° away` }));
}

export async function getObjectPageData(id) {
  const [object, objects, scienceContent] = await Promise.all([getObjectById(id), getAstronomyObjects(), getScienceContent()]);
  if (!object) return null;

  const relatedObjects = object.relatedObjectIds
    .map((relatedId) => objects.find((item) => item.id === relatedId))
    .filter(Boolean);

  const relatedTopics = (scienceContent.topics || []).filter((topic) => object.scienceTopicIds.includes(topic.id));

  return {
    object,
    relatedObjects,
    relatedTopics,
    furtherReading: object.furtherReading,
    researchInspiration: object.researchInspiration,
    observeNext: object.observeNext,
    featuredQuestion: (scienceContent.discoverModules || []).find((module) => module.id === 'cosmic-question') || null
  };
}
