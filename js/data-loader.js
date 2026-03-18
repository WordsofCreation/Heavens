import { getBasePrefix } from './path-utils.js';

async function loadJson(path) {
  try {
    const response = await fetch(`${getBasePrefix()}/${path}`);
    if (!response.ok) {
      throw new Error(`Unable to load ${path}.`);
    }
    return response.json();
  } catch (error) {
    if (path === 'data/objects.json') {
      const module = await import('../data/objects.js');
      return module.default;
    }
    if (path === 'data/science-content.json') {
      const module = await import('../data/science-content.js');
      return module.default;
    }
    throw error;
  }
}

export async function loadObjects() {
  return loadJson('data/objects.json');
}

export async function loadScienceContent() {
  return loadJson('data/science-content.json');
}
