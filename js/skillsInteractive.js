document.addEventListener('DOMContentLoaded', () => {
  const section = document.getElementById('skill');
  if (!section) return;

  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const cards = Array.from(section.querySelectorAll('.skill-card'));
  const tags = Array.from(section.querySelectorAll('.skill-tag'));

  // Make tags keyboard accessible without changing markup.
  tags.forEach((tag) => {
    if (!tag.hasAttribute('tabindex')) tag.setAttribute('tabindex', '0');
    tag.setAttribute('role', 'button');
    tag.setAttribute('aria-pressed', 'false');
  });

  // Entrance animation (IntersectionObserver) using the same style as your other fades.
  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealTargets = [...cards, ...tags];
    revealTargets.forEach((el) => el.classList.add('skill-reveal'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target;
          // Stagger based on DOM order for a nice cascade.
          const idx = revealTargets.indexOf(el);
          el.style.transitionDelay = `${Math.min(idx * 35, 280)}ms`;
          el.classList.add('is-visible');
          observer.unobserve(el);
        });
      },
      { threshold: 0.15 }
    );

    revealTargets.forEach((el) => observer.observe(el));
  }

  // Click / keyboard toggle to highlight a skill.
  const clearActive = () => {
    tags.forEach((t) => {
      t.classList.remove('is-active');
      t.setAttribute('aria-pressed', 'false');
    });
  };

  const setActive = (tag) => {
    const alreadyActive = tag.classList.contains('is-active');
    clearActive();
    if (!alreadyActive) {
      tag.classList.add('is-active');
      tag.setAttribute('aria-pressed', 'true');
    }
  };

  tags.forEach((tag) => {
    tag.addEventListener('click', () => setActive(tag));
    tag.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setActive(tag);
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        clearActive();
      }
    });
  });

  // Click anywhere outside tags in the Skills section to clear.
  section.addEventListener('click', (e) => {
    if (e.target && e.target.closest && e.target.closest('.skill-tag')) return;
    clearActive();
  });
});
