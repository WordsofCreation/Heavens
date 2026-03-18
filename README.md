# Heavens

Heavens is a polished, mobile-friendly astronomy platform built as a lightweight static site for GitHub Pages. It now combines a local-first object explorer, dedicated object pages, a discovery hub, guided science learning pathways, an embedded sky-viewing workflow, and a new flagship immersive layer: **Observatory Mode**.

## Project goals

- Fast static deployment with no heavy framework requirements
- Elegant cosmic visual design with accessible contrast and long-form reading comfort
- Semantic HTML, organized CSS, and modular vanilla JavaScript
- Local content as the stable baseline, with clean extension points for future astronomy APIs
- Responsive layouts that work well on phones, tablets, and desktop screens
- A connected knowledge architecture that links objects, science topics, guided journeys, regions, and research prompts

## What's new in the Observatory Mode release

- **Observatory Mode** at `pages/observatory.html`: a lightweight immersive night-sky experience with a canvas starfield, hotspot-based object discovery, journey filters, and elegant science-rich focus panels
- A richer **homepage** that immediately frames Heavens as a modern observatory for the web, with direct entry points into sky exploration, starlight, stellar life cycles, and scientific interpretation
- A reusable **guided discovery model** for journeys such as brightest stars, stars by color, winter sky tracing, naked-eye favorites, and a “follow the light” style science sequence
- A reusable **constellation / sky region layer** for regions like Orion, Lyra, Ursa Minor, and Andromeda
- A premium **object focus experience** inside Observatory Mode with smooth camera transitions, visual glow markers, distance bars, fact grids, and related science-topic links
- More integrated **science storytelling modules** that keep short explanatory panels close to the exploratory interface
- Deep-link friendly observatory URLs using query parameters like `?object=sirius&journey=brightest-stars`

## Project structure

```text
.
├── assets/
├── css/
│   └── styles.css
├── data/
│   ├── objects.json
│   └── science-content.json
├── js/
│   ├── config.js
│   ├── data-loader.js
│   ├── main.js
│   ├── path-utils.js
│   ├── search.js
│   ├── star-renderer.js
│   ├── ui.js
│   └── services/
│       ├── external-data-service.js
│       ├── object-service.js
│       ├── observatory-service.js
│       ├── science-content-service.js
│       └── sky-viewer-service.js
├── pages/
│   ├── about.html
│   ├── discover.html
│   ├── explore.html
│   ├── learn.html
│   ├── observatory.html
│   ├── objects/
│   │   └── *.html
│   ├── science-of-starlight.html
│   ├── sky-viewer.html
│   └── star-life-cycles.html
├── scripts/
│   └── generate-object-pages.mjs
├── index.html
└── README.md
```

## Pages

- **Home**: Premium landing page with rotating featured object, observatory invitation, educational pathways, and discovery entry points
- **Observatory Mode**: Stylized immersive sky experience with hotspot discovery, guided journeys, storytelling cards, and constellation-region context
- **Explore**: Searchable, filterable, sortable astronomy explorer with comparison tools and object-detail dialogs
- **Discover**: Science-driven hub for curated features, research prompts, topic discovery, and future archive integration hooks
- **Learn**: Guided learning pathways that connect short educational sections with real catalog objects
- **Object pages**: Dedicated long-form pages for each object with key facts, science sections, related reading, related objects, and Sky Viewer links
- **Sky Viewer**: Embedded Aladin Lite map with local object search, marker overlays, and science context panels
- **Science of Starlight**: Focused educational page on spectra, color, and measurement
- **Star Life Cycles**: Focused educational page on stellar formation, evolution, and endings
- **About**: Project purpose and editorial philosophy

## What Observatory Mode is

Observatory Mode is Heavens' “modern observatory for the web” layer. It is intentionally **not** a full planetarium engine or a Stellarium clone.

Instead, it offers a curated and immersive way to:

- move through a stylized sky field
- focus famous stars and deep-sky landmarks
- follow guided educational routes
- connect object selection to story-led science
- step from wonder into beginner-friendly interpretation

The experience is built to feel calm, premium, and educational rather than technical or game-like.

## How the immersive sky experience is structured

Observatory Mode is rendered from three cooperating layers:

1. **Markup layer** in `pages/observatory.html`
   - provides the static page shell
   - keeps the experience GitHub Pages friendly
   - ensures graceful fallback if script enhancements fail

2. **Rendering layer** in `js/star-renderer.js`
   - outputs the observatory hero
   - builds the canvas stage shell, story panels, journey controls, and constellation-region cards
   - keeps UI composition separate from interaction state

