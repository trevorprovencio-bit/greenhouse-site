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
- `index.html` is responsive: it has a phone menu (`details.gh-menu`) and a sticky bottom bar (`.gh-mbar`).
- The other pages were designed at 1440px and still need a mobile pass.
- Every page has its SEO `<title>` and meta description.
- The booking tool prototype (a request form for tattoos, plus direct links for hair) lives separately in Claude and is not wired in yet. Every "Book" button currently goes to `book.html`.

## Links still missing (left as `href="#"`)
- Instagram handles for Dre, Chuck, Sky, Lauren, Floyd, Sam, Mary-Kate, Valerie and Caitlin. This covers every "See X's work", "X on Instagram" and "Message on Instagram" link, plus the small Instagram icons on homepage cards.
- Vagaro or booking links for each artist other than Dre and Chuck.
- The "Reserve a spot" links for Academy classes.
- "Contact Barbara" and `@susanhendleystudio` on the Art page.

## Waiting on Dre and Chuck (don't guess these)
- Walk-in policy, separately for hair and for tattoo.
- Hours and open days.
- Whether Sky goes by "Sky" or "Bianca", and Valerie by "Val" or "Valerie".
- The cosmetic tattoo service upstairs.
- Artist specialties.
- Which booking page is the real one: `book.html` or `book-online.html`.
- How FAQ pricing works.
