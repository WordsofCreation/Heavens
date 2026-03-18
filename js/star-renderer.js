function formatTemperature(value) {
  return value ? `${value.toLocaleString()} K` : '—';
}

function formatMagnitude(value) {
  return typeof value === 'number' ? value.toString() : '—';
}

function spectralBadge(spectralClass) {
  if (!spectralClass || spectralClass === 'Not applicable') {
    return '<span class="spectral-pill spectral-pill-muted">No stellar spectrum</span>';
  }
  const family = spectralClass[0]?.toUpperCase();
  return `<span class="spectral-pill spectral-${family}">${spectralClass}</span>`;
}

function distanceMeter(object) {
  const capped = Math.min(100, Math.max(10, Math.log10((object.distanceLightYears || 0.000016) + 1) * 18));
  return `
    <div class="distance-meter" aria-label="Distance visualization">
      <div class="distance-meter-bar"><span style="width:${capped}%"></span></div>
      <small>${object.distance}</small>
    </div>
  `;
}

function temperatureSwatch(object) {
  return `<span class="temp-swatch" style="--object-color:${object.color?.includes('red') ? '#ff8d7a' : object.color?.includes('orange') || object.color?.includes('gold' ) || object.color?.includes('yellow') ? '#f0c97b' : object.color?.includes('blue') ? '#87abff' : '#edf2ff'}"></span>`;
}

function scienceInsightCard(card) {
  return `
    <article class="science-insight-card">
      <p class="eyebrow">Science insight</p>
      <h3>${card.title}</h3>
      <p>${card.body}</p>
    </article>
  `;
}

function objectCardTemplate(object, selectedIds) {
  const selected = selectedIds.has(object.id);
  return `
    <article class="catalog-card${selected ? ' is-compared' : ''}" tabindex="0" data-object-id="${object.id}">
      <div class="catalog-card-topline">
        <p class="eyebrow">${object.category}</p>
        <label class="compare-toggle" aria-label="Select ${object.name} for comparison">
          <input type="checkbox" data-compare-id="${object.id}" ${selected ? 'checked' : ''} />
          <span>Compare</span>
        </label>
      </div>
      <h2>${object.name}</h2>
      <p class="catalog-type-line">${temperatureSwatch(object)}<span>${object.type}</span></p>
      <div class="catalog-meta">
        <span class="tag">${object.constellation}</span>
        <span>${object.distance}</span>
        <span>Mag ${formatMagnitude(object.apparentMagnitude)}</span>
      </div>
      <div class="catalog-visuals">
        ${spectralBadge(object.spectralClass)}
        ${distanceMeter(object)}
      </div>
      <p>${object.summary}</p>
      <div class="catalog-card-actions">
        <button class="button button-ghost" type="button" data-view-sky="${object.id}">View in Sky Viewer</button>
      </div>
    </article>
  `;
}

function detailTemplate(object, progressiveSummary) {
  const observed = object.observedThroughLight || {};
  return `
    <article class="detail-article">
      <div class="detail-hero">
        <div>
          <p class="eyebrow">${object.category}</p>
          <h2 id="detail-title">${object.name}</h2>
          <p class="detail-lead">${object.summary}</p>
        </div>
        <div class="detail-visual-stack">
          <div class="detail-color-card">
            ${temperatureSwatch(object)}
            <div>
              <strong>Apparent color</strong>
              <p>${object.color}</p>
            </div>
          </div>
          ${spectralBadge(object.spectralClass)}
        </div>
      </div>
      <div class="detail-actions">
        <a class="button button-primary" href="sky-viewer.html?object=${object.id}">View in Sky Viewer</a>
        <p class="detail-coordinates">Sky position: ${object.coordinatesLabel}</p>
      </div>
      <div class="detail-list">
        <div><strong>Type</strong><p>${object.type}</p></div>
        <div><strong>Constellation</strong><p>${object.constellation}</p></div>
        <div><strong>Approximate distance</strong><p>${object.distance}</p></div>
        <div><strong>Spectral class</strong><p>${object.spectralClass}</p></div>
        <div><strong>Apparent brightness</strong><p>Magnitude ${formatMagnitude(object.apparentMagnitude)}</p></div>
        <div><strong>Temperature</strong><p>${formatTemperature(object.temperatureK)}</p></div>
      </div>
      <div class="detail-insight-grid">
        <section class="mini-panel">
          <h3>What its light tells us</h3>
          <p>${object.lightStory}</p>
        </section>
        <section class="mini-panel">
          <h3>Why this object matters</h3>
          <p>${object.importance}</p>
        </section>
      </div>
      <section class="mini-panel">
        <h3>Observed Through Light</h3>
        <div class="observed-grid">
          <div><strong>Color & temperature</strong><p>${observed.colorTemperature || 'Color helps astronomers estimate the energy coming from this object.'}</p></div>
          <div><strong>Spectral clues</strong><p>${observed.spectralInfo || 'Spectra reveal which wavelengths are present or missing.'}</p></div>
          <div><strong>Brightness & distance</strong><p>${observed.brightnessDistance || 'Brightness has to be interpreted together with distance.'}</p></div>
          <div><strong>Motion & composition</strong><p>${observed.motionComposition || 'Astronomers use light to track movement and chemistry.'}</p></div>
        </div>
      </section>
      <section class="mini-panel">
        <h3>Size and scale</h3>
        <p>${object.sizeNotes}</p>
        ${distanceMeter(object)}
      </section>
      ${progressiveSummary ? `
        <section class="mini-panel">
          <h3>Live context</h3>
          <p>${progressiveSummary.extract}</p>
          ${progressiveSummary.sourceUrl ? `<a class="text-link" href="${progressiveSummary.sourceUrl}" target="_blank" rel="noreferrer">Open source summary</a>` : ''}
        </section>` : ''}
      <section class="mini-panel">
        <h3>Key science facts</h3>
        <ul class="fact-list">
          ${(object.scienceFacts || []).map((fact) => `<li>${fact}</li>`).join('')}
        </ul>
      </section>
      <section class="science-insight-grid">
        ${(object.scienceCards || []).map(scienceInsightCard).join('')}
      </section>
    </article>
  `;
}

