# Heavens

Heavens is a polished, mobile-friendly astronomy website built as a lightweight static site for GitHub Pages. It now combines a local-first object explorer with a real sky viewing workflow powered by an embedded Aladin Lite experience.

## Project goals

- Fast static deployment with no heavy framework requirements
- Elegant cosmic visual design with accessible contrast
- Semantic HTML, organized CSS, and modular vanilla JavaScript
- Clean extension points for future astronomy APIs without breaking GitHub Pages compatibility
- Responsive layouts that work well on phones, tablets, and desktop screens

## What's new in the Sky Viewer release

- A new **Sky Viewer** page that embeds **Aladin Lite** inside the Heavens design system
- Deep-linking from Explore into Sky Viewer with URLs such as `pages/sky-viewer.html?object=andromeda-galaxy`
- Local object search that centers the viewer on a selected catalog entry and adds a marker overlay
- Rich side panels with object type, constellation, coordinates, a short science summary, nearby local objects, and integration readiness notes
- Expanded object detail dialogs with **Observed Through Light** explanations covering color, spectra, brightness, distance, motion, and composition
- A lightweight astronomy service layer for local data loading, object lookup, sky-viewer coordination, and future external adapters
- Progressive-enhancement support for lightweight external summaries, with graceful fallback when live services are unavailable
- Reusable science insight cards used across the explorer and the sky-viewer experience

## Project structure

```text
.
├── assets/
├── css/
│   └── styles.css
├── data/
│   └── objects.json
├── js/
│   ├── config.js
│   ├── data-loader.js
│   ├── main.js
│   ├── search.js
│   ├── star-renderer.js
│   ├── ui.js
│   └── services/
│       ├── external-data-service.js
│       ├── object-service.js
│       └── sky-viewer-service.js
├── pages/
│   ├── about.html
│   ├── explore.html
│   ├── science-of-starlight.html
│   ├── sky-viewer.html
│   └── star-life-cycles.html
├── index.html
└── README.md
```

## Pages

- **Home**: Hero section, rotating featured object, quick links into Explore and Sky Viewer, and premium astronomy callouts
- **Explore**: Searchable, filterable, sortable astronomy explorer with comparison tools, object detail dialogs, and Sky Viewer jump actions
- **Sky Viewer**: Embedded Aladin Lite map, local object search, marker overlays, deep links, nearby object suggestions, and future integration placeholders
- **Science of Starlight**: Educational content on spectra, color, temperature, and Doppler shifting
- **Star Life Cycles**: Introductory guide to stellar birth, evolution, and final outcomes
- **About**: Project purpose and editorial direction

## How object linking works

The object-to-sky flow is GitHub Pages friendly and relies on URL query parameters rather than server routing.

1. The Explore page renders **View in Sky Viewer** actions on catalog cards and in object detail dialogs.
2. Those actions link to `pages/sky-viewer.html?object=<id>`.
3. `js/main.js` reads the `object` query parameter on the Sky Viewer page.
4. `js/services/object-service.js` resolves the object from local data, adds parsed RA/Dec degrees, and supplies related-object lookups.
5. `js/services/sky-viewer-service.js` loads Aladin Lite progressively, centers the viewer, and drops a marker overlay on the selected object.
6. If the viewer script cannot load, the object panel still renders local coordinates and science content so the experience remains useful.

## Service layer architecture

The site is still intentionally lightweight, but the data path is now modular and ready for live astronomy integrations.

### `js/data-loader.js`
- Fetches `data/objects.json`
- Keeps local static data as the reliable foundation

### `js/services/object-service.js`
- Caches and enriches local objects
- Parses right ascension and declination into degrees
- Resolves objects by stable `id`
- Computes a small list of nearby local objects for the Sky Viewer side panel

### `js/services/sky-viewer-service.js`
- Loads Aladin Lite only when the Sky Viewer page needs it
- Injects the external stylesheet cleanly
- Creates the viewer instance and a marker overlay
- Exposes a small API for centering objects and toggling the coordinate grid

### `js/services/external-data-service.js`
- Holds progressive-enhancement logic for optional public summaries
- Provides a status list for future astronomy integrations
- Central place to add resilient adapters without coupling live services directly into UI rendering

### `js/config.js`
- Stores Sky Viewer library URLs and future API configuration stubs
- Keeps third-party integration settings in one place

## Future astronomy API integration points

The codebase includes configuration-driven placeholders for:

- **SIMBAD** for richer object metadata and identifiers
- **MAST** for archive imagery and mission-linked observations
- **ADS** for beginner-friendly literature or discovery context
- **NED** for extragalactic data and galaxy-specific context

Right now these services are intentionally represented as planned adapters. The site does not depend on them to function.

### Recommended next wiring steps

1. Create one adapter per service inside `js/services/adapters/`.
2. Normalize live responses into the same field shape used by `data/objects.json`.
3. Merge live fields into the local object model only when requests succeed.
4. Cache lightweight responses in `sessionStorage` so GitHub Pages remains fast and resilient.
5. Keep all UI panels rendering from the same normalized object schema.

## Data structure

`data/objects.json` remains the source of truth. Each object now includes both educational content and sky-linking data.

Key fields include:

- `id`: stable slug used for deep links
- `name`, `category`, `type`, `constellation`
- `distance`, `distanceLightYears`
- `spectralClass`, `color`, `apparentMagnitude`, `temperatureK`
- `summary`, `lightStory`, `importance`, `scienceFacts`
- `ra`, `dec`: coordinate strings used for sky centering
- `aladinTarget`: object-friendly lookup label for future viewer enhancements
- `observedThroughLight`: structured beginner-friendly science explanations for object detail panels
- `scienceCards`: reusable insight content attached to each object
- `skyGuide`: short guidance text for map-based exploration

## External scripts and setup notes

The project stays static-host friendly.

- The local catalog and detail views work entirely from `data/objects.json`.
- Aladin Lite is loaded client-side only on `pages/sky-viewer.html`.
- If the external script fails, the page falls back to local search, coordinates, and science panels.
- No secrets, server infrastructure, or copyrighted image packs are required.

Because JavaScript modules and local JSON are used, serve the project from a local static server during development.

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## GitHub Pages deployment

This project is designed for GitHub Pages as a static site.

1. Push the repository to GitHub.
2. In the repository settings, open **Pages**.
3. Set the deployment source to the main branch (or your preferred publishing branch) and the repository root.
4. Save and wait for GitHub Pages to publish the site.

Because navigation uses relative links, local JSON, and query-parameter deep links, the pages work cleanly in a standard GitHub Pages static deployment.

## Key implementation choices

- **Vanilla architecture**: Keeps the project lightweight, readable, and easy to host anywhere.
- **Local data first**: Makes the experience reliable even when live integrations fail.
- **Progressive enhancement**: External viewers and public summaries improve the experience without becoming a hard dependency.
- **Modular JavaScript**: Separates data loading, filtering logic, rendering, object services, and viewer integration.
- **Accessible interactions**: Includes keyboard-friendly cards, dialog focus management, reduced-motion handling, loading states, and empty states.
- **Premium visual integration**: Wraps the embedded viewer in the same surface, spacing, and typography system used elsewhere in Heavens.
