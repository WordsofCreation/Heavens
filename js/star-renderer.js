import { toAbsolutePath } from './path-utils.js';

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
  return `<span class="temp-swatch" style="--object-color:${object.color?.includes('red') ? '#ff8d7a' : object.color?.includes('orange') || object.color?.includes('gold') || object.color?.includes('yellow') ? '#f0c97b' : object.color?.includes('blue') ? '#87abff' : '#edf2ff'}"></span>`;
}

function scienceInsightCard(card) {
  return `
    <article class="science-insight-card mini-panel">
      <p class="eyebrow">Science insight</p>
      <h3>${card.title}</h3>
      <p>${card.body}</p>
    </article>
  `;
}

function objectLink(object) {
  return toAbsolutePath(`pages/objects/${object.id}.html`);
}

function skyLink(id) {
  return toAbsolutePath(`pages/sky-viewer.html?object=${id}`);
}

function learnTopicLink(topic) {
  return toAbsolutePath(topic.pageHref);
}

function topicChip(topic) {
  return `<a class="tag tag-link" href="${learnTopicLink(topic)}">${topic.title}</a>`;
}

function relatedObjectCard(object, eyebrow = 'Related object') {
  return `
    <article class="feature-card related-card">
      <p class="section-kicker">${eyebrow}</p>
      <h3>${object.name}</h3>
      <p>${object.summary}</p>
      <div class="catalog-meta">
        <span class="tag">${object.type}</span>
        <span>${object.constellation}</span>
        <span>${object.distance}</span>
      </div>
      <div class="stacked-links">
        <a class="text-link" href="${objectLink(object)}">Open object page</a>
        <a class="text-link" href="${skyLink(object.id)}">Explore in Sky Viewer</a>
      </div>
    </article>
  `;
}

function readingCard(card) {
  return `
    <article class="feature-card reading-card">
      <p class="section-kicker">${card.kind}</p>
      <h3>${card.title}</h3>
      <p>${card.description}</p>
      <a class="text-link" href="${card.href}">${card.label}</a>
    </article>
  `;
}

function topicCard(topic) {
  return `
    <article class="feature-card topic-card">
      <p class="section-kicker">${topic.tag}</p>
      <h3>${topic.title}</h3>
      <p>${topic.description || topic.summary}</p>
      <a class="text-link" href="${learnTopicLink(topic)}">Explore this topic</a>
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
      <div class="catalog-chip-row">${(object.relatedTopicCards || []).slice(0, 3).map(topicChip).join('')}</div>
      <div class="catalog-card-actions">
        <a class="button button-ghost" href="${objectLink(object)}">Open object page</a>
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
        <a class="button button-primary" href="${objectLink(object)}">Open full object page</a>
        <a class="button button-secondary" href="${skyLink(object.id)}">View in Sky Viewer</a>
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
        <h3>Continue on the full object page</h3>
        <p>${object.introDescription}</p>
        <div class="catalog-chip-row">${(object.relatedTopicCards || []).slice(0, 4).map(topicChip).join('')}</div>
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
      if (event?.target?.closest('.compare-toggle, [data-view-sky], a')) return;
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
  const objectOfDay = document.querySelector('[data-object-of-day]');
  if ((!card && !spotlight && !objectOfDay) || !objects.length) return;

  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), 0, 0));
  const diff = now - start;
  const day = Math.floor(diff / 86400000);
  const featured = objects[day % objects.length];
  const detailHref = objectLink(featured);
  const skyHref = skyLink(featured.id);

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
        <a class="text-link" href="${detailHref}">Open full object page</a>
        <a class="text-link" href="${skyHref}">See it in Sky Viewer</a>
      </div>
    `;
  }

  if (spotlight) {
    spotlight.innerHTML = `
      <p class="section-kicker">Today's featured object</p>
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

  if (objectOfDay) {
    objectOfDay.innerHTML = `
      <p class="section-kicker">Featured object of the day</p>
      <h2>${featured.name}</h2>
      <p>${featured.introDescription}</p>
      <div class="catalog-chip-row">${(featured.relatedTopicCards || []).slice(0, 3).map(topicChip).join('')}</div>
      <div class="stacked-links">
        <a class="text-link" href="${detailHref}">Open the object page</a>
        <a class="text-link" href="${skyHref}">Explore in the Sky Viewer</a>
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
    : 'Use the catalog like a science playground: compare nearby stars, giant evolved stars, and deep-sky regions to build intuition for scale and classification.';

  element.innerHTML = `
    <p class="eyebrow">In context</p>
    <h2>Read the catalog scientifically</h2>
    <p>${message}</p>
    <ul class="fact-list">
      <li>Nearest in view: <strong>${nearest?.name || '—'}</strong> at ${nearest?.distance || '—'}.</li>
      <li>Hottest in view: <strong>${hottest?.name || '—'}</strong> at ${formatTemperature(hottest?.temperatureK)}.</li>
      <li>Open any object page to move from a quick catalog card into a full research-and-learning view.</li>
    </ul>
  `;
}

