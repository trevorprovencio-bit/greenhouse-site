# Greenhouse website: notes for Claude

A static site, with no framework and no build step. The pages came from design comps, so most styling is inline `style=""` attributes. Moving repeated inline styles into `css/site.css` as classes is welcome, as long as each page looks the same afterwards.

## Brand
- **Colors (use only these):**
  - vermilion `#F03B1F`
  - forest `#1C4A46` (main text and buttons)
  - lime `#7FCB2B`
  - charcoal `#393536`
  - bone `#F2F0ED` (page background)
  - blush `#ECCCC4`
  - mist `#E0E0E0`
  - white
- **Fonts:**
  - Italiana for display headings
  - Barlow 600 for uppercase labels and buttons
  - Arimo for body text
  - DIN Pro and Trade Gothic are under consideration, but there is no web license yet. Don't add those font files.
- **Buttons:**
  - Base: min-height 48px; Barlow 600 at 13px; letter-spacing 0.14em; uppercase.
  - Primary: forest fill.
  - Outline: forest border, 1.5px.
  - On dark backgrounds: lime fill with charcoal text, or a white outline.
- **Copy voice:** plain, warm and specific. Say "Book with Dre", not "Book". Avoid filler like "community-focused".

## State of the build
- Every page works from phone to desktop. Below 900px, the nav collapses into a `details.gh-menu` panel and a sticky bottom bar (`.gh-mbar`) shows Book / Text the shop. Artist card grids (`.gh-artists`) go two across on phones.
- Every page has its SEO `<title>` and meta description.

## Booking panel (`js/booking.js`, `css/booking.css`)
- Any element with `data-book` opens it, and its `href` (`book.html`) stays as the fallback when the script doesn't run:
  - `data-book=""` opens the start screen (hair or tattoo).
  - `data-book="hair"` opens the hair questions.
  - `data-book="tattoo"` opens the tattoo questions.
  - `data-book="request:chuck"` opens the tattoo request form with that artist picked. The other values are `sky` and `lauren`.
  - Opening `any-page.html#book` opens the panel on load.
- Hair sends people to each stylist's own booking page. Those links are in the `ARTISTS` settings at the top of `booking.js`.
- Tattoo requests from Chuck, Sky and Lauren come in through the request form. Floyd books through Instagram messages.
- **Where requests go:** `REQUEST_ENDPOINT` at the top of `booking.js`.
  - While it's empty, the request opens in the visitor's email app, addressed to info@greenhouseavl.com.
  - Paste a form endpoint that accepts JSON, such as Formspree, and requests post there instead and show "Request sent".
- The panel is styled under `.ghb`, so page styles don't leak into it.

## Where the links came from
- Artist Instagram and booking links were taken from greenhouseavl.com (the current site) on Nov 8, 2026.
- The Academy "Reserve a spot" buttons point to the class product pages on the current site. They will break when that site is replaced, unless class sign-up moves somewhere else.

## Links still missing (left as `href="#"`)
- **Sam's Instagram:** the current site splits the link between @doeshairforfood and @macktomrell. Confirm with Sam.

## Waiting on Dre and Chuck (don't guess these)
- Walk-in policy, separately for hair and for tattoo.
- Hours and open days.
- Whether Sky goes by "Sky" or "Bianca", and Valerie by "Val" or "Valerie".
- The cosmetic tattoo service upstairs.
- Artist specialties. The booking panel's "best match" uses Dre for cuts, Caitlin for curls, and Sam, Mary-Kate and Valerie for color.
- Which booking page is the real one: `book.html` or `book-online.html`.
- How FAQ pricing works.
- Where tattoo requests should land: an email inbox or a form service.
