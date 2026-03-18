export function setupNavigation() {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    nav.classList.toggle('is-open');
  });

  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  nav.querySelectorAll('a').forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (href.endsWith(currentPath) || (currentPath === '' && href.endsWith('index.html'))) {
      link.classList.add('is-active');
    }
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

export function setupRevealAnimations() {
  const items = document.querySelectorAll('.reveal-on-scroll');
  if (!items.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((item) => observer.observe(item));
}

export function buildConstellationViewer() {
  const lineGroup = document.querySelector('.constellation-lines');
  const starGroup = document.querySelector('.constellation-stars');
  if (!lineGroup || !starGroup) return;

  const stars = [
    { x: 42, y: 142, r: 2.5 },
    { x: 96, y: 98, r: 4 },
    { x: 142, y: 118, r: 3 },
    { x: 180, y: 74, r: 4.5 },
    { x: 214, y: 128, r: 2.6 },
    { x: 262, y: 96, r: 3.6 }
  ];

  stars.slice(0, -1).forEach((star, index) => {
    const next = stars[index + 1];
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', star.x);
    line.setAttribute('y1', star.y);
    line.setAttribute('x2', next.x);
    line.setAttribute('y2', next.y);
    lineGroup.appendChild(line);
  });

  stars.forEach((star) => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', star.x);
    circle.setAttribute('cy', star.y);
    circle.setAttribute('r', star.r);
    starGroup.appendChild(circle);
  });
}

export function trapDialogFocus(dialog, closeButton) {
  if (!dialog || !closeButton) return;

  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      dialog.close();
      return;
    }

    if (event.key !== 'Tab') return;
    const focusable = [...dialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter(
      (element) => !element.hasAttribute('disabled')
    );
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  dialog.addEventListener('close', () => closeButton.blur());
}
