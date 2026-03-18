import { toAbsolutePath } from '../path-utils.js';

const STORAGE_KEY = 'heavens:journey-state';
const MAX_RECENT_OBJECTS = 8;
const MAX_RECENT_COMPARISONS = 4;

const memoryState = {
  recentObjects: [],
  comparisonSelections: [],
  comparisonDraft: null,
  recentComparisons: [],
  activeJourney: null,
  learningPath: null,
  lastMode: null,
  lastObject: null,
  skyRegion: null,
  updatedAt: null,
  lastSource: null
};

function safeStorage() {
  try {
    const probe = '__heavens_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch (error) {
    return null;
  }
}

function cloneState(state) {
  return JSON.parse(JSON.stringify(state));
}

function normalizeObjectContext(object, extras = {}) {
  if (!object?.id) return null;
  return {
    id: object.id,
    name: object.name,
    altNames: object.altNames || object.alternateNames || [],
    category: object.category,
    type: object.type,
    constellation: object.constellation,
    spectralClass: object.spectralClass || 'Not applicable',
    color: object.color,
    temperatureK: object.temperatureK || null,
    distance: object.distance,
    distanceLightYears: object.distanceLightYears || null,
    coordinates: object.coordinatesLabel ? { label: object.coordinatesLabel, ra: object.ra, dec: object.dec } : { ra: object.ra, dec: object.dec },
    relatedObjectIds: object.relatedObjectIds || [],
    scienceTopicIds: object.scienceTopicIds || [],
    learningLinks: object.relatedTopicCards || [],
    routeHints: {
      objectPage: toAbsolutePath(`pages/objects/${object.id}.html`),
      explore: toAbsolutePath(`pages/explore.html?object=${object.id}`),
      observatory: toAbsolutePath(`pages/observatory.html?object=${object.id}`),
      skyViewer: toAbsolutePath(`pages/sky-viewer.html?object=${object.id}`)
    },
    ...extras
  };
}

export function loadJourneyState() {
  const storage = safeStorage();
  if (!storage) return cloneState(memoryState);
  try {
    const value = storage.getItem(STORAGE_KEY);
    if (!value) return cloneState(memoryState);
    return { ...cloneState(memoryState), ...JSON.parse(value) };
  } catch (error) {
    return cloneState(memoryState);
  }
}

export function saveJourneyState(partialState) {
  const next = {
    ...loadJourneyState(),
    ...partialState,
    updatedAt: new Date().toISOString()
  };

  const storage = safeStorage();
  if (!storage) {
    Object.assign(memoryState, next);
    return next;
  }

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch (error) {
    Object.assign(memoryState, next);
  }
  return next;
}

export function clearJourneyState() {
  const storage = safeStorage();
  if (storage) storage.removeItem(STORAGE_KEY);
  Object.assign(memoryState, cloneState({
    recentObjects: [],
    comparisonSelections: [],
    comparisonDraft: null,
    recentComparisons: [],
    activeJourney: null,
    learningPath: null,
    lastMode: null,
    lastObject: null,
    skyRegion: null,
    updatedAt: null,
    lastSource: null
  }));
}

export function rememberObject(object, options = {}) {
  const context = normalizeObjectContext(object, options.contextExtras);
  if (!context) return loadJourneyState();

  const current = loadJourneyState();
  const recentObjects = [context, ...(current.recentObjects || []).filter((item) => item.id !== context.id)].slice(0, MAX_RECENT_OBJECTS);
  return saveJourneyState({
    recentObjects,
    lastObject: context,
    lastMode: options.mode || current.lastMode || null,
    lastSource: options.source || current.lastSource || null,
    skyRegion: options.skyRegion || current.skyRegion || null
  });
}

