/* =====================================================================
   APP — routing, filtering/search, rendering and small behaviours.
   Routes (hash based, works on any static host):
     #/                 home = the portfolio (all properties)
     #/property/<id>    property detail
     #/about            about
     #/more             more menu (phones) + add-to-home-screen help
   ===================================================================== */

(function () {
  const C = window.PORTFOLIO_CONFIG;
  const UI = window.UI;
  const ALL = (window.PROPERTIES || []).slice().sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  const els = { header: $("#site-header"), main: $("#main"), footer: $("#site-footer"), tabbar: $("#tabbar"), toast: $("#toast") };
  const state = { cat: "all", q: "" };
  const scrollMemory = {};
  let currentKey = "";

  /* ---------- search + filter ---------- */
  const STATE_NAMES = { TX: "texas", OK: "oklahoma" };
  const norm = s => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
  function matches(p) {
    if (state.cat !== "all" && p.category !== state.cat) return false;
    if (!state.q) return true;
    const hay = norm([p.name, p.city, p.state, STATE_NAMES[p.state], UI.catOf(p.category).label, UI.catOf(p.category).singular].join(" "));
    return norm(state.q).split(/\s+/).every(t => hay.includes(t));
  }

  function renderResults() {
    const grid = $("[data-grid]");
    if (!grid) return;
    const list = ALL.filter(matches);
    grid.innerHTML = UI.PropertyGrid(list);
    const count = $("[data-count]");
    if (count) {
      const label = state.cat === "all" ? (list.length === 1 ? "property" : "properties") : UI.catOf(state.cat).label.toLowerCase();
      count.textContent = `${list.length} ${label}${state.q ? ` for “${state.q}”` : ""}`;
    }
    const lt = $("[data-list-title]");
    if (lt) lt.textContent = state.cat === "all" ? "All properties" : UI.catOf(state.cat).label;
    $$("[data-cat]").forEach(b => { const on = b.dataset.cat === state.cat; b.classList.toggle("is-on", on); b.setAttribute("aria-pressed", on); });
    $$("[data-clear-search]").forEach(b => { b.hidden = !state.q; });
  }

  /* ---------- routing ---------- */
  function parseRoute() {
    const h = (location.hash || "#/").replace(/^#\/?/, "");
    const [head, id] = h.split("/");
    // old "#/properties" links still work and land on the portfolio
    if (head === "about") return { name: "about" };
    if (head === "more") return { name: "more" };
    if (head === "property" && id) return { name: "property", id: decodeURIComponent(id) };
    // A plain "#directory" style anchor lands on home
    return { name: "home" };
  }

  function setMeta(title, description) {
    document.title = title;
    const d = $('meta[name="description"]'); if (d && description) d.setAttribute("content", description);
    const ot = $('meta[property="og:title"]'); if (ot) ot.setAttribute("content", title);
    const od = $('meta[property="og:description"]'); if (od && description) od.setAttribute("content", description);
  }

  function render() {
    const route = parseRoute();
    const key = location.hash || "#/";
    if (currentKey) scrollMemory[currentKey] = window.scrollY;
    const navKey = route.name === "property" ? "" : route.name;

    els.header.innerHTML = UI.Header(navKey);
    els.tabbar.innerHTML = UI.TabBar(navKey === "about" ? "more" : route.name === "property" ? "home" : navKey);
    document.body.dataset.route = route.name;
    els.toast.classList.remove("show");

    if (route.name === "home") {
      els.main.innerHTML = UI.Hero(ALL) + UI.Directory(ALL, state, {});
      setMeta(`${C.siteName} · ${C.heroTitle}`, C.heroText);
    } else if (route.name === "about") {
      els.main.innerHTML = UI.About(ALL);
      setMeta(`About · ${C.siteName}`, C.aboutText[0]);
    } else if (route.name === "more") {
      els.main.innerHTML = UI.More(ALL);
      setMeta(`More · ${C.siteName}`, C.heroText);
      updateInstallUI();
    } else {
      const p = ALL.find(x => x.id === route.id);
      if (!p) {
        els.main.innerHTML = `<section class="wrap notfound"><h1>Property not found</h1><p>This property may have moved or been renamed.</p><a class="cta" href="#/"><span>See all properties</span></a></section>`;
        setMeta(`Not found · ${C.siteName}`, C.heroText);
      } else {
        els.main.innerHTML = UI.PropertyDetail(p, ALL);
        const loc = UI.locationText(p);
        setMeta(`${p.name}${loc ? " · " + loc : ""} · ${C.siteName}`, `${p.name}${loc ? ", " + loc : ""}. ${UI.describe(p)}`);
      }
    }

    // restore search text into whichever search box is on screen
    $$("[data-search]").forEach(i => { i.value = state.q; });
    renderResults();

    const y = scrollMemory[key];
    window.scrollTo(0, route.name !== "property" && y ? y : 0);
    currentKey = key;
    if (route.name === "property") { const h = $(".detail-title"); if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); } }
  }

  /* ---------- toast ---------- */
  let toastTimer;
  function toast(msg) {
    els.toast.textContent = msg;
    els.toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2800);
  }

  /* ---------- events (delegated, so re-renders never lose handlers) ---------- */
  document.addEventListener("input", e => {
    if (!e.target.matches("[data-search]")) return;
    state.q = e.target.value.trim();
    $$("[data-search]").forEach(i => { if (i !== e.target) i.value = e.target.value; });
    renderResults();
  });
  document.addEventListener("submit", e => {
    if (!e.target.matches("[data-search-form]")) return;
    e.preventDefault();
    const input = $("[data-search]", e.target);
    if (input) input.blur();
    const dir = $("#directory");
    if (dir && parseRoute().name === "home") dir.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  document.addEventListener("click", e => {
    const chip = e.target.closest("[data-cat]");
    if (chip) { state.cat = chip.dataset.cat; renderResults(); return; }

    if (e.target.closest("[data-clear-search]")) {
      state.q = ""; $$("[data-search]").forEach(i => { i.value = ""; }); renderResults();
      const i = $("[data-search]"); if (i) i.focus();
      return;
    }
    if (e.target.closest("[data-reset]")) {
      state.q = ""; state.cat = "all"; $$("[data-search]").forEach(i => { i.value = ""; }); renderResults(); return;
    }
    const goCat = e.target.closest("[data-go-cat]");
    if (goCat) {
      state.cat = goCat.dataset.goCat; state.q = "";
    }
    if (e.target.closest("[data-install]") && deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.finally(() => { deferredPrompt = null; updateInstallUI(); });
      return;
    }

    const pending = e.target.closest("[data-pending]");
    if (pending) {
      e.preventDefault();
      const p = ALL.find(x => x.id === pending.dataset.pending);
      toast(p ? `The official link for ${p.name} is coming soon.` : "This link is coming soon.");
      return;
    }
    const back = e.target.closest("[data-back]");
    if (back && window.__cameFromList) {
      e.preventDefault(); history.back();
    }
  });

  // remember whether the visitor reached a detail page from a list, so "back" returns to the same scroll spot
  window.addEventListener("hashchange", () => {
    window.__cameFromList = /^#\/property\//.test(location.hash) && /^(#\/?|#\/property\/.+)?$/.test(currentKey || "#/");
    render();
  });

  /* ---------- install (PWA) ---------- */
  let deferredPrompt = null;
  const isStandalone = () => {
    try { return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true; } catch (e) { return false; }
  };
  function updateInstallUI() {
    const btn = $("[data-install]"), done = $(".is-installed");
    const standalone = isStandalone();
    if (btn) btn.hidden = !deferredPrompt || standalone;
    if (done) done.hidden = !standalone;
    $$(".install .how").forEach(el => { el.hidden = standalone; });
  }
  window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); deferredPrompt = e; updateInstallUI(); });
  window.addEventListener("appinstalled", () => { deferredPrompt = null; updateInstallUI(); });
  if (isStandalone()) document.documentElement.classList.add("standalone");

  /* ---------- structured data (SEO) ---------- */
  function injectJsonLd() {
    const base = C.siteUrl ? C.siteUrl.replace(/\/$/, "") : "";
    const data = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: C.siteName,
      numberOfItems: ALL.length,
      itemListElement: ALL.map((p, i) => {
        const type = { hotel: "Hotel", apartments: "ApartmentComplex", event: "EventVenue", villas: "LodgingBusiness", recreation: "TouristAttraction" }[p.category] || "Place";
        const item = { "@type": type, name: p.name };
        if (p.city || p.state) item.address = Object.assign({ "@type": "PostalAddress" }, p.city ? { addressLocality: p.city } : {}, p.state ? { addressRegion: p.state } : {}, { addressCountry: "US" });
        const u = UI.safeUrl(p.bookingUrl); if (u) item.url = u;
        if (base) item["@id"] = `${base}/#/property/${p.id}`;
        return { "@type": "ListItem", position: i + 1, item };
      })
    };
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(data);
    document.head.appendChild(s);
  }

  /* ---------- PWA: service worker (only on a real https host, not in previews/iframes) ---------- */
  function registerSW() {
    try {
      const top = window.top === window.self;
      const okHost = location.protocol === "https:" || location.hostname === "localhost";
      if ("serviceWorker" in navigator && top && okHost && !/claude\.ai|claudeusercontent/.test(location.hostname)) {
        navigator.serviceWorker.register("sw.js").catch(() => {});
      }
    } catch (e) { /* ignore */ }
  }

  els.footer.innerHTML = UI.Footer();
  injectJsonLd();
  render();
  registerSW();
  if (window.console) console.info(`[portfolio] ${ALL.length} properties loaded, ${ALL.filter(p => UI.safeUrl(p.bookingUrl)).length} with live links.`);
})();
