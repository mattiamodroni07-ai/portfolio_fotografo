/* =========================================================
   Salvatore Lacalaprice — Portfolio · interazioni & animazioni
   Progressive enhancement: senza JS/CDN il sito resta usabile.
   ========================================================= */
(function () {
  "use strict";

  var HAS_GSAP = typeof window.gsap !== "undefined";
  var HAS_ST = HAS_GSAP && typeof window.ScrollTrigger !== "undefined";
  var HAS_LENIS = typeof window.Lenis !== "undefined";
  var HAS_SPLIT = typeof window.SplitType !== "undefined";
  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var TOUCH = window.matchMedia("(hover: none)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  if (HAS_ST) { try { gsap.registerPlugin(ScrollTrigger); } catch (e) {} }

  var lenis = null;

  function init() {
    setYear();
    initPreloader();
    initLenis();
    initCursor();
    initNav();
    initMenu();
    initMagnetic();
    initCounters();
    initLightbox();
    initForm();
    initToTop();

    if (HAS_GSAP && !REDUCED) {
      document.documentElement.classList.add("gsap-ready");
      try { initReveals(); } catch (e) {}
      try { initParallax(); } catch (e) {}
      try { initPortfolio(); } catch (e) {}
      try { initMarquee(); } catch (e) {}
      try { initScrollProgress(); } catch (e) {}
    }

    // Ricalcola i trigger quando font/immagini cambiano il layout
    if (HAS_ST) {
      window.addEventListener("load", function () { ScrollTrigger.refresh(); });
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () { ScrollTrigger.refresh(); });
      }
    }
  }

  /* ---------- Anno footer ---------- */
  function setYear() {
    var y = $("#year"); if (y) y.textContent = new Date().getFullYear();
  }

  /* ---------- Preloader ---------- */
  function initPreloader() {
    var pre = $("#preloader");
    if (!pre) { revealHero(); return; }
    var bar = $(".preloader__bar span", pre);
    var count = $(".preloader__count", pre);

    function done() {
      if (pre.dataset.done) return;
      pre.dataset.done = "1";
      if (HAS_GSAP) {
        gsap.to(pre, { yPercent: -100, duration: 1, ease: "power4.inOut",
          onComplete: function () { pre.style.display = "none"; } });
      } else {
        pre.style.transition = "opacity .6s"; pre.style.opacity = "0";
        setTimeout(function () { pre.style.display = "none"; }, 600);
      }
      revealHero();
    }

    // Failsafe assoluto
    setTimeout(done, 4200);

    if (HAS_GSAP && !REDUCED) {
      var obj = { v: 0 };
      gsap.to(obj, {
        v: 100, duration: 1.6, ease: "power2.inOut",
        onUpdate: function () {
          var val = Math.round(obj.v);
          if (count) count.textContent = val;
          if (bar) bar.style.width = val + "%";
        },
        onComplete: function () { gsap.delayedCall(0.15, done); }
      });
    } else {
      if (bar) bar.style.width = "100%";
      if (count) count.textContent = "100";
      setTimeout(done, 500);
    }
  }

  function revealHero() {
    if (!HAS_GSAP || REDUCED) return;
    var tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.from(".hero__title .line > span", { yPercent: 110, duration: 1.2, stagger: 0.12 }, 0)
      .from(".hero__eyebrow", { yPercent: 120, opacity: 0, duration: 0.9 }, 0.2)
      .from(".hero__sub", { y: 24, opacity: 0, duration: 0.9 }, 0.5)
      .from(".hero__cta", { y: 24, opacity: 0, duration: 0.9 }, 0.65)
      .from(".hero__scroll", { opacity: 0, duration: 0.8 }, 0.9)
      .fromTo(".hero__img", { scale: 1.25 }, { scale: 1.12, duration: 1.8, ease: "power2.out" }, 0);
  }

  /* ---------- Smooth scroll (Lenis) ---------- */
  function initLenis() {
    if (!HAS_LENIS || REDUCED) return;
    try {
      lenis = new Lenis({ duration: 1.1, smoothWheel: true,
        easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); } });
      if (HAS_ST) {
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
        gsap.ticker.lagSmoothing(0);
      } else {
        function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);
      }
    } catch (e) { lenis = null; }
  }

  function scrollToTarget(target) {
    var el = typeof target === "string" ? $(target) : target;
    if (!el && typeof target === "string" && target === "#hero") { el = document.body; }
    if (lenis && el) { lenis.scrollTo(el, { offset: 0, duration: 1.2 }); }
    else if (el && el.scrollIntoView) { el.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth" }); }
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ---------- Custom cursor ---------- */
  function initCursor() {
    if (TOUCH) return;
    var cursor = $(".cursor"); if (!cursor) return;
    var dot = $(".cursor__dot", cursor);
    var ring = $(".cursor__ring", cursor);
    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var rx = mx, ry = my;
    window.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = "translate(" + mx + "px," + my + "px) translate(-50%,-50%)";
    });
    (function loop() {
      rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15;
      ring.style.transform = "translate(" + rx + "px," + ry + "px) translate(-50%,-50%)";
      requestAnimationFrame(loop);
    })();
    var hoverSel = "a, button, [data-magnetic], .shot";
    $$(hoverSel).forEach(function (el) {
      el.addEventListener("mouseenter", function () {
        document.body.classList.add("cursor-hover");
        cursor.querySelector(".cursor__label").textContent = el.classList.contains("shot") ? "Vedi" : "";
      });
      el.addEventListener("mouseleave", function () { document.body.classList.remove("cursor-hover"); });
    });
  }

  /* ---------- Navbar: scrolled + hide on scroll down ---------- */
  function initNav() {
    var nav = $("#nav"); if (!nav) return;
    var last = 0;
    function onScroll(y) {
      nav.classList.toggle("is-scrolled", y > 40);
      if (y > last && y > 300 && !document.body.classList.contains("menu-open")) nav.classList.add("is-hidden");
      else nav.classList.remove("is-hidden");
      last = y;
    }
    if (lenis) lenis.on("scroll", function (e) { onScroll(e.scroll || window.scrollY); });
    else window.addEventListener("scroll", function () { onScroll(window.scrollY); }, { passive: true });

    // Smooth-scroll per i link interni
    $$('a[href^="#"][data-link]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var href = a.getAttribute("href");
        if (href && href.length > 1) { e.preventDefault(); closeMenu(); scrollToTarget(href); }
      });
    });
  }

  /* ---------- Fullscreen menu ---------- */
  function openMenu() {
    var menu = $("#menu"), toggle = $("#menuToggle");
    if (!menu) return;
    document.body.classList.add("menu-open");
    menu.classList.add("is-open"); menu.setAttribute("aria-hidden", "false");
    if (toggle) { toggle.setAttribute("aria-expanded", "true"); toggle.setAttribute("aria-label", "Chiudi menu"); }
    if (HAS_GSAP && !REDUCED) {
      gsap.to(menu, { clipPath: "inset(0 0 0% 0)", duration: 0.9, ease: "power4.inOut" });
      gsap.from("#menu .menu__nav a", { yPercent: 120, opacity: 0, duration: 0.8, stagger: 0.08, delay: 0.2, ease: "power4.out" });
      gsap.from("#menu .menu__foot a", { opacity: 0, y: 20, duration: 0.6, stagger: 0.06, delay: 0.5 });
    } else { menu.style.clipPath = "inset(0 0 0% 0)"; }
  }
  function closeMenu() {
    var menu = $("#menu"), toggle = $("#menuToggle");
    if (!menu || !menu.classList.contains("is-open")) return;
    document.body.classList.remove("menu-open");
    menu.classList.remove("is-open"); menu.setAttribute("aria-hidden", "true");
    if (toggle) { toggle.setAttribute("aria-expanded", "false"); toggle.setAttribute("aria-label", "Apri menu"); }
    if (HAS_GSAP && !REDUCED) gsap.to(menu, { clipPath: "inset(0 0 100% 0)", duration: 0.7, ease: "power4.inOut" });
    else menu.style.clipPath = "inset(0 0 100% 0)";
  }
  function initMenu() {
    var toggle = $("#menuToggle"); if (!toggle) return;
    toggle.addEventListener("click", function () {
      if (document.body.classList.contains("menu-open")) closeMenu(); else openMenu();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
  }

  /* ---------- Magnetic elements ---------- */
  function initMagnetic() {
    if (!HAS_GSAP || TOUCH || REDUCED) return;
    $$("[data-magnetic]").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var r = el.getBoundingClientRect();
        gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.5, duration: 0.6, ease: "power3.out" });
      });
      el.addEventListener("mouseleave", function () {
        gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1,0.4)" });
      });
    });
  }

  /* ---------- Counters ---------- */
  function initCounters() {
    var nums = $$(".stat__num[data-count]"); if (!nums.length) return;
    function run(el) {
      var target = parseInt(el.dataset.count, 10) || 0, dur = 2000, start = null;
      function step(t) {
        if (!start) start = t;
        var p = Math.min((t - start) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString("it-IT");
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { run(en.target); io.unobserve(en.target); }
        });
      }, { threshold: 0.5 });
      nums.forEach(function (n) { io.observe(n); });
    } else nums.forEach(run);
  }

  /* ---------- Reveal animations ---------- */
  function splitLines(el) {
    if (!HAS_SPLIT) return null;
    var s = new SplitType(el, { types: "lines", tagName: "span" });
    (s.lines || []).forEach(function (line) {
      line.style.display = "block"; line.style.overflow = "hidden";
      var inner = document.createElement("span");
      inner.className = "line-inner"; inner.style.display = "block";
      while (line.firstChild) inner.appendChild(line.firstChild);
      line.appendChild(inner);
    });
    return s;
  }

  function initReveals() {
    // Testo per righe con mascheramento
    $$(".reveal-line").forEach(function (el) {
      var split = splitLines(el);
      var targets = split ? el.querySelectorAll(".line-inner") : [el];
      gsap.set(targets, { yPercent: split ? 110 : 0, opacity: split ? 1 : 0 });
      ScrollTrigger.create({
        trigger: el, start: "top 85%", once: true,
        onEnter: function () {
          gsap.to(targets, { yPercent: 0, opacity: 1, duration: 1, ease: "power4.out", stagger: 0.09 });
        }
      });
    });

    // Fade + rise
    $$(".reveal-fade").forEach(function (el) {
      gsap.set(el, { y: 30, opacity: 0 });
      ScrollTrigger.create({ trigger: el, start: "top 88%", once: true,
        onEnter: function () { gsap.to(el, { y: 0, opacity: 1, duration: 1, ease: "power3.out" }); } });
    });

    // Card a comparsa
    $$(".reveal-card").forEach(function (el, i) {
      gsap.set(el, { y: 50, opacity: 0 });
      ScrollTrigger.create({ trigger: el, start: "top 90%", once: true,
        onEnter: function () { gsap.to(el, { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: (i % 2) * 0.08 }); } });
    });

    // Immagini con reveal clip + scala
    $$(".reveal-img").forEach(function (wrap) {
      var img = wrap.querySelector("img");
      gsap.set(wrap, { clipPath: "inset(100% 0 0 0)" });
      if (img) gsap.set(img, { scale: 1.3 });
      ScrollTrigger.create({ trigger: wrap, start: "top 82%", once: true,
        onEnter: function () {
          gsap.to(wrap, { clipPath: "inset(0% 0 0 0)", duration: 1.3, ease: "power4.inOut" });
          if (img) gsap.to(img, { scale: 1, duration: 1.6, ease: "power3.out" });
        } });
    });
  }

  /* ---------- Parallax ---------- */
  function initParallax() {
    $$("[data-parallax]").forEach(function (el) {
      var speed = parseFloat(el.dataset.parallax) || 0.15;
      gsap.to(el, {
        yPercent: speed * 100, ease: "none",
        scrollTrigger: { trigger: el.closest("section") || el, start: "top bottom", end: "bottom top", scrub: true }
      });
    });
  }

  /* ---------- Portfolio orizzontale (desktop) ---------- */
  function initPortfolio() {
    var track = $("#portfolioTrack"), pin = $("#portfolioPin");
    if (!track || !pin || !gsap.matchMedia) return;
    var mm = gsap.matchMedia();
    mm.add("(min-width: 901px)", function () {
      var amount = function () { return track.scrollWidth - window.innerWidth; };
      var tween = gsap.to(track, { x: function () { return -amount(); }, ease: "none" });
      ScrollTrigger.create({
        trigger: pin, start: "top top", end: function () { return "+=" + amount(); },
        pin: true, animation: tween, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true
      });
    });
  }

  /* ---------- Marquee con reattivita' alla velocita' ---------- */
  function initMarquee() {
    var track = $("#marquee"); if (!track) return;
    var mq = gsap.to(track, { xPercent: -50, repeat: -1, duration: 26, ease: "none" });
    if (!HAS_ST) return;
    var target = 1;
    ScrollTrigger.create({
      onUpdate: function (self) {
        var v = self.getVelocity();
        target = 1 + Math.min(Math.abs(v) / 320, 5);
        gsap.to(track, { skewX: gsap.utils.clamp(-6, 6, v / 500), duration: 0.4, overwrite: "auto" });
      }
    });
    // La velocita' torna dolcemente al valore base (direzione sempre costante)
    gsap.ticker.add(function () { target += (1 - target) * 0.05; mq.timeScale(target); });
  }

  /* ---------- Barra di progresso ---------- */
  function initScrollProgress() {
    var bar = $(".scroll-progress span"); if (!bar) return;
    gsap.to(bar, { scaleX: 1, ease: "none",
      scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.3 } });
    gsap.set(bar, { scaleX: 0, width: "100%" });
  }

  /* ---------- Lightbox ---------- */
  function initLightbox() {
    var box = $("#lightbox"); if (!box) return;
    var img = $("#lbImg"), btnClose = $("#lbClose"), btnPrev = $("#lbPrev"), btnNext = $("#lbNext");
    var shots = $$(".shot[data-lightbox]");
    var srcs = shots.map(function (s) { return s.getAttribute("data-lightbox"); });
    var i = 0;

    function show(n) {
      i = (n + srcs.length) % srcs.length;
      img.src = srcs[i];
      var fig = shots[i].querySelector("figcaption");
      img.alt = fig ? fig.textContent : "";
      if (HAS_GSAP) gsap.fromTo(img, { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" });
    }
    function open(n) {
      show(n); box.classList.add("is-open"); box.setAttribute("aria-hidden", "false");
      if (lenis) lenis.stop();
    }
    function close() {
      box.classList.remove("is-open"); box.setAttribute("aria-hidden", "true");
      if (lenis) lenis.start();
    }
    shots.forEach(function (s, n) { s.addEventListener("click", function () { open(n); }); });
    if (btnClose) btnClose.addEventListener("click", close);
    if (btnPrev) btnPrev.addEventListener("click", function (e) { e.stopPropagation(); show(i - 1); });
    if (btnNext) btnNext.addEventListener("click", function (e) { e.stopPropagation(); show(i + 1); });
    box.addEventListener("click", function (e) { if (e.target === box) close(); });
    document.addEventListener("keydown", function (e) {
      if (!box.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") show(i - 1);
      else if (e.key === "ArrowRight") show(i + 1);
    });
  }

  /* ---------- Form (mailto, nessun backend) ---------- */
  function initForm() {
    var form = $("#contactForm"); if (!form) return;
    var note = $("#formNote");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = $("#name").value.trim();
      var email = $("#email").value.trim();
      var msg = $("#message").value.trim();
      if (!name || !email || !msg || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        if (note) note.textContent = "Compila tutti i campi con un'email valida.";
        return;
      }
      var subject = encodeURIComponent("Richiesta info — " + name);
      var body = encodeURIComponent(msg + "\n\n— " + name + " (" + email + ")");
      window.location.href = "mailto:info@salvatorelacalaprice.it?subject=" + subject + "&body=" + body;
      if (note) note.textContent = "Grazie! Si aprirà il tuo programma di posta per inviare il messaggio.";
      form.reset();
    });
  }

  /* ---------- Torna su ---------- */
  function initToTop() {
    var btn = $("#toTop"); if (!btn) return;
    btn.addEventListener("click", function () { scrollToTarget("#hero"); });
  }

  /* ---------- Avvio ---------- */
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