export function renderScienceInsights(cards, element) {
  if (!element) return;
  element.innerHTML = cards.map(scienceInsightCard).join('');
}

export function renderFeaturedRegions(regions, element) {
  if (!element) return;
  element.innerHTML = regions.map((region) => `
    <article class="feature-card">
      <p class="section-kicker">Featured region</p>
      <h3>${region.title}</h3>
      <p>${region.description}</p>
      <div class="catalog-chip-row">
        ${region.objects.map((object) => `<a class="tag tag-link" href="${objectLink(object)}">${object.name}</a>`).join('')}
      </div>
    </article>
  `).join('');
}

export function renderSkyViewerPanel({ object, relatedObjects, integrationStatus, progressiveSummary }, panel) {
  panel.innerHTML = `
    <article class="detail-article">
      <p class="eyebrow">Sky Viewer focus</p>
      <h2>${object.name}</h2>
      <p>${object.skyGuide}</p>
      <div class="detail-list">
        ${object.keyFacts.map((fact) => `<div><strong>${fact.label}</strong><p>${fact.value}</p></div>`).join('')}
      </div>
      <section class="mini-panel">
        <h3>What we learn from its light</h3>
        <p>${object.whatWeLearnFromItsLight}</p>
      </section>
      <section class="mini-panel">
        <h3>Explore next</h3>
        <div class="card-grid three-up compact-grid">
          ${relatedObjects.map((related) => relatedObjectCard(related)).join('')}
        </div>
      </section>
      ${progressiveSummary ? `
        <section class="mini-panel">
          <h3>Progressive live context</h3>
          <p>${progressiveSummary.extract}</p>
        </section>` : ''}
      <section class="mini-panel">
        <h3>Future research integrations</h3>
        <ul class="fact-list">
          ${integrationStatus.map((service) => `<li><strong>${service.label}</strong>: ${service.description} <span class="text-soft">(${service.status})</span></li>`).join('')}
        </ul>
      </section>
    </article>
  `;
}

