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
  renderLearnPage,
  renderObservatoryPage,
  renderHomepageExperience,
  renderRecentObjectsPanel,
  renderRecentComparisonsPanel,
  renderTopicComparisonInsights,
  renderTopicJourneyPanel
} from './star-renderer.js';
import { getAstronomyObjects, getObjectById, getFeaturedRegions, findRelatedObjects, getObjectPageData } from './services/object-service.js';
import { getFutureIntegrationStatus, getProgressiveObjectSummary } from './services/external-data-service.js';
import { createSkyViewer, focusObject, toggleViewerGrid } from './services/sky-viewer-service.js';
import { getDiscoverModules, getLearningPaths, getScienceTopics, getStartHereGuide } from './services/science-content-service.js';
import { getObservatoryData } from './services/observatory-service.js';
import { getJourneyById, getJourneysForObject, getLinkedTopicIdsForObject, getStepState } from './services/journey-map-service.js';
import {
  buildCrossLinks,
  deriveComparisonStateFromUrl,
  getComparisonRestoreUrl,
  getJourneyResume,
  getStorageAvailability,
  loadJourneyState,
  rememberComparison,
  rememberObject,
  setActiveJourney,
  setLearningPath
} from './services/journey-state-service.js';
import { toAbsolutePath } from './path-utils.js';

setupNavigation();
setupRevealAnimations();
buildConstellationViewer();

const page = document.body.dataset.page;

function navigateTo(link) {
  window.location.href = link;
}


function buildRecentPanel(options = {}) {
  const state = loadJourneyState();
  const currentJourneyId = options.currentJourneyId || state.activeJourney?.id || state.learningPath?.id || null;
  const currentJourney = currentJourneyId ? getJourneyById(currentJourneyId) : null;
  const resumeHref = currentJourney
    ? toAbsolutePath(currentJourney.kind === 'learning' ? `pages/learn.html#path-${currentJourney.id}` : `pages/observatory.html?journey=${currentJourney.id}${state.lastObject?.id ? `&object=${state.lastObject.id}` : ''}`)
    : null;
  const items = (state.recentObjects || []).slice(0, options.limit || 4).map((item) => ({
    ...item,
    isJourneyMatch: currentJourneyId ? getJourneysForObject(item.id).some((journey) => journey.id === currentJourneyId) : false,
    resumeHref,
    resumeLabel: currentJourney ? (currentJourney.kind === 'learning' ? 'Continue learning' : 'Resume journey') : null
  }));
  return renderRecentObjectsPanel({
    items,
    title: options.title,
    context: options.context,
    currentJourneyId,
    currentComparisonIds: (state.comparisonSelections || []).map((item) => item.id),
    emptyMessage: options.emptyMessage
  });
}

function buildContinueModule(label, href, description) {
  return `
    <article class="mini-panel continue-module">
      <p class="section-kicker">Continue where you left off</p>
      <h3>${label}</h3>
      <p>${description}</p>
      <a class="text-link" href="${href}">Resume now</a>
    </article>
  `;
}

function buildRecentComparisonsPanel(objects, options = {}) {
  const state = loadJourneyState();
  return renderRecentComparisonsPanel({
    entries: (state.recentComparisons || []).slice(0, options.limit || 3),
    objects,
    title: options.title,
    context: options.context,
    emptyMessage: options.emptyMessage
  });
}

function buildTopicDeepeningPanel(objects, topics, options = {}) {
  const state = loadJourneyState();
  const topicIds = new Set();
  (state.lastObject?.scienceTopicIds || []).forEach((id) => topicIds.add(id));
  (state.activeJourney?.objectIds || []).forEach((objectId) => {
    const match = objects.find((object) => object.id === objectId);
    (match?.scienceTopicIds || []).forEach((id) => topicIds.add(id));
  });
  const selectedTopics = [...topicIds]
    .map((id) => topics.find((topic) => topic.id === id))
    .filter(Boolean)
    .slice(0, options.limit || 3);

  return renderTopicJourneyPanel({
    topics: selectedTopics.length ? selectedTopics : topics.slice(0, options.limit || 3),
    objects,
    title: options.title,
    eyebrow: options.eyebrow
  });
}


