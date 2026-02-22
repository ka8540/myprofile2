(() => {
  const STORAGE_KEY = 'theme'; // 'light' | 'dark'

  const getSystemTheme = () => {
    if (!window.matchMedia) return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const getSavedTheme = () => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  };

  const setSavedTheme = (theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  };

  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;

    const btn = document.getElementById('themeToggle');
    if (btn) {
      const isDark = theme === 'dark';
      btn.setAttribute('aria-pressed', String(isDark));

      const icon = btn.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-moon', !isDark);
        icon.classList.toggle('fa-sun', isDark);
      }

      const label = btn.querySelector('span');
      if (label) label.textContent = isDark ? 'Light' : 'Dark';

      // Keep button styling readable on both themes.
      btn.classList.toggle('btn-outline-light', isDark);
      btn.classList.toggle('btn-outline-primary', !isDark);
    }
  };

  const init = () => {
    const initial = getSavedTheme() || getSystemTheme();
    setTheme(initial);

    const btn = document.getElementById('themeToggle');
    if (btn) {
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        setSavedTheme(next);
        setTheme(next);
      });
    }

    // If user hasn't explicitly chosen, follow OS setting changes.
    const mql = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
    if (mql && !getSavedTheme()) {
      const handler = () => setTheme(getSystemTheme());
      if (typeof mql.addEventListener === 'function') mql.addEventListener('change', handler);
      else if (typeof mql.addListener === 'function') mql.addListener(handler);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
