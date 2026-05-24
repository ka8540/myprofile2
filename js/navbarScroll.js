/*
 * Navbar polish:
 *  - Adds .is-scrolled on the nav after a few px so CSS can swap to the
 *    condensed/glass treatment.
 *  - Highlights the in-view section in the desktop nav using IntersectionObserver
 *    (replaces Bootstrap's scrollspy, which fights our custom layout).
 *  - Closes the collapsed mobile menu after a nav link is tapped.
 *  - Adds smooth scroll with a stable offset for the fixed nav.
 */
(() => {
  const nav = document.querySelector('.navbar.fixed-top');
  if (!nav) return;

  // Sticky / glass toggle on scroll.
  const onScroll = () => {
    if (window.scrollY > 12) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Smooth scroll with header offset.
  const links = Array.from(nav.querySelectorAll('a.nav-link[href^="#"]'));
  const HEADER_OFFSET = 72;

  const smoothScrollTo = (hash) => {
    const target = document.querySelector(hash);
    if (!target) return;
    const top =
      target.getBoundingClientRect().top + window.pageYOffset - HEADER_OFFSET;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      const hash = link.getAttribute('href');
      if (!hash || !hash.startsWith('#')) return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      smoothScrollTo(hash);

      // Collapse mobile menu after navigating.
      const collapse = document.getElementById('navbarCollapse');
      if (collapse && collapse.classList.contains('show')) {
        collapse.classList.remove('show');
      }
    });
  });

  // Active link highlight via IntersectionObserver.
  const linkByHash = new Map(links.map((l) => [l.getAttribute('href'), l]));
  const sections = Array.from(linkByHash.keys())
    .map((hash) => document.querySelector(hash))
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    const setActive = (hash) => {
      links.forEach((l) => l.classList.remove('active'));
      const link = linkByHash.get(hash);
      if (link) link.classList.add('active');
    };

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry whose section occupies the most of the viewport's top band.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length) {
          setActive('#' + visible[0].target.id);
        }
      },
      {
        rootMargin: '-45% 0px -50% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    sections.forEach((s) => observer.observe(s));
  }
})();
