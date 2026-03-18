# Heavens

Heavens is a polished, mobile-friendly astronomy platform built as a lightweight static site for GitHub Pages. It now combines a local-first object explorer, dedicated object pages, a discovery hub, guided science learning pathways, and an embedded sky-viewing workflow.

## Project goals

- Fast static deployment with no heavy framework requirements
- Elegant cosmic visual design with accessible contrast and long-form reading comfort
- Semantic HTML, organized CSS, and modular vanilla JavaScript
- Local content as the stable baseline, with clean extension points for future astronomy APIs
- Responsive layouts that work well on phones, tablets, and desktop screens
- A connected knowledge architecture that links objects, science topics, and research prompts

## What's new in the Science Discovery and Research release

- **Dedicated object pages** for every catalog object, generated into stable GitHub Pages friendly URLs such as `pages/objects/sirius.html`
- A new **Discover** hub with featured star, spectral spotlight, stellar lifecycle focus, cosmic question, deep-sky feature, and research spotlight modules
- A new **Learn** hub with guided pathways for starlight, classification, stellar evolution, distances, sky navigation, and astronomical method
- Stronger internal linking between object pages, learning topics, discovery modules, Explore, and Sky Viewer
- Reusable content modules for science insight cards, related object cards, key fact panels, Q&A callouts, and observe-next recommendations
- A richer homepage that surfaces object-of-the-day, learning entry points, science-topic exploration, and a deeper project mission
- A cleaner local content model that separates object data from learning/discovery content while keeping both static-friendly and extensible

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
│       ├── science-content-service.js
│       └── sky-viewer-service.js
├── pages/
│   ├── about.html
│   ├── discover.html
│   ├── explore.html
│   ├── learn.html
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

- **Home**: Premium landing page with rotating featured object, learning entry points, discovery entry points, and platform mission
- **Explore**: Searchable, filterable, sortable astronomy explorer with comparison tools and object-detail dialogs
- **Discover**: Science-driven hub for curated features, research prompts, topic discovery, and future archive integration hooks
- **Learn**: Guided learning pathways that connect short educational sections with real catalog objects
- **Object pages**: Dedicated long-form pages for each object with key facts, science sections, related reading, related objects, and Sky Viewer links
- **Sky Viewer**: Embedded Aladin Lite map with local object search, marker overlays, and science context panels
- **Science of Starlight**: Focused educational page on spectra, color, and measurement
- **Star Life Cycles**: Focused educational page on stellar formation, evolution, and endings
- **About**: Project purpose and editorial philosophy

## How the object-page system works

The object-page layer is fully static and GitHub Pages compatible.

1. `data/objects.json` stores the core object catalog.
2. `data/science-content.json` stores discovery modules, learning pathways, topic metadata, and beginner routing.
3. `js/services/object-service.js` enriches each object with derived science-topic links, narrative sections, reading cards, research prompts, and observe-next recommendations.
4. `scripts/generate-object-pages.mjs` creates one static HTML file per object inside `pages/objects/`.
5. Each generated page sets `data-page="object-detail"` and `data-object-id="<id>"` on the `<body>`.
6. `js/main.js` detects the object-detail page type and asks `getObjectPageData(id)` for all content needed to render it.
7. `js/star-renderer.js` builds the premium object page UI, including:
   - object name
   - object type
   - constellation
   - approximate distance
   - spectral class when applicable
   - color and temperature notes
   - introductory description
   - “What We Learn from Its Light”
   - “How It Fits in the Universe”
   - “Why Astronomers Care About It”
   - “Related Objects”
   - “Explore in the Sky Viewer”
   - related reading, research inspiration, and topic cards

Because the pages are pre-generated and use relative links, they publish cleanly on GitHub Pages without custom routing.

## How learning pathways are structured

`data/science-content.json` contains a `learningPaths` array. Each pathway includes:

- `id`: stable anchor used for direct linking such as `pages/learn.html#path-understanding-starlight`
- `title`, `eyebrow`, and `summary`: the high-level framing
- `sections`: short approachable teaching blocks
- `relatedTopicIds`: links back into the science-topic layer
- `exampleObjectIds`: links directly to dedicated object pages

`js/services/science-content-service.js` loads this content, and `js/star-renderer.js` renders it into the Learn page. This keeps the educational copy separate from the UI code while making it easy to add more pathways later.

## How related content is modeled

The content model is intentionally split into two layers:

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

This design keeps the raw data clean while still allowing rich object pages and strong internal linking.

## Discovery and research organization

The **Discover** page is powered by `discoverModules` in `data/science-content.json`. Each module can reference:

- one or more object ids
- one or more topic ids
- a display type
- a title and description
- a CTA label and href

That means the current release uses curated local science content first, but future public integrations can slot in behind the same cards.

## Future research/data integration points

The codebase still keeps local content as the stable baseline, but it now has clearer connection points for public research services.

### Current lightweight extension points
- `js/services/external-data-service.js`: progressive enhancement for optional live summaries
- `js/services/object-service.js`: object normalization and derived relation building
- `js/services/science-content-service.js`: discovery/learning content loading
- `js/star-renderer.js`: reusable card rendering that can accept local or normalized live content

### Recommended next integration locations
- Add archive adapters under `js/services/adapters/`
- Normalize external ADS, MAST, NED, or SIMBAD responses into the same card schema used by object pages and Discover
- Merge live research cards only when requests succeed
- Keep all external calls as optional progressive enhancement so GitHub Pages remains fully functional without them

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

Because navigation uses relative links, generated static pages, local JSON, and query-parameter Sky Viewer deep links, the site works cleanly in a standard GitHub Pages deployment.

## Key implementation choices

- **Vanilla architecture**: Keeps the project lightweight, readable, and easy to host anywhere.
- **Local content first**: Makes the experience reliable even when live integrations fail.
- **Generated object pages**: Delivers dedicated URLs without introducing a framework router.
- **Knowledge web linking**: Connects objects, topics, discovery prompts, and learning paths.
- **Progressive enhancement**: External summaries and future research integrations can improve the experience without becoming a hard dependency.
- **Accessible interactions**: Includes keyboard-friendly cards, dialog focus management, reduced-motion handling, loading states, and strong reading hierarchy.
- **Premium visual integration**: Uses the same cosmic design language across catalog views, long-form pages, discovery modules, and learning pathways.
