import { loadScienceContent } from '../data-loader.js';

let cachedContent = null;

export async function getScienceContent() {
  if (!cachedContent) {
    cachedContent = await loadScienceContent();
  }
  return cachedContent;
}

export async function getScienceTopics() {
  const content = await getScienceContent();
  return content.topics || [];
}

export async function getLearningPaths() {
  const content = await getScienceContent();
  return content.learningPaths || [];
}

export async function getDiscoverModules() {
  const content = await getScienceContent();
  return content.discoverModules || [];
}

export async function getStartHereGuide() {
  const content = await getScienceContent();
  return content.startHere || null;
}