export function rememberComparison(objects = [], options = {}) {
  const comparisonSelections = objects.map((object) => normalizeObjectContext(object)).filter(Boolean);
  const comparisonDraft = comparisonSelections.length ? {
    ids: comparisonSelections.map((item) => item.id),
    source: options.source || null,
    restoredAt: options.restoredAt || null,
    updatedAt: new Date().toISOString()
  } : null;

  const recentComparisons = comparisonSelections.length >= 2
    ? [{ ids: comparisonSelections.map((item) => item.id), label: comparisonSelections.map((item) => item.name).join(' · '), updatedAt: new Date().toISOString() }, ...(loadJourneyState().recentComparisons || []).filter((entry) => entry.ids.join('|') !== comparisonSelections.map((item) => item.id).join('|'))].slice(0, MAX_RECENT_COMPARISONS)
    : loadJourneyState().recentComparisons || [];

  return saveJourneyState({ comparisonSelections, comparisonDraft, recentComparisons });
}

export function clearComparison() {
  return saveJourneyState({ comparisonSelections: [], comparisonDraft: null });
}

export function queueComparisonObject(object, options = {}) {
  const state = loadJourneyState();
  const next = [...(state.comparisonSelections || []).filter((item) => item.id !== object?.id)];
  const normalized = normalizeObjectContext(object);
  if (normalized) next.push(normalized);
  return rememberComparison(next.slice(0, 3), { source: options.source || state.lastSource || null });
}

export function getComparisonRestoreUrl(ids = [], options = {}) {
  const params = new URLSearchParams();
  if (ids.length) params.set('compare', ids.join(','));
  if (options.restored) params.set('restored', '1');
  if (options.from) params.set('from', options.from);
  return `${toAbsolutePath('pages/explore.html')}?${params.toString()}`;
}

export function setActiveJourney(journey, extras = {}) {
  if (!journey) return saveJourneyState({ activeJourney: null });
  return saveJourneyState({
    activeJourney: {
      id: journey.id,
      title: journey.title,
      eyebrow: journey.eyebrow,
      description: journey.description,
      theme: journey.theme,
      accent: journey.accent,
      objectIds: journey.objectIds || [],
      currentObjectId: extras.currentObjectId || null,
      originMode: extras.originMode || null,
      stepCount: Array.isArray(journey.steps) ? journey.steps.length : 0
    }
  });
}

export function setLearningPath(path) {
  if (!path) return saveJourneyState({ learningPath: null });
  return saveJourneyState({
    learningPath: {
      id: path.id,
      title: path.title,
      eyebrow: path.eyebrow,
      summary: path.summary
    }
  });
}

export function buildCrossLinks(object, options = {}) {
  const params = new URLSearchParams();
  if (object?.id) params.set('object', object.id);
  if (options.journeyId) params.set('journey', options.journeyId);
  if (options.from) params.set('from', options.from);
  if (options.regionId) params.set('region', options.regionId);
  if (options.learningPathId) params.set('path', options.learningPathId);
  if (options.compareTo) params.set('compare', options.compareTo);
  const query = params.toString();

  return {
    observatory: toAbsolutePath(`pages/observatory.html${query ? `?${query}` : ''}`),
    skyViewer: toAbsolutePath(`pages/sky-viewer.html${query ? `?${query}` : ''}`),
    explore: toAbsolutePath(`pages/explore.html${query ? `?${query}` : ''}`),
    objectPage: object?.id ? toAbsolutePath(`pages/objects/${object.id}.html${query ? `?${query}` : ''}`) : null
  };
}

export function getJourneyResume() {
  const state = loadJourneyState();
  if (!state.lastObject && !state.activeJourney && !state.learningPath) return null;
  return state;
}

export function getStorageAvailability() {
  return Boolean(safeStorage());
}

export { normalizeObjectContext };

export function deriveComparisonStateFromUrl(objects = []) {
  const params = new URLSearchParams(window.location.search);
  const compareIds = (params.get('compare') || '').split(',').map((item) => item.trim()).filter(Boolean);
  const restored = params.get('restored') === '1';
  const validObjects = compareIds.map((id) => objects.find((object) => object.id === id)).filter(Boolean).slice(0, 3);
  if (!compareIds.length) return { validObjects: [], missingIds: [], restored };
  return {
    validObjects,
    missingIds: compareIds.filter((id) => !validObjects.find((object) => object.id === id)),
    restored
  };
}
