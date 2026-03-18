import { toAbsolutePath } from '../path-utils.js';

const JOURNEY_COLLECTION = [
  {
    id: 'understanding-starlight',
    title: 'Understanding Starlight',
    kind: 'learning',
    theme: 'Light and evidence',
    pageHref: 'pages/learn.html#path-understanding-starlight',
    description: 'Follow how color, brightness, and spectra become scientific evidence.',
    steps: ['Start', 'Explore', 'Understand', 'Compare', 'Observe', 'Continue'],
    topicIds: ['understanding-starlight', 'stellar-classification', 'how-astronomers-know'],
    objectIds: ['sun', 'sirius', 'rigel', 'vega', 'polaris'],
    recommendedTopicIds: ['stellar-classification', 'how-astronomers-know'],
    recommendedObjectIds: ['sun', 'sirius', 'rigel']
  },
  {
    id: 'stellar-evolution',
    title: 'Stellar Evolution',
    kind: 'learning',
    theme: 'Lifecycle and change',
    pageHref: 'pages/learn.html#path-stellar-life-cycle',
    description: 'Move from star birth to giant phases and explosive endings.',
    steps: ['Start', 'Explore', 'Understand', 'Compare', 'Observe', 'Continue'],
    topicIds: ['stellar-life-cycle', 'distances-in-space'],
    objectIds: ['orion-nebula', 'eagle-nebula', 'sun', 'betelgeuse', 'antares'],
    recommendedTopicIds: ['stellar-life-cycle', 'distances-in-space'],
    recommendedObjectIds: ['orion-nebula', 'betelgeuse', 'antares']
  },
  {
    id: 'brightest-stars',
    title: 'Brightest Stars Journey',
    kind: 'discovery',
    theme: 'Landmarks and brightness',
    pageHref: 'pages/discover.html#featured-star',
    description: 'Use the sky’s headline stars to connect naked-eye wonder with distance and luminosity.',
    steps: ['Start', 'Explore', 'Compare', 'Understand', 'Observe', 'Continue'],
    topicIds: ['understanding-starlight', 'distances-in-space', 'sky-navigation'],
    objectIds: ['sirius', 'canopus', 'vega', 'rigel', 'betelgeuse'],
    recommendedTopicIds: ['distances-in-space', 'sky-navigation'],
    recommendedObjectIds: ['sirius', 'vega', 'betelgeuse']
  },
  {
    id: 'stars-by-color',
    title: 'Stars by Color Journey',
    kind: 'discovery',
    theme: 'Color and temperature',
    pageHref: 'pages/discover.html#spectral-spotlight',
    description: 'Read color as a clue, then connect it to temperature and stellar class.',
    steps: ['Start', 'Explore', 'Understand', 'Compare', 'Observe', 'Continue'],
    topicIds: ['stellar-classification', 'understanding-starlight'],
    objectIds: ['rigel', 'sirius', 'vega', 'polaris', 'aldebaran', 'betelgeuse'],
    recommendedTopicIds: ['stellar-classification', 'understanding-starlight'],
    recommendedObjectIds: ['rigel', 'aldebaran', 'betelgeuse']
  },
  {
    id: 'winter-sky',
    title: 'Winter Sky Journey',
    kind: 'discovery',
    theme: 'Seasonal orientation',
    pageHref: 'pages/discover.html#deep-sky-feature',
    description: 'Trace Orion and its neighbors as a coherent observing story.',
    steps: ['Start', 'Explore', 'Observe', 'Understand', 'Compare', 'Continue'],
    topicIds: ['sky-navigation', 'stellar-life-cycle'],
    objectIds: ['betelgeuse', 'bellatrix', 'rigel', 'orion-nebula', 'sirius', 'aldebaran'],
    recommendedTopicIds: ['sky-navigation', 'stellar-life-cycle'],
    recommendedObjectIds: ['betelgeuse', 'rigel', 'orion-nebula']
  }
];

const TOPIC_JOURNEY_MAP = {
  'understanding-starlight': ['understanding-starlight', 'stars-by-color'],
  'stellar-classification': ['understanding-starlight', 'stars-by-color'],
  'stellar-life-cycle': ['stellar-evolution', 'winter-sky'],
  'distances-in-space': ['brightest-stars', 'stellar-evolution'],
  'sky-navigation': ['winter-sky', 'brightest-stars'],
  'how-astronomers-know': ['understanding-starlight']
};

export function getJourneys() {
  return JOURNEY_COLLECTION.map((journey) => ({ ...journey }));
}

export function getJourneyById(id) {
  return JOURNEY_COLLECTION.find((journey) => journey.id === id) || null;
}

export function getJourneysForObject(objectId) {
  return getJourneys().filter((journey) => journey.objectIds.includes(objectId));
}

export function getJourneysForTopic(topicId) {
  const ids = TOPIC_JOURNEY_MAP[topicId] || [];
  return ids.map(getJourneyById).filter(Boolean);
}

export function getStepState(journeyId, currentLabel) {
  const journey = getJourneyById(journeyId);
  if (!journey) return null;
  const currentIndex = Math.max(0, journey.steps.findIndex((step) => step.toLowerCase() === String(currentLabel || '').toLowerCase()));
  return {
    ...journey,
    currentStep: journey.steps[currentIndex] || journey.steps[0],
    currentIndex,
    nextStep: journey.steps[currentIndex + 1] || null,
    previousSteps: journey.steps.slice(0, currentIndex),
    stepItems: journey.steps.map((label, index) => ({
      label,
      status: index < currentIndex ? 'complete' : index === currentIndex ? 'current' : index === currentIndex + 1 ? 'next' : 'upcoming'
    }))
  };
}

export function getLinkedTopicIdsForObject(object) {
  const ids = new Set(object?.scienceTopicIds || []);
  getJourneysForObject(object?.id).forEach((journey) => journey.topicIds.forEach((topicId) => ids.add(topicId)));
  return [...ids];
}

export function getLinkedObjectIdsForTopic(topicId) {
  const ids = new Set();
  getJourneysForTopic(topicId).forEach((journey) => journey.objectIds.forEach((objectId) => ids.add(objectId)));
  return [...ids];
}

export function getJourneyContextLabel(journey) {
  return journey.kind === 'learning' ? 'Part of' : 'Appears in';
}

export function getJourneyHref(journey) {
  return toAbsolutePath(journey.pageHref);
}
