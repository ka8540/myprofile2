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
    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }));

    const btn = document.getElementById('themeToggle');
    if (btn) {
      const isDark = theme === 'dark';
      btn.setAttribute('aria-pressed', String(isDark));
      btn.setAttribute(
        'aria-label',
        isDark
          ? 'Dark mode active. Switch to light mode'
          : 'Light mode active. Switch to dark mode'
      );

      const icon = btn.querySelector('.theme-toggle__icon i');
      if (icon) {
        icon.classList.toggle('fa-sun', !isDark);
        icon.classList.toggle('fa-moon', isDark);
      }
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
