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
  root.classList.toggle("reduce-motion", reduceMotion);

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  if (typeof motionQuery.addEventListener === "function") {
    motionQuery.addEventListener("change", function (event) {
      reduceMotion = event.matches;
      root.classList.toggle("reduce-motion", reduceMotion);
    });
  } else if (typeof motionQuery.addListener === "function") {
    motionQuery.addListener(function (event) {
      reduceMotion = event.matches;
      root.classList.toggle("reduce-motion", reduceMotion);
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
    var timelineProgress = 0;

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

    function updateTimeline(item) {
      if (!timeline || !timelineItems.length || !item.classList.contains("tl-item")) return;
      var idx = timelineItems.indexOf(item);
      if (idx < 0) return;
      timelineProgress = Math.max(timelineProgress, (idx + 1) / timelineItems.length);
      timeline.style.setProperty("--timeline-progress", timelineProgress.toFixed(3));
    }

    function reveal(el) {
      var delay = parseFloat(el.getAttribute("data-delay") || 0);
      if (delay) el.style.setProperty("--reveal-delay", delay + "s");
      el.classList.add("in");
      if (el.hasAttribute("data-stagger")) {
        Array.prototype.forEach.call(el.children, function (child) {
          child.classList.add("in");
        });
      }
      updateTimeline(el);
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

  /* --------------------- Scroll depth + progress ------------------------ */
  function initScrollEffects() {
    var nav = document.querySelector(".nav");
    var progress = document.querySelector(".scroll-progress");
    var hero = document.querySelector("[data-hero-depth]");
    var heroCopy = hero ? hero.querySelector("[data-hero-copy]") : null;
    var heroVisual = hero ? hero.querySelector(".hero__visual") : null;
    var depthItems = hero ? Array.prototype.slice.call(hero.querySelectorAll("[data-depth]")) : [];
    var ticking = false;
    var heroTop = 0;
    var heroHeight = 1;

    function resetHeroDepth() {
      if (heroCopy) {
        heroCopy.style.removeProperty("--hero-copy-y");
        heroCopy.style.removeProperty("--hero-copy-opacity");
      }
      if (heroVisual) heroVisual.style.removeProperty("opacity");
      depthItems.forEach(function (el) {
        el.style.removeProperty("--depth-x");
        el.style.removeProperty("--depth-y");
      });
    }

    function measureHero() {
      if (!hero) return;
      var rect = hero.getBoundingClientRect();
      heroTop = rect.top + (window.scrollY || window.pageYOffset);
      heroHeight = hero.offsetHeight || window.innerHeight || 1;
    }

    function applyHeroDepth(y) {
      if (!hero || reduceMotion) {
        resetHeroDepth();
        return;
      }

      var depthRange = Math.max(heroHeight * 0.86, window.innerHeight * 0.72);
      var amount = clamp((y - heroTop) / depthRange, 0, 1);
      var softAmount = amount * amount * (3 - 2 * amount);

      if (heroCopy) {
        heroCopy.style.setProperty("--hero-copy-y", (softAmount * 36).toFixed(2) + "px");
        heroCopy.style.setProperty("--hero-copy-opacity", (1 - softAmount * 0.46).toFixed(3));
      }
      if (heroVisual) {
        heroVisual.style.opacity = (1 - softAmount * 0.2).toFixed(3);
      }

      depthItems.forEach(function (el) {
        var x = parseFloat(el.getAttribute("data-depth-x") || 0);
        var dy = parseFloat(el.getAttribute("data-depth-y") || 0);
        el.style.setProperty("--depth-x", (x * softAmount).toFixed(2) + "px");
        el.style.setProperty("--depth-y", (dy * softAmount).toFixed(2) + "px");
      });
    }

    function update() {
      var y = window.scrollY || window.pageYOffset;
      if (nav) nav.classList.toggle("is-scrolled", y > 12);
      if (progress) {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        var p = h > 0 ? y / h : 0;
        progress.style.transform = "scaleX(" + Math.min(1, Math.max(0, p)) + ")";
      }
      applyHeroDepth(y);
      ticking = false;
    }

    measureHero();
    window.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    window.addEventListener("resize", function () {
      measureHero();
      update();
    }, { passive: true });
    window.addEventListener("load", function () {
      measureHero();
      update();
    }, { once: true });
    update();
  }

  /* ------------------------ Section depth state ------------------------- */
  function initSectionDepth() {
    var sections = Array.prototype.slice.call(document.querySelectorAll(".hero, .section"));
    if (!sections.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      sections.forEach(function (section) { section.classList.add("has-entered"); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle("is-depth-active", entry.isIntersecting);
        if (entry.isIntersecting) entry.target.classList.add("has-entered");
      });
    }, { threshold: 0.22, rootMargin: "-12% 0px -16% 0px" });

    sections.forEach(function (section) { io.observe(section); });
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
    initScrollEffects();
    initSectionDepth();
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
