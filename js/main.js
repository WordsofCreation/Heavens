import { loadObjects } from './data-loader.js';
import { filterObjects, getCategories, sortObjects } from './search.js';
import { buildConstellationViewer, setupNavigation, setupRevealAnimations, trapDialogFocus } from './ui.js';
import { renderCatalog, renderComparison, renderContextualInsight, renderDetail, renderFeaturedObject } from './star-renderer.js';

setupNavigation();
setupRevealAnimations();
buildConstellationViewer();

const page = document.body.dataset.page;

async function init() {
  const objects = await loadObjects();
  renderFeaturedObject(objects);

  if (page !== 'explore') return;

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

  const openObject = (object) => {
    renderDetail({ ...object }, detailContent);
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

init().catch((error) => {
  console.error(error);
  const container = document.querySelector('[data-featured-object]') || document.getElementById('catalog-grid');
  if (container) {
    container.innerHTML = '<p>Unable to load astronomy data right now.</p>';
  }
});
