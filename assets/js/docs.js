(function () {
  "use strict";

  var B = window.BRAVIS;
  var sections = Array.prototype.slice.call(document.querySelectorAll(".doc-section"));
  var links = Array.prototype.slice.call(document.querySelectorAll(".toc a[href^='#']"));
  var linkById = {};
  links.forEach(function (a) { linkById[a.getAttribute("href").slice(1)] = a; });

  function normalize(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  var index = sections.map(function (s) { return normalize(s.textContent); });

  /* ---------- Copy-link buttons on chapter titles ---------- */
  sections.forEach(function (section) {
    var h2 = section.querySelector("h2");
    if (!h2) return;
    var btn = B.el("button", {
      type: "button", class: "anchor-btn", text: "#",
      "data-fr-aria-label": "Copier le lien de cette section",
      "data-en-aria-label": "Copy link to this section",
      "aria-label": B.lang() === "en" ? "Copy link to this section" : "Copier le lien de cette section"
    });
    btn.addEventListener("click", function () {
      var url = location.href.split("#")[0] + "#" + section.id;
      history.replaceState(null, "", "#" + section.id);
      var done = function () { B.toast("Lien copié", "Link copied"); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(done, done);
      else done();
    });
    h2.appendChild(btn);
  });

  /* ---------- Video marker in the table of contents ---------- */
  var VIDEO_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>';
  document.addEventListener("bravis:video", function (e) {
    if (!e.detail.available) return;
    var section = e.detail.slot.closest(".doc-section");
    var link = section && linkById[section.id];
    if (link && !link.querySelector(".toc-video")) {
      link.appendChild(B.el("span", { class: "toc-video", title: "Vidéo / Video", html: VIDEO_ICON }));
    }
  });

  /* ---------- Scroll spy ---------- */
  function setActive(id) {
    links.forEach(function (a) { a.classList.toggle("is-active", a.getAttribute("href") === "#" + id); });
    var active = linkById[id];
    var sidebar = document.getElementById("doc-sidebar");
    if (active && sidebar && window.innerWidth > 1020) {
      var top = active.offsetTop, h = sidebar.clientHeight;
      if (top < sidebar.scrollTop + 60 || top > sidebar.scrollTop + h - 60) sidebar.scrollTop = top - h / 3;
    }
  }
  var currentId = null, ticking = false;
  function spy() {
    ticking = false;
    var line = Math.min(window.innerHeight * 0.3, 220);
    var id = null;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].hidden) continue;
      if (sections[i].getBoundingClientRect().top <= line) id = sections[i].id;
      else if (id) break;
    }
    if (!id) {
      var firstVisible = sections.filter(function (s) { return !s.hidden; })[0];
      id = firstVisible ? firstVisible.id : null;
    }
    if (id && id !== currentId) { currentId = id; setActive(id); }
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(spy); }
  }, { passive: true });
  window.addEventListener("resize", spy);
  spy();

  /* ---------- Search ---------- */
  var input = document.getElementById("doc-search");
  var emptyMsg = document.getElementById("search-empty");
  var tocEmpty = document.querySelector(".toc-empty");
  var groupTitles = document.querySelectorAll(".doc-group-title, .toc-group");

  function runSearch() {
    var q = normalize(input.value.trim());
    var terms = q.split(/\s+/).filter(Boolean);
    var shownGroups = {};
    var count = 0;
    sections.forEach(function (s, i) {
      var match = terms.every(function (t) { return index[i].indexOf(t) !== -1; });
      s.hidden = !match;
      var link = linkById[s.id];
      if (link) link.parentElement.hidden = !match;
      if (match) { count++; shownGroups[s.getAttribute("data-group")] = true; }
    });
    groupTitles.forEach(function (g) { g.hidden = !shownGroups[g.getAttribute("data-group")]; });
    emptyMsg.classList.toggle("is-visible", count === 0);
    if (tocEmpty) tocEmpty.hidden = count !== 0;
    spy();
  }

  if (input) {
    input.addEventListener("input", runSearch);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { input.value = ""; runSearch(); input.blur(); }
      if (e.key === "Enter") {
        var first = sections.filter(function (s) { return !s.hidden; })[0];
        if (first) { first.scrollIntoView(); closeToc(); }
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "/" && document.activeElement !== input && !/input|textarea/i.test(document.activeElement.tagName)) {
        e.preventDefault();
        openToc();
        input.focus();
      }
    });
  }

  /* ---------- Mobile table of contents ---------- */
  var toggle = document.querySelector(".doc-toc-toggle");
  var sidebar = document.getElementById("doc-sidebar");
  var backdrop = B.el("div", { class: "backdrop" });
  document.body.appendChild(backdrop);

  function isDrawer() { return window.innerWidth <= 1020; }
  function openToc() {
    if (!isDrawer()) return;
    sidebar.classList.add("is-open");
    backdrop.classList.add("is-visible");
    toggle.setAttribute("aria-expanded", "true");
  }
  function closeToc() {
    sidebar.classList.remove("is-open");
    backdrop.classList.remove("is-visible");
    toggle.setAttribute("aria-expanded", "false");
  }
  toggle.addEventListener("click", function () {
    if (sidebar.classList.contains("is-open")) closeToc(); else openToc();
  });
  backdrop.addEventListener("click", closeToc);
  sidebar.addEventListener("click", function (e) { if (e.target.closest("a")) closeToc(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeToc(); });
})();