export function renderObjectPage(pageData, element) {
  const { object, relatedObjects, relatedTopics, furtherReading, researchInspiration, observeNext, featuredQuestion } = pageData;
  document.title = `${object.name} | Heavens`;

  element.innerHTML = `
    <section class="object-hero hero object-page-hero">
      <div class="container object-hero-grid">
        <div class="reveal-on-scroll is-visible">
          <p class="eyebrow">Dedicated object page</p>
          <h1>${object.name}</h1>
          <p class="hero-text">${object.introDescription}</p>
          <div class="catalog-meta">
            <span class="tag">${object.type}</span>
            <span>${object.constellation}</span>
            <span>${object.distance}</span>
          </div>
          <div class="hero-actions">
            <a class="button button-primary" href="${skyLink(object.id)}">Explore in the Sky Viewer</a>
            <a class="button button-secondary" href="${toAbsolutePath('pages/explore.html?object=' + object.id)}">Open in Explore</a>
          </div>
        </div>
        <aside class="key-fact-panel reveal-on-scroll is-visible">
          <p class="section-kicker">Key facts</p>
          <div class="fact-panel-grid">
            ${object.keyFacts.map((fact) => `<div><strong>${fact.label}</strong><p>${fact.value}</p></div>`).join('')}
          </div>
        </aside>
      </div>
    </section>

    <section class="section">
      <div class="container object-content-grid">
        <div class="object-main-column">
          <section class="reading-surface reveal-on-scroll is-visible">
            <p class="section-kicker">Introduction</p>
            <h2>${object.name} at a glance</h2>
            <p>${object.summary}</p>
            <p>${object.sizeNotes}</p>
            <div class="catalog-chip-row">${relatedTopics.map(topicChip).join('')}</div>
          </section>

          <section class="reading-surface reveal-on-scroll is-visible">
            <p class="section-kicker">What We Learn from Its Light</p>
            <h2>Light turns appearance into evidence</h2>
            <p>${object.whatWeLearnFromItsLight}</p>
            <div class="qa-callout">
              <h3>Question worth asking</h3>
              <p>${featuredQuestion?.description || 'How do astronomers transform a beautiful point of light into a measurable physical object?'}</p>
            </div>
          </section>

          <section class="reading-surface reveal-on-scroll is-visible">
            <p class="section-kicker">How It Fits in the Universe</p>
            <h2>Context matters as much as appearance</h2>
            <p>${object.howItFitsInTheUniverse}</p>
          </section>

          <section class="reading-surface reveal-on-scroll is-visible">
            <p class="section-kicker">Why Astronomers Care About It</p>
            <h2>Scientific value beyond visual appeal</h2>
            <p>${object.whyAstronomersCare}</p>
          </section>

          <section class="section-block reveal-on-scroll is-visible">
            <div class="section-heading-row">
              <div>
                <p class="section-kicker">Related reading</p>
                <h2>Further reading, research inspiration, and connected topics</h2>
              </div>
            </div>
            <div class="card-grid three-up compact-grid">
              ${[...furtherReading, ...researchInspiration].map(readingCard).join('')}
              ${relatedTopics.map(topicCard).join('')}
            </div>
          </section>
        </div>

        <aside class="object-side-column">
          <section class="mini-panel reveal-on-scroll is-visible">
            <p class="section-kicker">Observe this next</p>
            <div class="stacked-recommendations">
              ${observeNext.map((item) => `
                <article class="recommendation-card">
                  <h3>${item.title}</h3>
                  <p>${item.description}</p>
                  <a class="text-link" href="${item.href}">${item.label}</a>
                </article>
              `).join('')}
            </div>
          </section>

          <section class="mini-panel reveal-on-scroll is-visible">
            <p class="section-kicker">Related Objects</p>
            <div class="stacked-recommendations">
              ${relatedObjects.map((related) => `
                <article class="recommendation-card">
                  <h3>${related.name}</h3>
                  <p>${related.angularDistance}. ${related.summary}</p>
                  <a class="text-link" href="${objectLink(related)}">Open object page</a>
                </article>
              `).join('')}
            </div>
          </section>

          <section class="mini-panel reveal-on-scroll is-visible">
            <p class="section-kicker">If you liked this, explore…</p>
            <div class="stacked-links">
              <a class="text-link" href="${toAbsolutePath('pages/discover.html')}">Go to Discover</a>
              <a class="text-link" href="${toAbsolutePath('pages/learn.html')}">Follow a learning pathway</a>
              <a class="text-link" href="${skyLink(object.id)}">Explore in the Sky Viewer</a>
            </div>
          </section>
        </aside>
      </div>
    </section>
  `;
}

