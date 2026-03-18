import { loadObjects } from '../data-loader.js';

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

function enrichObject(object) {
  const raDegrees = parseRaToDegrees(object.ra);
  const decDegrees = parseDecToDegrees(object.dec);
  return {
    ...object,
    raDegrees,
    decDegrees,
    coordinatesLabel: `${object.ra}, ${object.dec}`,
    searchText: [object.name, object.type, object.constellation, object.summary].join(' ').toLowerCase()
  };
}

export async function getAstronomyObjects() {
  if (!cachedObjects) {
    const objects = await loadObjects();
    cachedObjects = objects.map(enrichObject);
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