function injectHomeJourneyResume(objects, topics) {
  if (page !== 'home') return;
  const state = getJourneyResume();
  const grid = document.querySelector('.featured-home-grid');
  if (!grid) return;

  if (state?.lastObject) {
    const article = document.createElement('article');
    article.className = 'feature-card reveal-on-scroll is-visible';
    article.innerHTML = `
      <p class="section-kicker">Resume your journey</p>
      <h2>Pick up where you left off with ${state.lastObject.name}.</h2>
      <p>${state.activeJourney ? `Continue the ${state.activeJourney.title} route, reopen a recent comparison, or branch into a topic linked to ${state.lastObject.name}.` : 'Your most recent object is ready to reopen across Explore, Observatory Mode, and the Sky Viewer.'}</p>
      <div class="stacked-links">
        <a class="text-link" href="${buildCrossLinks(state.lastObject, { journeyId: state.activeJourney?.id, from: 'home-resume' }).observatory}">Resume in Observatory Mode</a>
        <a class="text-link" href="${buildCrossLinks(state.lastObject, { journeyId: state.activeJourney?.id, from: 'home-resume' }).skyViewer}">Open in Sky Viewer</a>
        <a class="text-link" href="${state.lastObject.routeHints?.objectPage || buildCrossLinks(state.lastObject).objectPage}">Open object page</a>
      </div>
    `;
    grid.prepend(article);
  }

  const comparisonArticle = document.createElement('article');
  comparisonArticle.className = 'feature-card reveal-on-scroll is-visible';
  comparisonArticle.innerHTML = buildRecentComparisonsPanel(objects, {
    title: 'Recent comparison sets',
    context: 'home',
    emptyMessage: 'Build a comparison in Explore or on an object page, then restore it here.'
  });
  grid.appendChild(comparisonArticle);

  const topicArticle = document.createElement('article');
  topicArticle.className = 'feature-card reveal-on-scroll is-visible';
  topicArticle.innerHTML = buildTopicDeepeningPanel(objects, topics, {
    title: 'Recommended next topics',
    eyebrow: 'Topic-deepening'
  });
  grid.appendChild(topicArticle);
}

