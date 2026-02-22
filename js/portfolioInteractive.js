document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('#portfolio .portfolio-container');
  if (!container) return;

  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = Array.from(container.querySelectorAll('.portfolio-item'));

  // Add a subtle reveal animation (similar energy to your other sections).
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    items.forEach((item) => {
      item.classList.add('portfolio-reveal');
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const idx = items.indexOf(el);
          el.style.transitionDelay = `${Math.min(idx * 45, 320)}ms`;
          el.classList.add('is-visible');
          observer.unobserve(el);
        });
      },
      { threshold: 0.12 }
    );

    items.forEach((item) => observer.observe(item));
  }

  // Make project cards keyboard friendly: pressing Enter opens the GitHub link.
  items.forEach((item) => {
    const link = item.querySelector('a[href]');
    if (!link) return;

    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'group');
    item.setAttribute('aria-label', `Project: ${item.querySelector('h5')?.textContent || 'Link'}`);

    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        link.click();
      }
    });
  });
});
