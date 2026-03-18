import { INTEGRATION_CONFIG } from '../config.js';

export async function getProgressiveObjectSummary(object) {
  if (!INTEGRATION_CONFIG.wikipediaSummary.enabled || !object?.name) {
    return null;
  }

  try {
    const response = await fetch(`${INTEGRATION_CONFIG.wikipediaSummary.endpoint}${encodeURIComponent(object.name)}`);
    if (!response.ok) return null;
    const payload = await response.json();
    return payload.extract ? {
      sourceLabel: 'Wikipedia summary',
      sourceUrl: payload.content_urls?.desktop?.page || null,
      extract: payload.extract
    } : null;
  } catch {
    return null;
  }
}

export function getFutureIntegrationStatus() {
  return Object.entries(INTEGRATION_CONFIG.futureApis).map(([key, service]) => ({
    id: key,
    ...service,
    status: service.enabled ? 'ready for adapter wiring' : 'planned'
  }));
}
