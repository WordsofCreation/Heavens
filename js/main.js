import { filterObjects, getCategories, sortObjects } from './search.js';
import { setupNavigation, setupRevealAnimations, buildConstellationViewer, trapDialogFocus } from './ui.js';
import {
  renderCatalog,
  renderComparison,
  renderContextualInsight,
  renderDetail,
  renderFeaturedObject,
  renderScienceInsights,
  renderSkyViewerPanel,
  renderFeaturedRegions,
  renderObjectPage,
  renderDiscoverPage,
  renderLearnPage
} from './star-renderer.js';
import { getAstronomyObjects, getObjectById, getFeaturedRegions, findRelatedObjects, getObjectPageData } from './services/object-service.js';
import { getFutureIntegrationStatus, getProgressiveObjectSummary } from './services/external-data-service.js';
import { createSkyViewer, focusObject, toggleViewerGrid } from './services/sky-viewer-service.js';
import { getDiscoverModules, getLearningPaths, getScienceTopics, getStartHereGuide } from './services/science-content-service.js';
import { toAbsolutePath } from './path-utils.js';

setupNavigation();
setupRevealAnimations();
buildConstellationViewer();

const page = document.body.dataset.page;

async function initExplore(objects) {
  const searchInput = document.getElementById('search-input');
  const filterGroup = document.getElementById('filter-group');
  const sortSelect = document.getElementById('sort-select');
  const catalogGrid = document.getElementById('catalog-grid');
  const resultsCount = document.getElementById('results-count');
  const comparePanel = document.getElementById('compare-panel');
  const contextPanel = document.getElementById('context-panel');
  const dialog = document.getElementById('detail-dialog');
  const detailContent = document.getElementById('detail-content');
  const dialogClose = document.getElementById('dialog-close');

  const params = new URLSearchParams(window.location.search);
  let activeCategory = params.get('category') || 'all';
  let activeQuery = params.get('q') || '';
  let activeSort = params.get('sort') || 'name';
  let activeObjectId = params.get('object') || '';
  const compareIds = new Set();

  searchInput.value = activeQuery;
  sortSelect.value = activeSort;

  const syncUrl = () => {
    const next = new URLSearchParams();
    if (activeCategory !== 'all') next.set('category', activeCategory);
    if (activeQuery) next.set('q', activeQuery);
    if (activeSort !== 'name') next.set('sort', activeSort);
    if (activeObjectId) next.set('object', activeObjectId);
    const query = next.toString();
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ''}`;
    window.history.replaceState({}, '', nextUrl);
  };

  const openSkyViewer = (id) => {
    window.location.href = toAbsolutePath(`pages/sky-viewer.html?object=${id}`);
  };

  const openObject = async (object) => {
    const progressiveSummary = await getProgressiveObjectSummary(object);
    renderDetail({ ...object }, detailContent, progressiveSummary);
    activeObjectId = object.id;
    if (!dialog.open) dialog.showModal();
    syncUrl();
  };

  const applyFilters = () => {
    const filtered = sortObjects(filterObjects(objects, activeQuery, activeCategory), activeSort);
    renderCatalog(
      filtered,
      {
        grid: catalogGrid,
        count: resultsCount,
        onSelect: openObject,
        onViewSky: openSkyViewer,
        onToggleCompare: (id) => {
          if (compareIds.has(id)) {
            compareIds.delete(id);
          } else if (compareIds.size < 3) {
            compareIds.add(id);
          }
          applyFilters();
        }
      },
      compareIds
    );
    renderComparison(objects.filter((object) => compareIds.has(object.id)), comparePanel);
    renderContextualInsight(filtered.length ? filtered : objects, contextPanel, activeCategory);
    syncUrl();
  };

  getCategories(objects).forEach((category) => {
    const button = document.createElement('button');
    button.className = `filter-chip${category === activeCategory ? ' is-selected' : ''}`;
    button.type = 'button';
    button.textContent = category;
    button.addEventListener('click', () => {
      activeCategory = category;
      filterGroup.querySelectorAll('.filter-chip').forEach((chip) => chip.classList.remove('is-selected'));
      button.classList.add('is-selected');
      applyFilters();
    });
    filterGroup.appendChild(button);
  });

  searchInput.addEventListener('input', (event) => {
    activeQuery = event.target.value;
    applyFilters();
  });

  sortSelect.addEventListener('change', (event) => {
    activeSort = event.target.value;
    applyFilters();
  });

  dialogClose.addEventListener('click', () => {
    activeObjectId = '';
    dialog.close();
    syncUrl();
  });
  dialog.addEventListener('close', () => {
    activeObjectId = '';
    syncUrl();
  });
  dialog.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    const inDialog = rect.top <= event.clientY && event.clientY <= rect.top + rect.height && rect.left <= event.clientX && event.clientX <= rect.left + rect.width;
    if (!inDialog) dialog.close();
  });
  trapDialogFocus(dialog, dialogClose);

  applyFilters();

  const objectFromUrl = params.get('object');
  if (objectFromUrl) {
    const match = objects.find((object) => object.id === objectFromUrl);
    if (match) openObject(match);
  }
}

async function initSkyViewer(objects) {
  const searchInput = document.getElementById('sky-object-search');
  const resultList = document.getElementById('sky-search-results');
  const panel = document.getElementById('sky-object-panel');
  const viewerStatus = document.getElementById('sky-viewer-status');
  const viewerFrame = document.getElementById('aladin-lite-viewer');
  const emptyState = document.getElementById('sky-empty-state');
  const guidance = document.getElementById('sky-guidance');
  const scienceRail = document.getElementById('science-insights-rail');
  const featuredRegions = document.getElementById('featured-regions');
  const gridToggle = document.getElementById('sky-grid-toggle');

  renderScienceInsights([
    { title: 'Why blue stars are hotter', body: 'A star\'s color tracks the mix of wavelengths it emits most strongly, so hotter stars skew blue-white.' },
    { title: 'How spectra reveal chemistry', body: 'Each atom leaves a pattern in light. That lets astronomers read chemistry from very far away.' },
    { title: 'Why apparent brightness is not true luminosity', body: 'Distance can hide power. A remote supergiant may look fainter than a modest nearby star.' }
  ], scienceRail);
  renderFeaturedRegions(await getFeaturedRegions(), featuredRegions);

  let api = null;
  const integrationStatus = getFutureIntegrationStatus();

  const selectObject = async (object) => {
    emptyState.hidden = true;
    guidance.hidden = true;
    viewerStatus.textContent = `Centering on ${object.name}…`;

    const progressiveSummary = await getProgressiveObjectSummary(object);
    renderSkyViewerPanel({
      object,
      relatedObjects: findRelatedObjects(object, objects),
      integrationStatus,
      progressiveSummary
    }, panel);

    if (api) {
      focusObject(api, object);
      viewerStatus.textContent = `${object.name} centered in the sky viewer.`;
    } else {
      viewerStatus.textContent = 'Sky map unavailable; object science panel still loaded.';
    }

    const next = new URLSearchParams(window.location.search);
    next.set('object', object.id);
    window.history.replaceState({}, '', `${window.location.pathname}?${next.toString()}`);
  };

  resultList.innerHTML = objects.map((object) => `<button type="button" class="sky-search-result" data-object-id="${object.id}">${object.name}<span>${object.type}</span></button>`).join('');
  resultList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-object-id]');
    if (!button) return;
    const object = objects.find((item) => item.id === button.dataset.objectId);
    if (object) selectObject(object);
  });

  searchInput.addEventListener('input', (event) => {
    const value = event.target.value.trim().toLowerCase();
    resultList.querySelectorAll('.sky-search-result').forEach((button) => {
      const object = objects.find((item) => item.id === button.dataset.objectId);
      const matches = !value || object.searchText.includes(value);
      button.hidden = !matches;
    });
  });

  try {
    api = await createSkyViewer(viewerFrame);
    viewerStatus.textContent = 'Interactive sky viewer ready.';
    gridToggle?.addEventListener('change', () => toggleViewerGrid(api, gridToggle.checked));
  } catch (error) {
    console.warn(error);
    viewerFrame.classList.add('is-fallback');
    viewerFrame.innerHTML = `<div class="sky-fallback"><h2>Sky Viewer unavailable</h2><p>The interactive sky map could not load right now. Search still works with local coordinates and science summaries.</p></div>`;
    viewerStatus.textContent = 'Interactive sky viewer unavailable.';
  }

  const objectFromUrl = new URLSearchParams(window.location.search).get('object');
  if (objectFromUrl) {
    const match = await getObjectById(objectFromUrl);
    if (match) {
      searchInput.value = match.name;
      selectObject(match);
    }
  }
}

async function initObjectPage() {
  const target = document.getElementById('object-page-content');
  const objectId = document.body.dataset.objectId;
  if (!target || !objectId) return;

  const pageData = await getObjectPageData(objectId);
  if (!pageData) {
    target.innerHTML = '<section class="section"><div class="container"><p>Unable to load this object right now.</p></div></section>';
    return;
  }

  renderObjectPage(pageData, target);
}

async function initDiscoverPage(objects) {
  const target = document.getElementById('discover-page-content');
  if (!target) return;

  const [modules, topics] = await Promise.all([getDiscoverModules(), getScienceTopics()]);
  renderDiscoverPage({ modules, topics, objects }, target);
}

async function initLearnPage(objects) {
  const target = document.getElementById('learn-page-content');
  if (!target) return;

  const [paths, topics, startHere] = await Promise.all([getLearningPaths(), getScienceTopics(), getStartHereGuide()]);
  renderLearnPage({ paths, topics, startHere, objects }, target);
}

async function init() {
  const objects = await getAstronomyObjects();
  renderFeaturedObject(objects);

  if (page === 'explore') await initExplore(objects);
  if (page === 'sky-viewer') await initSkyViewer(objects);
  if (page === 'object-detail') await initObjectPage();
  if (page === 'discover') await initDiscoverPage(objects);
  if (page === 'learn') await initLearnPage(objects);
}

init().catch((error) => {
  console.error(error);
  const container = document.querySelector('[data-featured-object]') || document.getElementById('catalog-grid') || document.getElementById('sky-object-panel') || document.getElementById('object-page-content');
  if (container) {
    container.innerHTML = '<p>Unable to load astronomy data right now.</p>';
  }
});
