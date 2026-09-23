(function () {
  "use strict";

  // Always begin at the top (hero), including when the page is restored from
  // the back/forward cache. The pinned-scroll timing below reads scroll
  // position on init, so this has to run before any of it.
  window.scrollTo(0, 0);
  window.addEventListener("pageshow", function (e) {
    if (e.persisted) {
      window.scrollTo(0, 0);
    }
  });

  /* ---------------- intro loader ---------------- */
  // Runs immediately (not on DOMContentLoaded) since this script sits at the
  // end of body, after the loader markup — the DOM it needs already exists.
  // Everything else on the page renders and animates in behind the opaque
  // overlay the whole time; only the cycling words are the loader's own work.
  (function initLoader() {
    var loader = document.getElementById("loader");
    var cycleEl = document.getElementById("loaderCycle");
    var barFill = document.getElementById("loaderBarFill");
    if (!loader || !cycleEl) {
      return;
    }

    // Only play the full branded intro when someone actually arrives at the
    // site (direct load, refresh, bookmark, external link) — internal
    // navigation back to index.html (e.g. clicking the logo from a service
    // page) sets this flag just before navigating, in initPageTransitions(),
    // so it skips straight to the hero instead of replaying the ~2.5s
    // intro. Bail out before the loader ever paints (rather than adding
    // it, then immediately fading it back out over 0.6s) — that fade was
    // still a visible flash of the branded screen for a beat.
    var skipIntro = false;
    try {
      skipIntro = sessionStorage.getItem("as-skip-loader") === "1";
      sessionStorage.removeItem("as-skip-loader");
    } catch (e) {}

    if (skipIntro) {
      loader.style.display = "none";
      // The body starts with class="is-loading" hardcoded in the HTML
      // itself (so the loader covers everything even before this script
      // runs) — normally finish() strips it once the intro's done, but
      // that never runs on this path, so without this the hero stayed
      // permanently forced to opacity: 0 by body.is-loading .hero ... in
      // styles.css, i.e. "the hero is empty" after skipping the intro.
      document.body.classList.remove("is-loading");
      var skipHeroVideo = document.getElementById("heroVideo");
      if (skipHeroVideo) {
        skipHeroVideo.play().catch(function () {});
      }
      return;
    }

    var FINAL_WORD = "Strategy";
    var TOTAL_STEPS = 9; // kept in step with the old words-list length, for setProgress's math

    document.body.classList.add("is-loading");

    function setProgress(step) {
      if (barFill) {
        barFill.style.width = Math.min(100, (step / TOTAL_STEPS) * 100) + "%";
      }
    }

    function finish() {
      cycleEl.textContent = FINAL_WORD;
      cycleEl.classList.remove("is-flip");
      cycleEl.classList.add("is-final");
      setProgress(TOTAL_STEPS);
      window.setTimeout(function () {
        loader.classList.add("is-done");
        document.body.classList.remove("is-loading");
      }, 550);
    }

    // The word-cycling effect is retired (words stay hidden — only the mark
    // shows now), so just animate the progress bar up and finish, instead of
    // stepping through the old words list.
    setProgress(TOTAL_STEPS);
    window.setTimeout(finish, 2200);

    // Start the video a little before the bar's own 2s fill finishes,
    // so it's already moving under the loader rather than only once
    // everything else is done.
    window.setTimeout(function () {
      var heroVideo = document.getElementById("heroVideo");
      if (heroVideo) {
        heroVideo.play().catch(function () {});
      }
    }, 1700);
  })();

  var DEFAULT_LANG = "en";

  var translations = {
    el: {
      "meta.title": "Marketing that brings brands forward — Atomic Strategy",
      "meta.description": "Atomic Strategy — boutique brand & marketing strategy studio στο Ηράκλειο Κρήτης.",
      "a11y.skipLink": "Μετάβαση στο περιεχόμενο",

      "nav.about": "Σχετικά",
      "nav.services": "Τι κάνουμε",
      "nav.contact": "Επικοινωνία",
      "nav.cta": "Επικοινωνία",
      "nav.servicesFooterPrompt": "Δεν ξέρεις από πού να ξεκινήσεις;",
      "nav.servicesFooterCta": "Κλείσε ένα ραντεβού →",

      "hero.title": "<span class=\"hero-title-line hero-title-line-1\">Μάρκετινγκ που πάει τα</span><span class=\"hero-title-line hero-title-line-2\"><span class=\"glow-text\">brands</span> <span class=\"glow-text\">μπροστά</span>.</span>",
      "hero.scroll": "Εξερεύνησε",

      "about.kicker": "Σχετικά",
      "about.heading": "Λίγα λόγια για εμάς",
      "about.body": "Το Atomic Strategy είναι ένα boutique brand & marketing strategy studio. Δουλεύουμε με brands που θέλουν να ξεχωρίσουν από το πλήθος, συνδυάζοντας στρατηγική με δημιουργικό περιεχόμενο για να χτίσουν ισχυρή ψηφιακή παρουσία και να πετύχουν ουσιαστική ανάπτυξη.",

      "results.kicker": "Οργανικά αποτελέσματα των πελατών μας",
      "results.l1": "Αύξηση κοινού στο Instagram",
      "results.l2": "Αύξηση followers",
      "results.l3": "Οργανικές προβολές ανά περιεχόμενο",
      "results.l4": "Οργανικές προβολές σε όλους τους λογαριασμούς που διαχειριζόμαστε",
      "results.l5": "Κοινό TikTok χτισμένο από το μηδέν",
      "results.l6": "Ανάπτυξη TikTok σε 30 μέρες",

      "services.kicker": "Οι Υπηρεσίες μας",
      "services.heading": "Τι κάνουμε για εσένα.",
      "services.subheading": "Social, διαφημίσεις και web — χτισμένα γύρω από το funnel που πραγματικά ακολουθούν οι πελάτες σου, όχι ένα ημερολόγιο περιεχομένου για το θεαθήναι.",
      "services.svc1Sub": "(Meta & TikTok)",
      "services.svc1B1": "Ανάπτυξη εξατομικευμένης στρατηγικής marketing για την επιχείρησή σου",
      "services.svc1B2": "Δημιουργία καινοτόμων concepts για την αποτελεσματική προβολή του brand σου",
      "services.svc1B3": "Παραγωγή περιεχομένου ανάλογα με τη συχνότητα που χρειάζεσαι (+ εύρεση μοντέλων)",
      "services.svc1B4": "Επεξεργασία περιεχομένου ανάλογα με την πλατφόρμα",
      "services.svc1B5": "Ανέβασμα με SEO-optimized περιγραφές",
      "services.svc2B1": "Ανάπτυξη στρατηγικής βασισμένης στο Customer Funnel",
      "services.svc2B2": "Δημιουργία και διαχείριση καμπανιών",
      "services.svc2B3": "Copywriting διαφημίσεων",
      "services.svc2B4": "Δημιουργία Retargeting Audiences (η καλύτερη τακτική)",
      "services.svc2B5": "Παραγωγή creative για τις διαφημίσεις (αν χρειαστεί)",
      "services.svc2B6": "Διαχείριση budget & μηνιαία αναφορά",
      "service1.title": "Διαχείριση Social Media",
      "service1.desc": "Στρατηγική, παραγωγή και διαχείριση περιεχομένου για Meta & TikTok, προσαρμοσμένα στο brand σου.",
      "service2.title": "Meta & Google Ads",
      "service2.desc": "Καμπάνιες βασισμένες στο customer funnel, με στοχευμένο retargeting και μηνιαίο reporting.",
      "service3.title": "Κατασκευή Ιστοσελίδων",
      "service3.desc": "Γρήγορες, custom ιστοσελίδες φτιαγμένες να μετατρέπουν — όχι απλώς να δείχνουν ωραία.",
      "service4.title": "Brand Strategy",
      "service4.desc": "Θέση, αφήγηση και ταυτότητα που κάνουν το brand σου να ξεχωρίζει από το πλήθος.",


      "contact.kicker": "Επικοινωνία",
      "contact.heading": "Ας φτιάξουμε κάτι μαζί",
      "contact.body": "Έχεις ένα project στο μυαλό σου; Πες μας λίγα λόγια και θα επικοινωνήσουμε μαζί σου σύντομα.",
      "contact.formName": "Όνομα",
      "contact.formEmail": "Email",
      "contact.formMessage": "Μήνυμα",
      "contact.formSubmit": "Στείλε μήνυμα",
      "contact.formNote": "Ανοίγει η εφαρμογή email σου με τα στοιχεία συμπληρωμένα.",
      "contact.orDivider": "Ή επικοινώνησε απευθείας",
      "contact.emailLabel": "Στείλε email",
      "contact.instagram": "Instagram",
      "contact.linkedin": "LinkedIn",

      "footer.tagline": "Designed &amp; built with attention to detail.",
      "footer.rights": "All rights reserved."
    },

    en: {
      "meta.title": "Marketing that brings brands forward — Atomic Strategy",
      "meta.description": "Atomic Strategy — boutique brand & marketing strategy studio in Heraklion, Crete.",
      "a11y.skipLink": "Skip to content",

      "nav.about": "About us",
      "nav.services": "What we do",
      "nav.contact": "Get in touch",
      "nav.cta": "Let's talk",
      "nav.servicesFooterPrompt": "Not sure where to start?",
      "nav.servicesFooterCta": "Book a strategy call →",

      "hero.title": "<span class=\"hero-title-line hero-title-line-1\">Marketing that brings</span><span class=\"hero-title-line hero-title-line-2\"><span class=\"glow-text\">brands</span> <span class=\"glow-text\">forward</span>.</span>",
      "hero.scroll": "Explore",

      "about.kicker": "About",
      "about.heading": "A little about us",
      "about.body": "Atomic Strategy is a boutique brand & marketing strategy studio. We work with brands that want to stand out from the crowd, pairing strategy with creative content to build a strong digital presence and drive meaningful growth.",

      "results.kicker": "Organic results of our clients",
      "results.l1": "Instagram audience growth",
      "results.l2": "Follower growth",
      "results.l3": "Organic views per piece of content",
      "results.l4": "Organic views across managed accounts",
      "results.l5": "TikTok audience built from scratch",
      "results.l6": "TikTok growth in 30 days",

      "services.kicker": "Our Services",
      "services.heading": "What we do for you.",
      "services.subheading": "Social, ads, and web — built around the funnel your customers actually follow, not a content calendar for its own sake.",
      "services.svc1Sub": "(Meta & TikTok)",
      "services.svc1B1": "Developing a tailored marketing strategy for your business",
      "services.svc1B2": "Creating innovative concepts to effectively promote your brand",
      "services.svc1B3": "Content production based on your required frequency (+ model sourcing)",
      "services.svc1B4": "Content editing according to the social media platform",
      "services.svc1B5": "Uploading with SEO-optimized descriptions",
      "services.svc2B1": "Developing a strategy based on the Customer Funnel",
      "services.svc2B2": "Building and managing campaigns",
      "services.svc2B3": "Ad copywriting",
      "services.svc2B4": "Creation of Retargeting Audiences (best tactic)",
      "services.svc2B5": "Creative production for ad creatives (if needed)",
      "services.svc2B6": "Budget management & monthly reporting",
      "service1.title": "Social Media Management",
      "service1.desc": "Strategy, production, and content management for Meta & TikTok, tailored to your brand.",
      "service2.title": "Meta & Google Ads",
      "service2.desc": "Campaigns built around the customer funnel, with targeted retargeting and monthly reporting.",
      "service3.title": "Web Development",
      "service3.desc": "Fast, custom websites built to convert — not just to look good.",
      "service4.title": "Brand Strategy",
      "service4.desc": "Positioning, story, and identity that make your brand stand out from the crowd.",


      "contact.kicker": "Contact",
      "contact.heading": "Let's build something together",
      "contact.body": "Got a project in mind? Send us a few details and we'll get back to you soon.",
      "contact.formName": "Name",
      "contact.formEmail": "Email",
      "contact.formMessage": "Message",
      "contact.formSubmit": "Send message",
      "contact.formNote": "Opens your email app with the details filled in.",
      "contact.orDivider": "Or reach out directly",
      "contact.emailLabel": "Send an email",
      "contact.instagram": "Instagram",
      "contact.linkedin": "LinkedIn",

      "footer.tagline": "Designed &amp; built with attention to detail.",
      "footer.rights": "All rights reserved."
    }
  };

  function applyLang(lang) {
    var dict = translations[lang] || translations[DEFAULT_LANG];

    document.documentElement.setAttribute("lang", lang);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (dict[key] !== undefined) {
        el.textContent = dict[key];
      }
    });

    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-html");
      if (dict[key] !== undefined) {
        el.innerHTML = dict[key];
      }
    });

    document.querySelectorAll("[data-i18n-content]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-content");
      if (dict[key] !== undefined) {
        el.setAttribute("content", dict[key]);
      }
    });

    if (dict["meta.title"]) {
      document.title = dict["meta.title"];
    }

    document.querySelectorAll("[data-lang-btn]").forEach(function (btn) {
      var isActive = btn.getAttribute("data-lang-btn") === lang;
      btn.setAttribute("aria-pressed", String(isActive));
    });
  }

  function initLangSwitch() {
    // The site is English-only now (no language-switch UI exists) — always
    // apply DEFAULT_LANG, ignoring any language a browser may have stored
    // from earlier testing, so a stale "el" in localStorage can't override it.
    applyLang(DEFAULT_LANG);
  }

  function initPageTransitions() {
    var FADE_MS = 280;
    // Chrome/Edge 126+ (and Chromium-based browsers generally) support
    // cross-document View Transitions natively — styles.css's
    // @view-transition{navigation:auto} plus the view-transition-name on
    // the shared header/svc-switch elements already makes the browser
    // morph those in place on a plain navigation. Our manual whole-page
    // fade below would fight that (it fades everything, including the
    // "persistent" elements, right before the browser gets to snapshot
    // them), so only use it where native support is missing.
    var nativeViewTransitions = "startViewTransition" in document;

    document.addEventListener("click", function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }
      var link = e.target.closest("a[href]");
      if (!link || (link.target && link.target !== "_self")) {
        return;
      }

      var url;
      try {
        url = new URL(link.href, window.location.href);
      } catch (err) {
        return;
      }
      // Only same-origin, whole-page navigations — not in-page anchors
      // (those should keep their instant/smooth-scroll behavior) and not
      // external links, mailto:, tel:, etc.
      if (url.origin !== window.location.origin) {
        return;
      }
      if (url.pathname === window.location.pathname && url.hash) {
        return;
      }

      // Landing back on index.html this way (e.g. clicking the logo from a
      // service page) should skip straight to the hero instead of replaying
      // the full branded intro loader — flag it for initLoader() to read.
      if (/(^|\/)index\.html$/.test(url.pathname) || url.pathname === "/" || url.pathname === "") {
        try {
          sessionStorage.setItem("as-skip-loader", "1");
        } catch (err) {}
      }

      // Native support: let the click through as a normal navigation so
      // the browser's own view transition (and its element morphing) runs.
      if (nativeViewTransitions) {
        return;
      }

      e.preventDefault();
      document.body.classList.add("is-page-fading-out");
      window.setTimeout(function () {
        window.location.href = link.href;
      }, FADE_MS);
    });

    // A page restored from the back/forward cache keeps whatever class list
    // it had at the moment it was left — clear the fade so a back-navigation
    // doesn't land on a page stuck invisible.
    window.addEventListener("pageshow", function (e) {
      if (e.persisted) {
        document.body.classList.remove("is-page-fading-out");
      }
    });
  }

  function initFooterYear() {
    var yearEl = document.getElementById("year");
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  function initSvcSwitchToggle() {
    var nav = document.querySelector(".svc-switch");
    var toggle = nav ? nav.querySelector(".svc-switch-toggle") : null;
    if (!nav || !toggle) {
      return;
    }
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  function initNavDropdown(triggerId, panelId) {
    var trigger = document.getElementById(triggerId);
    var panel = document.getElementById(panelId);
    if (!trigger || !panel) {
      return;
    }
    var wrap = trigger.closest(".nav-dropdown");

    function close() {
      trigger.setAttribute("aria-expanded", "false");
      panel.setAttribute("aria-hidden", "true");
      if (wrap) wrap.classList.remove("is-open");
    }

    function open() {
      trigger.setAttribute("aria-expanded", "true");
      panel.setAttribute("aria-hidden", "false");
      if (wrap) wrap.classList.add("is-open");
    }

    trigger.addEventListener("click", function (event) {
      event.stopPropagation();
      var isOpen = trigger.getAttribute("aria-expanded") === "true";
      if (isOpen) {
        close();
      } else {
        open();
      }
    });

    panel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", close);
    });

    document.addEventListener("click", function (event) {
      if (wrap && !wrap.contains(event.target)) {
        close();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        close();
      }
    });
  }

  function initNavDropdowns() {
    initNavDropdown("servicesDropdownTrigger", "servicesDropdownPanel");
    initNavDropdown("servicesDropdownTriggerFloating", "servicesDropdownPanelFloating");
  }

  // Shared by the plain click-to-toggle accordion (initServicesAccordion)
  // and the scroll-driven pinned version (initServicesPinnedTabs) — both
  // just need to flip a row's open state with the same height animation.
  function setAccordionRowOpen(row, open) {
    var btn = row.querySelector(".acc-summary");
    var body = row.querySelector(".acc-body");
    if (!btn || !body || open === row.classList.contains("is-open")) {
      return;
    }

    // Drop any listener left over from a previous, possibly interrupted,
    // open — otherwise its transitionend would fire on this transition and
    // flip a closing row back to height: auto (stuck visually open).
    if (body._accEnd) {
      body.removeEventListener("transitionend", body._accEnd);
      body._accEnd = null;
    }

    if (open) {
      body.style.height = body.scrollHeight + "px";
      body._accEnd = function (e) {
        if (e.target !== body || e.propertyName !== "height") {
          return;
        }
        body.style.height = "auto";
        body.removeEventListener("transitionend", body._accEnd);
        body._accEnd = null;
      };
      body.addEventListener("transitionend", body._accEnd);
    } else {
      body.style.height = body.scrollHeight + "px";
      void body.offsetHeight;
      body.style.height = "0px";
    }

    btn.setAttribute("aria-expanded", open ? "true" : "false");
    row.classList.toggle("is-open", open);
  }

  function initServicesAccordion() {
    document.querySelectorAll(".acc-row").forEach(function (row) {
      var btn = row.querySelector(".acc-summary");
      var body = row.querySelector(".acc-body");
      if (!btn || !body) {
        return;
      }

      if (row.classList.contains("is-open")) {
        body.style.height = "auto";
      }

      btn.addEventListener("click", function () {
        // Inside the pinned services section, scroll position is what
        // drives which tab is open (see initServicesPinnedTabs) — a plain
        // toggle here would just get overwritten on the next scroll tick,
        // so that function attaches its own click handler (scrolls to the
        // tab's segment) and this one steps aside.
        if (document.documentElement.classList.contains("pin-mode") && row.closest("#svcPinWrap")) {
          return;
        }
        setAccordionRowOpen(row, btn.getAttribute("aria-expanded") !== "true");
      });
    });
  }

  function initServicesPinnedTabs() {
    if (!document.documentElement.classList.contains("pin-mode")) {
      return;
    }

    var pinWrap = document.getElementById("svcPinWrap");
    var rows = pinWrap ? Array.prototype.slice.call(pinWrap.querySelectorAll(".acc-row")) : [];
    if (!pinWrap || !rows.length) {
      return;
    }

    // How much extra scroll distance (as a fraction of one viewport) each
    // tab gets before the progress line finishes and the next one opens.
    var SEGMENT_VH = 160;
    var lastActiveIndex = -1;
    var openTimer = null;
    // Keep in sync with the .acc-body height transition in styles.css.
    var ACC_DURATION_MS = 550;

    function clamp01(n) {
      return Math.min(1, Math.max(0, n));
    }

    function recomputeHeight() {
      pinWrap.style.height = 100 + rows.length * SEGMENT_VH + "vh";
    }
    recomputeHeight();

    function update() {
      var scrolled = -pinWrap.getBoundingClientRect().top;
      var totalScrollable = Math.max(1, pinWrap.offsetHeight - window.innerHeight);
      var scaled = clamp01(scrolled / totalScrollable) * rows.length;
      var activeIndex = Math.min(rows.length - 1, Math.floor(scaled));
      var withinProgress = clamp01(scaled - activeIndex);

      rows.forEach(function (row, i) {
        var fill = row.querySelector(".acc-progress-fill");
        if (!fill) {
          return;
        }
        var pct = i < activeIndex ? 100 : i === activeIndex ? withinProgress * 100 : 0;
        fill.style.width = pct + "%";
      });

      if (activeIndex !== lastActiveIndex) {
        var isFirst = lastActiveIndex === -1;
        lastActiveIndex = activeIndex;
        clearTimeout(openTimer);

        // One at a time: the previous tab closes first, and only once it has
        // finished does the next one open.
        rows.forEach(function (row, i) {
          if (i !== activeIndex) {
            setAccordionRowOpen(row, false);
          }
        });

        if (isFirst) {
          setAccordionRowOpen(rows[activeIndex], true);
        } else {
          openTimer = setTimeout(function () {
            setAccordionRowOpen(rows[lastActiveIndex], true);
          }, ACC_DURATION_MS);
        }
      }
    }

    var ticking = false;
    function onScroll() {
      if (ticking) {
        return;
      }
      ticking = true;
      requestAnimationFrame(function () {
        update();
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", function () {
      recomputeHeight();
      onScroll();
    });
    update();

    // Clicking a tab while pinned scrolls the window to that tab's
    // segment instead of toggling it directly — see the early-return in
    // initServicesAccordion's click handler above.
    rows.forEach(function (row, i) {
      var btn = row.querySelector(".acc-summary");
      if (!btn) {
        return;
      }
      btn.addEventListener("click", function () {
        var totalScrollable = Math.max(1, pinWrap.offsetHeight - window.innerHeight);
        var segment = totalScrollable / rows.length;
        var wrapTop = pinWrap.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({ top: wrapTop + segment * (i + 0.5), behavior: "smooth" });
      });
    });
  }

  function initScrollReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) {
      return;
    }

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) {
        el.classList.add("is-visible");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    items.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initPinnedScroll() {
    if (!document.documentElement.classList.contains("pin-mode")) {
      return;
    }

    var pinWrap = document.getElementById("pinWrap");
    var pinAtom = pinWrap ? pinWrap.querySelector(".pin-bg-atom") : null;
    var heroWatermarkFill = pinWrap ? pinWrap.querySelector(".hero-watermark-fill") : null;
    var floatingNav = document.getElementById("floatingNav");
    var lastScrollY = window.scrollY;
    if (!pinWrap) {
      return;
    }

    var heroVideoFrame = document.getElementById("heroVideoFrame");
    var heroVideo = document.getElementById("heroVideo");
    var heroVideoPlay = document.getElementById("heroVideoPlay");
    var videoPanelTarget = document.getElementById("videoPanelTarget");
    var videoShowcaseInner = document.getElementById("videoShowcaseInner");
    var videoLanded = false;
    var videoDocked = false;
    var videoFrameHomeParent = heroVideoFrame ? heroVideoFrame.parentNode : null;
    var videoFrameHomeNextSibling = heroVideoFrame ? heroVideoFrame.nextSibling : null;

    // The video starts as a full-viewport cover behind the hero copy, then
    // continuously morphs — every scroll tick, not at one discrete cutoff —
    // into #videoPanelTarget's live rect as scroll progress sweeps through
    // [VIDEO_MORPH_START, VIDEO_MORPH_END]. #videoPanelTarget and its
    // flanking "Δες"/"πώς δουλεύουμε" labels (#videoShowcaseInner) live
    // inside the hero panel itself, fading in over that same window (see
    // the opacity line at the bottom of updateHeroVideo) as the shrink
    // completes. Once landed, it just stops updating position/size and
    // stays exactly where it is — still position: fixed, so it remains on
    // screen, still playing, no matter how much further you scroll past
    // it (see the videoLanded early-return in updateHeroVideo).
    //
    // Tuned against a rough "one wheel notch ≈ 100px" assumption, over the
    // pinned range's total scrollable distance (pinWrap height − one
    // viewport): header gone within ~1 notch, slogan within ~7, then the
    // video's own shrink runs over the 10 notches after that (landing at
    // notch 17). heroScrollRange (and everything derived from it below)
    // depends on the viewport's current height, so it's recomputed on
    // resize, not just once at load — see recomputeVideoTiming.
    var heroScrollRange, notchToProgress, HEADER_FADE_END, SLOGAN_FADE_END, VIDEO_MORPH_START, VIDEO_MORPH_END;
    var SCROLL_NOTCH_PX = 100;

    // The target's own rect (#videoPanelTarget is fixed 16:9 — see
    // styles.css). Re-measured on load and on resize, but deliberately NOT on every
    // scroll tick — the target's own layout position doesn't change
    // across the pinned dwell from scrolling alone (nothing about the
    // hero's layout depends on scroll, only the video frame's own
    // size/opacity), so re-measuring live on scroll is both unnecessary
    // and fragile: a scroll event that jumps straight past the whole
    // pinned range in one tick (scrollbar-track click, End key) fires
    // with the hero already scrolled away, and a live measurement at
    // that moment would freeze the video at that now-off-screen position
    // instead of its intended on-screen spot.
    var videoTargetRect = null;

    // Recomputes everything that depends on the viewport's current size —
    // called on load and on every resize, together, so the timing
    // constants and the target's cached rect never drift out of sync with
    // each other the way they would if each refreshed independently (a
    // resize-only rect refresh with stale timing constants can disagree
    // with updateHeroVideo about whether it's even still "landed").
    function recomputeVideoTiming() {
      heroScrollRange = Math.max(1, pinWrap.offsetHeight - window.innerHeight);
      notchToProgress = SCROLL_NOTCH_PX / heroScrollRange;
      HEADER_FADE_END = Math.min(0.15, notchToProgress * 1);
      SLOGAN_FADE_END = Math.min(0.5, notchToProgress * 7);
      VIDEO_MORPH_START = SLOGAN_FADE_END;
      VIDEO_MORPH_END = Math.min(1, Math.max(VIDEO_MORPH_START + 0.1, notchToProgress * 17));

      if (videoPanelTarget) {
        // Width and horizontal centering come from the real measurement —
        // the grid layout that positions #videoPanelTarget between the two
        // labels is what actually needs measuring. Height is *not* taken
        // from that measurement, though — it's derived from the width
        // using the known 16:9 ratio instead, so the frame's shape can
        // never end up wrong even if something about how the target's own
        // height resolves (CSS aspect-ratio support, a layout timing
        // quirk, whatever) disagrees with that in a given browser. The
        // vertical center is kept wherever the raw measurement put it,
        // just recomputing how tall the box spans around that center.
        var rawTargetRect = videoPanelTarget.getBoundingClientRect();
        var targetCenterY = rawTargetRect.top + rawTargetRect.height / 2;
        var targetHeight = rawTargetRect.width * (9 / 16);
        videoTargetRect = {
          top: targetCenterY - targetHeight / 2,
          left: rawTargetRect.left,
          width: rawTargetRect.width,
          height: targetHeight
        };
        // No explicit re-snap needed here for the landed case — once
        // docked, the frame is width: 100% of the target and gets its own
        // aspect-ratio (see .hero-video-frame.is-landed in styles.css and
        // dockVideoIntoTarget), so it already resizes with it through
        // plain CSS, independent of the target's own real height too.
      }
    }
    recomputeVideoTiming();
    window.addEventListener("resize", recomputeVideoTiming);
    // Web fonts (Inter, the Horizon wordmark) swap in asynchronously —
    // font-display: swap first paints with a fallback font, which can be
    // narrower or wider than the real one. The "Δες"/"πώς δουλεύουμε"
    // labels sit either side of #videoPanelTarget in a grid whose middle
    // column depends on their rendered width, so that swap can nudge the
    // target a few pixels once it happens — re-measuring after fonts.ready
    // catches that instead of freezing the video at a rect measured
    // against the fallback font's metrics.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(recomputeVideoTiming).catch(function () {});
    }

    var heroHeaderEls = [
      document.querySelector(".hero .brand-badge"),
      document.querySelector(".hero .hero-nav"),
      document.querySelector(".hero .hero-top-right"),
      document.querySelector(".hero .hero-scroll")
    ].filter(Boolean);
    var heroSloganEls = [document.querySelector(".hero .hero-copy")].filter(Boolean);

    function clamp01(n) {
      return Math.min(1, Math.max(0, n));
    }

    // The box the video morphs *from*, at the very start of the shrink —
    // sized to the target's own aspect ratio (16:9) but scaled up to
    // fully cover the viewport (like object-fit: cover, just applied to
    // the frame itself rather than the <video> inside it), then centered.
    // Using this instead of the viewport's raw, generally-different
    // aspect ratio means the frame's own shape never changes across the
    // whole shrink — only its size and position do — so object-fit: cover
    // on the <video> crops by a constant amount throughout instead of
    // subtly re-zooming the footage as the shape drifts toward 16:9.
    function coverRectForAspect(viewportWidth, viewportHeight, aspect) {
      var width, height;
      if (viewportWidth / viewportHeight > aspect) {
        width = viewportWidth;
        height = width / aspect;
      } else {
        height = viewportHeight;
        width = height * aspect;
      }
      return {
        top: (viewportHeight - height) / 2,
        left: (viewportWidth - width) / 2,
        width: width,
        height: height
      };
    }

    function fadeElsByProgress(els, progress, fadeEnd) {
      var t = clamp01(progress / fadeEnd);
      var opacity = String(1 - t);
      var pointerEvents = t >= 1 ? "none" : "auto";
      els.forEach(function (el) {
        el.style.opacity = opacity;
        el.style.pointerEvents = pointerEvents;
      });
    }

    // Both independent of the hero panel's own (much slower) ambient
    // crossfade opacity — that one's still driving the hero→showcase
    // handoff itself (activeIndex, pointer-events, etc. via panelStateAt)
    // and stays at 1 through this whole window regardless, so these just
    // multiply on top of it with no conflict. Header first (~1 notch),
    // then the slogan a few notches later (~7) — right as the video
    // itself starts its own shrink.
    function updateHeroHeader(progress) {
      fadeElsByProgress(heroHeaderEls, progress, HEADER_FADE_END);
    }

    function updateHeroSlogan(progress) {
      fadeElsByProgress(heroSloganEls, progress, SLOGAN_FADE_END);
    }

    // Once fully landed, the frame stops being a fixed, JS-positioned
    // overlay and is physically moved into #videoPanelTarget as a normal
    // in-flow child instead, right beside the "Δες"/"πώς δουλεύουμε"
    // labels — from that point it scrolls away with the rest of the hero
    // panel like ordinary content once the sticky pin releases, rather
    // than following the viewport. videoTargetRect (already matching
    // exactly at this instant, since morphT just hit 1) is what the frame
    // was sized/positioned to just before this runs, so the swap from
    // fixed-tracking to static-in-flow is visually seamless.
    function dockVideoIntoTarget() {
      if (videoDocked || !heroVideoFrame || !videoPanelTarget) {
        return;
      }
      videoDocked = true;
      // relative, not static — the play button and the dark overlay are
      // both position: absolute *inside* this frame, anchored to it; a
      // static frame stops being a positioning context at all, so they'd
      // fall back to the next positioned ancestor up the tree instead —
      // .video-showcase-inner, which spans the full width including both
      // labels, not just the video — sizing/centering themselves against
      // that far wider box and spilling out over the "Δες"/"πώς
      // δουλεύουμε" text instead of staying confined to the video panel.
      // relative with no offset keeps the same normal-flow placement as
      // static while still anchoring its own absolutely-positioned
      // children correctly.
      heroVideoFrame.style.position = "relative";
      heroVideoFrame.style.top = "";
      heroVideoFrame.style.left = "";
      heroVideoFrame.style.width = "100%";
      // Deliberately not height: 100% — that would size the frame off
      // #videoPanelTarget's own real rendered height, which is exactly
      // the value this whole approach doesn't trust. Its own aspect-ratio
      // (see .hero-video-frame.is-landed in styles.css) derives height
      // from its width instead, the same way videoTargetRect above does.
      heroVideoFrame.style.height = "";
      videoPanelTarget.appendChild(heroVideoFrame);
      videoPanelTarget.style.visibility = "visible";
    }

    function undockVideoFromTarget() {
      if (!videoDocked || !heroVideoFrame || !videoFrameHomeParent) {
        return;
      }
      videoDocked = false;
      videoPanelTarget.style.visibility = "hidden";
      heroVideoFrame.style.position = "fixed";
      videoFrameHomeParent.insertBefore(heroVideoFrame, videoFrameHomeNextSibling);
    }

    // The play button opens the same clip full-size in a popup (with real
    // controls, unmuted) rather than unmuting this background copy in
    // place — the background video just keeps playing muted/looped,
    // untouched, the whole time.
    var videoModal = document.getElementById("videoModal");
    var videoModalPlayer = document.getElementById("videoModalPlayer");
    var videoModalClose = document.getElementById("videoModalClose");
    var videoModalBackdrop = document.getElementById("videoModalBackdrop");

    var videoModalScrollY = 0;

    function openVideoModal() {
      if (!videoModal || !videoModalPlayer) {
        return;
      }
      videoModal.classList.add("is-open");
      videoModal.setAttribute("aria-hidden", "false");
      // This is a pinned-scroll page — scroll position alone drives the
      // hero/video/panel choreography. A plain body { overflow: hidden }
      // lock still let the page silently jump to scrollY 0 the instant it
      // was applied (removing the scrollbar removes body's own scroll
      // offset), which the pinned math read as "scrolled to top" — so
      // scrolling at all after closing snapped things into whatever state
      // matched wherever the page had actually (invisibly) ended up.
      // Pinning body at its exact current pixel offset instead means nothing
      // about scroll position changes at all while the modal is open.
      videoModalScrollY = window.scrollY;
      document.body.classList.add("is-video-modal-open");
      document.body.style.top = -videoModalScrollY + "px";
      videoModalPlayer.currentTime = 0;
      videoModalPlayer.play().catch(function () {});
    }

    function closeVideoModal() {
      if (!videoModal || !videoModalPlayer) {
        return;
      }
      videoModal.classList.remove("is-open");
      videoModal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("is-video-modal-open");
      document.body.style.top = "";
      window.scrollTo(0, videoModalScrollY);
      videoModalPlayer.pause();
    }

    if (heroVideoPlay) {
      heroVideoPlay.addEventListener("click", openVideoModal);
    }
    if (videoModalClose) {
      videoModalClose.addEventListener("click", closeVideoModal);
    }
    if (videoModalBackdrop) {
      videoModalBackdrop.addEventListener("click", closeVideoModal);
    }
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && videoModal && videoModal.classList.contains("is-open")) {
        closeVideoModal();
      }
    });

    function updateHeroVideo(progress) {
      if (!heroVideoFrame || !heroVideo || !videoPanelTarget) {
        return;
      }

      var morphT = clamp01((progress - VIDEO_MORPH_START) / (VIDEO_MORPH_END - VIDEO_MORPH_START));
      var isLanded = morphT >= 1;
      var wasLanded = videoLanded;

      if (isLanded && !wasLanded) {
        videoLanded = true;
        heroVideoFrame.classList.add("is-landed");
        // Keeps playing (muted, looping) once landed rather than pausing —
        // the play button below is purely an "unmute and watch it with
        // sound from the start" affordance, not a start/stop control.
      } else if (!isLanded && wasLanded) {
        videoLanded = false;
        heroVideoFrame.classList.remove("is-landed");
        heroVideo.muted = true;
        heroVideo.currentTime = 0;
        heroVideo.play().catch(function () {});
        // Must undock (back to position: fixed) before the lerp below can
        // move it at all — a statically in-flow element ignores top/left.
        undockVideoFromTarget();
      }

      // The caption (and the invisible target above it) fades in only over
      // the tail end of the shrink, not the whole window — the video is
      // still much bigger than its landed size through most of morphT and
      // would otherwise visibly pass behind/through the caption's fixed
      // spot below it before finishing the shrink.
      if (videoShowcaseInner) {
        var captionT = clamp01((morphT - 0.85) / 0.15);
        videoShowcaseInner.style.opacity = String(captionT);
        videoShowcaseInner.style.pointerEvents = morphT >= 1 ? "auto" : "none";
      }

      // Skip repositioning only once *already* landed (and docked) as of
      // the previous tick — the tick that first lands it (isLanded &&
      // !wasLanded, just above) still needs to run the code below, with
      // morphT pinned at 1, so it actually gets set to the target's exact
      // rect *before* docking hands it off. Skipping unconditionally on
      // isLanded would leave it stuck wherever the previous tick's lerp
      // happened to land (or, on a jump straight to the pinned range's
      // end with no previous tick at all, at its untouched CSS default of
      // full-viewport).
      if (isLanded && wasLanded) {
        return;
      }

      var targetRect = videoTargetRect;
      var heroRect = coverRectForAspect(window.innerWidth, window.innerHeight, targetRect.width / targetRect.height);

      heroVideoFrame.style.top = lerp(heroRect.top, targetRect.top, morphT) + "px";
      heroVideoFrame.style.left = lerp(heroRect.left, targetRect.left, morphT) + "px";
      heroVideoFrame.style.width = lerp(heroRect.width, targetRect.width, morphT) + "px";
      heroVideoFrame.style.height = lerp(heroRect.height, targetRect.height, morphT) + "px";
      heroVideoFrame.style.borderRadius = lerp(0, 20, morphT) + "px";

      // Now that it's sized/positioned to match the target exactly (morphT
      // is 1 on this tick), hand off from fixed-tracking to docked in-flow
      // — seamless, since the two states are visually identical right now.
      if (isLanded && !wasLanded) {
        dockVideoIntoTarget();
      }
    }

    var panels = Array.prototype.slice.call(pinWrap.querySelectorAll(".panel"));
    if (!panels.length) {
      return;
    }

    var panelIds = panels.map(function (panel) {
      return panel.id;
    });

    var PANEL_MARGIN = 0.035;
    var MIN_SCALE = 0.88;

    // The background atom mark starts small right where the hero's own focal
    // point sits, grows in as the journey begins, then fades from a
    // bold hero-level presence down to a subtle ambient glow as it
    // drifts across the background for the rest of the scroll. "blur" is
    // no longer applied as a real CSS blur (the atom stays crisp) — it's
    // kept only as an abstract "spread" input to the watermark mask radius
    // below, same as it always fed that calculation.
    // Hero is the only pinned panel now (Services onward scroll normally
    // below, see index.html) — these are just its own start/end drift
    // waypoints across that one panel's pinned dwell, not one per panel.
    var blobStops = [
      { left: 78, top: 46, opacity: 0.55, scale: 0.3, blur: 38 }, // start
      { left: 88, top: 82, opacity: 0.2, scale: 0.55, blur: 70 }  // end — corner, clear of the landed video panel
    ];

    function lerp(a, b, t) {
      return a + (b - a) * t;
    }

    function blobStateAt(progress) {
      var segments = blobStops.length - 1;
      var scaled = Math.min(Math.max(progress, 0), 1) * segments;
      var index = Math.min(Math.floor(scaled), segments - 1);
      var t = scaled - index;
      var a = blobStops[index];
      var b = blobStops[index + 1];
      return {
        left: lerp(a.left, b.left, t),
        top: lerp(a.top, b.top, t),
        opacity: lerp(a.opacity, b.opacity, t),
        scale: lerp(a.scale, b.scale, t),
        blur: lerp(a.blur, b.blur, t)
      };
    }

    // Both outgoing and incoming panels shrink toward MIN_SCALE (never
    // grow past 1) so they visually recede instead of overlapping —
    // opacity resolves faster than scale within the same window, so the
    // crossfade reads as a quick zoom rather than a lingering fade.
    function panelStateAt(index, count, progress) {
      // Just hero now (Services onward are normal-scroll, and the video
      // showcase moved inside the hero panel itself — see index.html) —
      // no crossfade partner to fade out for, so it just stays fully
      // opaque for its whole pinned dwell. Scrolling further reveals what
      // comes next via the sticky pin-stage naturally unsticking and
      // scrolling away, not via this opacity fade.
      if (count === 1) {
        return { opacity: 1, scale: 1 };
      }

      var slice = 1 / count;
      var start = Math.max(0, index * slice - PANEL_MARGIN);
      var end = Math.min(1, (index + 1) * slice + PANEL_MARGIN);

      if (progress <= start) {
        return index === 0 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: MIN_SCALE };
      }
      if (progress >= end) {
        return index === count - 1 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: MIN_SCALE };
      }

      var local = (progress - start) / (end - start);

      if (index === 0) {
        if (local < 0.5) {
          return { opacity: 1, scale: 1 };
        }
        var t0 = (local - 0.5) / 0.5;
        return {
          opacity: Math.max(0, 1 - t0 / 0.5),
          scale: 1 - t0 * (1 - MIN_SCALE)
        };
      }

      if (index === count - 1) {
        if (local > 0.5) {
          return { opacity: 1, scale: 1 };
        }
        var t1 = local / 0.5;
        return {
          opacity: Math.min(1, t1 / 0.5),
          scale: MIN_SCALE + t1 * (1 - MIN_SCALE)
        };
      }

      if (local < 0.4) {
        var tIn = local / 0.4;
        return {
          opacity: Math.min(1, tIn / 0.5),
          scale: MIN_SCALE + tIn * (1 - MIN_SCALE)
        };
      }
      if (local > 0.6) {
        var tOut = (local - 0.6) / 0.4;
        return {
          opacity: Math.max(0, 1 - tOut / 0.5),
          scale: 1 - tOut * (1 - MIN_SCALE)
        };
      }
      return { opacity: 1, scale: 1 };
    }

    function update() {
      var total = pinWrap.offsetHeight - window.innerHeight;
      var scrolled = Math.min(Math.max(window.scrollY - pinWrap.offsetTop, 0), total);
      var progress = total > 0 ? scrolled / total : 0;

      var activeIndex = 0;
      var bestOpacity = -1;

      panels.forEach(function (panel, i) {
        var state = panelStateAt(i, panels.length, progress);
        panel.style.opacity = String(state.opacity);
        panel.style.transform = "scale(" + state.scale + ")";
        if (state.opacity > bestOpacity) {
          bestOpacity = state.opacity;
          activeIndex = i;
        }
      });

      panels.forEach(function (panel, i) {
        if (i === activeIndex) {
          panel.removeAttribute("inert");
          panel.classList.add("is-active");
        } else {
          panel.setAttribute("inert", "");
          panel.classList.remove("is-active");
        }
      });

      // Runs after the panels' own opacity/scale are applied above, not
      // before — #videoPanelTarget lives inside the "showcase" panel, and
      // its rect needs to reflect *this* frame's transform, not the
      // previous one, or the morph lags a frame behind and lands on a
      // slightly-off size while showcase is still scaling in.
      updateHeroVideo(progress);
      updateHeroHeader(progress);
      updateHeroSlogan(progress);

      // The floating pill navbar only makes sense once the hero (with its
      // own embedded nav) is no longer the panel in view — and even then,
      // only pops in on an upward scroll (checking back for it), staying
      // out of the way while actively scrolling down through the page.
      if (floatingNav) {
        var scrollingUp = window.scrollY < lastScrollY;
        if (activeIndex === 0) {
          floatingNav.classList.remove("is-visible");
        } else if (scrollingUp) {
          floatingNav.classList.add("is-visible");
        } else if (window.scrollY > lastScrollY) {
          floatingNav.classList.remove("is-visible");
        }
      }
      lastScrollY = window.scrollY;
    }

    // The ring drifts on its own via the scripted blobStops path — driven by
    // scroll progress, not the cursor. Specifically while the hero panel is
    // showing, that same scroll progress instead sweeps it once, left to
    // right, across the full width of the "ATOMIC STRATEGY" watermark —
    // finishing the sweep by the time the hero starts fading into the next
    // panel. Runs on its own continuous rAF loop, not just scroll ticks.
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var DRIFT_PX = 16;
    var SWEEP_LEAD_PX = 140; // safely past the reveal mask's radius, so there's no glow at rest

    var heroWatermarkWord = document.querySelector(".hero-watermark .hero-watermark-word");
    var heroSlice = 1 / panels.length;
    var heroZoneEnd = Math.min(1, heroSlice + PANEL_MARGIN);
    // The hero stays fully opaque only for the first half of its own zone
    // (see panelStateAt below — it starts fading past local 0.5). Racing
    // the sweep to finish there, instead of at heroZoneEnd itself, means
    // "ATOMIC STRATEGY" is still fully visible (not already fading out)
    // the moment it finishes — otherwise the two finish at the same instant
    // and the completed word is never actually seen before it dissolves.
    var heroSweepEnd = heroZoneEnd * 0.5;

    // How much of the atom's own opacity to suppress when it's currently
    // passing behind the "ATOMIC STRATEGY" watermark letters — 1 right on
    // top of them, fading to 0 by `falloff` px away. That's also exactly
    // the reveal mask's radius, so the two effects hand off at the same
    // edge: the atom icon fades out just as the glow-through-the-letters
    // effect fades in, and it reappears the moment it clears the word.
    function insideTextFactor(px, py, rect, falloff) {
      if (!rect || falloff <= 0) {
        return 0;
      }
      var dx = Math.max(rect.left - px, 0, px - rect.right);
      var dy = Math.max(rect.top - py, 0, py - rect.bottom);
      var dist = Math.sqrt(dx * dx + dy * dy);
      return Math.max(0, Math.min(1, 1 - dist / falloff));
    }

    if (pinAtom && !reduceMotion) {
      (function blobFrame(timestamp) {
        var total = pinWrap.offsetHeight - window.innerHeight;
        var scrolled = Math.min(Math.max(window.scrollY - pinWrap.offsetTop, 0), total);
        var progress = total > 0 ? scrolled / total : 0;
        var state = blobStateAt(progress);
        var heroT = panelStateAt(0, panels.length, progress).opacity;
        var heroLocalT = heroSweepEnd > 0 ? Math.min(1, Math.max(0, progress / heroSweepEnd)) : 0;

        var left, top;
        // .hero-watermark is currently disabled (display: none — see
        // styles.css), which collapses this to a zero-size rect rather
        // than null; guard on width too so the atom cleanly falls back to
        // the plain blobStops drift path instead of sweeping toward (0, 0).
        var wordRect = heroWatermarkWord && heroT > 0.05 ? heroWatermarkWord.getBoundingClientRect() : null;
        if (wordRect && wordRect.width === 0) {
          wordRect = null;
        }
        if (wordRect) {
          // Starts just off the word's left edge — so at rest (no scroll
          // yet) there's no glow at all — then sweeps left-to-right across
          // the full watermark in step with scroll, reaching the right edge
          // (the "Y") right as the hero finishes fading into the next panel.
          var sweepStart = wordRect.left - SWEEP_LEAD_PX;
          var sweepX = sweepStart + heroLocalT * (wordRect.right - sweepStart);
          left = (sweepX / window.innerWidth) * 100;
          top = ((wordRect.top + wordRect.height / 2) / window.innerHeight) * 100;
        } else {
          left = state.left;
          top = state.top;
        }

        var t = timestamp * 0.00035;
        var driftX = Math.sin(t) * DRIFT_PX;
        var driftY = Math.cos(t * 0.8) * DRIFT_PX * 0.7;

        var transform =
          "translate(calc(-50% + " + driftX.toFixed(1) + "px), calc(-50% + " + driftY.toFixed(1) + "px)) " +
          "rotate(" + (progress * 720) + "deg) scale(" + state.scale + ")";

        var maskRadius = 210 * state.scale + state.blur * 0.8;

        var insideFactor = 0;
        if (wordRect) {
          var atomPxX = (left / 100) * window.innerWidth + driftX;
          var atomPxY = (top / 100) * window.innerHeight + driftY;
          insideFactor = insideTextFactor(atomPxX, atomPxY, wordRect, maskRadius) * heroT;
        }

        pinAtom.style.left = left + "%";
        pinAtom.style.top = top + "%";
        pinAtom.style.opacity = String(state.opacity * (1 - insideFactor));
        pinAtom.style.transform = transform;

        // The watermark's dark "cutout" mask tracks the exact same
        // position/offset/size as the atom mark, so it reads as a cutout
        // of that specific glow rather than a generic spotlight.
        if (heroWatermarkFill) {
          heroWatermarkFill.style.setProperty(
            "--blob-x",
            "calc(" + left + "% + " + driftX.toFixed(1) + "px)"
          );
          heroWatermarkFill.style.setProperty(
            "--blob-y",
            "calc(" + top + "% + " + driftY.toFixed(1) + "px)"
          );
          heroWatermarkFill.style.setProperty("--blob-r", maskRadius.toFixed(1) + "px");
        }

        window.requestAnimationFrame(blobFrame);
      })(0);
    }

    var ticking = false;
    function onScroll() {
      if (ticking) {
        return;
      }
      ticking = true;
      window.requestAnimationFrame(function () {
        update();
        ticking = false;
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", update);
    update();

    function holdProgressFor(index, count) {
      if (index === 0) {
        return 0;
      }
      if (index === count - 1) {
        return 1;
      }
      var slice = 1 / count;
      var start = Math.max(0, index * slice - PANEL_MARGIN);
      var end = Math.min(1, (index + 1) * slice + PANEL_MARGIN);
      return start + 0.5 * (end - start);
    }

    function scrollToPanel(id) {
      var index = panelIds.indexOf(id);
      if (index === -1) {
        return;
      }
      var total = pinWrap.offsetHeight - window.innerHeight;
      var targetY = pinWrap.offsetTop + holdProgressFor(index, panels.length) * total;
      window.scrollTo({ top: targetY, behavior: "smooth" });
      try {
        history.pushState(null, "", "#" + id);
      } catch (e) {
        /* ignore */
      }
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      var id = link.getAttribute("href").slice(1);
      if (panelIds.indexOf(id) === -1) {
        return;
      }
      link.addEventListener("click", function (event) {
        event.preventDefault();
        scrollToPanel(id);
      });
    });
  }

  function initContactForm() {
    var form = document.getElementById("contactForm");
    if (!form) {
      return;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      var name = form.elements.name.value.trim();
      var email = form.elements.email.value.trim();
      var message = form.elements.message.value.trim();

      var subject = encodeURIComponent("Νέο μήνυμα από " + name);
      var body = encodeURIComponent(message + "\n\n— " + name + " (" + email + ")");

      window.location.href = "mailto:helloatomicstrategy@gmail.com?subject=" + subject + "&body=" + body;
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initLangSwitch();
    initPageTransitions();
    initFooterYear();
    initSvcSwitchToggle();
    initNavDropdowns();
    initServicesAccordion();
    initServicesPinnedTabs();
    initContactForm();
    initScrollReveal();
    initPinnedScroll();
  });
})();
