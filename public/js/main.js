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
  var openLightbox = function () {}; // assegnata da initLightbox, usata dalla gallery

  function init() {
    setYear();
    revealHero();
    initLenis();
    initCursor();
    initNav();
    initMenu();
    initMagnetic();
    initCounters();
    initLightbox();
    initGallery();
    initForm();
    initToTop();
    initTubelight();
    initTestimonials();
    initRotator();

    if (HAS_GSAP && !REDUCED) {
      document.documentElement.classList.add("gsap-ready");
      try { initReveals(); } catch (e) {}
      try { initParallax(); } catch (e) {}
      try { initVelocity(); } catch (e) {}
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

  /* ---------- Ingresso hero ---------- */
  function revealHero() {
    if (!HAS_GSAP || REDUCED) return;
    var tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.from(".hero__title .line > span", { yPercent: 110, duration: 1.2, stagger: 0.12 }, 0)
      .from(".hero__eyebrow", { yPercent: 120, opacity: 0, duration: 0.9 }, 0.2)
      .from(".hero__sub", { y: 24, opacity: 0, duration: 0.9 }, 0.5)
      .from(".hero__cta", { y: 24, opacity: 0, duration: 0.9 }, 0.65)
      .from(".hero__scroll", { opacity: 0, duration: 0.8 }, 0.9)
      .fromTo(".hero__img", { scale: 1.25 }, { scale: 1.12, duration: 1.8, ease: "power2.out" }, 0);
    // Ken Burns: zoom lento e continuo sull'immagine hero, dopo l'ingresso
    gsap.to(".hero__img", { scale: 1.2, duration: 16, ease: "sine.inOut", repeat: -1, yoyo: true, delay: 2, overwrite: "auto" });
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

  /* ---------- Gallery: categorie → eventi → foto ---------- */
  function initGallery() {
    var host = $("#galleryCats");
    var data = window.GALLERY;
    if (!host || !data || !data.length) return;

    var arch = $("#archive"), body = $("#archiveBody"), title = $("#archiveTitle"),
        back = $("#archiveBack"), close = $("#archiveClose");
    var level = 0, curCat = 0;

    function esc(s) {
      return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
      });
    }

    // ---- Livello 1: card categoria (in pagina) ----
    data.forEach(function (cat, ci) {
      var n = (cat.eventi || []).length;
      var card = document.createElement("button");
      card.className = "gcat reveal-card"; card.type = "button";
      card.setAttribute("aria-label", cat.nome + " — " + n + (n === 1 ? " evento" : " eventi"));
      var idx = ("0" + (ci + 1)).slice(-2);
      card.innerHTML =
        '<span class="gcat__media"><img src="' + esc(cat.cover) + '" alt="" loading="lazy" /></span>' +
        '<span class="gcat__idx">' + idx + '</span>' +
        '<span class="gcat__meta">' +
          '<span class="gcat__name">' + esc(cat.nome) + '</span>' +
          '<span class="gcat__count">' + n + (n === 1 ? " evento" : " eventi") + '</span>' +
          '<span class="gcat__go">Scopri \u2192</span>' +
        '</span>';
      card.addEventListener("click", function () { openCategory(ci); });
      host.appendChild(card);
    });

    if (!arch) return; // senza overlay, le card restano decorative

    function openArchive() { arch.classList.add("is-open"); arch.setAttribute("aria-hidden", "false"); }
    function closeArchive() { arch.classList.remove("is-open"); arch.setAttribute("aria-hidden", "true"); level = 0; }

    // ---- Livello 2: lista eventi ----
    function openCategory(ci) {
      curCat = ci; level = 1;
      var cat = data[ci];
      title.textContent = cat.nome;
      body.className = "archive__body archive__body--events";
      body.innerHTML = "";
      body.scrollTop = 0;
      var eventi = cat.eventi || [];
      if (!eventi.length) {
        body.innerHTML = '<p class="archive__empty">Nessun evento ancora pubblicato in questa categoria.</p>';
      } else {
        eventi.forEach(function (ev, ei) {
          var cover = (ev.foto && ev.foto[0]) || cat.cover;
          var nf = (ev.foto || []).length;
          var c = document.createElement("button");
          c.className = "gevent"; c.type = "button";
          c.innerHTML =
            '<span class="gevent__media"><img src="' + esc(cover) + '" alt="" loading="lazy" /></span>' +
            '<span class="gevent__meta">' +
              '<span class="gevent__name">' + esc(ev.nome) + '</span>' +
              (ev.info ? '<span class="gevent__info">' + esc(ev.info) + '</span>' : '') +
              '<span class="gevent__count">' + nf + (nf === 1 ? " foto" : " foto") + '</span>' +
            '</span>';
          c.addEventListener("click", function () { openEvent(ci, ei); });
          body.appendChild(c);
        });
      }
      openArchive();
    }

    // ---- Livello 3: foto dell'evento ----
    function openEvent(ci, ei) {
      level = 2;
      var ev = data[ci].eventi[ei];
      title.textContent = ev.nome + (ev.info ? " — " + ev.info : "");
      body.className = "archive__body archive__body--photos";
      body.innerHTML = "";
      body.scrollTop = 0;
      var foto = ev.foto || [];
      var caps = foto.map(function () { return ev.nome; });
      foto.forEach(function (src, pi) {
        var b = document.createElement("button");
        b.className = "gphoto"; b.type = "button";
        b.innerHTML = '<img src="' + esc(src) + '" alt="' + esc(ev.nome) + ' — foto ' + (pi + 1) + '" loading="lazy" />';
        b.addEventListener("click", function () { openLightbox(foto, caps, pi); });
        body.appendChild(b);
      });
    }

    function goBack() {
      if (level === 2) openCategory(curCat); // dalle foto torna agli eventi
      else closeArchive();                    // dagli eventi torna al sito
    }

    if (back) back.addEventListener("click", goBack);
    if (close) close.addEventListener("click", closeArchive);
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape" || !arch.classList.contains("is-open")) return;
      var lb = $("#lightbox");
      if (lb && lb.classList.contains("is-open")) return; // il lightbox gestisce il proprio Esc
      goBack();
    });
  }

  /* ---------- Barra di progresso ---------- */
  function initScrollProgress() {
    var bar = $(".scroll-progress span"); if (!bar) return;
    gsap.to(bar, { scaleX: 1, ease: "none",
      scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.3 } });
    gsap.set(bar, { scaleX: 0, width: "100%" });
  }

  /* ---------- Lightbox (lista dinamica di foto) ---------- */
  function initLightbox() {
    var box = $("#lightbox"); if (!box) return;
    var img = $("#lbImg"), btnClose = $("#lbClose"), btnPrev = $("#lbPrev"), btnNext = $("#lbNext");
    var srcs = [], caps = [], i = 0;

    function show(n) {
      if (!srcs.length) return;
      i = (n + srcs.length) % srcs.length;
      img.src = srcs[i];
      img.alt = caps[i] || "";
      if (HAS_GSAP) gsap.fromTo(img, { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.5, ease: "power3.out" });
    }
    function open(list, captions, n) {
      srcs = list || []; caps = captions || [];
      if (!srcs.length) return;
      show(n || 0); box.classList.add("is-open"); box.setAttribute("aria-hidden", "false");
      if (lenis) lenis.stop();
    }
    function close() {
      box.classList.remove("is-open"); box.setAttribute("aria-hidden", "true");
      // Non riattivare lo scroll se l'archivio è ancora aperto sotto
      var arch = $("#archive");
      if (lenis && !(arch && arch.classList.contains("is-open"))) lenis.start();
    }
    if (btnClose) btnClose.addEventListener("click", close);
    if (btnPrev) btnPrev.addEventListener("click", function (e) { e.stopPropagation(); show(i - 1); });
    if (btnNext) btnNext.addEventListener("click", function (e) { e.stopPropagation(); show(i + 1); });
    box.addEventListener("click", function (e) { if (e.target === box) close(); });
    document.addEventListener("keydown", function (e) {
      if (!box.classList.contains("is-open")) return;
      // Blocca gli altri gestori (es. l'archivio) così Esc chiude SOLO il lightbox
      if (e.key === "Escape") { e.stopImmediatePropagation(); close(); }
      else if (e.key === "ArrowLeft") show(i - 1);
      else if (e.key === "ArrowRight") show(i + 1);
    });

    openLightbox = open; // esposta alla gallery
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
      window.location.href = "mailto:fullframe@blu.it?subject=" + subject + "&body=" + body;
      if (note) note.textContent = "Grazie! Si aprirà il tuo programma di posta per inviare il messaggio.";
      form.reset();
    });
  }

  /* ---------- Torna su ---------- */
  function initToTop() {
    var btn = $("#toTop"); if (!btn) return;
    btn.addEventListener("click", function () { scrollToTarget("#hero"); });
  }

  /* ---------- Tubelight navbar: indicatore luminoso sulla voce attiva ---------- */
  function initTubelight() {
    var tube = $("#tube"); if (!tube) return;
    var lamp = $("#tubeLamp");
    var links = $$(".tube__link", tube);
    if (!links.length) return;

    function moveLamp(link) {
      if (!lamp || !link) return;
      lamp.style.left = link.offsetLeft + "px";
      lamp.style.width = link.offsetWidth + "px";
    }
    function setActive(link) {
      links.forEach(function (l) { l.classList.toggle("is-active", l === link); });
      moveLamp(link);
    }
    function currentActive() { return tube.querySelector(".tube__link.is-active") || links[0]; }

    requestAnimationFrame(function () { moveLamp(currentActive()); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { moveLamp(currentActive()); });
    window.addEventListener("resize", function () { moveLamp(currentActive()); });
    links.forEach(function (link) { link.addEventListener("click", function () { setActive(link); }); });

    // Scroll-spy: attiva la voce in base alla sezione visibile
    var map = {};
    links.forEach(function (l) { var s = document.getElementById(l.dataset.sec); if (s) map[l.dataset.sec] = l; });
    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting && map[en.target.id]) setActive(map[en.target.id]); });
      }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
      Object.keys(map).forEach(function (id) { var s = document.getElementById(id); if (s) io.observe(s); });
    }
  }

  /* ---------- Scroll velocity: due file di foto reattive allo scroll ---------- */
  function initVelocity() {
    var rows = $$(".velocity__row");
    if (!rows.length || !HAS_GSAP || REDUCED) return;
    rows.forEach(function (row) {
      var track = row.querySelector(".velocity__track"); if (!track) return;
      var v = parseFloat(row.dataset.velocity) || 2;
      var base = Math.max(0.4, Math.abs(v) / 2.2);
      var goLeft = v > 0;
      gsap.set(track, { xPercent: goLeft ? 0 : -50 });
      var tw = gsap.to(track, { xPercent: goLeft ? -50 : 0, duration: 30, ease: "none", repeat: -1 });
      tw.timeScale(base);
      if (!HAS_ST) return;
      var target = 1;
      ScrollTrigger.create({
        onUpdate: function (self) { target = 1 + Math.min(Math.abs(self.getVelocity()) / 300, 5); }
      });
      gsap.ticker.add(function () { target += (1 - target) * 0.05; tw.timeScale(base * target); });
    });
  }

  /* ---------- Testimonianze circolari ---------- */
  function initTestimonials() {
    var wrap = $("#testiImages"); if (!wrap) return;
    var imgs = $$("img", wrap);
    var nameEl = $("#testiName"), roleEl = $("#testiRole"), quoteEl = $("#testiQuote");
    var prev = $("#testiPrev"), next = $("#testiNext");
    if (!imgs.length || !quoteEl) return;

    var data = [
      { name: "Giulia & Marco", role: "Matrimonio a Villa Reale — Giugno 2024",
        quote: "Salvatore ha catturato la nostra giornata in un modo che ancora ci emoziona. Guardando le foto rivivamo ogni momento, esattamente come lo abbiamo sentito." },
      { name: "Sara & Luca", role: "Matrimonio sul lago — Settembre 2023",
        quote: "Discreto, gentile, invisibile al punto giusto. Non ci siamo mai sentiti in posa, eppure ogni scatto è perfetto. Le nostre famiglie sono ancora senza parole." },
      { name: "Elena & Davide", role: "Cerimonia in campagna — Maggio 2024",
        quote: "Cercavamo qualcuno che raccontasse la verità del nostro giorno, non foto finte. Abbiamo trovato molto di più: un vero narratore di emozioni." }
    ];
    var n = imgs.length, active = 0, timer = null;

    function place(i) {
      var img = imgs[i];
      img.classList.toggle("is-active", i === active);
      var isLeft = (active - 1 + n) % n === i;
      var isRight = (active + 1) % n === i;
      if (i === active) { img.style.transform = "translateX(0) scale(1) rotateY(0deg)"; img.style.opacity = "1"; img.style.zIndex = "3"; }
      else if (isLeft) { img.style.transform = "translateX(-48%) scale(0.85) rotateY(14deg)"; img.style.opacity = "0.45"; img.style.zIndex = "2"; }
      else if (isRight) { img.style.transform = "translateX(48%) scale(0.85) rotateY(-14deg)"; img.style.opacity = "0.45"; img.style.zIndex = "2"; }
      else { img.style.transform = "translateX(0) scale(0.8)"; img.style.opacity = "0"; img.style.zIndex = "1"; }
    }
    function renderQuote(text) {
      quoteEl.innerHTML = "";
      text.split(" ").forEach(function (w, i) {
        var s = document.createElement("span");
        s.textContent = w + " ";
        s.style.filter = "blur(10px)"; s.style.opacity = "0"; s.style.transform = "translateY(6px)";
        s.style.transition = "filter .5s ease, opacity .5s ease, transform .5s ease";
        s.style.transitionDelay = (0.025 * i) + "s";
        quoteEl.appendChild(s);
        requestAnimationFrame(function () { requestAnimationFrame(function () {
          s.style.filter = "blur(0)"; s.style.opacity = "1"; s.style.transform = "none";
        }); });
      });
    }
    function update() {
      for (var i = 0; i < n; i++) place(i);
      var d = data[active % data.length];
      if (nameEl) nameEl.textContent = d.name;
      if (roleEl) roleEl.textContent = d.role;
      renderQuote(d.quote);
    }
    function go(dir) { active = (active + dir + n) % n; update(); restart(); }
    function restart() { if (timer) clearInterval(timer); timer = setInterval(function () { go(1); }, 5000); }

    if (prev) prev.addEventListener("click", function () { go(-1); });
    if (next) next.addEventListener("click", function () { go(1); });
    imgs.forEach(function (img, i) { img.addEventListener("click", function () { if (i !== active) { active = i; update(); restart(); } }); });

    update(); restart();
    var section = $("#testimonials");
    if (section && "IntersectionObserver" in window) {
      new IntersectionObserver(function (e) {
        e.forEach(function (en) { if (en.isIntersecting) restart(); else if (timer) { clearInterval(timer); timer = null; } });
      }, { threshold: 0.15 }).observe(section);
    }
  }

  /* ---------- Occhiello hero: parola che ruota ---------- */
  function initRotator() {
    var el = $("#heroRotator"); if (!el) return;
    var words = (el.getAttribute("data-words") || "").split("|").filter(Boolean);
    if (words.length < 2 || REDUCED) return;
    var i = 0;
    el.style.display = "inline-block";
    el.style.transition = "opacity .4s " + "cubic-bezier(0.22,1,0.36,1), transform .4s cubic-bezier(0.22,1,0.36,1)";
    setInterval(function () {
      i = (i + 1) % words.length;
      el.style.opacity = "0"; el.style.transform = "translateY(-8px)";
      setTimeout(function () {
        el.textContent = words[i];
        el.style.opacity = "1"; el.style.transform = "translateY(0)";
      }, 400);
    }, 2800);
  }

  /* ---------- Avvio ---------- */
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
