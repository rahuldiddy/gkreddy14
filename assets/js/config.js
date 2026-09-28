/* =====================================================================
   SITE CONFIG — branding, wording and category settings.
   Property details live in properties.js, not here.
   ===================================================================== */

window.PORTFOLIO_CONFIG = {
  siteName: "The Portfolio",              // neutral placeholder; replace with the real portfolio name later
  siteShortName: "The Portfolio",         // name under the home-screen icon
  siteUrl: "",                          // e.g. "https://portfolio.example.com" once deployed (used for SEO links)

  heroEyebrow: "Hotels · Apartments · Events · Villas · Recreation",
  heroTitle: "One Portfolio. Many Destinations.",
  heroText: "Choose a property and continue straight to its official booking, leasing or event page.",

  aboutText: [
    "This is the front door to every property in the portfolio, from hotels and apartments to event space, lakeside villas and recreation.",
    "Pick a property to see where it is, then continue to its official booking, leasing, tour or event page. Reservations and enquiries are handled by each property directly."
  ],

  // Optional. Leave "" to hide. Shown under More / About.
  contactEmail: "",
  contactPhone: "",

  // While true, properties with a "toConfirm" note show a small "To confirm" tag.
  // Set to false before going live.
  showDraftLabels: true,

  // While true, the illustrated placeholder images carry a "Placeholder image" label.
  showPlaceholderLabels: true,

  appVersion: "1.2",

  // Filter order and labels. "key" must match the category field in properties.js.
  categories: [
    { key: "hotel",      label: "Hotels",     singular: "Hotel",       blurb: "Book your stay through the official hotel site." },
    { key: "apartments", label: "Apartments", singular: "Apartments",  blurb: "Schedule a tour with the leasing team." },
    { key: "event",      label: "Events",     singular: "Event Venue", blurb: "Explore the venue and plan your event." },
    { key: "villas",     label: "Villas",     singular: "Villas",      blurb: "Explore the villas and plan your stay." },
    { key: "recreation", label: "Recreation", singular: "Recreation",  blurb: "Explore what's on offer at the lake." }
  ]
};