3. **Interaction layer** in `js/main.js`
   - initializes the observatory page
   - reads URL query parameters
   - manages active object, journey, and filter state
   - animates a lightweight camera across the canvas sky
   - updates hotspots, journey panels, and object focus cards

The sky itself is intentionally stylized:

- the canvas paints a premium starfield backdrop and object glows
- HTML hotspot buttons sit above the canvas for accessibility and reliable interaction
- the camera “refocuses” on objects through a simple animated coordinate system rather than a full astrophysical simulation

This keeps the experience immersive while staying lightweight.

## How guided journeys are modeled

Guided journeys are defined in `js/services/observatory-service.js` as reusable content objects. Each journey includes:

- `id`: stable identifier for linking and URL state
- `title` and `eyebrow`: display framing
- `description`: concise educational premise
- `theme`: supporting label for the UI
- `accent`: visual treatment for the journey card
- `objectIds`: ordered object sequence for the route
- `steps`: short narrative guidance shown inside the observatory

Current journeys include:

- brightest stars
- stars by color
- how light becomes knowledge
- winter sky tracing
- naked-eye favorites

To add a new journey:

1. Open `js/services/observatory-service.js`
2. Add a new entry to the `JOURNEYS` array
3. Reference existing catalog object ids in `objectIds`
4. Write real educational copy for `description` and `steps`
5. Reload the site; the journey appears automatically in Observatory Mode

## How object focus panels work

The object focus experience combines data from the catalog with observatory-specific UI behavior.

### Data source

`data/objects.json` still holds the source catalog facts:

- object name and id
- type and category
- constellation
- distance and numeric distance scale
- spectral class
- color and temperature notes
- summary, importance, and light story
- science facts and coordinates

### Derived object content

`js/services/object-service.js` enriches catalog entries with:

- topic relationships
- sky-coordinate parsing
- introductory and science narrative sections
- key facts
- related object ids
- further reading and research prompts

### Observatory presentation

`js/main.js` then turns the selected object into a premium focus card showing:

- object name
- type
- constellation
- distance
- spectral class
- color / temperature note
- why the object matters
- what its light reveals
- related science links
- distance bar and “fame” style badges

The corresponding hotspot glows in the sky layer, and the camera gently transitions toward it unless reduced motion is requested.

## Constellation and region modeling

Constellation / region cards are defined in `js/services/observatory-service.js` via the `CONSTELLATION_REGIONS` array.

Each region stores:

- `id`
- `name`
- `title`
- `note`
- `cultural`
- `objectIds`

This makes it easy to add new sky neighborhoods later without changing the overall architecture.

To add a new region:

1. Add a region entry to `CONSTELLATION_REGIONS`
2. Point it at valid object ids from `data/objects.json`
3. Write one concise scientific note and one concise cultural / orientation note
4. Reload the observatory page

## Science storytelling modules

Short storytelling cards in Observatory Mode are also managed in `js/services/observatory-service.js` via `STORY_PANELS`.

These modules support themes like:

- what your eyes are seeing
- what astronomers measure
- how light becomes knowledge
- why stars have different colors
- why some stars die in explosions
- what distance means in astronomy

Because they are content-first objects rather than hardcoded DOM fragments in the page HTML, new panels can be added or reordered easily.

## How related content is modeled across the site

The content model is intentionally split into layers.

### `data/objects.json`
Core astronomy object data:
- stable ids
- type/category/constellation/distance
- spectral class, color, magnitude, temperature
- summary, importance, light story, science facts
- sky coordinates and Sky Viewer targeting fields

### `data/science-content.json`
Cross-site editorial and educational content:
- `discoverModules`
- `topics`
- `learningPaths`
- `startHere`

### `js/services/observatory-service.js`
Curated observatory content:
- `JOURNEYS`
- `STORY_PANELS`
- `CONSTELLATION_REGIONS`
- stylized sky-node layout data

### Derived relationships in `js/services/object-service.js`
At runtime the service derives:
- `scienceTopicIds`
- `relatedTopicCards`
- `introDescription`
- `whatWeLearnFromItsLight`
- `howItFitsInTheUniverse`
- `whyAstronomersCare`
- `relatedObjectIds`
- `furtherReading`
- `researchInspiration`
- `observeNext`
- `keyFacts`

This keeps raw data clean while still supporting immersive presentation and strong internal linking.

## How to add new featured objects

To add a new featured object to the broader Heavens system:

1. Add the object to `data/objects.json`
2. If needed, regenerate static object pages with:
   ```bash
   node scripts/generate-object-pages.mjs
   ```
