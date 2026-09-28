/* =====================================================================
   PLACEHOLDER ARTWORK
   Illustrated dusk scenes, one style per category, used only when a
   property has no "image" set. They are generic illustrations and are
   labelled as placeholders so they are never mistaken for real photos.
   ===================================================================== */

(function () {
  // small deterministic random from a string seed
  function rng(seed) {
    let h = 2166136261;
    for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
    return function () { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 10000) / 10000; };
  }

  const SKIES = [
    ["#15223A", "#2C4468", "#C79E68"],
    ["#172540", "#34507A", "#D2AE7C"],
    ["#13203A", "#2A4A6E", "#B8946A"],
    ["#1A2640", "#3B5579", "#D9B98A"]
  ];

  function sky(r, id) {
    const s = SKIES[Math.floor(r() * SKIES.length)];
    const sunX = 180 + r() * 440;
    return {
      defs: `<linearGradient id="s${id}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${s[0]}"/><stop offset=".62" stop-color="${s[1]}"/><stop offset="1" stop-color="${s[2]}"/></linearGradient>
        <radialGradient id="g${id}" cx="${sunX / 800}" cy=".78" r=".5">
          <stop offset="0" stop-color="#F4DDB0" stop-opacity=".75"/><stop offset="1" stop-color="#F4DDB0" stop-opacity="0"/></radialGradient>`,
      body: `<rect width="800" height="500" fill="url(#s${id})"/><rect width="800" height="500" fill="url(#g${id})"/>` +
        stars(r),
      sunX
    };
  }

  function stars(r) {
    let out = "";
    for (let i = 0; i < 18; i++) {
      out += `<circle cx="${(r() * 800).toFixed(0)}" cy="${(r() * 170).toFixed(0)}" r="${(0.6 + r() * 1.1).toFixed(1)}" fill="#fff" opacity="${(0.25 + r() * 0.5).toFixed(2)}"/>`;
    }
    return out;
  }

  function windows(x, y, cols, rows, w, h, gx, gy, r, litRate) {
    let out = "";
    for (let c = 0; c < cols; c++) for (let rr = 0; rr < rows; rr++) {
      const lit = r() < litRate;
      out += `<rect x="${x + c * (w + gx)}" y="${y + rr * (h + gy)}" width="${w}" height="${h}" rx="1.5" fill="${lit ? "#F2D29B" : "#22324F"}" opacity="${lit ? 0.95 : 0.9}"/>`;
    }
    return out;
  }

  const ground = (y, c) => `<rect x="0" y="${y}" width="800" height="${500 - y}" fill="${c || "#0F1929"}"/>`;
  const trees = (r, y, n, c) => {
    let out = "";
    for (let i = 0; i < n; i++) {
      const x = r() * 800, h = 30 + r() * 40;
      out += `<path d="M${x - h * 0.28} ${y} L${x} ${y - h} L${x + h * 0.28} ${y} Z" fill="${c || "#0F1929"}"/>`;
    }
    return out;
  };

  const SCENES = {
    hotel(r) {
      const x = 250 + r() * 120, w = 250, top = 120 + r() * 30;
      return trees(r, 410, 9) +
        `<rect x="${x - 60}" y="${top + 110}" width="70" height="${410 - top - 110}" fill="#1A2740"/>` +
        `<rect x="${x}" y="${top}" width="${w}" height="${410 - top}" fill="#1E2C47"/>` +
        `<rect x="${x}" y="${top}" width="${w}" height="10" fill="#B08D57" opacity=".85"/>` +
        windows(x + 22, top + 30, 7, 7, 20, 18, 12, 18, r, 0.45) +
        windows(x - 48, top + 130, 2, 5, 16, 14, 10, 16, r, 0.35) +
        `<rect x="${x + 90}" y="${388}" width="70" height="22" fill="#F2D29B" opacity=".9"/>` +
        `<rect x="${x + 70}" y="378" width="110" height="10" fill="#B08D57"/>` +
        ground(410);
    },
    apartments(r) {
      let out = trees(r, 415, 7);
      const blocks = [[120, 190, 180], [300, 140, 200], [500, 200, 170]];
      blocks.forEach(([x, top, w], i) => {
        out += `<rect x="${x}" y="${top}" width="${w}" height="${415 - top}" fill="${i === 1 ? "#1F2E4A" : "#1A2741"}"/>` +
          windows(x + 18, top + 22, Math.floor((w - 20) / 36), Math.floor((380 - top) / 38), 22, 22, 14, 16, r, 0.4);
        for (let y = top + 50; y < 400; y += 38) out += `<rect x="${x + 10}" y="${y}" width="${w - 20}" height="3" fill="#B08D57" opacity=".55"/>`;
      });
      return out + ground(415);
    },
    event(r) {
      const x = 170, w = 460, y = 300;
      let lights = "";
      for (let i = 0; i <= 24; i++) {
        const t = i / 24, lx = 60 + t * 680, ly = 190 + Math.sin(t * Math.PI * 3) * 18 + 20;
        lights += `<circle cx="${lx}" cy="${ly}" r="3.2" fill="#F6DCA8"/><circle cx="${lx}" cy="${ly}" r="9" fill="#F6DCA8" opacity=".18"/>`;
      }
      return trees(r, 420, 8) +
        `<path d="M${x - 20} ${y} L400 ${y - 90} L${x + w + 20} ${y} Z" fill="#1E2C47"/>` +
        `<rect x="${x}" y="${y}" width="${w}" height="120" fill="#1A2741"/>` +
        `<rect x="${x + 30}" y="${y + 25}" width="${w - 60}" height="70" fill="#F2D29B" opacity=".85"/>` +
        Array.from({ length: 7 }, (_, i) => `<rect x="${x + 30 + i * ((w - 60) / 6) - 3}" y="${y + 25}" width="6" height="70" fill="#1A2741"/>`).join("") +
        lights + ground(420, "#132035");
    },
    villas(r) {
      let out = "";
      const hs = [[110, 0.9], [330, 1.1], [560, 0.95]];
      hs.forEach(([x, s]) => {
        const w = 150 * s, h = 70 * s, b = 330;
        out += `<path d="M${x - 12} ${b - h} L${x + w / 2} ${b - h - 55 * s} L${x + w + 12} ${b - h} Z" fill="#22324F"/>` +
          `<rect x="${x}" y="${b - h}" width="${w}" height="${h}" fill="#1B2842"/>` +
          `<rect x="${x + w * 0.18}" y="${b - h + 18}" width="${w * 0.22}" height="${h * 0.45}" fill="#F2D29B" opacity=".9"/>` +
          `<rect x="${x + w * 0.58}" y="${b - h + 18}" width="${w * 0.22}" height="${h * 0.45}" fill="${r() < 0.6 ? "#F2D29B" : "#2A3A58"}" opacity=".9"/>`;
      });
      // lake with reflections
      out += `<rect x="0" y="330" width="800" height="170" fill="#1C3354"/>`;
      for (let i = 0; i < 14; i++) {
        const y = 345 + i * 11, x = 60 + r() * 640;
        out += `<rect x="${x}" y="${y}" width="${40 + r() * 120}" height="2" rx="1" fill="#F2D29B" opacity="${(0.15 + r() * 0.35).toFixed(2)}"/>`;
      }
      return trees(r, 332, 6) + out;
    },
    recreation(r) {
      let out = `<path d="M0 300 Q200 250 400 290 T800 280 L800 320 L0 320 Z" fill="#1A2741"/>` + trees(r, 318, 12, "#152238") +
        `<rect x="0" y="318" width="800" height="182" fill="#1C3354"/>`;
      for (let i = 0; i < 16; i++) {
        const y = 330 + i * 10, x = r() * 760;
        out += `<rect x="${x}" y="${y}" width="${30 + r() * 90}" height="2" rx="1" fill="#F2D29B" opacity="${(0.12 + r() * 0.3).toFixed(2)}"/>`;
      }
      // dock + boat + rod
      out += `<rect x="470" y="372" width="330" height="10" fill="#0F1929"/>` +
        [490, 560, 630, 700, 770].map(x => `<rect x="${x}" y="382" width="7" height="40" fill="#0F1929"/>`).join("") +
        `<path d="M560 372 L610 300" stroke="#0F1929" stroke-width="3"/><path d="M610 300 Q640 340 628 400" stroke="#E9D3A8" stroke-width="1" fill="none" opacity=".6"/>` +
        `<path d="M170 400 L290 400 L272 418 L186 418 Z" fill="#0F1929"/>`;
      for (let i = 0; i < 3; i++) {
        const bx = 200 + r() * 350, by = 150 + r() * 70;
        out += `<path d="M${bx} ${by} q8 -7 16 0 q8 -7 16 0" stroke="#0F1929" stroke-width="2.2" fill="none"/>`;
      }
      return out;
    }
  };

  const cache = {};
  window.placeholderImage = function (category, seed) {
    const key = category + "|" + seed;
    if (cache[key]) return cache[key];
    const r = rng(key);
    const id = Math.floor(r() * 1e6).toString(36);
    const s = sky(r, id);
    const scene = (SCENES[category] || SCENES.hotel)(r);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice"><defs>${s.defs}</defs>${s.body}${scene}</svg>`;
    cache[key] = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg.replace(/\s+/g, " "));
    return cache[key];
  };
})();