async function initExplore(objects) {
  const searchInput = document.getElementById('search-input');
  const filterGroup = document.getElementById('filter-group');
  const sortSelect = document.getElementById('sort-select');
  const catalogGrid = document.getElementById('catalog-grid');
  const resultsCount = document.getElementById('results-count');
  const comparePanel = document.getElementById('compare-panel');
  const contextPanel = document.getElementById('context-panel');
  const recentPanelHost = document.getElementById('explore-recent-panel');
  const dialog = document.getElementById('detail-dialog');
  const detailContent = document.getElementById('detail-content');
  const dialogClose = document.getElementById('dialog-close');

  const params = new URLSearchParams(window.location.search);
  let activeCategory = params.get('category') || 'all';
  let activeQuery = params.get('q') || '';
  let activeSort = params.get('sort') || 'name';
  let activeObjectId = params.get('object') || '';
  const restoreState = deriveComparisonStateFromUrl(objects);
  const compareIds = new Set((restoreState.validObjects.length ? restoreState.validObjects : (loadJourneyState().comparisonSelections || [])).map((item) => item.id));

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
    const object = objects.find((item) => item.id === id);
    if (object) rememberObject(object, { mode: 'Explore', source: 'Explore' });
    navigateTo(buildCrossLinks(object || { id }, { from: 'explore' }).skyViewer);
  };

  const openObservatory = (id) => {
    const object = objects.find((item) => item.id === id);
    if (object) rememberObject(object, { mode: 'Explore', source: 'Explore' });
    navigateTo(buildCrossLinks(object || { id }, { from: 'explore' }).observatory);
  };

  const openObject = async (object) => {
    rememberObject(object, { mode: 'Explore', source: 'Explore' });
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
        onOpenObservatory: openObservatory,
        onToggleCompare: (id) => {
          if (compareIds.has(id)) {
            compareIds.delete(id);
          } else if (compareIds.size < 3) {
            compareIds.add(id);
          }
          rememberComparison(objects.filter((object) => compareIds.has(object.id)), { source: 'Explore' });
          applyFilters();
        }
      },
      compareIds
    );
    const comparedObjects = objects.filter((object) => compareIds.has(object.id));
    rememberComparison(comparedObjects, { source: 'Explore', restoredAt: restoreState.restored ? new Date().toISOString() : null });
    renderComparison(comparedObjects, comparePanel, {
      restoredNotice: restoreState.restored && comparedObjects.length ? `Restored ${comparedObjects.length}-object comparison set.` : '',
      missingNotice: restoreState.missingIds.length ? `Some saved objects could not be restored: ${restoreState.missingIds.join(', ')}.` : '',
      continueHref: getComparisonRestoreUrl(comparedObjects.map((object) => object.id), { restored: true, from: 'explore' }),
      clearHref: toAbsolutePath('pages/explore.html')
    });
    renderContextualInsight(filtered.length ? filtered : objects, contextPanel, activeCategory);
    if (recentPanelHost) recentPanelHost.innerHTML = buildRecentPanel({ title: 'Recent Objects for Explore', context: 'explore', emptyMessage: 'Open a few objects to build a fast-return panel here.' });
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
    rememberObject(object, { mode: 'Sky Viewer', source: new URLSearchParams(window.location.search).get('from') || 'Sky Viewer' });
    emptyState.hidden = true;
    guidance.hidden = true;
    viewerStatus.textContent = `Centering on ${object.name}…`;

    const progressiveSummary = await getProgressiveObjectSummary(object);
    renderSkyViewerPanel({
      object,
      relatedObjects: findRelatedObjects(object, objects),
      integrationStatus,
      progressiveSummary,
      journeyState: loadJourneyState()
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


async function initObservatory() {
  const target = document.getElementById('observatory-app');
  if (!target) return;

  const observatoryData = await getObservatoryData();
  renderObservatoryPage(observatoryData, target);

  const params = new URLSearchParams(window.location.search);
  const canvas = document.getElementById('observatory-canvas');
  const hotspots = document.getElementById('observatory-hotspots');
  const filterGroup = document.getElementById('observatory-filter-group');
  const objectPanel = document.getElementById('observatory-object-panel');
  const objectLink = document.getElementById('observatory-object-link');
  const journeyPanel = document.getElementById('observatory-journey-panel');
  const statusTitle = document.getElementById('observatory-status-title');
  const statusCopy = document.getElementById('observatory-status-copy');
  const observatoryRecentPanel = document.getElementById('observatory-recent-panel');

  if (!canvas || !hotspots || !filterGroup || !objectPanel || !journeyPanel) return;

  const ctx = canvas.getContext('2d');
  const { skyNodes, journeys, regions, storyPanels } = observatoryData;
  let activeJourney = journeys.find((journey) => journey.id === params.get('journey')) || journeys.find((journey) => journey.id === loadJourneyState().activeJourney?.id) || journeys[0];
  let activeFilter = params.get('filter') || 'all';
  let activeObject = skyNodes.find((object) => object.id === params.get('object')) || skyNodes.find((object) => object.id === loadJourneyState().lastObject?.id) || activeJourney.objects[0] || skyNodes[0];
  let animationFrame = null;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const camera = { x: activeObject.x, y: activeObject.y, scale: 1.08 };
  const targetCamera = { x: activeObject.x, y: activeObject.y, scale: 1.08 };

  const colorMap = (object) => object.color?.includes('red') ? '#ff9d7f' : object.color?.includes('yellow') || object.color?.includes('gold') || object.color?.includes('orange') ? '#f3d18c' : object.color?.includes('blue') ? '#8fb0ff' : '#edf2ff';
  const distanceFill = (distance) => `${Math.max(14, Math.min(100, Math.log10((distance || 1) + 1) * 24))}%`;

  const syncUrl = () => {
    const next = new URLSearchParams();
    if (activeObject?.id) next.set('object', activeObject.id);
    if (activeJourney?.id) next.set('journey', activeJourney.id);
    if (activeFilter !== 'all') next.set('filter', activeFilter);
    window.history.replaceState({}, '', `${window.location.pathname}?${next.toString()}`);
  };

  const visibleNodes = () => {
    if (activeFilter === 'favorites') return skyNodes.filter((object) => activeJourney.objectIds.includes(object.id));
    if (activeFilter === 'naked-eye') return skyNodes.filter((object) => ['sirius','betelgeuse','rigel','vega','polaris','pleiades','andromeda-galaxy','aldebaran','arcturus'].includes(object.id));
    if (activeFilter === 'by-color') return skyNodes.filter((object) => object.temperatureK || object.color);
    return skyNodes;
  };

  const renderFilters = () => {
    const filters = [
      { id: 'all', label: 'All highlights' },
      { id: 'favorites', label: 'Tonight's Journey' },
      { id: 'naked-eye', label: 'Naked-eye favorites' },
      { id: 'by-color', label: 'Explore by color' }
    ];
    filterGroup.innerHTML = filters.map((filter) => `<button type="button" class="filter-chip${filter.id === activeFilter ? ' is-selected' : ''}" data-filter-id="${filter.id}">${filter.label}</button>`).join('');
    filterGroup.querySelectorAll('[data-filter-id]').forEach((button) => {
      button.addEventListener('click', () => {
        activeFilter = button.dataset.filterId;
        renderFilters();
        renderHotspots();
        syncUrl();
      });
    });
  };

  const renderHotspots = () => {
    hotspots.innerHTML = visibleNodes().map((object) => `<button type="button" class="observatory-hotspot${object.id === activeObject.id ? ' is-active' : ''}" style="left:${object.x}%;top:${object.y}%;--glow:${colorMap(object)}" data-object-id="${object.id}"><span class="sr-only">Focus ${object.name}</span><span class="observatory-hotspot-dot"></span><span class="observatory-hotspot-label">${object.name}</span></button>`).join('');
    hotspots.querySelectorAll('[data-object-id]').forEach((button) => button.addEventListener('click', () => {
      const match = skyNodes.find((object) => object.id === button.dataset.objectId);
      if (match) selectObject(match);
    }));
  };

  const renderObjectPanel = (object) => {
    const region = regions.find((item) => item.objectIds.includes(object.id));
    const relatedTopics = (object.relatedTopicCards || []).slice(0, 3).map((topic) => `<a class="tag tag-link" href="${toAbsolutePath(topic.pageHref)}">${topic.title}</a>`).join('');
    const fame = object.apparentMagnitude <= 1 ? 'Headline sky object' : object.distanceLightYears > 100000 ? 'Cosmic scale landmark' : 'Guided observatory target';
    const journeyState = loadJourneyState();
    const links = buildCrossLinks(object, { journeyId: activeJourney?.id, from: 'observatory', regionId: region?.id || undefined, compareTo: 'sun' });
    const journeyContinuationHref = activeJourney ? toAbsolutePath(activeJourney.pageHref) : null;
    const journeyContinuationLabel = activeJourney?.kind === 'learning' ? 'Continue the learning thread' : 'Continue this guided journey';
    objectPanel.innerHTML = `
      <div class="observatory-object-card">
        <div class="observatory-object-topline">
          <span class="temp-swatch" style="--object-color:${colorMap(object)}"></span>
          <div>
            <h3>${object.name}</h3>
            <p>${object.type}</p>
          </div>
        </div>
        <div class="catalog-meta">
          <span class="tag">${object.constellation}</span>
          <span>${object.distance}</span>
          <span>${object.spectralClass}</span>
        </div>
        <div class="observatory-badge-row">
          <span class="tag">${fame}</span>
          <span class="tag">${region ? region.name : 'Sky highlight'}</span>
        </div>
        <p>${object.summary}</p>
        <div class="detail-list observatory-detail-list">
          <div><strong>Constellation</strong><p>${object.constellation}</p></div>
          <div><strong>Distance</strong><p>${object.distance}</p></div>
          <div><strong>Spectral class</strong><p>${object.spectralClass}</p></div>
          <div><strong>Color note</strong><p>${object.color}</p></div>
          <div><strong>Temperature</strong><p>${object.temperatureK ? object.temperatureK.toLocaleString() + ' K' : 'Interpreted from emitted gas and stellar mix'}</p></div>
          <div><strong>Why it matters</strong><p>${object.importance}</p></div>
        </div>
        <div class="distance-meter"><div class="distance-meter-bar"><span style="width:${distanceFill(object.distanceLightYears)}"></span></div><small>Distance scale in the observatory collection</small></div>
        <section class="mini-panel nested-panel"><h3>What its light reveals</h3><p>${object.lightStory}</p></section>
        <section class="mini-panel nested-panel"><h3>Journey continuity</h3><p>${journeyState.activeJourney ? `You are in the ${journeyState.activeJourney.title} path.` : 'Open a guided route to connect this target to a bigger sky story.'}</p><div class="stacked-links">${journeyState.activeJourney && journeyContinuationHref ? `<a class=\"text-link\" href=\"${journeyContinuationHref}\">${journeyContinuationLabel}</a>` : ''}<a class="text-link" href="${links.explore}">Compare with another object</a><a class="text-link" href="${links.objectPage}">Open full object page</a></div></section>
        <section class="mini-panel nested-panel"><h3>Discovery actions</h3><div class="stacked-links"><a class="text-link" href="${links.skyViewer}">Open in Sky Viewer</a><a class="text-link" href="${links.explore}">Compare with another object</a><a class="text-link" href="${toAbsolutePath(`pages/discover.html`)}">Explore related science</a>${object.relatedObjectIds?.[0] ? `<a class=\"text-link\" href=\"${toAbsolutePath(`pages/observatory.html?object=${object.relatedObjectIds[0]}&journey=${activeJourney?.id || ''}&from=related`)}\">Explore related objects</a>` : ''}<a class="text-link" href="${toAbsolutePath(`pages/objects/sun.html?compare=${object.id}`)}">Compare to the Sun</a></div></section>
        <section class="mini-panel nested-panel"><h3>Related science topics</h3><div class="catalog-chip-row">${relatedTopics}</div></section>
      </div>`;
    objectLink.href = links.objectPage;
    if (observatoryRecentPanel) observatoryRecentPanel.innerHTML = buildRecentPanel({ title: 'Recent Observatory Objects', context: 'observatory', currentJourneyId: activeJourney?.id, emptyMessage: 'Focus a few observatory targets to keep them ready here.' });
    statusTitle.textContent = object.name;
    statusCopy.textContent = `${object.skyGuide} ${region ? region.note : ''}`;
  };

  const renderJourneyPanel = () => {
    journeyPanel.innerHTML = `
      <article class="journey-panel" style="background:${activeJourney.accent}">
        <p class="section-kicker">${activeJourney.eyebrow}</p>
        <h3>${activeJourney.title}</h3>
        <p>${activeJourney.description}</p>
        <ol class="journey-step-list">${activeJourney.steps.map((step) => `<li>${step}</li>`).join('')}</ol>
        <div class="catalog-chip-row">${activeJourney.objects.map((object) => `<button type="button" class="tag tag-button" data-journey-object="${object.id}">${object.name}</button>`).join('')}</div>
      </article>
      <article class="mini-panel nested-panel"><h3>Story prompt</h3><p>${storyPanels.find((panel) => activeJourney.title.toLowerCase().includes('light') ? panel.id === 'light-knowledge' : activeJourney.title.toLowerCase().includes('color') ? panel.id === 'star-colors' : panel.id === 'eyes-seeing')?.body}</p></article>`;
    journeyPanel.querySelectorAll('[data-journey-object]').forEach((button) => button.addEventListener('click', () => {
      const match = skyNodes.find((object) => object.id === button.dataset.journeyObject);
      if (match) selectObject(match, false);
    }));
    document.querySelectorAll('[data-journey-id]').forEach((button) => button.classList.toggle('is-selected', button.dataset.journeyId === activeJourney.id));
  };

  const selectObject = (object, updateJourney = true) => {
    activeObject = object;
    if (updateJourney) {
      const containingJourney = journeys.find((journey) => journey.objectIds.includes(object.id));
      if (containingJourney) activeJourney = containingJourney;
    }
    targetCamera.x = object.x;
    targetCamera.y = object.y;
    targetCamera.scale = 1.18;
    renderHotspots();
    renderObjectPanel(object);
    renderJourneyPanel();
    rememberObject(object, { mode: 'Observatory Mode', source: params.get('from') || 'Observatory Mode', skyRegion: object.regionId || null });
    setActiveJourney(activeJourney, { currentObjectId: object.id, originMode: 'Observatory Mode' });
    syncUrl();
  };

  const draw = () => {
    const width = canvas.clientWidth || canvas.width;
    const height = canvas.clientHeight || canvas.height;
    if (canvas.width !== width * devicePixelRatio || canvas.height !== height * devicePixelRatio) {
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
    }
    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    ctx.clearRect(0, 0, width, height);

    if (!prefersReducedMotion) {
      camera.x += (targetCamera.x - camera.x) * 0.055;
      camera.y += (targetCamera.y - camera.y) * 0.055;
      camera.scale += (targetCamera.scale - camera.scale) * 0.04;
    } else {
      camera.x = targetCamera.x;
      camera.y = targetCamera.y;
      camera.scale = targetCamera.scale;
    }

    const gradient = ctx.createRadialGradient(width * 0.52, height * 0.46, 20, width * 0.52, height * 0.46, width * 0.8);
    gradient.addColorStop(0, 'rgba(54, 84, 170, 0.22)');
    gradient.addColorStop(0.5, 'rgba(17, 27, 59, 0.16)');
    gradient.addColorStop(1, 'rgba(2, 6, 18, 0.94)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < 140; i += 1) {
      const x = ((i * 79) % width);
      const y = ((i * 43) % height);
      const twinkle = prefersReducedMotion ? 0.7 : 0.55 + Math.sin((performance.now() * 0.0012) + i) * 0.18;
      ctx.fillStyle = `rgba(255,255,255,${twinkle})`;
      ctx.beginPath();
      ctx.arc(x, y, (i % 3) + 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    const nodes = visibleNodes();
    nodes.forEach((node) => {
      const px = ((node.x - camera.x) * camera.scale + 50) / 100 * width;
      const py = ((node.y - camera.y) * camera.scale + 50) / 100 * height;
      if (px < -50 || py < -50 || px > width + 50 || py > height + 50) return;
      const glow = ctx.createRadialGradient(px, py, 0, px, py, 38);
      glow.addColorStop(0, colorMap(node));
      glow.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(px, py, 38, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(px, py, node.id === activeObject.id ? node.size + 2 : node.size, 0, Math.PI * 2);
      ctx.fill();
      if (node.regionId && node.id !== activeObject.id) {
        ctx.strokeStyle = 'rgba(135,171,255,0.18)';
        ctx.beginPath();
        ctx.arc(px, py, 12 + node.size, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    animationFrame = requestAnimationFrame(draw);
  };

  renderFilters();
  renderHotspots();
  renderObjectPanel(activeObject);
  renderJourneyPanel();
  rememberObject(activeObject, { mode: 'Observatory Mode', source: params.get('from') || 'Observatory Mode', skyRegion: activeObject.regionId || null });
  setActiveJourney(activeJourney, { currentObjectId: activeObject.id, originMode: 'Observatory Mode' });

  document.querySelectorAll('[data-journey-id]').forEach((button) => button.addEventListener('click', () => {
    const journey = journeys.find((item) => item.id === button.dataset.journeyId);
    if (!journey) return;
    activeJourney = journey;
    setActiveJourney(journey, { currentObjectId: journey.objects?.[0]?.id || null, originMode: 'Observatory Mode' });
    activeFilter = 'favorites';
    renderFilters();
    renderJourneyPanel();
    renderHotspots();
    if (journey.objects[0]) selectObject(journey.objects[0], false);
  }));

  document.querySelectorAll('[data-region-object]').forEach((button) => button.addEventListener('click', () => {
    const object = skyNodes.find((item) => item.id === button.dataset.regionObject);
    if (object) selectObject(object);
  }));

  draw();
  window.addEventListener('beforeunload', () => animationFrame && cancelAnimationFrame(animationFrame), { once: true });
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

  rememberObject(pageData.object, { mode: 'Object Page', source: new URLSearchParams(window.location.search).get('from') || 'Object Page' });
  const topics = await getScienceTopics();
  const linkedTopicIds = getLinkedTopicIdsForObject(pageData.object).slice(0, 3);
  const relatedTopics = linkedTopicIds.map((id) => topics.find((topic) => topic.id === id)).filter(Boolean);
  const compareCandidates = relatedTopics.map((topic) => {
    const candidate = (pageData.relatedObjects || []).find((related) => (related.scienceTopicIds || []).includes(topic.id));
    if (!candidate) return null;
    return {
      topic,
      object: candidate,
      sharedTopics: relatedTopics.filter((item) => (candidate.scienceTopicIds || []).includes(item.id)).slice(0, 2),
      reason: `${candidate.name} helps extend the ${topic.title.toLowerCase()} thread from ${pageData.object.name} into a clearer side-by-side comparison.`
    };
  }).filter(Boolean);
  renderObjectPage({
    ...pageData,
    journeyState: loadJourneyState(),
    recentPanel: buildRecentPanel({ title: 'Recent Objects', context: 'object-page', currentJourneyId: loadJourneyState().activeJourney?.id }),
    recentComparisonsPanel: buildRecentComparisonsPanel([pageData.object, ...(pageData.relatedObjects || [])], {
      title: 'Recent comparisons',
      context: 'object-page',
      emptyMessage: 'Use Compare this to save a two- or three-object comparison for quick return.'
    }),
    topicComparisonPanel: renderTopicComparisonInsights({ object: pageData.object, compareCandidates, relatedTopics }),
    crossLinks: buildCrossLinks(pageData.object, { journeyId: loadJourneyState().activeJourney?.id, from: 'object-page' })
  }, target);
}

async function initDiscoverPage(objects) {
  const target = document.getElementById('discover-page-content');
  if (!target) return;

  const [modules, topics] = await Promise.all([getDiscoverModules(), getScienceTopics()]);
  const state = loadJourneyState();
  const currentJourneyId = state.activeJourney?.id || 'brightest-stars';
  const step = getStepState(currentJourneyId, 'Understand') || getStepState('brightest-stars', 'Understand');
  renderDiscoverPage({ modules, topics, objects, journeyStep: step, recentPanel: buildRecentPanel({ title: 'Recent Objects for Discover', context: 'discover', currentJourneyId }), continueModule: state.activeJourney ? buildContinueModule(state.activeJourney.title, toAbsolutePath(`pages/observatory.html?journey=${state.activeJourney.id}&object=${state.lastObject?.id || state.activeJourney.currentObjectId || ''}`), 'Return to the discovery flow that was active in Observatory Mode or recent exploration.') : '' }, target);
}

async function initLearnPage(objects) {
  const target = document.getElementById('learn-page-content');
  if (!target) return;

  const [paths, topics, startHere] = await Promise.all([getLearningPaths(), getScienceTopics(), getStartHereGuide()]);
  const hash = window.location.hash.replace('#path-', '');
  const activePath = paths.find((path) => path.id === hash) || paths[0];
  const step = getStepState(activePath?.id === 'stellar-life-cycle' ? 'stellar-evolution' : activePath?.id || 'understanding-starlight', 'Understand') || getStepState('understanding-starlight', 'Understand');
  renderLearnPage({ paths, topics, startHere, objects, journeyStep: step, recentPanel: buildRecentPanel({ title: 'Recent Objects for Learn', context: 'learn', currentJourneyId: activePath?.id }), continueModule: loadJourneyState().learningPath ? buildContinueModule(loadJourneyState().learningPath.title, toAbsolutePath(`pages/learn.html#path-${loadJourneyState().learningPath.id}`), 'Pick up the lesson you were using most recently, then reopen the linked objects from recent history.') : '' }, target);
  if (activePath) setLearningPath(activePath);
}


async function init() {
  const objects = await getAstronomyObjects();
  renderFeaturedObject(objects);
  renderHomepageExperience(objects);
  injectHomeJourneyResume(objects, await getScienceTopics());
  document.body.dataset.storageAvailable = String(getStorageAvailability());

  if (page === 'explore') await initExplore(objects);
  if (page === 'sky-viewer') await initSkyViewer(objects);
  if (page === 'object-detail') await initObjectPage();
  if (page === 'discover') await initDiscoverPage(objects);
  if (page === 'learn') await initLearnPage(objects);
  if (page === 'observatory') await initObservatory();
}

init().catch((error) => {
  console.error(error);
  const container = document.querySelector('[data-featured-object]') || document.getElementById('catalog-grid') || document.getElementById('sky-object-panel') || document.getElementById('object-page-content');
  if (container) {
    container.innerHTML = '<p>Unable to load astronomy data right now.</p>';
  }
});
