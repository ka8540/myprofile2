/* ==========================================================================
   Kush Jayesh Ahir — Portfolio interactions
   Vanilla JS. No dependencies. Theme, scroll reveal, navbar, active section,
   scroll progress, mobile nav, typed role, smooth scroll. Reduced-motion aware.
   ========================================================================== */
(function () {
  "use strict";

  var motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  var reduceMotion = motionQuery.matches;
  var root = document.documentElement;
  var requestScrollUpdate = null;
  root.classList.toggle("reduce-motion", reduceMotion);

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function smoothstep(value) {
    var t = clamp(value, 0, 1);
    return t * t * (3 - 2 * t);
  }

  if (typeof motionQuery.addEventListener === "function") {
    motionQuery.addEventListener("change", function (event) {
      reduceMotion = event.matches;
      root.classList.toggle("reduce-motion", reduceMotion);
      if (typeof requestScrollUpdate === "function") requestScrollUpdate();
    });
  } else if (typeof motionQuery.addListener === "function") {
    motionQuery.addListener(function (event) {
      reduceMotion = event.matches;
      root.classList.toggle("reduce-motion", reduceMotion);
      if (typeof requestScrollUpdate === "function") requestScrollUpdate();
    });
  }

  /* ----------------------------- Theme ---------------------------------- */
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#f7f7f4" : "#0a0b0f");
  }
  var stored = null;
  try { stored = localStorage.getItem("theme"); } catch (e) {}
  var prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  applyTheme(stored || (prefersLight ? "light" : "dark"));

  function bindTheme() {
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
        applyTheme(next);
        try { localStorage.setItem("theme", next); } catch (e) {}
      });
    });
  }

  /* -------------------------- Scroll reveal ----------------------------- */
  function initReveal() {
    var targets = Array.prototype.slice.call(document.querySelectorAll("[data-reveal], [data-stagger]"));
    var timeline = document.querySelector("[data-timeline]");
    var timelineItems = timeline ? Array.prototype.slice.call(timeline.querySelectorAll(".tl-item")) : [];

    document.querySelectorAll("[data-stagger]").forEach(function (group) {
      var baseDelay = parseFloat(group.getAttribute("data-delay") || 0);
      var step = parseFloat(group.getAttribute("data-stagger") || 0.08);
      Array.prototype.forEach.call(group.children, function (child, i) {
        child.classList.add("reveal-child");
        child.style.setProperty("--stagger-delay", (baseDelay + i * step) + "s");
        child.style.setProperty("--stagger-index", i);
      });
    });

    document.querySelectorAll(".chips, .proj__stack, .tl-tags, .tagrow").forEach(function (group) {
      Array.prototype.forEach.call(group.children, function (child, i) {
        child.style.setProperty("--chip-index", i);
        child.style.setProperty("--chip-delay", (i * 0.032).toFixed(3) + "s");
      });
    });

    timelineItems.forEach(function (item, i) {
      item.style.setProperty("--timeline-index", i);
    });

    function reveal(el) {
      var delay = parseFloat(el.getAttribute("data-delay") || 0);
      if (delay) el.style.setProperty("--reveal-delay", delay + "s");
      el.classList.add("in");
      if (el.hasAttribute("data-stagger")) {
        Array.prototype.forEach.call(el.children, function (child) {
          child.classList.add("in");
        });
      }
    }

    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("in"); });
      document.querySelectorAll("[data-stagger]").forEach(function (group) {
        Array.prototype.forEach.call(group.children, function (child) {
          child.classList.add("in");
        });
      });
      if (timeline) timeline.style.setProperty("--timeline-progress", "1");
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -10% 0px" });

    targets.forEach(function (el) { io.observe(el); });
  }

  /* ------------------- Scroll-scrubbed scene controller ----------------- */
  function initScrollController() {
    var nav = document.querySelector(".nav");
    var progress = document.querySelector(".scroll-progress");
    var hero = document.querySelector('[data-scroll-scene="hero"]');
    var heroCopy = hero ? hero.querySelector("[data-hero-copy]") : null;
    var heroVisual = hero ? hero.querySelector(".hero__visual") : null;
    var depthItems = hero ? Array.prototype.slice.call(hero.querySelectorAll("[data-scroll-parallax], [data-depth]")) : [];
    var projectsScene = document.querySelector('[data-scroll-scene="projects"]');
    var projectCards = projectsScene ? Array.prototype.slice.call(projectsScene.querySelectorAll("[data-project-card]")) : [];
    var timeline = document.querySelector("[data-timeline]");
    var timelineItems = timeline ? Array.prototype.slice.call(timeline.querySelectorAll("[data-timeline-item], .tl-item")) : [];
    var sections = Array.prototype.slice.call(document.querySelectorAll(".section"));
    var ticking = false;
    var latestY = window.scrollY || window.pageYOffset || 0;
    var viewportH = window.innerHeight || 1;
    var docH = document.documentElement.scrollHeight || 1;
    var metrics = {
      hero: null,
      projects: null,
      timeline: null,
      sections: []
    };

    projectCards.forEach(function (card, i) {
      card.style.setProperty("--project-index", i);
    });

    function measureElement(el) {
      if (!el) return null;
      var rect = el.getBoundingClientRect();
      var top = rect.top + (window.scrollY || window.pageYOffset || 0);
      var height = Math.max(rect.height || el.offsetHeight || 1, 1);
      return { top: top, height: height, end: top + height };
    }

    function measure() {
      viewportH = window.innerHeight || 1;
      docH = document.documentElement.scrollHeight || document.body.scrollHeight || 1;
      metrics.hero = measureElement(hero);
      metrics.projects = measureElement(projectsScene);
      metrics.timeline = measureElement(timeline);
      metrics.sections = sections.map(function (section) {
        return { el: section, box: measureElement(section) };
      });
    }

    function resetScrollMotion() {
      if (hero) {
        hero.style.setProperty("--hero-progress", "0");
        hero.style.setProperty("--hero-content-y", "0px");
        hero.style.setProperty("--hero-visual-y", "0px");
        hero.style.setProperty("--hero-scale", "1");
        hero.style.setProperty("--hero-opacity", "1");
      }
      if (heroVisual) heroVisual.style.setProperty("--hero-visual-opacity", "1");
      depthItems.forEach(function (el) {
        el.style.setProperty("--depth-x", "0px");
        el.style.setProperty("--depth-y", "0px");
      });
      if (projectsScene) {
        projectsScene.style.setProperty("--projects-progress", "1");
        projectsScene.style.setProperty("--projects-bg-y", "0px");
        projectsScene.style.setProperty("--projects-bg-opacity", ".38");
        projectsScene.style.setProperty("--projects-head-y", "0px");
        projectsScene.style.setProperty("--projects-head-opacity", "1");
        projectsScene.style.setProperty("--projects-grid-y", "0px");
      }
      projectCards.forEach(function (card) {
        card.style.setProperty("--project-card-progress", "1");
        card.style.setProperty("--project-card-y", "0px");
        card.style.setProperty("--project-card-opacity", "1");
        card.style.setProperty("--project-card-scale", "1");
        card.classList.add("is-scroll-active");
      });
      if (timeline) timeline.style.setProperty("--timeline-progress", "1");
      timelineItems.forEach(function (item) { item.classList.add("is-active"); });
      metrics.sections.forEach(function (entry) {
        entry.el.style.setProperty("--section-progress", "1");
        entry.el.style.setProperty("--section-focus", "1");
        entry.el.style.setProperty("--section-depth-y", "0px");
        entry.el.style.setProperty("--section-depth-opacity", ".22");
      });
    }

    function updateHero(y) {
      if (!hero || !metrics.hero) return;
      var range = Math.max(Math.min(metrics.hero.height * 0.95, viewportH * 1.24), viewportH * 0.72);
      var raw = clamp((y - metrics.hero.top) / range, 0, 1);
      var p = smoothstep(raw);

      hero.style.setProperty("--hero-progress", p.toFixed(4));
      hero.style.setProperty("--hero-content-y", (-72 * p).toFixed(2) + "px");
      hero.style.setProperty("--hero-visual-y", (46 * p).toFixed(2) + "px");
      hero.style.setProperty("--hero-scale", (1 + p * 0.045).toFixed(4));
      hero.style.setProperty("--hero-opacity", (1 - p * 0.72).toFixed(3));

      if (heroVisual) {
        heroVisual.style.setProperty("--hero-visual-opacity", (1 - p * 0.24).toFixed(3));
      }

      depthItems.forEach(function (el) {
        var speed = parseFloat(el.getAttribute("data-parallax-speed") || el.getAttribute("data-depth-y") || 0);
        var x = parseFloat(el.getAttribute("data-depth-x") || 0);
        var yDepth = speed * p;
        el.style.setProperty("--depth-x", (x * p).toFixed(2) + "px");
        el.style.setProperty("--depth-y", yDepth.toFixed(2) + "px");
      });
    }

    function updateProjects(y) {
      if (!projectsScene || !metrics.projects) return;
      var travel = Math.max(metrics.projects.height - viewportH, 1);
      var raw = clamp((y - metrics.projects.top) / travel, 0, 1);
      var p = smoothstep(raw);
      var count = Math.max(projectCards.length, 1);

      projectsScene.style.setProperty("--projects-progress", p.toFixed(4));
      projectsScene.style.setProperty("--project-stage", Math.round(p * (count - 1)));
      projectsScene.style.setProperty("--projects-bg-y", ((p - 0.5) * -48).toFixed(2) + "px");
      projectsScene.style.setProperty("--projects-bg-opacity", (0.22 + p * 0.36).toFixed(3));
      projectsScene.style.setProperty("--projects-head-y", (-22 * p).toFixed(2) + "px");
      projectsScene.style.setProperty("--projects-head-opacity", (1 - Math.max(0, p - 0.72) * 0.95).toFixed(3));
      projectsScene.style.setProperty("--projects-grid-y", (-76 * p).toFixed(2) + "px");

      projectCards.forEach(function (card, i) {
        var start = i * 0.07 - 0.08;
        var local = smoothstep((raw - start) / 0.26);
        var drift = (0.5 - p) * (10 + i * 0.7);
        var yOffset = (1 - local) * 58 + drift;
        var opacity = 0.08 + local * 0.92;
        var scale = 0.955 + local * 0.045;

        card.style.setProperty("--project-card-progress", local.toFixed(4));
        card.style.setProperty("--project-depth", (local * (1 - i / (count + 4))).toFixed(4));
        card.style.setProperty("--project-card-y", yOffset.toFixed(2) + "px");
        card.style.setProperty("--project-card-opacity", opacity.toFixed(3));
        card.style.setProperty("--project-card-scale", scale.toFixed(4));
        card.classList.toggle("is-scroll-active", local > 0.52);
      });
    }

    function updateTimeline(y) {
      if (!timeline || !metrics.timeline) return;
      var start = metrics.timeline.top - viewportH * 0.62;
      var end = metrics.timeline.end - viewportH * 0.24;
      var raw = clamp((y - start) / Math.max(end - start, 1), 0, 1);
      timeline.style.setProperty("--timeline-progress", raw.toFixed(4));

      timelineItems.forEach(function (item, i) {
        var threshold = timelineItems.length <= 1 ? 0 : i / (timelineItems.length - 1);
        item.classList.toggle("is-active", raw + 0.02 >= threshold);
      });
    }

    function updateSections(y) {
      metrics.sections.forEach(function (entry) {
        if (!entry.box) return;
        var raw = clamp((y + viewportH - entry.box.top) / (entry.box.height + viewportH), 0, 1);
        var focus = clamp(1 - Math.abs(raw - 0.48) * 2.1, 0, 1);
        var easedFocus = smoothstep(focus);

        entry.el.style.setProperty("--section-progress", raw.toFixed(4));
        entry.el.style.setProperty("--section-focus", easedFocus.toFixed(4));
        entry.el.style.setProperty("--section-depth-y", ((1 - easedFocus) * 18).toFixed(2) + "px");
        entry.el.style.setProperty("--section-depth-opacity", (0.14 + easedFocus * 0.58).toFixed(3));
      });
    }

    function update() {
      var y = latestY;
      if (nav) nav.classList.toggle("is-scrolled", y > 12);
      if (progress) {
        var maxScroll = Math.max(docH - viewportH, 1);
        progress.style.transform = "scaleX(" + clamp(y / maxScroll, 0, 1) + ")";
      }

      if (reduceMotion) {
        resetScrollMotion();
        ticking = false;
        return;
      }

      updateHero(y);
      updateProjects(y);
      updateTimeline(y);
      updateSections(y);
      ticking = false;
    }

    function requestUpdate() {
      latestY = window.scrollY || window.pageYOffset || 0;
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }

    function refresh() {
      measure();
      requestUpdate();
    }

    requestScrollUpdate = requestUpdate;
    measure();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", refresh, { passive: true });
    window.addEventListener("load", refresh, { once: true });
    requestUpdate();
  }

  /* -------------------------- Active section ---------------------------- */
  function initActiveSection() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".nav__links a[href^='#']"));
    if (!links.length || !("IntersectionObserver" in window)) return;
    var map = {};
    links.forEach(function (l) { map[l.getAttribute("href").slice(1)] = l; });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (l) { l.classList.remove("active"); });
          var active = map[entry.target.id];
          if (active) active.classList.add("active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

    Object.keys(map).forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) io.observe(sec);
    });
  }

  /* ---------------------------- Mobile nav ------------------------------ */
  function initMobileNav() {
    var burger = document.querySelector(".burger");
    var sheet = document.querySelector(".mobile-nav");
    if (!burger || !sheet) return;
    function close() { document.body.classList.remove("menu-open"); burger.setAttribute("aria-expanded", "false"); }
    burger.addEventListener("click", function () {
      var open = document.body.classList.toggle("menu-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    sheet.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", close); });
    window.addEventListener("resize", function () { if (window.innerWidth > 760) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }

  /* ----------------------- Typed role rotator --------------------------- */
  function initTyped() {
    var el = document.querySelector("[data-typed]");
    if (!el) return;
    var words;
    try { words = JSON.parse(el.getAttribute("data-typed")); } catch (e) { return; }
    if (!words || !words.length) return;
    if (reduceMotion) { el.textContent = words[0]; el.style.borderRight = "none"; return; }

    var wi = 0, ci = 0, deleting = false;
    function tick() {
      var word = words[wi];
      el.textContent = word.slice(0, ci);
      if (!deleting) {
        if (ci < word.length) { ci++; setTimeout(tick, 70); }
        else { deleting = true; setTimeout(tick, 1500); }
      } else {
        if (ci > 0) { ci--; setTimeout(tick, 35); }
        else { deleting = false; wi = (wi + 1) % words.length; setTimeout(tick, 240); }
      }
    }
    tick();
  }

  /* ---------------------------- Footer year ----------------------------- */
  function initYear() {
    var y = document.querySelector("[data-year]");
    if (y) y.textContent = new Date().getFullYear();
  }

  /* ------------------------------- Boot --------------------------------- */
  function boot() {
    bindTheme();
    initReveal();
    initScrollController();
    initActiveSection();
    initMobileNav();
    initTyped();
    initYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
