# Card 724 homepage frames audit

This audit supports [Fizzy card 724](https://fizzy.startkit.tech/1/cards/724) and [draft PR 15](https://github.com/firewalker06/tycho-site/pull/15). It follows [ADR 004](https://github.com/firewalker06/tycho-site/blob/main/docs/decisions/adr-004-release-version-and-screenshots.md) and the [site release checklist](https://github.com/firewalker06/tycho-site/blob/main/docs/RELEASING.md).

## Source and provenance

- Product source: Tycho tag `v0.14.1`, commit `2092ce32874d1b874bb467b8d293f986c7b5648a`. The tag was fetched into the product repository and extracted with `git archive` into a temporary directory outside every checkout.
- Product checkout: not modified. No product source was changed to make the UI look different.
- Ruby gems: the global gem install was used. `bundle install` into a vendor path failed on native extensions in this environment, as recorded in the [v0.14.1 audit](https://github.com/firewalker06/tycho-site/blob/main/docs/audits/2026-10-26-v0.14.1.md).
- Capture tool: a copy of the tag's `bin/capture-site-quickstart`. The copy changes only the browser step and the output path.
- Fixture: the tag's synthetic quickstart fixture, with the Atlas Web, Compass API, and Beacon Mobile projects and nine agents. Config, logs, and workspaces are isolated in a temporary directory. The remote token is empty and the server binds to `127.0.0.1`.
- Browser: Google Chrome 155.0.8059.85, headless, dark color scheme.

## Captures

| Asset | Source | Viewport | Scale | Pixels | SHA-256 |
| --- | --- | --- | --- | --- | --- |
| `public/assets/quickstart-watch-v0.14.1.png` | Public v0.14.1 quickstart capture, unchanged | 1440×900 | 1× | 1440×900 | `10bfbd9b156da1d08bfa3dcf10f063cf46ea042c5668700a97771fd403b930db` |
| `public/assets/remote-mobile-agents-v0.14.1.png` | New capture from the tag, this audit | 390×844 | 2× | 780×1688 | `8478e3fe444d65a4f6d4209e53a502013a6210c7bec8e3e0d3c4c3fc7338aeea` |
| `public/og-image.png` | Composed from the two captures above in HTML and rendered in Chrome | 1200×630 | 1× | 1200×630 | `7c60600cf23706e323ef28c0f47d148ff2cc8d914f0502372b94ebb8c9dd9942` |

### Mobile capture fixture changes

- The tag's quickstart script was used, with its launch-modal and desktop fit steps replaced by a mobile step.
- The mobile step opens `#agents`, asserts nine agent rows, asserts no horizontal overflow, blurs the autofocused filter input so no focus ring appears, and captures the viewport.
- No fixture data was changed.

## Removed asset

- `public/assets/tui-conversation-v0.10.0.png` (SHA-256 `1f0ec71927c93f8d7497f5ce5fb016aa92fb9b486a25c684d1e37c7889e41824`) was removed. Its only use was the homepage hero, which now shows the v0.14.1 Remote UI. The file remains in git history.

## Homepage decisions

- The tagline is "Supervise coding agents." in the H1, the page title, the README, AGENTS.md, the manifest, and the Starlight config.
- The meta, Open Graph, and Twitter descriptions are now "Tycho is a local-first operator console for supervising coding agents." The "across projects" phrase was removed to match the new promise.
- `og:image:alt` and `twitter:image:alt` describe the OG image.
- Below 620 px, the laptop frame is hidden and the phone frame spans the column. At that width the laptop capture would show text too small to read. The phone capture is the only hero visual on phones, and its frame does not overlap any other content.
- Between 620 and 920 px, both frames show. The phone frame sits at the laptop's lower-right corner.
- The phone camera cutout sits inside the bezel.

## Browser verification

Checked on the rebuilt `dist/` in Chrome 155.0.8059.85 (see the PR head SHA for the exact build):

- Overflow: zero horizontal overflow at 1440, 900, and 390 px.
- Images: all content images returned HTTP 200 and have alt text.
- Keyboard: the header links receive focus in order, then the hero links.
- Visuals: the desktop hero, mobile hero, and OG image were inspected as images. Each one matches its capture, and the OG image contains the proof sentence.

## Open gates

1. Independent review on the exact pushed head. The parent commissions it.
2. Native PR image evidence is refreshed on the final head and verified by URL.
3. No merge or deployment is part of this audit.
