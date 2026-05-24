/*
 * Reusable scroll-reveal engine.
 * Replaces fadein.js, portfolioFade.js, qualificationFade.js with a single
 * declarative system driven by data-attributes.
 *
 *   <div data-reveal>...</div>                     // default fade-up
 *   <div data-reveal="fade-in">...</div>           // variant
 *   <div data-reveal="slide-left" data-reveal-delay="120">...</div>
 *
 *   <div data-reveal-group="80">                   // children stagger by 80ms
 *     <div data-reveal>child</div>
 *     <div data-reveal>child</div>
 *   </div>
 *
 * Variants supported (see premium.css):
 *   fade-up (default), fade-in, slide-left, slide-right, scale
 *
 * Honors prefers-reduced-motion: elements appear instantly without animation.
 */
(() => {
  const prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const SELECTOR = '[data-reveal]';
  const GROUP_SELECTOR = '[data-reveal-group]';

  const prep = (el) => {
    if (el.dataset.revealReady) return;
    const variant = el.getAttribute('data-reveal') || 'fade-up';
    el.classList.add('reveal');
    el.classList.add(`reveal--${variant}`);
    el.dataset.revealReady = '1';
  };

  const computeDelay = (el) => {
    // Explicit per-element delay wins.
    const explicit = parseInt(el.getAttribute('data-reveal-delay') || '', 10);
    if (!isNaN(explicit)) return explicit;

    // Otherwise inherit a stagger from the nearest [data-reveal-group="<ms>"].
    const group = el.closest(GROUP_SELECTOR);
    if (!group) return 0;

    const step = parseInt(group.getAttribute('data-reveal-group') || '80', 10) || 80;
    const siblings = Array.from(group.querySelectorAll(SELECTOR)).filter(
      (n) => n.closest(GROUP_SELECTOR) === group
    );
    const idx = siblings.indexOf(el);
    if (idx < 0) return 0;
    // Cap the stagger so long lists don't drag on.
    return Math.min(idx * step, 600);
  };

  const reveal = (el) => {
    const delay = computeDelay(el);
    if (delay > 0) el.style.transitionDelay = `${delay}ms`;
    // rAF makes the transition reliably fire after the class change.
    requestAnimationFrame(() => el.classList.add('is-visible'));
  };

  const init = () => {
    const targets = Array.from(document.querySelectorAll(SELECTOR));
    if (!targets.length) return;

    targets.forEach(prep);

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          reveal(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach((el) => observer.observe(el));
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
