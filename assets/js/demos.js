(function () {
  "use strict";

  var B = window.BRAVIS;
  var categories = window.BRAVIS_VIDEO_CATEGORIES || [];
  var videos = window.BRAVIS_VIDEOS || [];
  var grid = document.getElementById("demo-grid");
  var bar = document.getElementById("demo-filters");
  var empty = document.getElementById("demo-empty");
  if (!grid || !bar) return;

  function categoryLabel(id) {
    for (var i = 0; i < categories.length; i++) if (categories[i].id === id) return categories[i];
    return { fr: id, en: id };
  }

  function card(meta) {
    var cat = categoryLabel(meta.cat);
    var article = B.el("article", { class: "demo-card", "data-cat": meta.cat });
    article.appendChild(B.el("figure", { class: "video-slot", "data-video": meta.id, "data-no-caption": "" }));
    var h3 = B.el("h3");
    h3.appendChild(B.bi(meta.fr.title, meta.en.title));
    article.appendChild(h3);
    var p = B.el("p");
    p.appendChild(B.bi(meta.fr.desc, meta.en.desc));
    article.appendChild(p);
    var footer = B.el("div", { class: "demo-meta" });
    var pill = B.el("span", { class: "cat-pill" });
    pill.appendChild(B.bi(cat.fr, cat.en));
    footer.appendChild(pill);
    if (meta.section) {
      var link = B.el("a", { href: "documentation.html#" + meta.section });
      link.appendChild(B.bi("Lire la doc →", "Read the docs →"));
      footer.appendChild(link);
    }
    article.appendChild(footer);
    return article;
  }

  function chip(id, fr, en, count, pressed) {
    var btn = B.el("button", { type: "button", class: "chip", "data-filter": id, "aria-pressed": String(pressed) });
    btn.appendChild(B.bi(fr, en));
    btn.appendChild(B.el("span", { class: "count", text: String(count) }));
    return btn;
  }

  Promise.all(videos.map(function (v) { return B.fileExists(B.videoUrl(v)); })).then(function (available) {
    var ready = videos.filter(function (v, i) { return available[i]; });
    var coming = B.isLocal ? videos.filter(function (v, i) { return !available[i]; }) : [];
    var shown = ready.concat(coming);

    shown.forEach(function (meta) { grid.appendChild(card(meta)); });
    B.initVideoSlots(grid);
    empty.hidden = shown.length > 0;

    bar.appendChild(chip("all", "Toutes", "All", shown.length, true));
    categories.forEach(function (cat) {
      var n = shown.filter(function (v) { return v.cat === cat.id; }).length;
      if (n) bar.appendChild(chip(cat.id, cat.fr, cat.en, n, false));
    });

    bar.addEventListener("click", function (e) {
      var btn = e.target.closest(".chip");
      if (!btn) return;
      var filter = btn.getAttribute("data-filter");
      bar.querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-pressed", String(c === btn)); });
      grid.querySelectorAll(".demo-card").forEach(function (c) {
        c.hidden = filter !== "all" && c.getAttribute("data-cat") !== filter;
      });
    });
  });
})();
