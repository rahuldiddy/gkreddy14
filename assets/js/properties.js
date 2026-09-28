/* =====================================================================
   PROPERTY DATA — the single source of truth for the whole portfolio.
   ---------------------------------------------------------------------
   Edit ONLY this file to change any property. The whole app (cards,
   filters, search, detail pages, SEO data) is generated from it.

   Fields
     id           unique, lowercase, dashes only (used in the page URL)
     name         display name
     city, state  location ("" if not confirmed yet)
     category     one of: hotel | apartments | event | villas | recreation
     image        path or URL to a photo, e.g. "assets/images/properties/yerrabella.jpg"
                  leave "" to show the built-in illustrated placeholder
     imageAlt     short description of the photo (used when image is set)
     description  one short line; "" uses the category default from config.js
     ctaLabel     button text
     bookingUrl   official booking / leasing / tour / website link
                  leave "" and the button shows "Link coming soon" instead
                  of sending visitors to a broken page
     featured     true = shown first with a "Featured" tag
     toConfirm    internal note shown as a "To confirm" tag while
                  showDraftLabels is true in config.js; "" when final
   ===================================================================== */

window.PROPERTIES = [
  {
    id: "yerrabella-apartments",
    name: "Yerrabella Apartments",
    city: "",
    state: "",
    category: "apartments",
    image: "",
    imageAlt: "",
    description: "Modern apartment living",
    ctaLabel: "Book a Tour",
    bookingUrl: "",
    featured: true,
    toConfirm: "Location"
  },
  {
    id: "holiday-hotel-bonham",
    name: "Holiday Property",
    city: "Bonham",
    state: "TX",
    category: "hotel",
    image: "",
    imageAlt: "",
    description: "",
    ctaLabel: "Book Your Stay",
    bookingUrl: "",
    featured: false,
    toConfirm: "Exact hotel brand name"
  },
  {
    id: "marriott-bonham",
    name: "Marriott",
    city: "Bonham",
    state: "TX",
    category: "hotel",
    image: "",
    imageAlt: "",
    description: "",
    ctaLabel: "Book Your Stay",
    bookingUrl: "",
    featured: false,
    toConfirm: ""
  },
  {
    id: "days-inn-plainview",
    name: "Days Inn",
    city: "Plainview",
    state: "TX",
    category: "hotel",
    image: "",
    imageAlt: "",
    description: "",
    ctaLabel: "Book Your Stay",
    bookingUrl: "",
    featured: false,
    toConfirm: ""
  },
  {
    id: "holiday-hotel-plainview",
    name: "Holiday Property",
    city: "Plainview",
    state: "TX",
    category: "hotel",
    image: "",
    imageAlt: "",
    description: "",
    ctaLabel: "Book Your Stay",
    bookingUrl: "",
    featured: false,
    toConfirm: "Exact hotel brand name"
  },
  {
    id: "holiday-inn-express-childress",
    name: "Holiday Inn Express",
    city: "Childress",
    state: "TX",
    category: "hotel",
    image: "",
    imageAlt: "",
    description: "",
    ctaLabel: "Book Your Stay",
    bookingUrl: "",
    featured: true,
    toConfirm: ""
  },
  {
    id: "americinn",
    name: "AmericInn",
    city: "",
    state: "",
    category: "hotel",
    image: "",
    imageAlt: "",
    description: "",
    ctaLabel: "Book Your Stay",
    bookingUrl: "",
    featured: false,
    toConfirm: "Exact branding (AmericInn / Meric Inn) and location"
  },
  {
    id: "holiday-inn-express-pilot-point",
    name: "Holiday Inn Express",
    city: "Pilot Point",
    state: "TX",
    category: "hotel",
    image: "",
    imageAlt: "",
    description: "",
    ctaLabel: "Book Your Stay",
    bookingUrl: "",
    featured: false,
    toConfirm: ""
  },
  {
    id: "holiday-inn-express-mineola",
    name: "Holiday Inn Express",
    city: "Mineola",
    state: "TX",
    category: "hotel",
    image: "",
    imageAlt: "",
    description: "",
    ctaLabel: "Book Your Stay",
    bookingUrl: "",
    featured: false,
    toConfirm: ""
  },
  {
    id: "hampton-plainview",
    name: "Hampton",
    city: "Plainview",
    state: "TX",
    category: "hotel",
    image: "",
    imageAlt: "",
    description: "",
    ctaLabel: "Book Your Stay",
    bookingUrl: "",
    featured: false,
    toConfirm: ""
  },
  {
    id: "holiday-inn-express-jenks",
    name: "Holiday Inn Express",
    city: "Jenks",
    state: "OK",
    category: "hotel",
    image: "",
    imageAlt: "",
    description: "",
    ctaLabel: "Book Your Stay",
    bookingUrl: "",
    featured: false,
    toConfirm: ""
  },
  {
    id: "reddy-event-centre-bonham",
    name: "Reddy Event Centre",
    city: "Bonham",
    state: "TX",
    category: "event",
    image: "",
    imageAlt: "",
    description: "",
    ctaLabel: "Explore Venue",
    bookingUrl: "",
    featured: true,
    toConfirm: ""
  },
  {
    id: "villas-by-lake-bonham",
    name: "Villas by Lake",
    city: "Bonham",
    state: "TX",
    category: "villas",
    image: "",
    imageAlt: "",
    description: "",
    ctaLabel: "Explore Property",
    bookingUrl: "",
    featured: true,
    toConfirm: ""
  },
  {
    id: "fishing-by-lake-windom",
    name: "Fishing by Lake",
    city: "Windom area",
    state: "",
    category: "recreation",
    image: "",
    imageAlt: "",
    description: "",
    ctaLabel: "Explore",
    bookingUrl: "",
    featured: false,
    toConfirm: "Exact name and location (Windom / Windham area)"
  }
];
