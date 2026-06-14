/* ==========================================================================
   Kush Jayesh Ahir — Portfolio interactions
   Vanilla JS, zero dependencies. Theme, scroll reveal, floating navbar,
   active section + sliding pill, scroll progress, mobile nav, animated role
   rotator, count-up stats, magnetic buttons, 3D tilt, cursor aura, parallax,
   timeline progress, particle constellation, back-to-top.
   Reduced-motion aware and performance conscious.
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var root = document.documentElement;

  /* ----------------------------- Theme ---------------------------------- */
  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#f6f4ee" : "#070a14");
    if (window.__fxColors) window.__fxColors();
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

  /* ---------------- Navbar scroll + progress + timeline ----------------- */
  function initScrollFx() {
    var nav = document.querySelector(".nav");
    var bar = document.querySelector(".scroll-progress span");
    var toTop = document.getElementById("to-top");
    var tl = document.querySelector(".timeline");
    var tlProg = document.querySelector(".timeline__progress");
    var ticking = false;

    function update() {
      var y = window.scrollY || window.pageYOffset;
      var h = root.scrollHeight - window.innerHeight;
      var p = h > 0 ? y / h : 0;

      if (nav) nav.classList.toggle("is-scrolled", y > 20);
      if (bar) bar.style.transform = "scaleX(" + Math.min(1, Math.max(0, p)) + ")";
      if (toTop) toTop.classList.toggle("show", y > 600);

      if (tl && tlProg) {
        var r = tl.getBoundingClientRect();
        var vh = window.innerHeight;
        var total = r.height;
        var seen = Math.min(total, Math.max(0, vh * 0.55 - r.top));
        tlProg.style.height = (total > 0 ? (seen / total) * 100 : 0) + "%";
      }
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();
  }

  /* ------------------- Active section + sliding pill -------------------- */
  function initActiveSection() {
    var linkWrap = document.querySelector(".nav__links");
    var pill = document.querySelector(".nav__pill");
    var links = Array.prototype.slice.call(document.querySelectorAll(".nav__link[href^='#']"));
    if (!links.length) return;

    var map = {};
    links.forEach(function (l) { map[l.getAttribute("href").slice(1)] = l; });
    var current = links[0];

    function movePill(target, animate) {
      if (!pill || !target) return;
      if (!animate) pill.style.transition = "none";
      pill.style.opacity = "1";
      pill.style.width = target.offsetWidth + "px";
      pill.style.transform = "translateX(" + target.offsetLeft + "px)";
      if (!animate) { void pill.offsetWidth; pill.style.transition = ""; }
    }

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var active = map[entry.target.id];
          if (!active) return;
          links.forEach(function (l) { l.classList.remove("active"); });
          active.classList.add("active");
          current = active;
          movePill(active, true);
        });
      }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

      Object.keys(map).forEach(function (id) {
        var sec = document.getElementById(id);
        if (sec) io.observe(sec);
      });
    }

    // Hover steals the pill, leaving restores it to the active link.
    if (linkWrap) {
      links.forEach(function (l) {
        l.addEventListener("mouseenter", function () { movePill(l, true); });
      });
      linkWrap.addEventListener("mouseleave", function () { movePill(current, true); });
    }
    window.addEventListener("resize", function () { movePill(current, false); });
  }

  /* ---------------------------- Mobile nav ------------------------------ */
  function initMobileNav() {
    var burger = document.querySelector(".burger");
    var sheet = document.querySelector(".mobile-nav");
    var scrim = document.getElementById("mobile-scrim");
    if (!burger || !sheet) return;
    function close() {
      document.body.classList.remove("menu-open");
      burger.setAttribute("aria-expanded", "false");
    }
    function toggle() {
      var open = document.body.classList.toggle("menu-open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    }
    burger.addEventListener("click", toggle);
    if (scrim) scrim.addEventListener("click", close);
    sheet.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", close); });
    window.addEventListener("resize", function () { if (window.innerWidth > 860) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  }

  /* ------------------------ Animated role rotator ----------------------- */
  function initRoleRotator() {
    var wrap = document.querySelector(".role-rotator");
    if (!wrap) return;
    var word = wrap.querySelector(".role-rotator__word");
    var roles;
    try { roles = JSON.parse(wrap.getAttribute("data-roles")); } catch (e) { return; }
    if (!word || !roles || !roles.length) return;

    var i = 0;
    if (reduceMotion) { word.textContent = roles[0]; return; }

    function next() {
      word.classList.add("is-out");
      setTimeout(function () {
        i = (i + 1) % roles.length;
        word.textContent = roles[i];
        word.classList.remove("is-out");
        word.classList.add("is-in");
        setTimeout(function () { word.classList.remove("is-in"); }, 520);
      }, 420);
    }
    setInterval(next, 2600);
  }

  /* ---------------------------- Count up -------------------------------- */
  function initCounters() {
    var nums = document.querySelectorAll("[data-count]");
    if (!nums.length) return;
    function run(el) {
      var target = parseFloat(el.getAttribute("data-count"));
      var dec = parseInt(el.getAttribute("data-decimals") || "0", 10);
      if (reduceMotion || isNaN(target)) { el.textContent = target.toFixed(dec); return; }
      var start = performance.now(), dur = 1400;
      function frame(now) {
        var t = Math.min(1, (now - start) / dur);
        var eased = 1 - Math.pow(1 - t, 3);
        el.textContent = (target * eased).toFixed(dec);
        if (t < 1) requestAnimationFrame(frame);
        else el.textContent = target.toFixed(dec);
      }
      requestAnimationFrame(frame);
    }
    if (!("IntersectionObserver" in window)) { nums.forEach(run); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { run(e.target); io.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    nums.forEach(function (n) { io.observe(n); });
  }

  /* ------------------------- Magnetic buttons --------------------------- */
  function initMagnetic() {
    if (!finePointer || reduceMotion) return;
    document.querySelectorAll("[data-magnetic]").forEach(function (el) {
      var strength = 0.32;
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * strength;
        var y = (e.clientY - r.top - r.height / 2) * strength;
        el.style.transform = "translate(" + x + "px," + y + "px)";
      });
      el.addEventListener("pointerleave", function () { el.style.transform = ""; });
    });
  }

  /* ----------------------------- 3D tilt -------------------------------- */
  function initTilt() {
    if (!finePointer || reduceMotion) return;
    document.querySelectorAll("[data-tilt]").forEach(function (el) {
      var max = parseFloat(el.getAttribute("data-tilt-max") || "8");
      var layers = el.querySelectorAll("[data-tilt-layer]");
      var raf = null, rx = 0, ry = 0, mx = 50, my = 50;

      function apply() {
        raf = null;
        el.style.transform = "perspective(900px) rotateX(" + rx + "deg) rotateY(" + ry + "deg)";
        el.style.setProperty("--mx", mx + "%");
        el.style.setProperty("--my", my + "%");
        layers.forEach(function (l) {
          var d = parseFloat(l.getAttribute("data-tilt-layer")) || 0;
          l.style.transform = "translateZ(" + d + "px) translate(" + (-ry * 1.3) + "px," + (rx * 1.3) + "px)";
        });
      }
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width;
        var py = (e.clientY - r.top) / r.height;
        mx = px * 100; my = py * 100;
        ry = (px - 0.5) * max * 2;
        rx = -(py - 0.5) * max * 2;
        if (!raf) raf = requestAnimationFrame(apply);
      });
      el.addEventListener("pointerleave", function () {
        rx = ry = 0; mx = my = 50;
        el.style.transform = "";
        layers.forEach(function (l) {
          var d = parseFloat(l.getAttribute("data-tilt-layer")) || 0;
          l.style.transform = "translateZ(" + d + "px)";
        });
      });
    });
  }

  /* ------------------------ Cursor aura + parallax ---------------------- */
  function initPointerFx() {
    if (!finePointer || reduceMotion) return;
    var aura = document.getElementById("cursor-aura");
    var visual = document.querySelector("[data-parallax]");
    var tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    var cx = tx, cy = ty, shown = false;

    window.addEventListener("pointermove", function (e) {
      tx = e.clientX; ty = e.clientY;
      if (aura && !shown) { aura.style.opacity = "1"; shown = true; }
      if (visual) {
        var ox = (e.clientX / window.innerWidth - 0.5) * 22;
        var oy = (e.clientY / window.innerHeight - 0.5) * 22;
        visual.style.transform = "translate(" + ox + "px," + oy + "px)";
      }
    }, { passive: true });

    if (aura) {
      (function loop() {
        cx += (tx - cx) * 0.12;
        cy += (ty - cy) * 0.12;
        aura.style.transform = "translate(" + cx + "px," + cy + "px)";
        requestAnimationFrame(loop);
      })();
    }
  }

  /* --------------------- Particle constellation ------------------------- */
  /* Restores the original tsParticles look (white dots + teal links + mouse
     repulse) as a lightweight vanilla canvas — no external library. */
  function initParticles() {
    var canvas = document.getElementById("fx-canvas");
    if (!canvas || reduceMotion) return;
    var ctx = canvas.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, parts = [], linkDist = 130, maxd2 = linkDist * linkDist;
    var dot = "rgba(255,255,255,.72)", line = "rgba(0,255,198,.28)";
    var running = true;
    var mouse = { x: -9999, y: -9999, active: false };
    var REP = 110, REP2 = REP * REP; // repulse radius

    function colors() {
      var cs = getComputedStyle(root);
      dot = cs.getPropertyValue("--particle").trim() || dot;
      line = cs.getPropertyValue("--particle-line").trim() || line;
    }
    window.__fxColors = colors;

    function resize() {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var mobile = w <= 768;
      linkDist = mobile ? 100 : 132; maxd2 = linkDist * linkDist;
      var count = mobile ? 26 : Math.min(66, Math.max(38, Math.floor((w * h) / 20000)));
      parts = [];
      for (var i = 0; i < count; i++) {
        parts.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
          r: Math.random() * 1.5 + 2.2
        });
      }
    }

    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.x += p.vx; p.y += p.vy;

        // mouse repulse — particles push away from the cursor
        if (mouse.active) {
          var mdx = p.x - mouse.x, mdy = p.y - mouse.y, md2 = mdx * mdx + mdy * mdy;
          if (md2 < REP2 && md2 > 0.01) {
            var md = Math.sqrt(md2), f = (REP - md) / REP;
            p.x += (mdx / md) * f * 3.4;
            p.y += (mdy / md) * f * 3.4;
          }
        }

        // wrap around edges
        if (p.x < -14) p.x = w + 14; else if (p.x > w + 14) p.x = -14;
        if (p.y < -14) p.y = h + 14; else if (p.y > h + 14) p.y = -14;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = dot;
        ctx.fill();

        for (var j = i + 1; j < parts.length; j++) {
          var q = parts[j];
          var dx = p.x - q.x, dy = p.y - q.y;
          var dist = dx * dx + dy * dy;
          if (dist < maxd2) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = line;
            ctx.globalAlpha = 1 - dist / maxd2;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
      requestAnimationFrame(frame);
    }

    colors();
    resize();
    window.addEventListener("resize", resize, { passive: true });
    if (finePointer) {
      window.addEventListener("pointermove", function (e) {
        mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true;
      }, { passive: true });
      window.addEventListener("pointerout", function (e) {
        if (!e.relatedTarget) mouse.active = false;
      });
    }
    document.addEventListener("visibilitychange", function () {
      running = !document.hidden;
      if (running) requestAnimationFrame(frame);
    });
    requestAnimationFrame(frame);
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
    initScrollFx();
    initActiveSection();
    initMobileNav();
    initRoleRotator();
    initCounters();
    initMagnetic();
    initTilt();
    initPointerFx();
    initParticles();
    initYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
