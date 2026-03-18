# Heavens

Heavens is a polished, mobile-friendly astronomy website built as a lightweight static site for GitHub Pages. It focuses on visual exploration of stars and approachable explanations of starlight, spectra, constellations, deep-sky objects, and stellar evolution.

## Project goals

- Fast static deployment with no heavy framework requirements
- Elegant cosmic visual design with accessible contrast
- Semantic HTML, organized CSS, and modular vanilla JavaScript
- Clear educational content written for general learners
- Responsive layouts that work well on phones, tablets, and desktop screens

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

- **Home**: Hero section, mission statement, featured learning paths, featured object card, and a lightweight SVG constellation viewer
- **Explore**: Searchable and filterable astronomy catalog with a modal detail panel
- **Science of Starlight**: Educational content on spectra, color, temperature, and Doppler shifting
- **Star Life Cycles**: Introductory guide to stellar birth, evolution, and final outcomes
- **About**: Project purpose and editorial direction

## Design system

The main design system lives in `css/styles.css` and uses CSS custom properties for:

- Colors and elevated surfaces
- Border radius, spacing feel, and shadows
- Motion and reduced-motion handling
- Shared components such as cards, buttons, panels, and navigation

## Data model

`data/objects.json` contains starter astronomy entries. Each object includes:

- `name`
- `type`
- `constellation`
- `distance`
- `spectralClass`
- `description`

The starter release includes 12 real objects: the Sun, bright stars, supergiants, the Orion Nebula, and the Andromeda Galaxy.

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

Because all navigation uses relative links, the pages work cleanly in a standard GitHub Pages static deployment.

## Key implementation choices

- **Vanilla architecture**: Keeps the project lightweight, readable, and easy to host anywhere.
- **Modular JavaScript**: Separates data loading, filtering logic, UI helpers, and rendering.
- **Accessible interactions**: Includes skip links, keyboard-friendly cards, semantic landmarks, and reduced-motion support.
- **CSS-generated atmosphere**: Uses gradients, stars, glow effects, and SVG rather than external images.
- **Educational first release**: Favors clear, publishable copy over placeholder text or unfinished mock content.
