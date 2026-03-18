function objectCardTemplate(object) {
  return `
    <article class="catalog-card" tabindex="0" data-object-name="${object.name}">
      <p class="eyebrow">${object.type}</p>
      <h2>${object.name}</h2>
      <div class="catalog-meta">
        <span class="tag">${object.constellation}</span>
        <span>${object.distance}</span>
        <span>${object.spectralClass}</span>
      </div>
      <p>${object.description}</p>
    </article>
  `;
}

function detailTemplate(object) {
  return `
    <article>
      <h2>${object.name}</h2>
      <p>${object.description}</p>
      <div class="detail-list">
        <div><strong>Type</strong><p>${object.type}</p></div>
        <div><strong>Constellation</strong><p>${object.constellation}</p></div>
        <div><strong>Approximate distance</strong><p>${object.distance}</p></div>
        <div><strong>Spectral class</strong><p>${object.spectralClass}</p></div>
      </div>
    </article>
  `;
}

export function renderCatalog(objects, elements) {
  const { grid, count, onSelect } = elements;
  grid.innerHTML = objects.map(objectCardTemplate).join('');
  count.textContent = `${objects.length} object${objects.length === 1 ? '' : 's'} in view`;

  grid.querySelectorAll('.catalog-card').forEach((card) => {
    const handler = () => {
      const object = objects.find((item) => item.name === card.dataset.objectName);
      onSelect(object);
    };
    card.addEventListener('click', handler);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handler();
      }
    });
  });
}

export function renderDetail(object, detailContent) {
  detailContent.innerHTML = detailTemplate(object);
}

export function renderFeaturedObject(objects) {
  const container = document.querySelector('[data-featured-object]');
  if (!container || !objects.length) return;
  const featured = objects.find((object) => object.type === 'nebula') || objects[0];
  container.innerHTML = `
    <p class="eyebrow">Featured object</p>
    <h2>${featured.name}</h2>
    <p>${featured.description}</p>
    <div class="catalog-meta">
      <span class="tag">${featured.type}</span>
      <span>${featured.constellation}</span>
      <span>${featured.distance}</span>
    </div>
  `;
}
