/* ============================================================
   MDZX — interactions
   Theme · Header · Menu · Reveal · Counters · Accordion
   Magnetic · Tilt · Spotlight · Parallax · Scrollspy
   ============================================================ */
(function () {
  "use strict";

  var docEl = document.documentElement;
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* ── 1. Theme (dark / light) ─────────────────────────── */
  var themeMeta = $('meta[name="theme-color"]');
  var savedTheme = null;
  try { savedTheme = localStorage.getItem("mdzx-theme"); } catch (e) {}

  function applyTheme(theme, animate) {
    if (animate) docEl.classList.add("theming");
    docEl.setAttribute("data-theme", theme);
    if (themeMeta) themeMeta.setAttribute("content", theme === "dark" ? "#080808" : "#F7F7F5");
    var toggle = $("#themeToggle");
    if (toggle) toggle.setAttribute("aria-pressed", String(theme === "light"));
    if (animate) {
      window.setTimeout(function () { docEl.classList.remove("theming"); }, 650);
    }
  }

  applyTheme(savedTheme === "light" || savedTheme === "dark"
    ? savedTheme
    : (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark"), false);

  $("#themeToggle").addEventListener("click", function () {
    var next = docEl.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next, !prefersReduced);
    try { localStorage.setItem("mdzx-theme", next); } catch (e) {}
  });

  /* ── 2. Header state + scroll progress ───────────────── */
  var header = $("#siteHeader");
  var progressBar = $("#scrollProgressBar");
  var ticking = false;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle("is-scrolled", y > 14);
    if (progressBar) {
      var max = docEl.scrollHeight - window.innerHeight;
      var ratio = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      progressBar.style.transform = "scaleX(" + ratio + ")";
    }
    ticking = false;
  }

  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ── 3. Mobile menu ──────────────────────────────────── */
  var menuToggle = $("#menuToggle");
  var mobileMenu = $("#mobileMenu");

  function setMenu(open) {
    if (!menuToggle || !mobileMenu) return;
    if (open) mobileMenu.hidden = false;
    window.requestAnimationFrame(function () {
      mobileMenu.classList.toggle("is-open", open);
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "إغلاق القائمة" : "فتح القائمة");
      document.body.style.overflow = open ? "hidden" : "";
    });
    if (!open) {
      window.setTimeout(function () { if (!mobileMenu.classList.contains("is-open")) mobileMenu.hidden = true; }, 420);
    }
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", function () {
      setMenu(!mobileMenu.classList.contains("is-open"));
    });
    $$("a", mobileMenu).forEach(function (a) {
      a.addEventListener("click", function () { setMenu(false); });
    });
    mobileMenu.addEventListener("click", function (e) {
      if (e.target === mobileMenu) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobileMenu.classList.contains("is-open")) {
        setMenu(false);
        menuToggle.focus();
      }
    });
  }

  /* ── 4. Reveal on scroll ─────────────────────────────── */
  var revealEls = $$(".reveal");
  if ("IntersectionObserver" in window && !prefersReduced) {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealIO.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    revealEls.forEach(function (el) { revealIO.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ── 5. Number counters ──────────────────────────────── */
  function runCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;
    if (prefersReduced) { el.textContent = String(target); return; }
    var dur = 1500;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(eased * target));
      if (p < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  var counters = $$("[data-count]");
  function runCounterOnce(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = "1";
    runCounter(el);
  }
  if ("IntersectionObserver" in window) {
    var counterIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runCounterOnce(entry.target);
          counterIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { counterIO.observe(el); });
  } else {
    counters.forEach(runCounterOnce);
  }

  /* ── 5b. Fallback for skipped elements (anchor jumps) ── */
  var skipTicking = false;
  function checkPassedElements() {
    var vh = window.innerHeight || docEl.clientHeight;
    $$(".reveal:not(.is-visible)").forEach(function (el) {
      if (el.getBoundingClientRect().top < vh * 0.92) el.classList.add("is-visible");
    });
    counters.forEach(function (el) {
      if (!el.dataset.counted && el.getBoundingClientRect().top < vh * 0.92) runCounterOnce(el);
    });
    skipTicking = false;
  }
  window.addEventListener("scroll", function () {
    if (!skipTicking) { skipTicking = true; window.requestAnimationFrame(checkPassedElements); }
  }, { passive: true });
  window.setTimeout(checkPassedElements, 900);

  /* ── 6. Hero project progress bar ────────────────────── */
  var heroProgress = $("#heroProgress");
  if (heroProgress) {
    var progIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          heroProgress.style.width = "78%";
          progIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    progIO.observe(heroProgress);
  }

  /* ── 7. Accordion (animated details) ─────────────────── */
  $$(".acc").forEach(function (details) {
    var summary = details.querySelector("summary");
    var body = details.querySelector(".acc-body");
    if (!summary || !body || prefersReduced) return;

    var animating = false;
    summary.addEventListener("click", function (e) {
      e.preventDefault();
      if (animating) return;
      animating = true;

      if (!details.open) {
        /* open: 0 → natural height */
        details.open = true;
        var h = body.scrollHeight;
        body.style.height = "0px";
        body.style.transition = "height .45s cubic-bezier(.16,1,.3,1)";
        window.requestAnimationFrame(function () {
          window.requestAnimationFrame(function () {
            body.style.height = h + "px";
            body.addEventListener("transitionend", function done(ev) {
              if (ev.propertyName !== "height") return;
              body.style.height = "";
              body.style.transition = "";
              body.removeEventListener("transitionend", done);
              animating = false;
            });
          });
        });
      } else {
        /* close: natural height → 0 */
        body.style.height = body.scrollHeight + "px";
        body.style.transition = "height .4s cubic-bezier(.16,1,.3,1)";
        window.requestAnimationFrame(function () {
          window.requestAnimationFrame(function () {
            body.style.height = "0px";
            body.addEventListener("transitionend", function done(ev) {
              if (ev.propertyName !== "height") return;
              details.open = false;
              body.style.height = "";
              body.style.transition = "";
              body.removeEventListener("transitionend", done);
              animating = false;
            });
          });
        });
        /* safety: if transitionend never fires (tab hidden etc.) */
        window.setTimeout(function () {
          if (animating) {
            details.open = false;
            body.style.height = "";
            body.style.transition = "";
            animating = false;
          }
        }, 650);
      }
    });
  });

  /* ── 8. Magnetic buttons (desktop) ───────────────────── */
  if (finePointer && !prefersReduced) {
    $$(".magnetic").forEach(function (btn) {
      var strength = 0.28;
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        btn.style.transform = "translate(" + (x * strength) + "px," + (y * strength) + "px)";
      });
      btn.addEventListener("mouseleave", function () {
        btn.style.transform = "";
      });
    });
  }

  /* ── 9. Card tilt (subtle, desktop) ──────────────────── */
  if (finePointer && !prefersReduced) {
    $$("[data-tilt]").forEach(function (card) {
      var maxTilt = 4.5;
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5;
        var py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform =
          "perspective(900px) rotateX(" + (-py * maxTilt) + "deg) rotateY(" + (px * maxTilt) + "deg)";
      });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
      });
    });
  }

  /* ── 10. Hero cursor spotlight (desktop) ─────────────── */
  var hero = $(".hero");
  var spotlight = $("#heroSpotlight");
  if (hero && spotlight && finePointer && !prefersReduced) {
    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      spotlight.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
      spotlight.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
    }, { passive: true });
  }

  /* ── 11. Gentle parallax for hero visual ─────────────── */
  var heroVisual = $("#heroVisual");
  if (heroVisual && finePointer && !prefersReduced) {
    var currentY = 0, targetY = 0;
    window.addEventListener("scroll", function () {
      targetY = Math.min(90, (window.scrollY || 0) * 0.06);
    }, { passive: true });
    (function parallaxLoop() {
      currentY += (targetY - currentY) * 0.08;
      heroVisual.style.transform = "translateY(" + currentY.toFixed(2) + "px)";
      window.requestAnimationFrame(parallaxLoop);
    })();
  }

  /* ── 12. Phone-first steps cycler ────────────────────── */
  var bpSteps = $$(".bp-step");
  if (bpSteps.length && !prefersReduced) {
    var bpIndex = 0;
    window.setInterval(function () {
      bpSteps.forEach(function (s) { s.classList.remove("is-on"); });
      bpSteps[bpIndex].classList.add("is-on");
      bpIndex = (bpIndex + 1) % bpSteps.length;
    }, 2100);
  } else if (bpSteps.length) {
    bpSteps.forEach(function (s) { s.classList.add("is-on"); });
  }

  /* ── 13. Scrollspy for nav ───────────────────────────── */
  var navLinks = $$("[data-nav]");
  var spySections = navLinks
    .map(function (a) { return $(a.getAttribute("href")); })
    .filter(Boolean);

  if (spySections.length && "IntersectionObserver" in window) {
    var spyIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (a) {
            a.classList.toggle("is-active", a.getAttribute("href") === "#" + entry.target.id);
          });
        }
      });
    }, { rootMargin: "-38% 0px -55% 0px" });
    spySections.forEach(function (s) { spyIO.observe(s); });
  }

  /* ── 14. Footer year ─────────────────────────────────── */
  var yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();