3. Add the object id to any of the following as appropriate:
   - `JOURNEYS` in `js/services/observatory-service.js`
   - `CONSTELLATION_REGIONS` in `js/services/observatory-service.js`
   - `discoverModules` in `data/science-content.json`
   - `learningPaths.exampleObjectIds` in `data/science-content.json`

## How the object-page system works

The object-page layer is fully static and GitHub Pages compatible.

1. `data/objects.json` stores the core object catalog.
2. `data/science-content.json` stores discovery modules, learning pathways, topic metadata, and beginner routing.
3. `js/services/object-service.js` enriches each object with derived science-topic links, narrative sections, reading cards, research prompts, and observe-next recommendations.
4. `scripts/generate-object-pages.mjs` creates one static HTML file per object inside `pages/objects/`.
5. Each generated page sets `data-page="object-detail"` and `data-object-id="<id>"` on the `<body>`.
6. `js/main.js` detects the object-detail page type and asks `getObjectPageData(id)` for all content needed to render it.
7. `js/star-renderer.js` builds the premium object page UI.

Because the pages are pre-generated and use relative links, they publish cleanly on GitHub Pages without custom routing.

## How learning pathways are structured

`data/science-content.json` contains a `learningPaths` array. Each pathway includes:

- `id`: stable anchor used for direct linking such as `pages/learn.html#path-understanding-starlight`
- `title`, `eyebrow`, and `summary`: the high-level framing
- `sections`: short approachable teaching blocks
- `relatedTopicIds`: links back into the science-topic layer
- `exampleObjectIds`: links directly to dedicated object pages

`js/services/science-content-service.js` loads this content, and `js/star-renderer.js` renders it into the Learn page. This keeps the educational copy separate from the UI code while making it easy to add more pathways later.

## Performance and accessibility considerations

Heavens keeps Observatory Mode lightweight and resilient by design.

### Performance

- No heavy SPA framework is introduced
- The observatory sky uses a single canvas plus lightweight HTML overlays
- Content remains local-first and static-host friendly
- Optional live integrations remain progressive enhancement, not required functionality
- Query-parameter deep links work without a router or backend

### Accessibility

- Navigation and core interaction remain keyboard reachable through HTML buttons and links
- A skip link is included on every page
- Reduced-motion users get immediate camera transitions and no reliance on animation for comprehension
- Observatory hotspots remain accessible as regular buttons layered over the canvas
- The site preserves readable contrast, semantic headings, and responsive layouts
- If optional enhancements fail, the static shell and local content still provide meaningful navigation and reading surfaces

## Development notes

Because JavaScript modules and local JSON are used, serve the project from a local static server during development.

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

### Regenerating object pages

If you add or remove objects in `data/objects.json`, regenerate the static detail pages:

```bash
node scripts/generate-object-pages.mjs
```

## GitHub Pages deployment

This project is designed for GitHub Pages as a static site.

1. Push the repository to GitHub.
2. In the repository settings, open **Pages**.
3. Set the deployment source to the main branch (or your preferred publishing branch) and the repository root.
4. Save and wait for GitHub Pages to publish the site.

Because navigation uses relative links, generated static pages, local JSON, and query-parameter deep links, the site works cleanly in a standard GitHub Pages deployment.

## Key implementation choices

- **Vanilla architecture**: keeps the project lightweight, readable, and easy to host anywhere
- **Local content first**: makes the experience reliable even when live integrations fail
- **Generated object pages**: delivers dedicated URLs without introducing a framework router
- **Immersive but curated observatory design**: adds wonder and motion without building a heavy planetarium engine
- **Knowledge web linking**: connects objects, topics, journeys, regions, and learning paths
- **Progressive enhancement**: external summaries and future research integrations can improve the experience without becoming a hard dependency
- **Accessible interactions**: includes keyboard-friendly controls, dialog focus management, reduced-motion handling, and strong reading hierarchy
- **Premium visual integration**: uses one cohesive cosmic design language across homepage, explorer, observatory, object pages, and science storytelling

## What's new in the Cross-Experience Integration release

- **Unified object context handoff** across Explore, object pages, Observatory Mode, and Sky Viewer using static-friendly query parameters plus a shared local state helper in `js/services/journey-state-service.js`
- **Observatory Mode entry points** from Explore cards, detail panels, related-object modules, and dedicated object pages so object focus can carry through with intent-preserving links
- **Observatory → Sky Viewer handoff** that opens the real-sky map with the same target object and source context already selected when possible
- **Persistent journey continuity** for the last object, recent objects, selected comparisons, current observatory journey, last-used mode, and active learning path, with graceful fallback when storage is unavailable
- **Compact stellar-class comparison visualization** reused across object pages, comparison views, Sky Viewer panels, and quick detail overlays
- **Homepage resume card** that helps visitors continue a prior discovery session without requiring a backend or SPA router

