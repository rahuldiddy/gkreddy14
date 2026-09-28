# The Portfolio — property directory app (v1.2)

A lightweight, mobile-first portfolio web app. Visitors browse every property,
open a property page, and continue to that property's official booking,
leasing, tour or event site. No login, no database, no backend, no paid services.

## Where to change things

| To change…                                   | Edit                         |
|----------------------------------------------|------------------------------|
| Any property (name, city, category, image, description, button text, booking URL, featured) | `assets/js/properties.js` |
| Portfolio name, hero wording, About text, contact, category labels, draft/placeholder tags | `assets/js/config.js` |
| Colours, fonts, spacing                      | `assets/css/styles.css` (tokens at the top) |
| Home-screen app name and colours             | `manifest.webmanifest`       |

### Adding a booking link
Paste the full official URL (starting with `https://`) into `bookingUrl`.
While it is `""`, the button shows **Link coming soon** and never opens a broken page.
Real links open in a new tab, so the portfolio stays open behind them.

### Adding a real photo
1. Put the photo in `assets/images/properties/` (JPG or WebP, about 1600px wide, under 300 KB).
2. Set `image: "assets/images/properties/your-photo.jpg"` and a short `imageAlt`.
The "Placeholder image" label disappears automatically for that property.

### Before going live
- When the portfolio has a real name, set `siteName`, `siteShortName` and `siteUrl` in `config.js`, and update the `<title>`/meta tags in `index.html` and the names in `manifest.webmanifest`.
- Set `showDraftLabels: false` (hides the "To confirm" tags).
- Replace the icons in `icons/` with the real logo (192px, 512px, 512px maskable, 180px Apple, og-image 1200×630).
- Bump `VERSION` in `sw.js` each time you deploy.

## Install on a phone (after deploying to an https address)
- iPhone (Safari): Share → Add to Home Screen. It opens full-screen as "The Portfolio".
- Android (Chrome): ⋮ menu → Install app. The More tab also shows an Install button when Chrome offers one.

## Run locally
Open `index.html` directly, or run `python3 -m http.server` in this folder and visit http://localhost:8000.

## Deploy (free)
It is a static site: drag the folder onto Netlify Drop, or use Cloudflare Pages / GitHub Pages / Vercel.
Add-to-home-screen works once it is served over HTTPS.

## Structure
```
index.html                 page shell + SEO / PWA tags
assets/js/properties.js    ← the 14 properties (single source of truth)
assets/js/config.js        site settings and categories
assets/js/components.js    Header, Hero, CategoryFilter, PropertyGrid, PropertyCard,
                           PropertyDetail, CTAButton, About, Footer
assets/js/app.js           routing (#/ portfolio, #/property/<id>, #/about, #/more), search, filters, install
assets/js/placeholders.js  illustrated placeholder images
assets/css/styles.css      design tokens + responsive layout (light & dark)
manifest.webmanifest, sw.js, icons/   installable PWA
```
