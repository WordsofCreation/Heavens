import { getBasePrefix } from './path-utils.js';

async function loadJson(path) {
  const response = await fetch(`${getBasePrefix()}/${path}`);
  if (!response.ok) {
    throw new Error(`Unable to load ${path}.`);
  }
  return response.json();
}

export async function loadObjects() {
  return loadJson('data/objects.json');
}

export async function loadScienceContent() {
  return loadJson('data/science-content.json');
}
