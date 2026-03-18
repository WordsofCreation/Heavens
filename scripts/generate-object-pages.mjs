import fs from 'node:fs';

const objects = JSON.parse(fs.readFileSync(new URL('../data/objects.json', import.meta.url), 'utf8'));
const outDir = new URL('../pages/objects/', import.meta.url);

const nav = `
      <header class="site-header">
        <div class="container nav-wrap">
          <a class="brand" href="../../index.html" aria-label="Heavens home">
            <span class="brand-mark">✦</span>
            <span class="brand-text">Heavens</span>
          </a>
          <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
            <span class="sr-only">Toggle navigation</span>
            <span></span><span></span><span></span>
          </button>
          <nav id="site-nav" class="site-nav" aria-label="Primary navigation">
            <a href="../../index.html">Home</a>
            <a href="../explore.html">Explore</a>
            <a href="../discover.html">Discover</a>
            <a href="../learn.html">Learn</a>
            <a href="../sky-viewer.html">Sky Viewer</a>
            <a href="../science-of-starlight.html">Science of Starlight</a>
            <a href="../star-life-cycles.html">Star Life Cycles</a>
            <a href="../about.html">About</a>
          </nav>
        </div>
      </header>`;

const footer = `
      <footer class="site-footer">
        <div class="container footer-grid">
          <div>
            <a class="brand brand-footer" href="../../index.html">Heavens</a>
            <p>An elegant astronomy platform connecting visual exploration, science learning, and research curiosity.</p>
          </div>
          <div>
            <p class="footer-heading">Continue exploring</p>
            <ul>
              <li><a href="../discover.html">Discover</a></li>
              <li><a href="../learn.html">Learn</a></li>
              <li><a href="../sky-viewer.html">Sky Viewer</a></li>
            </ul>
          </div>
          <div>
            <p class="footer-heading">Object pages</p>
            <p>Generated from local structured data so each object has a stable, GitHub Pages friendly URL.</p>
          </div>
        </div>
      </footer>`;

for (const object of objects) {
  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${object.name} | Heavens</title>
    <meta name="description" content="Study ${object.name} with a premium Heavens object page covering its light, cosmic context, related objects, and learning links." />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />
    <link rel="icon" href="../../assets/favicon.svg" type="image/svg+xml" />
    <link rel="stylesheet" href="../../css/styles.css" />
  </head>
  <body data-page="object-detail" data-object-id="${object.id}">
    <a class="skip-link" href="#main-content">Skip to content</a>
    <div class="site-shell">
${nav}
      <main id="main-content">
        <div id="object-page-content"></div>
      </main>
${footer}
    </div>
    <script type="module" src="../../js/main.js"></script>
  </body>
</html>`;
  fs.writeFileSync(new URL(`${object.id}.html`, outDir), html);
}
