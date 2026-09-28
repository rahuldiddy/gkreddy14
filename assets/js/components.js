/* =====================================================================
   COMPONENTS — small functions that return HTML for each piece of UI.
   They read everything from PROPERTIES and PORTFOLIO_CONFIG.
   ===================================================================== */

(function () {
  const C = window.PORTFOLIO_CONFIG;

  /* ---------- helpers ---------- */
  const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));

  const ICONS = {
    pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    back: '<path d="M19 12H5M11 18l-6-6 6-6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    home: '<path d="M4 11 12 4l8 7v9h-5v-6H9v6H4z"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    chev: '<path d="m9 6 6 6-6 6"/>',
    more: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
    share: '<path d="M12 3v12M8 7l4-4 4 4"/><path d="M5 12v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7"/>',
    plus: '<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 8v8M8 12h8"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    hotel: '<path d="M3 21h18M5 21V4h14v17M9 8h1M14 8h1M9 12h1M14 12h1M10 21v-4h4v4"/>',
    apartments: '<path d="M3 21h18M6 21V3h12v18M9.5 7h1M13.5 7h1M9.5 11h1M13.5 11h1M9.5 15h1M13.5 15h1"/>',
    event: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
    villas: '<path d="M3 21h18M5 21V11l7-6 7 6v10M10 21v-5h4v5"/>',
    recreation: '<path d="M6.5 12c3-5 9-6 13 0-4 6-10 5-13 0Z"/><path d="M6.5 12 3 9v6z"/><path d="M16 11h.01"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>'
  };
  const icon = (n, cls) => `<svg class="ic ${cls || ""}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[n] || ""}</svg>`;

  const catOf = key => C.categories.find(c => c.key === key) || { key, label: key, singular: key, blurb: "" };

  const locationText = p => [p.city, p.state].filter(Boolean).join(", ");

  // A URL is only used when it is a real http(s) address. Anything else = "coming soon".
  function safeUrl(u) {
    if (!u || typeof u !== "string") return "";
    try {
      const url = new URL(u.trim());
      return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
    } catch (e) { return ""; }
  }

  const imageFor = p => p.image
    ? { src: p.image, alt: p.imageAlt || `${p.name}${locationText(p) ? ", " + locationText(p) : ""}`, placeholder: false }
    : { src: window.placeholderImage(p.category, p.id), alt: `Illustration of a ${catOf(p.category).singular.toLowerCase()}. Placeholder, not a photo of ${p.name}.`, placeholder: true };

  const describe = p => p.description || catOf(p.category).blurb;

  /* ---------- components ---------- */

  function Header(route) {
    const link = (href, label, key) =>
      `<a href="${href}" class="nav-link${route === key ? " is-on" : ""}"${route === key ? ' aria-current="page"' : ""}>${label}</a>`;
    return `
      <div class="wrap header-in">
        <a href="#/" class="brand" aria-label="${esc(C.siteName)} home">
          <span class="brand-mark" aria-hidden="true"></span>
          <span class="brand-name">${esc(C.siteName)}</span>
        </a>
        <nav class="nav" aria-label="Main">
          ${link("#/", "Portfolio", "home")}
          ${link("#/about", "About", "about")}
        </nav>
      </div>`;
  }

  function TabBar(route) {
    const tab = (href, label, ic, key) =>
      `<a href="${href}" class="tab${route === key ? " is-on" : ""}"${route === key ? ' aria-current="page"' : ""}>${icon(ic)}<span>${label}</span></a>`;
    return `<a href="#/" class="tab tab-primary${route === "home" ? " is-on" : ""}"${route === "home" ? ' aria-current="page"' : ""}><span class="tab-bubble">${icon("grid")}</span><span>Portfolio</span></a>` +
      tab("#/more", "More", "more", "more");
  }

  function Hero(props) {
    const states = [...new Set(props.map(p => p.state).filter(Boolean))];
    const stateNames = { TX: "Texas", OK: "Oklahoma" };
    const where = states.map(s => stateNames[s] || s).join(" & ");
    // decorative illustrations only (one per category style), not tied to any property
    const preview = ["hotel", "event", "villas"].map((c, i) => ({ category: c, id: "hero-" + i, image: "", name: "" }));
    return `
      <section class="hero desktop-only" aria-labelledby="hero-title">
        <div class="wrap hero-in">
          <div class="hero-copy">
            <p class="eyebrow on-strong">${esc(C.heroEyebrow)}</p>
            <h1 id="hero-title">${esc(C.heroTitle)}</h1>
            <p class="hero-text">${esc(C.heroText)}</p>
            ${SearchBox("hero")}
            <p class="hero-meta"><strong>${props.length}</strong> properties${where ? ` across ${esc(where)}` : ""}</p>
          </div>
          <div class="hero-stack" aria-hidden="true">
            ${preview.map((p, i) => {
              const im = { src: window.placeholderImage(p.category, p.id) };
              return `<div class="stack-card s${i}"><img src="${esc(im.src)}" alt=""></div>`;
            }).join("")}
          </div>
        </div>
      </section>`;
  }

  function SearchBox(where) {
    return `
      <form class="search search-${where}" role="search" data-search-form>
        <label class="sr-only" for="q-${where}">Search by property name or city</label>
        ${icon("search")}
        <input id="q-${where}" type="search" data-search placeholder="Search by name or city" autocomplete="off" enterkeyhint="search">
        <button type="button" class="search-clear" data-clear-search aria-label="Clear search" hidden>${icon("x")}</button>
      </form>`;
  }

  function CategoryFilter(props, active) {
    const chip = (key, label, n) =>
      `<button type="button" class="chip${active === key ? " is-on" : ""}" data-cat="${key}" aria-pressed="${active === key}">${esc(label)}<span class="chip-n">${n}</span></button>`;
    return `<div class="chips" role="group" aria-label="Filter by category">
      ${chip("all", "All", props.length)}
      ${C.categories.map(c => chip(c.key, c.label, props.filter(p => p.category === c.key).length)).join("")}
    </div>`;
  }

  function CTAButton(p, size) {
    const url = safeUrl(p.bookingUrl);
    const cls = `cta${size ? " cta-" + size : ""}`;
    if (url) {
      return `<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener noreferrer" data-cta="${esc(p.id)}"
        aria-label="${esc(p.ctaLabel)}: ${esc(p.name)} (opens the official site in a new tab)">
        <span>${esc(p.ctaLabel)}</span>${icon("ext")}</a>`;
    }
    return `<button type="button" class="${cls} is-pending" data-pending="${esc(p.id)}" aria-disabled="true"
      aria-label="${esc(p.ctaLabel)}: link coming soon for ${esc(p.name)}">
      <span>${esc(p.ctaLabel)}</span><span class="soon">${icon("clock")}Coming soon</span></button>`;
  }

  function Badges(p) {
    let out = "";
    if (p.featured) out += `<span class="badge badge-feat">Featured</span>`;
    if (C.showDraftLabels && p.toConfirm) out += `<span class="badge badge-tbc" title="To confirm: ${esc(p.toConfirm)}">To confirm</span>`;
    return out;
  }

  function Media(p, cls, withBadges) {
    const im = imageFor(p);
    const b = withBadges ? Badges(p) : "";
    return `<div class="media ${cls || ""}">
      ${b ? `<span class="media-badges">${b}</span>` : ""}
      <img src="${esc(im.src)}" alt="${esc(im.alt)}" loading="lazy" decoding="async">
      ${im.placeholder && C.showPlaceholderLabels ? `<span class="ph-label">Placeholder<span class="ph-extra"> image</span></span>` : ""}
    </div>`;
  }

  function PropertyCard(p, i) {
    const cat = catOf(p.category);
    const loc = locationText(p);
    return `
      <article class="card" style="--i:${Math.min(i || 0, 12)}">
        ${Media(p, "card-media", true)}
        <div class="card-body">
          <div class="card-info">
          <span class="cat">${icon(p.category)}${esc(cat.singular)}<span class="cat-badges">${Badges(p)}</span></span>
          <h3 class="card-title"><a href="#/property/${esc(p.id)}" class="card-link">${esc(p.name)}</a></h3>
          <p class="loc">${icon("pin")}${loc ? esc(loc) : '<span class="muted">Location to be announced</span>'}</p>
          <p class="card-desc">${esc(describe(p))}</p>
          </div>
          <div class="card-foot">${CTAButton(p)}</div>
        </div>

      </article>`;
  }

  function PropertyGrid(list) {
    if (!list.length) {
      return `<div class="empty">
        <p class="empty-title">No properties match that search.</p>
        <p>Try another name or city, or show every property.</p>
        <button type="button" class="btn-ghost" data-reset>Show all properties</button>
      </div>`;
    }
    return `<div class="grid">${list.map((p, i) => PropertyCard(p, i)).join("")}</div>`;
  }

  function Directory(props, state, opts) {
    return `
      <section class="directory" id="directory" aria-label="All properties">
        <div class="wrap">
          <h1 class="sr-only mobile-only">${esc(C.siteName)}: all properties</h1>
          <div class="dir-head desktop-only">
            <p class="eyebrow">Explore</p><h2 id="dir-title">Browse the portfolio</h2>
          </div>
          <div class="toolbar">
            <div class="mobile-only toolbar-search">${SearchBox("home")}</div>
            ${CategoryFilter(props, state.cat)}
          </div>
          <div class="list-head"><h2 class="list-title mobile-only" data-list-title>All properties</h2><p class="result-count" aria-live="polite" data-count></p></div>
          <div data-grid></div>
        </div>
      </section>`;
  }


  function PropertyDetail(p, props) {
    const cat = catOf(p.category);
    const loc = locationText(p);
    const related = props.filter(o => o.id !== p.id && ((p.city && o.city === p.city) || o.category === p.category)).slice(0, 3);
    return `
      <article class="detail">
        <div class="wrap">
          <a href="#/" class="back" data-back>${icon("back")}<span>All properties</span></a>
        </div>
        <div class="wrap detail-grid">
          ${Media(p, "detail-media")}
          <div class="detail-info">
            <div class="card-top"><span class="cat">${icon(p.category)}${esc(cat.singular)}</span><span class="badges">${Badges(p)}</span></div>
            <h1 class="detail-title">${esc(p.name)}</h1>
            <p class="loc loc-lg">${icon("pin")}${loc ? esc(loc) : '<span class="muted">Location to be announced</span>'}</p>
            <p class="detail-desc">${esc(describe(p))}</p>
            <div class="detail-cta">${CTAButton(p, "lg")}</div>
            <p class="fine">${safeUrl(p.bookingUrl)
              ? `Opens the official ${esc(cat.singular.toLowerCase())} page in a new tab. Bookings and enquiries are handled there.`
              : `The official link for this property is on its way. Please check back soon.`}</p>
            ${C.showDraftLabels && p.toConfirm ? `<p class="draft-note"><strong>To confirm:</strong> ${esc(p.toConfirm)}</p>` : ""}
          </div>
        </div>
        ${related.length ? `
        <section class="related" aria-labelledby="rel-title">
          <div class="wrap">
            <h2 id="rel-title" class="related-title">${p.city && related.some(o => o.city === p.city) ? `More in ${esc(p.city)}` : `More ${esc(cat.label.toLowerCase())}`}</h2>
            <div class="grid">${related.map((o, i) => PropertyCard(o, i)).join("")}</div>
          </div>
        </section>` : ""}
        <div class="sticky-cta" aria-hidden="false">
          <div class="sticky-name"><strong>${esc(p.name)}</strong><span>${esc(loc || cat.singular)}</span></div>
          ${CTAButton(p)}
        </div>
      </article>`;
  }

  function About(props) {
    const counts = C.categories.map(c => ({ c, n: props.filter(p => p.category === c.key).length })).filter(x => x.n);
    const contact = [];
    if (C.contactEmail) contact.push(`<p class="contact-row">${icon("mail")}<span class="selectable">${esc(C.contactEmail)}</span></p>`);
    if (C.contactPhone) contact.push(`<p class="contact-row">${icon("phone")}<span class="selectable">${esc(C.contactPhone)}</span></p>`);
    return `
      <section class="about">
        <div class="wrap about-grid">
          <div>
            <p class="eyebrow">About</p>
            <h1>${esc(C.siteName)}</h1>
            ${C.aboutText.map(t => `<p class="about-text">${esc(t)}</p>`).join("")}
            <a href="#/" class="cta cta-lg about-cta"><span>Browse all properties</span>${icon("arrow")}</a>
          </div>
          <div class="about-panel">
            <div class="about-total"><span class="big">${props.length}</span><span>properties in the portfolio</span></div>
            <ul class="about-list">
              ${counts.map(x => `<li><a href="#/" data-go-cat="${x.c.key}">${icon(x.c.key)}<span>${esc(x.c.label)}</span><span class="n">${x.n}</span></a></li>`).join("")}
            </ul>
            ${contact.length ? `<div class="contact"><p class="eyebrow">Contact</p>${contact.join("")}</div>` : ""}
          </div>
        </div>
      </section>`;
  }

  function More(props) {
    const row = (href, ic, label, sub, attrs) =>
      `<a href="${href}" class="menu-row" ${attrs || ""}>${icon(ic)}<span class="menu-text"><strong>${label}</strong>${sub ? `<span>${sub}</span>` : ""}</span>${icon("chev", "menu-chev")}</a>`;
    const contact = [];
    if (C.contactEmail) contact.push(`<div class="menu-row static">${icon("mail")}<span class="menu-text"><strong>Email</strong><span class="selectable">${esc(C.contactEmail)}</span></span></div>`);
    if (C.contactPhone) contact.push(`<div class="menu-row static">${icon("phone")}<span class="menu-text"><strong>Phone</strong><span class="selectable">${esc(C.contactPhone)}</span></span></div>`);
    return `
      <section class="more">
        <div class="wrap more-in">
          <p class="eyebrow desktop-only">${esc(C.siteName)}</p>
          <h1 class="app-title">More</h1>
          <div class="menu">
            ${row("#/", "grid", "All properties", `${props.length} properties`)}
            ${row("#/about", "info", "About", "About the portfolio")}
          </div>
          ${contact.length ? `<h2 class="menu-head">Contact</h2><div class="menu">${contact.join("")}</div>` : ""}
          <h2 class="menu-head" id="install">Add to Home Screen</h2>
          <div class="menu install">
            <button type="button" class="menu-row" data-install hidden>${icon("plus")}<span class="menu-text"><strong>Install app</strong><span>Add ${esc(C.siteShortName)} to this device</span></span>${icon("chev", "menu-chev")}</button>
            <div class="menu-row static is-installed" hidden>${icon("plus")}<span class="menu-text"><strong>Installed</strong><span>You're using the home-screen app.</span></span></div>
            <div class="menu-row static how">${icon("share")}<span class="menu-text"><strong>iPhone / iPad (Safari)</strong><span>Tap Share, then Add to Home Screen.</span></span></div>
            <div class="menu-row static how">${icon("more")}<span class="menu-text"><strong>Android (Chrome)</strong><span>Tap the ⋮ menu, then Install app or Add to Home screen.</span></span></div>
          </div>
          <p class="app-version">${esc(C.siteShortName)} · version ${esc(C.appVersion || "1")}</p>
        </div>
      </section>`;
  }

  function Footer() {
    return `
      <div class="wrap footer-in">
        <div class="brand brand-foot"><span class="brand-mark" aria-hidden="true"></span><span class="brand-name">${esc(C.siteName)}</span></div>
        <p>Bookings, leasing and event enquiries are completed on each property's official website.</p>
        <p class="copy">© ${new Date().getFullYear()} ${esc(C.siteName)}</p>
      </div>`;
  }

  window.UI = { More, esc, icon, catOf, locationText, safeUrl, describe, Header, TabBar, Hero, SearchBox, CategoryFilter, CTAButton, PropertyCard, PropertyGrid, Directory, PropertyDetail, About, Footer };
})();