## How Observatory Mode links to Sky Viewer

Observatory Mode now acts as the immersive discovery layer, while Sky Viewer acts as the explicit real-sky context layer.

- Focus an object in Observatory Mode.
- Use the focus panel's **Open in Sky Viewer** action.
- The site passes the selected object through the URL, preserving journey/source context such as `object`, `journey`, `from`, and optional region hints.
- Sky Viewer reads that context on load, restores the same target object, centers the viewer when Aladin Lite is available, and still shows the local science panel if the live map cannot load.

This keeps the transition understandable, accessible, and compatible with GitHub Pages because it relies on stable static URLs rather than server-side routing.

## How object-context handoff works

Cross-page object handoff uses two cooperating layers:

1. **URL-level deep links**
   - Built by `buildCrossLinks()` in `js/services/journey-state-service.js`
   - Produces GitHub Pages friendly links for Explore, Observatory Mode, Sky Viewer, and object pages
   - Encodes lightweight context through query parameters such as:
     - `object`: stable object id
     - `journey`: active guided observatory journey
     - `from`: source surface such as Explore, Observatory Mode, object page, or resume card
     - `region`: optional observatory sky-region context

2. **Unified persisted object context**
   - Stored through `rememberObject()` in `js/services/journey-state-service.js`
   - Preserves a normalized object record containing identity, display name, alt names, category, constellation, spectral data, temperature, distance, coordinate labels, related objects, science links, and route hints

If persistence is unavailable, the URL still carries enough information for a clean handoff.

## How journey persistence works

Journey continuity is intentionally lightweight and privacy-respectful.

### Storage approach

- Primary persistence: `localStorage`
- Graceful fallback: in-memory state for the current page session only
- No backend, account system, or tracking dependency required

### Stored fields

The shared state model currently preserves:

- `lastObject`
- `recentObjects`
- `comparisonSelections`
- `activeJourney`
- `learningPath`
- `lastMode`
- `skyRegion`
- `lastSource`
- `updatedAt`

### Behavioral goals

- Users can move from Explore to Observatory Mode to Sky Viewer without losing the selected object
- Guided journeys can survive navigation away from Observatory Mode
- Learning-path context can follow object-page visits and resume from the Learn page
- The homepage can render a **Resume your journey** card when meaningful state exists
- If storage is blocked, pages still load correctly and simply fall back to URL-driven navigation

## How the stellar-class comparison visualization is structured

The compact comparison component is rendered by `spectralClassComparison()` in `js/star-renderer.js`.

It is designed to be educational without becoming a dense scientific chart.

### Included cues

- a broad **O–M spectral sequence bar**
- a **marker** showing where the focused object sits when a stellar class exists
- **temperature context**
- a **color cue** tied to the site's object accent palette
- a short **scale / lifecycle hint** based on the object's size notes
- a **Sun comparison label** so users have a familiar reference

### Where it appears

- Explore detail panels
- comparison cards
- Sky Viewer focus panels
- dedicated object pages

## Unified object state model

The unified object context model is assembled from catalog data enriched in `js/services/object-service.js` and normalized in `js/services/journey-state-service.js`.

The normalized context includes:

- `id`
- `name`
- `altNames`
- `category`
- `type`
- `constellation`
- `spectralClass`
- `color`
- `temperatureK`
- `distance`
- `distanceLightYears`
- `coordinates`
- `relatedObjectIds`
- `scienceTopicIds`
- `learningLinks`
- `routeHints`

This gives the site one lightweight object payload that can be shared across immersive, informational, comparative, and educational surfaces without introducing a heavy centralized framework.

## How to add new cross-linked objects and journey-aware content

### Add a new cross-linked object

1. Add the object's source data to `data/objects.json`.
2. Ensure it has a stable `id`, `name`, sky coordinates, category, type, distance, summary, and science notes.
3. If it should appear in Observatory Mode, add a layout position in `buildSkyNodes()` inside `js/services/observatory-service.js`.
4. Add or regenerate the object's static page in `pages/objects/`.
5. The shared object enrichment in `js/services/object-service.js` and route generation in `js/services/journey-state-service.js` will automatically make it available to cross-experience handoffs.

### Add a new guided or journey-aware route

1. Add a new journey to `JOURNEYS` in `js/services/observatory-service.js`.
2. Reference valid object ids in `objectIds`.
3. Write short explanatory `steps` and a concise `description`.
4. Link related learn/discover content where appropriate.
5. The journey can then persist through `setActiveJourney()` and be resumed from linked pages or the homepage resume card.

