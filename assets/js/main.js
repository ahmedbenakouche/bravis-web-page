(function () {
  "use strict";

  var root = document.documentElement;
  var config = window.BRAVIS_CONFIG || {};
  var videos = window.BRAVIS_VIDEOS || [];
  var isLocal = location.protocol === "file:" ||
    ["localhost", "127.0.0.1", "::1", "[::1]", ""].indexOf(location.hostname) !== -1 ||
    /[?&]preview\b/.test(location.search);

  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) { return null; }
  }

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "class") node.className = attrs[k];
      else if (k === "html") node.innerHTML = attrs[k];
      else if (k === "text") node.textContent = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }

  /* Two spans, one per language; CSS shows the active one. */
  function bi(fr, en, tag) {
    var frag = document.createDocumentFragment();
    frag.appendChild(el(tag || "span", { "data-l": "fr", text: fr }));
    frag.appendChild(el(tag || "span", { "data-l": "en", text: en }));
    return frag;
  }

  function lang() { return root.dataset.lang === "en" ? "en" : "fr"; }

  /* ---------- Toast ---------- */
  var toastEl;
  function toast(fr, en) {
    if (!toastEl) {
      toastEl = el("div", { class: "toast", role: "status", "aria-live": "polite" });
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = lang() === "en" ? (en || fr) : fr;
    toastEl.classList.add("is-visible");
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () { toastEl.classList.remove("is-visible"); }, 2000);
  }

  /* ---------- Theme ---------- */
  var media = window.matchMedia("(prefers-color-scheme: dark)");
  var THEME_LABELS = {
    auto: ["Thème : automatique (système)", "Theme: automatic (system)"],
    light: ["Thème : clair", "Theme: light"],
    dark: ["Thème : sombre", "Theme: dark"]
  };

  function applyTheme(pref) {
    var dark = pref === "dark" || (pref === "auto" && media.matches);
    root.dataset.themePref = pref;
    root.dataset.theme = dark ? "dark" : "light";
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", dark ? "#060a17" : "#f5f7fc");
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      var label = THEME_LABELS[pref][lang() === "en" ? 1 : 0];
      btn.setAttribute("aria-label", label);
      btn.setAttribute("title", label);
    });
  }

  function initTheme() {
    var pref = root.dataset.themePref || "dark";
    applyTheme(pref);
    document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var order = ["auto", "light", "dark"];
        var next = order[(order.indexOf(root.dataset.themePref) + 1) % order.length];
        store("bravis-theme", next);
        applyTheme(next);
        toast(THEME_LABELS[next][0], THEME_LABELS[next][1]);
      });
    });
    var onSystem = function () { if (root.dataset.themePref === "auto") applyTheme("auto"); };
    if (media.addEventListener) media.addEventListener("change", onSystem);
    else if (media.addListener) media.addListener(onSystem);
  }

  /* ---------- Language ---------- */
  function applyLang(l) {
    root.dataset.lang = l;
    root.lang = l;
    var title = root.getAttribute("data-title-" + l);
    if (title) document.title = title;
    ["placeholder", "aria-label", "title", "alt", "content"].forEach(function (attr) {
      document.querySelectorAll("[data-" + l + "-" + attr + "]").forEach(function (node) {
        node.setAttribute(attr, node.getAttribute("data-" + l + "-" + attr));
      });
    });
    document.querySelectorAll("[data-set-lang]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", String(btn.getAttribute("data-set-lang") === l));
    });
    applyTheme(root.dataset.themePref || "dark");
    document.dispatchEvent(new CustomEvent("bravis:lang", { detail: l }));
  }

  function initLang() {
    applyLang(lang());
    document.querySelectorAll("[data-set-lang]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var l = btn.getAttribute("data-set-lang");
        store("bravis-lang", l);
        applyLang(l);
      });
    });
  }

  /* ---------- Mobile nav ---------- */
  function initNav() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("main-nav");
    if (!toggle || !nav) return;
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Source code links ---------- */
  function initSourceLinks() {
    var url = String(config.sourceUrl || "").trim();
    document.querySelectorAll("[data-source-link]").forEach(function (a) {
      if (url) {
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener";
        a.hidden = false;
      } else if (isLocal) {
        a.hidden = false;
        a.classList.add("is-todo");
        a.href = "#";
        a.title = "Lien à compléter dans assets/js/config.js (sourceUrl)";
        a.addEventListener("click", function (e) {
          e.preventDefault();
          toast("Lien à compléter : assets/js/config.js → sourceUrl", "Link to fill in: assets/js/config.js → sourceUrl");
        });
      } else {
        a.hidden = true;
      }
    });
  }

  /* ---------- Videos ---------- */
  var existsCache = {};
  function fileExists(url) {
    if (!existsCache[url]) {
      existsCache[url] = fetch(url, { method: "HEAD", cache: "no-store" })
        .then(function (r) { return r.ok; })
        .catch(function () { return false; });
    }
    return existsCache[url];
  }

  function videoMeta(id) {
    for (var i = 0; i < videos.length; i++) if (videos[i].id === id) return videos[i];
    return null;
  }

  function videoUrl(meta) { return (config.videoDir || "assets/videos/") + meta.file; }
  function posterUrl(meta) { return videoUrl(meta).replace(/\.[a-z0-9]+$/i, ".jpg"); }

  var PLAY_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>';
  var CAMERA_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 10l4.55-2.28A1 1 0 0 1 21 8.62v6.76a1 1 0 0 1-1.45.9L15 14"/><rect x="3" y="6" width="12" height="12" rx="2"/></svg>';

  function renderPlayer(slot, meta, hasPoster) {
    var frame = el("div", { class: "video-frame" });
    var btn = el("button", {
      type: "button",
      class: "video-poster" + (hasPoster ? "" : " no-image"),
      "data-fr-aria-label": "Lire la vidéo : " + meta.fr.title,
      "data-en-aria-label": "Play video: " + meta.en.title,
      "aria-label": (lang() === "en" ? "Play video: " + meta.en.title : "Lire la vidéo : " + meta.fr.title)
    });
    if (hasPoster) btn.style.backgroundImage = "url('" + posterUrl(meta) + "')";
    btn.appendChild(el("span", { class: "video-play", html: PLAY_SVG }));
    btn.addEventListener("click", function () {
      var video = el("video", { controls: "", playsinline: "", preload: "auto" });
      if (hasPoster) video.poster = posterUrl(meta);
      video.src = videoUrl(meta);
      frame.replaceChild(video, btn);
      video.addEventListener("play", function () {
        document.querySelectorAll("video").forEach(function (v) { if (v !== video) v.pause(); });
      });
      var p = video.play();
      if (p && p.catch) p.catch(function () {});
    });
    frame.appendChild(btn);
    slot.appendChild(frame);

    if (!slot.hasAttribute("data-no-caption")) {
      var cap = el("figcaption", { class: "video-caption" });
      var strong = el("strong");
      strong.appendChild(bi(meta.fr.title, meta.en.title));
      cap.appendChild(strong);
      if (slot.hasAttribute("data-show-desc")) {
        var desc = el("span");
        desc.appendChild(bi(meta.fr.desc, meta.en.desc));
        cap.appendChild(desc);
      }
      slot.appendChild(cap);
    }
  }

  function renderPlaceholder(slot, meta) {
    var box = el("div", { class: "video-placeholder" });
    var inner = el("div", { class: "ph-inner" });
    inner.appendChild(el("div", { class: "ph-icon", html: CAMERA_SVG }));
    var tag = el("span", { class: "ph-tag" });
    tag.appendChild(bi("Vidéo à venir · visible seulement en local", "Video coming · visible locally only"));
    inner.appendChild(tag);
    var h = el("h4");
    h.appendChild(bi(meta.fr.title, meta.en.title));
    inner.appendChild(h);
    if (meta.hint && (meta.hint.fr || meta.hint.en)) {
      var p = el("p");
      p.appendChild(bi("À filmer : " + meta.hint.fr, "To record: " + meta.hint.en));
      inner.appendChild(p);
    }
    var drop = el("p");
    drop.appendChild(bi("Déposer le fichier : ", "Drop the file: "));
    drop.appendChild(el("code", { text: videoUrl(meta) }));
    inner.appendChild(drop);
    box.appendChild(inner);
    slot.appendChild(box);
  }

  /* Resolves to true when the video file exists. */
  function initVideoSlot(slot) {
    if (slot._bravisInit) return slot._bravisInit;
    var meta = videoMeta(slot.getAttribute("data-video"));
    if (!meta) { slot.hidden = true; return Promise.resolve(false); }
    slot._bravisInit = Promise.all([fileExists(videoUrl(meta)), fileExists(posterUrl(meta))])
      .then(function (res) {
        var available = res[0];
        slot.innerHTML = "";
        if (available) renderPlayer(slot, meta, res[1]);
        else if (isLocal) renderPlaceholder(slot, meta);
        else slot.hidden = true;
        slot.classList.toggle("is-available", available);
        document.dispatchEvent(new CustomEvent("bravis:video", { detail: { id: meta.id, available: available, slot: slot } }));
        return available;
      });
    return slot._bravisInit;
  }

  function initVideoSlots(scope) {
    var slots = (scope || document).querySelectorAll(".video-slot[data-video]");
    return Promise.all(Array.prototype.map.call(slots, initVideoSlot));
  }

  /* ---------- Lightbox ---------- */
  function initLightbox() {
    var box = null, img = null, lastFocus = null;
    function close() {
      if (!box) return;
      box.classList.remove("is-open");
      if (lastFocus) lastFocus.focus();
    }
    document.addEventListener("click", function (e) {
      var target = e.target.closest(".zoomable");
      if (!target) return;
      if (!box) {
        box = el("div", { class: "lightbox", role: "dialog", "aria-modal": "true" });
        img = el("img", { alt: "" });
        var closeBtn = el("button", { class: "icon-btn lightbox-close", type: "button", "aria-label": "Fermer / Close", html: "&#10005;" });
        box.appendChild(img);
        box.appendChild(closeBtn);
        box.addEventListener("click", close);
        document.body.appendChild(box);
      }
      lastFocus = target;
      img.src = target.getAttribute("data-full") || target.currentSrc || target.src;
      img.alt = target.alt || "";
      box.classList.add("is-open");
      box.querySelector(".lightbox-close").focus();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  /* ---------- Back to top ---------- */
  function initToTop() {
    var btn = el("button", {
      class: "to-top", type: "button",
      "data-fr-aria-label": "Retour en haut", "data-en-aria-label": "Back to top", "aria-label": "Retour en haut",
      html: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M5 12l7-7 7 7"/></svg>'
    });
    document.body.appendChild(btn);
    btn.addEventListener("click", function () { window.scrollTo({ top: 0 }); });
    var onScroll = function () { btn.classList.toggle("is-visible", window.scrollY > 700); };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal, .vtree");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (n) { n.classList.add("is-visible", "animate"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add(entry.target.classList.contains("vtree") ? "animate" : "is-visible");
        io.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    items.forEach(function (n) { io.observe(n); });
  }

  function initYear() {
    document.querySelectorAll("[data-year]").forEach(function (n) { n.textContent = new Date().getFullYear(); });
  }

  window.BRAVIS = {
    isLocal: isLocal,
    lang: lang,
    bi: bi,
    el: el,
    toast: toast,
    videoMeta: videoMeta,
    videoUrl: videoUrl,
    fileExists: fileExists,
    initVideoSlots: initVideoSlots
  };

  initToTop();
  initTheme();
  initLang();
  initNav();
  initSourceLinks();
  initVideoSlots();
  initLightbox();
  initReveal();
  initYear();
})();