function compareTableTemplate(objects) {
  if (!objects.length) {
    return `
      <div class="compare-empty">
        <p class="eyebrow">Comparison</p>
        <h2>Select up to three objects</h2>
        <p>Use the compare toggles on object cards to build a side-by-side science snapshot.</p>
      </div>
    `;
  }

  return `
    <div class="compare-header">
      <div>
        <p class="eyebrow">Comparison</p>
        <h2>${objects.length} object${objects.length === 1 ? '' : 's'} selected</h2>
      </div>
      <p>Compare category, distance, spectral class, temperature, scale notes, and key science ideas.</p>
    </div>
    <div class="comparison-grid">
      ${objects
        .map(
          (object) => `
            <article class="comparison-card">
              <h3>${object.name}</h3>
              <p class="catalog-type-line">${temperatureSwatch(object)}<span>${object.type}</span></p>
              ${spectralBadge(object.spectralClass)}
              <dl class="comparison-list">
                <div><dt>Distance</dt><dd>${object.distance}</dd></div>
                <div><dt>Temp</dt><dd>${formatTemperature(object.temperatureK)}</dd></div>
                <div><dt>Brightness</dt><dd>Mag ${formatMagnitude(object.apparentMagnitude)}</dd></div>
                <div><dt>Scale</dt><dd>${object.sizeNotes}</dd></div>
                <div><dt>Science fact</dt><dd>${object.scienceFacts?.[0] || object.importance}</dd></div>
              </dl>
            </article>
          `
        )
        .join('')}
    </div>
  `;
}

export function renderCatalog(objects, elements, selectedIds) {
  const { grid, count, onSelect, onToggleCompare, onViewSky } = elements;
  grid.innerHTML = objects.map((object) => objectCardTemplate(object, selectedIds)).join('');
  count.textContent = `${objects.length} object${objects.length === 1 ? '' : 's'} in view`;

  grid.querySelectorAll('.catalog-card').forEach((card) => {
    const handler = (event) => {
      if (event?.target?.closest('.compare-toggle, [data-view-sky]')) return;
      const object = objects.find((item) => item.id === card.dataset.objectId);
      onSelect(object);
    };
    card.addEventListener('click', handler);
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handler(event);
      }
    });
  });

  grid.querySelectorAll('[data-compare-id]').forEach((input) => {
    input.addEventListener('change', () => onToggleCompare(input.dataset.compareId));
  });
  grid.querySelectorAll('[data-view-sky]').forEach((button) => {
    button.addEventListener('click', () => onViewSky(button.dataset.viewSky));
  });
}

export function renderDetail(object, detailContent, progressiveSummary = null) {
  detailContent.innerHTML = detailTemplate(object, progressiveSummary);
}

export function renderComparison(objects, element) {
  element.innerHTML = compareTableTemplate(objects);
}

