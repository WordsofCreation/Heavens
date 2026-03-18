import { loadObjects } from './data-loader.js';
import { filterObjects, getCategories } from './search.js';
import { buildConstellationViewer, setupNavigation, setupRevealAnimations } from './ui.js';
import { renderCatalog, renderDetail, renderFeaturedObject } from './star-renderer.js';

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
  const catalogGrid = document.getElementById('catalog-grid');
  const resultsCount = document.getElementById('results-count');
  const dialog = document.getElementById('detail-dialog');
  const detailContent = document.getElementById('detail-content');
  const dialogClose = document.getElementById('dialog-close');

  let activeCategory = 'all';
  let activeQuery = '';

  const applyFilters = () => {
    const filtered = filterObjects(objects, activeQuery, activeCategory);
    renderCatalog(filtered, {
      grid: catalogGrid,
      count: resultsCount,
      onSelect: (object) => {
        renderDetail(object, detailContent);
        dialog.showModal();
      }
    });
  };

  getCategories(objects).forEach((category) => {
    const button = document.createElement('button');
    button.className = `filter-chip${category === 'all' ? ' is-selected' : ''}`;
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

  dialogClose.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    const rect = dialog.getBoundingClientRect();
    const inDialog = rect.top <= event.clientY && event.clientY <= rect.top + rect.height && rect.left <= event.clientX && event.clientX <= rect.left + rect.width;
    if (!inDialog) dialog.close();
  });

  applyFilters();
}

init().catch((error) => {
  console.error(error);
  const container = document.querySelector('[data-featured-object]') || document.getElementById('catalog-grid');
  if (container) {
    container.innerHTML = '<p>Unable to load astronomy data right now.</p>';
  }
});