export function renderDiscoverPage({ modules, topics, objects }, element) {
  element.innerHTML = `
    <section class="container page-intro reveal-on-scroll is-visible">
      <p class="eyebrow">Discover</p>
      <h1>A science-driven hub for curiosity, questions, and research pathways.</h1>
      <p>Discover brings together featured objects, cosmic questions, spectral science, deep-sky highlights, and research-oriented prompts that can later connect to live public archives without changing the presentation layer.</p>
    </section>
    <section class="container card-grid three-up compact-grid">
      ${modules.map((module) => {
        const linkedObjects = (module.objectIds || []).map((id) => objects.find((object) => object.id === id)).filter(Boolean);
        const linkedTopics = (module.topicIds || []).map((id) => topics.find((topic) => topic.id === id)).filter(Boolean);
        return `
          <article class="feature-card reveal-on-scroll is-visible" id="${module.id}">
            <p class="section-kicker">${module.type}</p>
            <h2>${module.title}</h2>
            <p>${module.description}</p>
            <div class="catalog-chip-row">
              ${linkedObjects.map((object) => `<a class="tag tag-link" href="${objectLink(object)}">${object.name}</a>`).join('')}
              ${linkedTopics.map((topic) => `<a class="tag tag-link" href="${learnTopicLink(topic)}">${topic.title}</a>`).join('')}
            </div>
            <a class="text-link" href="${toAbsolutePath(module.ctaHref)}">${module.ctaLabel}</a>
          </article>
        `;
      }).join('')}
    </section>
    <section class="container section-block reveal-on-scroll is-visible">
      <div class="section-heading-row">
        <div>
          <p class="section-kicker">Explore by science topic</p>
          <h2>Build a connected knowledge web</h2>
        </div>
      </div>
      <div class="card-grid three-up compact-grid">
        ${topics.map(topicCard).join('')}
      </div>
    </section>
  `;
}

export function renderLearnPage({ paths, topics, startHere, objects }, element) {
  element.innerHTML = `
    <section class="container page-intro reveal-on-scroll is-visible">
      <p class="eyebrow">Learn</p>
      <h1>Guided astronomy pathways for building understanding step by step.</h1>
      <p>Learn is a self-guided science experience that connects approachable explanations with real objects from the catalog, helping the site feel like a connected astronomy curriculum rather than a collection of isolated pages.</p>
    </section>
    <section class="container highlight-banner reveal-on-scroll is-visible">
      <div>
        <p class="section-kicker">${startHere.title}</p>
        <h2>A guided beginner route into the night sky</h2>
        <p>${startHere.description}</p>
      </div>
      <div class="stacked-links">
        ${startHere.steps.map((step) => `<a class="text-link" href="${toAbsolutePath(step.href)}">${step.label}</a>`).join('')}
      </div>
    </section>
    <section class="container learning-layout">
      ${paths.map((path, index) => {
        const pathTopics = (path.relatedTopicIds || []).map((id) => topics.find((topic) => topic.id === id)).filter(Boolean);
        const examples = (path.exampleObjectIds || []).map((id) => objects.find((object) => object.id === id)).filter(Boolean);
        return `
          <article class="learning-path reading-surface reveal-on-scroll is-visible" id="path-${path.id}">
            <div class="learning-path-header">
              <div>
                <p class="section-kicker">${path.eyebrow}</p>
                <h2>${path.title}</h2>
              </div>
              <p class="learning-path-summary">${path.summary}</p>
            </div>
            <div class="educational-grid">
              ${path.sections.map((section) => `<section class="mini-panel"><h3>${section.title}</h3><p>${section.body}</p></section>`).join('')}
            </div>
            <div class="learning-links-row">
              <div>
                <h3>Related topics</h3>
                <div class="catalog-chip-row">${pathTopics.map(topicChip).join('')}</div>
              </div>
              <div>
                <h3>Example objects</h3>
                <div class="catalog-chip-row">${examples.map((object) => `<a class="tag tag-link" href="${objectLink(object)}">${object.name}</a>`).join('')}</div>
              </div>
            </div>
          </article>
        `;
      }).join('')}
    </section>
  `;
}
