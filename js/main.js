/* ==========================================================================
   Kush Jayesh Ahir — Portfolio interactions
   Vanilla JS. No dependencies. Theme, scroll reveal, navbar, active section,
   scroll progress, mobile nav, typed role, smooth scroll. Reduced-motion aware.
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;

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
    var targets = document.querySelectorAll("[data-reveal], [data-stagger]");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = parseFloat(el.getAttribute("data-delay") || 0);
        if (delay) el.style.transitionDelay = delay + "s";

        if (el.hasAttribute("data-stagger")) {
          var step = parseFloat(el.getAttribute("data-stagger")) || 0.08;
          Array.prototype.forEach.call(el.children, function (child, i) {
            child.style.transitionDelay = (delay + i * step) + "s";
          });
        }
        el.classList.add("in");
        io.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    targets.forEach(function (el) { io.observe(el); });
  }

  /* --------------------- Navbar scroll + progress ----------------------- */
  function initNavScroll() {
    var nav = document.querySelector(".nav");
    var progress = document.querySelector(".scroll-progress");
    var ticking = false;

    function update() {
      var y = window.scrollY || window.pageYOffset;
      if (nav) nav.classList.toggle("is-scrolled", y > 12);
      if (progress) {
        var h = document.documentElement.scrollHeight - window.innerHeight;
        var p = h > 0 ? y / h : 0;
        progress.style.transform = "scaleX(" + Math.min(1, Math.max(0, p)) + ")";
      }
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
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
    initNavScroll();
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
