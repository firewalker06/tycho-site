# ADR 006: Accessible Quickstart Carousel

## Status

Accepted.

## Context

ADR-005 gave every quickstart step a separate vertical row and linked every screenshot to its source PNG. That treatment makes the screenshots compete with one another, repeats a large frame four times, and puts the sequence farther from the compact step navigation and dominant visual requested for the homepage. The source-image links are no longer part of the product direction.

The quickstart still needs to preserve its four actions and their order. It must also work for keyboard, screen-reader, reduced-motion, mobile, and no-JavaScript users without autoplay or hidden essential content.

## Decision

Use a progressively enhanced tabbed carousel with four compact labels above one dominant screenshot panel:

1. Launch
2. Watch
3. Answer
4. Resume

Each panel retains the existing full step sentence as its heading and keeps its screenshot in the same ordered-list item. JavaScript enhances the step links into a WAI-ARIA tab list, shows one panel at a time, and supports click, Left/Right/Up/Down Arrow, Home, and End operation. Selection follows keyboard focus. The carousel does not autoplay and does not animate, including when `prefers-reduced-motion` is active.

Without JavaScript, the compact controls remain normal in-page links and all four ordered panels remain visible. This preserves the complete sequence and provides working navigation instead of inert tabs. The screenshot is not interactive, and the site provides no full-size or open-image link.

Keep the screenshot frame at its native 8:5 ratio with `width="1440"` and `height="900"`. The panel must stay within the page width at every breakpoint and must never crop or stretch the image. The first screenshot loads eagerly because it is the initial panel; the remaining screenshots load lazily.

Use Tycho's existing orange accent, dark panel, type, border, and shadow tokens so the component follows the reference's structure without copying its brand treatment.

## Assets

The Answer and Resume captures from ADR-005 remain valid. The Launch capture uses an authentic populated Tycho quick-agent modal over the registered-project ledger. The Watch capture uses an authentic, complete nine-row agent list across three projects and Succeeded, Answer required, Running, and Failed states. Both approved canonical PNGs come from the Tycho product repository's `docs/assets/site-quickstart/` directory and retain their release-versioned names in this site's `public/assets/` directory.

Canonical replacement checksums:

- `quickstart-launch-v0.10.0.png`: `91db4a2fadcd40b0869a79b7c2508c369e8038fe57704706b6ffbbade46a7065`
- `quickstart-watch-v0.10.0.png`: `db14da9b2b26e58f305e6b76b3fc901d4b9d3bd6621dba716a02f8206eba80ff`

Do not merge or deploy until both replacement assets have been delivered, reviewed at their original size, copied into this repository, and included in the full responsive and accessibility QA pass.
