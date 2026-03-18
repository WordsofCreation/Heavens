import { SKY_VIEWER_CONFIG } from '../config.js';

let scriptPromise;

function ensureStylesheet() {
  if (document.querySelector('[data-aladin-style]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = SKY_VIEWER_CONFIG.stylesheetUrl;
  link.dataset.aladinStyle = 'true';
  document.head.appendChild(link);
}

function loadAladinScript() {
  if (window.A?.aladin) return Promise.resolve(window.A);
  if (scriptPromise) return scriptPromise;

  ensureStylesheet();
  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SKY_VIEWER_CONFIG.scriptUrl;
    script.async = true;
    script.onload = () => resolve(window.A);
    script.onerror = () => reject(new Error('Failed to load Aladin Lite.'));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

export async function createSkyViewer(element, options = {}) {
  const A = await loadAladinScript();
  const viewer = A.aladin(element, {
    ...SKY_VIEWER_CONFIG.options,
    ...options
  });

  const overlay = A.graphicOverlay({ color: '#f0d28a', lineWidth: 2, name: 'Selected object' });
  viewer.addOverlay(overlay);

  return { A, viewer, overlay };
}

export function focusObject({ A, viewer, overlay }, object) {
  if (!object) return;
  viewer.gotoRaDec(object.raDegrees, object.decDegrees);
  viewer.setFoV(object.category.includes('Galax') ? 1.5 : object.category.includes('Nebula') ? 2.5 : 8);
  overlay.removeAll();
  overlay.add(A.marker(object.raDegrees, object.decDegrees, { popupTitle: object.name, popupDesc: object.summary }));
}

export function toggleViewerGrid({ viewer }, enabled) {
  viewer.showCooGrid(Boolean(enabled));
}
