(() => {
  const layer = document.getElementById('ambientParticlesLayer');
  const host = document.getElementById('ambientParticles');
  const siteContent = document.getElementById('siteContent');

  if (!layer || !host) return;

  const debugMode = new URLSearchParams(window.location.search).get('particlesDebug') === '1';

  const state = {
    container: null,
    enginePromise: null,
    loading: false,
    started: false,
    profileKey: '',
    fallbackCanvas: null,
    fallbackFrame: 0,
    fallbackParticles: [],
    fallbackPalette: null
  };

  const prefersReducedMotion = () =>
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const getTheme = () =>
    document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';

  const forceLayering = () => {
    document.body.style.position = 'relative';
    document.body.style.overflowX = 'hidden';
    document.body.style.isolation = 'isolate';

    layer.style.position = 'fixed';
    layer.style.top = '0';
    layer.style.left = '0';
    layer.style.width = '100%';
    layer.style.height = '100%';
    layer.style.zIndex = '0';
    layer.style.pointerEvents = 'none';

    host.style.position = 'absolute';
    host.style.top = '0';
    host.style.left = '0';
    host.style.width = '100%';
    host.style.height = '100%';
    host.style.pointerEvents = 'none';

    if (siteContent) {
      siteContent.style.position = 'relative';
      siteContent.style.zIndex = '1';
      siteContent.style.background = 'transparent';
    }
  };

  const getProfile = () => {
    const mobile = window.matchMedia('(max-width: 768px)').matches;
    const reducedMotion = prefersReducedMotion();
    const lowCores = Number.isFinite(navigator.hardwareConcurrency) && navigator.hardwareConcurrency <= 4;
    const lowMemory = Number.isFinite(navigator.deviceMemory) && navigator.deviceMemory <= 4;
    const lowPower = reducedMotion || lowCores || lowMemory;

    return {
      mobile,
      reducedMotion,
      lowPower,
      key: `${mobile ? 'm' : 'd'}-${lowPower ? 'l' : 'n'}`
    };
  };

  const getPalette = (theme = getTheme()) => {
    if (debugMode) {
      return {
        particle: '#ff0000',
        line: '#ff0000',
        lineRgb: '255, 0, 0',
        particleOpacity: 1,
        lineOpacity: 0.45
      };
    }

    if (theme === 'dark') {
      return {
        particle: '#ffffff',
        line: '#00FFC6',
        lineRgb: '0, 255, 198',
        particleOpacity: 0.76,
        lineOpacity: 0.3
      };
    }

    return {
      particle: '#444444',
      line: '#888888',
      lineRgb: '136, 136, 136',
      particleOpacity: 0.68,
      lineOpacity: 0.32
    };
  };

  const buildOptions = (profile) => {
    const palette = getPalette();
    const particleOpacityMin = debugMode ? 1 : Math.max(0.58, palette.particleOpacity - 0.08);

    return {
      fullScreen: { enable: false },
      background: { color: 'transparent' },
      detectRetina: false,
      fpsLimit: 60,
      pauseOnBlur: true,
      pauseOnOutsideViewport: true,
      particles: {
        number: {
          value: profile.mobile ? (profile.lowPower ? 20 : 26) : profile.lowPower ? 50 : 62,
          density: {
            enable: true,
            area: profile.mobile ? 900 : 1180
          }
        },
        color: { value: palette.particle },
        shape: { type: 'circle' },
        opacity: {
          value: {
            min: particleOpacityMin,
            max: palette.particleOpacity
          }
        },
        size: {
          value: debugMode
            ? { min: 4, max: 6 }
            : { min: profile.mobile ? 2.4 : 2.8, max: profile.mobile ? 3.6 : 4.1 }
        },
        links: {
          enable: true,
          distance: profile.mobile ? 96 : 128,
          color: palette.line,
          opacity: palette.lineOpacity,
          width: 1
        },
        move: {
          enable: !profile.reducedMotion,
          direction: 'none',
          speed: profile.lowPower ? 0.45 : 0.7,
          random: false,
          straight: false,
          outModes: { default: 'out' }
        },
        collisions: { enable: false },
        shadow: { enable: false }
      },
      interactivity: {
        detectsOn: 'window',
        events: {
          onHover: {
            enable: !profile.lowPower && !profile.reducedMotion,
            mode: 'repulse'
          },
          resize: { enable: true }
        },
        modes: {
          repulse: {
            distance: profile.mobile ? 42 : 58,
            duration: 0.24
          }
        }
      },
      themes: [
        {
          name: 'light',
          default: { value: true, mode: 'light' },
          options: {
            particles: {
              color: { value: debugMode ? '#ff0000' : '#444444' },
              opacity: {
                value: {
                  min: debugMode ? 1 : 0.6,
                  max: debugMode ? 1 : 0.68
                }
              },
              links: {
                color: debugMode ? '#ff0000' : '#888888',
                opacity: 0.32
              }
            }
          }
        },
        {
          name: 'dark',
          default: { value: true, mode: 'dark' },
          options: {
            particles: {
              color: { value: debugMode ? '#ff0000' : '#ffffff' },
              opacity: {
                value: {
                  min: debugMode ? 1 : 0.68,
                  max: debugMode ? 1 : 0.76
                }
              },
              links: {
                color: debugMode ? '#ff0000' : '#00FFC6',
                opacity: 0.3
              }
            }
          }
        }
      ]
    };
  };

  const appendScript = (src) =>
    new Promise((resolve, reject) => {
      const existing = Array.from(document.scripts).find((script) => script.src.includes(src));

      if (existing) {
        if (window.tsParticles) {
          resolve();
          return;
        }

        existing.addEventListener('load', resolve, { once: true });
        existing.addEventListener('error', () => reject(new Error(`Unable to load ${src}`)), {
          once: true
        });
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Unable to load ${src}`));
      document.head.appendChild(script);
    });

  const loadEngine = async () => {
    if (window.tsParticles) return window.tsParticles;
    if (state.enginePromise) return state.enginePromise;

    const sources = [
      'lib/tsparticles/tsparticles.bundle.min.js',
      'https://cdn.jsdelivr.net/npm/tsparticles@3/tsparticles.bundle.min.js',
      'https://unpkg.com/tsparticles@3/tsparticles.bundle.min.js'
    ];

    state.enginePromise = (async () => {
      for (const src of sources) {
        try {
          await appendScript(src);
          if (window.tsParticles) return window.tsParticles;
        } catch (error) {
          console.warn(error.message);
        }
      }

      throw new Error('tsParticles failed to load');
    })();

    return state.enginePromise;
  };

  const stopFallback = () => {
    if (state.fallbackFrame) {
      window.cancelAnimationFrame(state.fallbackFrame);
      state.fallbackFrame = 0;
    }

    if (state.fallbackCanvas) {
      state.fallbackCanvas.remove();
      state.fallbackCanvas = null;
    }

    state.fallbackParticles = [];
  };

  const startFallback = () => {
    if (state.fallbackCanvas) return;

    stopFallback();

    const canvas = document.createElement('canvas');
    canvas.id = 'ambientFallbackCanvas';
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.background = 'transparent';
    host.appendChild(canvas);
    state.fallbackCanvas = canvas;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = Math.max(1, Math.floor(window.innerWidth));
      canvas.height = Math.max(1, Math.floor(window.innerHeight));
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    };

    const buildParticles = () => {
      const profile = getProfile();
      const count = profile.mobile ? 24 : 54;
      state.fallbackPalette = getPalette();
      state.fallbackParticles = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: prefersReducedMotion() ? 0 : (Math.random() - 0.5) * 0.18,
        vy: prefersReducedMotion() ? 0 : (Math.random() - 0.5) * 0.18,
        size: debugMode ? 4 + Math.random() * 2 : 2.4 + Math.random() * 1.6
      }));
    };

    const draw = () => {
      if (!state.fallbackCanvas) return;

      const palette = state.fallbackPalette || getPalette();
      const linkDistance = window.innerWidth <= 768 ? 96 : 128;

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = 0; i < state.fallbackParticles.length; i += 1) {
        const particle = state.fallbackParticles[i];

        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < -12) particle.x = window.innerWidth + 12;
        if (particle.x > window.innerWidth + 12) particle.x = -12;
        if (particle.y < -12) particle.y = window.innerHeight + 12;
        if (particle.y > window.innerHeight + 12) particle.y = -12;

        for (let j = i + 1; j < state.fallbackParticles.length; j += 1) {
          const target = state.fallbackParticles[j];
          const dx = particle.x - target.x;
          const dy = particle.y - target.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance > linkDistance) continue;

          ctx.strokeStyle = `rgba(${palette.lineRgb}, ${(1 - distance / linkDistance) * palette.lineOpacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(target.x, target.y);
          ctx.stroke();
        }
      }

      ctx.fillStyle = palette.particle;
      ctx.globalAlpha = palette.particleOpacity;
      for (const particle of state.fallbackParticles) {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      state.fallbackFrame = window.requestAnimationFrame(draw);
    };

    resize();
    buildParticles();
    draw();

    window.addEventListener(
      'resize',
      () => {
        resize();
        buildParticles();
      },
      { passive: true }
    );
  };

  const applyTheme = async () => {
    const palette = getPalette();
    state.fallbackPalette = palette;

    if (!state.container || debugMode) return;

    const theme = getTheme();

    if (typeof state.container.loadTheme === 'function') {
      await state.container.loadTheme(theme);
      return;
    }

    state.container.options.particles.color.value = palette.particle;
    state.container.options.particles.links.color = palette.line;
    state.container.options.particles.links.opacity = palette.lineOpacity;
    state.container.options.particles.opacity.value = {
      min: Math.max(0.58, palette.particleOpacity - 0.08),
      max: palette.particleOpacity
    };

    if (typeof state.container.refresh === 'function') {
      await state.container.refresh();
    }
  };

  const refreshForProfile = async () => {
    if (!state.container) return;

    const profile = getProfile();
    if (profile.key === state.profileKey) return;

    state.profileKey = profile.key;
    state.container.options = buildOptions(profile);

    if (typeof state.container.refresh === 'function') {
      await state.container.refresh();
      await applyTheme();
    }
  };

  const initParticles = async () => {
    if (state.loading || state.started) return;

    state.loading = true;

    try {
      forceLayering();

      const engine = await loadEngine();
      if (!engine || typeof engine.load !== 'function') {
        throw new Error('tsParticles engine unavailable');
      }

      const profile = getProfile();
      state.profileKey = profile.key;
      host.innerHTML = '';

      let container;
      try {
        container = await engine.load({ id: 'ambientParticles', options: buildOptions(profile) });
      } catch (error) {
        container = await engine.load('ambientParticles', buildOptions(profile));
        if (!container) throw error;
      }

      state.container = container || null;
      state.started = true;
      console.log('Particles loaded');
      await applyTheme();

      window.setTimeout(() => {
        const canvas = host.querySelector('canvas');

        if (!canvas) {
          console.warn('tsParticles canvas missing, switching to fallback canvas');
          startFallback();
          return;
        }

        stopFallback();
        canvas.style.position = 'absolute';
        canvas.style.inset = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.background = 'transparent';
        canvas.style.opacity = '1';
      }, 400);
    } catch (error) {
      console.warn('Particles failed to initialize', error);
      startFallback();
    } finally {
      state.loading = false;
    }
  };

  const queueStart = () => {
    const start = () => {
      initParticles().catch((error) => {
        console.warn('Ambient background bootstrap failed', error);
        startFallback();
      });
    };

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(start, { timeout: 500 });
      return;
    }

    window.setTimeout(start, 120);
  };

  forceLayering();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', queueStart, { once: true });
  } else {
    queueStart();
  }

  document.addEventListener('themechange', () => {
    applyTheme().catch(() => {});
  });

  const themeObserver = new MutationObserver(() => {
    applyTheme().catch(() => {});
  });
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme']
  });

  let resizeTimer = 0;
  window.addEventListener(
    'resize',
    () => {
      if (resizeTimer) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        refreshForProfile().catch(() => {});
      }, 180);
    },
    { passive: true }
  );
})();
