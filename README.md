# Heavens

Heavens is a polished, mobile-friendly astronomy website built as a lightweight static site for GitHub Pages. It focuses on visual exploration of stars and approachable explanations of starlight, spectra, constellations, deep-sky objects, and stellar evolution.

## Project goals

- Fast static deployment with no heavy framework requirements
- Elegant cosmic visual design with accessible contrast
- Semantic HTML, organized CSS, and modular vanilla JavaScript
- Clear educational content written for general learners
- Responsive layouts that work well on phones, tablets, and desktop screens

## What's new in the Star Explorer release

- A richer **Star Explorer** page with search, category filters, and sorting by name, distance, brightness, or object type
- A polished object detail dialog with science-focused sections including **What its light tells us** and **Why this object matters**
- A local dataset expanded to **24 real celestial objects** spanning bright stars, nearby stars, red giants and supergiants, nebulae, galaxies, clusters, and star-forming regions
- A side-by-side comparison tool for up to three selected objects
- Science-layer callouts and visual cues such as spectral labels, color indicators, and distance bars
- A homepage **Tonight's Featured Wonder** rotation powered entirely by local data and date-based logic

## Project structure

```text
.
├── assets/
├── css/
│   └── styles.css
├── data/
│   └── objects.json
├── js/
│   ├── data-loader.js
│   ├── main.js
│   ├── search.js
│   ├── star-renderer.js
│   └── ui.js
├── pages/
│   ├── about.html
│   ├── explore.html
│   ├── science-of-starlight.html
│   └── star-life-cycles.html
├── index.html
└── README.md
```

## Pages

- **Home**: Hero section, rotating featured object, lightweight SVG constellation viewer, and quick links into the explorer
- **Explore**: Searchable, filterable, sortable astronomy explorer with comparison tools and an accessible detail dialog
- **Science of Starlight**: Educational content on spectra, color, temperature, and Doppler shifting
- **Star Life Cycles**: Introductory guide to stellar birth, evolution, and final outcomes
- **About**: Project purpose and editorial direction

## How the explorer works

The explorer is intentionally local-data-first and static-host friendly.

1. `js/data-loader.js` fetches `data/objects.json`.
2. `js/search.js` filters and sorts the loaded objects.
3. `js/star-renderer.js` builds the catalog cards, detail dialog, comparison view, homepage featured object blocks, and contextual science copy.
4. `js/main.js` connects the controls, URL query state, comparison logic, and detail deep-linking.
5. `js/ui.js` handles shared UI behaviors such as navigation, reveal animations, the constellation viewer, and focus management for the dialog.

The homepage featured object uses local date rotation logic, so the featured target changes over time without any backend or external API.

## Data structure

`data/objects.json` is the source of truth for the explorer. Each object is a publishable content record that can later be mapped into API-backed results.

Each object currently uses these fields:

- `id`: stable slug used for deep links such as `pages/explore.html?object=andromeda-galaxy`
- `name`: display name
- `category`: broad explorer grouping such as `Stars`, `Nearby stars`, or `Nebulae`
- `type`: more specific object label
- `constellation`: sky location context
- `distance`: reader-friendly display string
- `distanceLightYears`: numeric distance used for sorting and visual scaling
- `spectralClass`: stellar class or `Not applicable`
- `color`: apparent color or color description
- `apparentMagnitude`: brightness field used for comparison and sorting when available
- `temperatureK`: approximate surface temperature in Kelvin when applicable
- `sizeNotes`: short scale note for comparison UI
- `summary`: concise overview copy
- `lightStory`: beginner-friendly explanation of what the object's light reveals
- `importance`: why the object matters scientifically or educationally
- `scienceFacts`: short fact list used in detail and comparison views

## How to add more celestial objects

1. Open `data/objects.json`.
2. Add a new object using the same field structure as the existing entries.
3. Choose a stable, URL-safe `id`.
4. Keep `distanceLightYears`, `apparentMagnitude`, and `temperatureK` numeric where possible so sorting and comparison continue to work.
5. Place the object into one of the current explorer categories, or add a new category if you want a new filter chip to appear automatically.
6. Write polished `summary`, `lightStory`, and `importance` copy so the detail dialog remains publishable.

Because category filters are generated from the dataset, new categories will automatically appear in the explorer controls. Because the homepage feature rotation draws from the full dataset, newly added objects can also become future featured wonders.

## Design system

The main design system lives in `css/styles.css` and uses CSS custom properties for:

- Colors and elevated surfaces
- Border radius, spacing feel, and shadows
- Motion and reduced-motion handling
- Shared components such as cards, buttons, panels, spectral pills, comparison layouts, and dialog surfaces

## Local development

Because the site uses JavaScript modules and fetches a local JSON file, run it through a local static server rather than opening the files directly in the browser.

Examples:

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

Because all navigation uses relative links and local JSON, the pages work cleanly in a standard GitHub Pages static deployment.

## Key implementation choices

- **Vanilla architecture**: Keeps the project lightweight, readable, and easy to host anywhere.
- **Local data first**: Makes the experience reliable on GitHub Pages while leaving a clean path to future live astronomy APIs.
- **Modular JavaScript**: Separates data loading, filtering logic, rendering, and shared UI helpers.
- **Accessible interactions**: Includes skip links, keyboard-friendly cards, a focus-managed dialog, semantic landmarks, and reduced-motion support.
- **CSS-generated atmosphere**: Uses gradients, stars, glow effects, and SVG rather than external copyrighted images.
- **Educational polish**: Favors concise, publishable copy over placeholder content.