export function renderFeaturedObject(objects) {
  const card = document.querySelector('[data-featured-object]');
  const spotlight = document.querySelector('[data-home-featured-spotlight]');
  if ((!card && !spotlight) || !objects.length) return;

  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), 0, 0));
  const diff = now - start;
  const day = Math.floor(diff / 86400000);
  const featured = objects[day % objects.length];
  const base = window.location.pathname.includes('/pages/') ? '../' : '';
  const detailHref = `${base}pages/explore.html?object=${featured.id}`;
  const skyHref = `${base}pages/sky-viewer.html?object=${featured.id}`;

  if (card) {
    card.innerHTML = `
      <p class="eyebrow">Tonight's Featured Wonder</p>
      <h2>${featured.name}</h2>
      <p>${featured.summary}</p>
      <div class="catalog-meta">
        <span class="tag">${featured.category}</span>
        <span>${featured.constellation}</span>
        <span>${featured.distance}</span>
      </div>
      <div class="stacked-links">
        <a class="text-link" href="${detailHref}">Open full detail view</a>
        <a class="text-link" href="${skyHref}">See it in Sky Viewer</a>
      </div>
    `;
  }

  if (spotlight) {
    spotlight.innerHTML = `
      <p class="section-kicker">Tonight's Featured Wonder</p>
      <h2>${featured.name}</h2>
      <p>${featured.summary}</p>
      <div class="catalog-meta">
        <span class="tag">${featured.type}</span>
        <span>${featured.distance}</span>
        <span>${featured.constellation}</span>
      </div>
      <p class="home-feature-note">Rotation is based on the local date and the site's built-in data, so GitHub Pages can stay fast and backend-free.</p>
      <div class="stacked-links">
        <a href="${detailHref}" class="text-link">Jump straight to this object</a>
        <a href="${skyHref}" class="text-link">Open it in the Sky Viewer</a>
      </div>
    `;
  }
}

export function renderContextualInsight(objects, element, category) {
  if (!element) return;
  const nearest = [...objects].sort((a, b) => a.distanceLightYears - b.distanceLightYears)[0];
  const hottest = [...objects].filter((object) => object.temperatureK).sort((a, b) => b.temperatureK - a.temperatureK)[0];
  const message = category !== 'all'
    ? `You are viewing ${category.toLowerCase()}. Watch how shared categories can still hide very different distances, colors, and brightness levels.`
    : `Across the full explorer, ${nearest?.name || 'nearby stars'} shows how nearness affects visibility, while ${hottest?.name || 'hot stars'} demonstrates how blue-white light often signals higher temperature.`;

  element.innerHTML = `
    <p class="eyebrow">Science layer</p>
    <h2>Context for this view</h2>
    <p>${message}</p>
  `;
}

export function renderScienceInsights(cards, element) {
  if (!element) return;
  element.innerHTML = cards.map(scienceInsightCard).join('');
}

export function renderSkyViewerPanel({ object, relatedObjects, integrationStatus, progressiveSummary }, element) {
  if (!element) return;
  if (!object) {
    element.innerHTML = `
      <div class="sky-panel-empty">
        <p class="eyebrow">Choose a target</p>
        <h2>Select an object from the catalog</h2>
        <p>Search for a star, nebula, or galaxy from the local dataset to center the viewer and add a marker.</p>
      </div>
    `;
    return;
  }

  element.innerHTML = `
    <article class="sky-object-panel">
      <p class="eyebrow">Selected object</p>
      <h2>${object.name}</h2>
      <p class="detail-lead">${object.summary}</p>
      <div class="catalog-meta">
        <span class="tag">${object.type}</span>
        <span>${object.constellation}</span>
        <span>${object.coordinatesLabel}</span>
      </div>
      <section class="mini-panel inline-panel">
        <h3>Short science summary</h3>
        <p>${object.lightStory}</p>
      </section>
      <section class="mini-panel inline-panel">
        <h3>Observed Through Light</h3>
        <p>${object.observedThroughLight?.spectralInfo || object.lightStory}</p>
      </section>
      ${progressiveSummary ? `<section class="mini-panel inline-panel"><h3>Live enhancement</h3><p>${progressiveSummary.extract}</p></section>` : ''}
      <section class="mini-panel inline-panel">
        <h3>Related objects nearby</h3>
        <ul class="related-list">
          ${relatedObjects.map((item) => `<li><strong>${item.name}</strong><span>${item.angularDistance}</span></li>`).join('') || '<li>No nearby matches in the current local dataset.</li>'}
        </ul>
      </section>
      <section class="integration-list">
        <p class="eyebrow">Future integrations</p>
        ${integrationStatus.map((service) => `<div><strong>${service.label}</strong><p>${service.status}. ${service.enabled ? 'Adapter can be wired without changing the viewer shell.' : 'Config stub is ready for a future client-side adapter.'}</p></div>`).join('')}
      </section>
    </article>
  `;
}

export function renderFeaturedRegions(regions, element) {
  if (!element) return;
  element.innerHTML = regions.map((region) => `
    <article class="feature-card">
      <p class="section-kicker">Featured Region of the Sky</p>
      <h2>${region.title.replace('Featured Region of the Sky: ', '')}</h2>
      <p>${region.description}</p>
      <div class="catalog-meta">${region.objects.map((object) => `<span class="tag">${object.name}</span>`).join('')}</div>
      <a class="text-link" href="../pages/sky-viewer.html?object=${region.objects[0]?.id || ''}">Open this region in Sky Viewer</a>
    </article>
  `).join('');
}
