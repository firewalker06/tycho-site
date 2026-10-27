# Card 724 selected desktop review capture

The operator selected candidate 3, adapter code review, and explicitly authorized its redacted pixels for the public site. This implements [card 724](https://fizzy.startkit.tech/1/cards/724). It replaces the desktop hero and Watch carousel image, and refreshes the social image. The laptop frame, phone frame, 5 px phone padding, and site layout are unchanged.

## Actual source

This is a real session capture, not a synthetic fixture. The operator authorization is a scoped exception to the synthetic-data default in [ADR 004](../decisions/adr-004-release-version-and-screenshots.md). The source UI uses Tycho v0.14.1, product commit `2092ce32874d1b874bb467b8d293f986c7b5648a`, which was checked in the source checkout. The screenshot shows a review of an experimental adapter in [product PR 276](https://github.com/firewalker06/tycho/pull/276); it does not claim that the adapter is released or supported.

| Identity | Value |
| --- | --- |
| Parent | Tycho Works, `secondbrain-agent-20261025-122051-441588` |
| Source agent | `pull-request-reviews-agent-20261027-003815-799933` |
| Native session | `650605b4-9d5e-4361-b9b0-356f67e50d64` |
| Run | 2, `eac8000f-96f3-4d9a-afc1-30ffea29d0ad` |
| Summary | `summary-2026-10-27T01-31-07Z-310` |
| Open attachment | `1117553bb04ea9a6405f`, PR 276 review report (canonical) |
| Public review | [Posted review](https://github.com/firewalker06/tycho/pull/276#pullrequestreview-5661221230) |

The direct live Remote UI was opened in Chrome through browser tools. The run summary was opened in the center, and the attachment Preview control opened the report on the right. The report was scrolled past its metadata table to Overview and Issues. The capture viewport is 1920 × 1200 at device scale 1. No archive bridge was used for this selected candidate. Other candidates used a local bridge, but they are not published by this change.

## Redactions and authorization

Before capture, browser text nodes containing local absolute paths under the operator home directory or temporary directory were replaced with `[local path hidden]`. The real session, prompt, saved result, and attachment files were not edited. Relative public source-code paths, run result, cost, counts, code findings, and public PR links remain real. The selected image was visually checked for credentials and unrelated private data; none is visible. The same redactions remain in the shipped image.

The source is the unframed candidate 3 PNG. Its pixels are copied byte-for-byte. The framed candidate is only a review reference, so the public image does not contain a second laptop frame. Candidate files remain in the operator's durable local review bundle for audit; private bundle paths and other candidate content are not published.

## Public assets

| Asset | Dimensions | SHA-256 | Use |
| --- | --- | --- | --- |
| `remote-desktop-review-2026-10-27.png` | 1920 × 1200 | `9676aefe82718fc87b5a733dc14b4fdf6b3a419880a3cc06adf4a09b69fe9d8c` | Desktop hero and Watch carousel |
| `og-image.png` | 1200 × 630 | `0788c7aec8c97b18aa81dc57efed242ee6f24b400a40befbbd6fcbae7cb62647` | Open Graph and Twitter |
| `remote-mobile-agents-v0.14.1.png` | 780 × 1688 | `8478e3fe444d65a4f6d4209e53a502013a6210c7bec8e3e0d3c4c3fc7338aeea` | Phone, unchanged |

The old `quickstart-watch-v0.14.1.png` remains unchanged as the exact-release quickstart capture recorded by the prior release audits. It is no longer the homepage hero or Watch image. Launch, Answer, and Resume keep their existing screenshots.

The hero and Watch share the selected file and alt text. The phone alt text no longer says it shows the same sessions as the laptop. Watch image dimensions now use its actual 1920 × 1200 size; the other steps retain 1440 × 900.

## Social image

The [saved HTML composition](../assets/site-homepage/card724-desktop-review-og.html) is rendered in Chrome at 1200 × 630, device scale 1. It keeps the full title, full hero paragraph, local-first proof, release badge, and complete device outlines. The desktop screenshot changes; the phone composition stays in its previous position. The paragraph type size is 21 px so the complete paragraph and proof fit. The proof ends at y=621.9 within the 630 px canvas. Screenshot pixels are not cropped: the full 16:10 source fits the 16:10 laptop screen. The existing phone overlap is retained.

To reproduce, open the saved HTML file from this checkout in Chrome, let its three images load, set the viewport to 1200 × 630 at scale 1, and capture the viewport to `public/og-image.png`. The HTML uses relative public asset paths and contains no local absolute paths or credentials.

## Verification and handoff

- The initial full build passed with the pinned toolchain.
- Real Chrome checked the built homepage at 1440 × 1000, 900 × 1000, and 390 × 844. Horizontal overflow is 0 px. The header links fit on mobile, and the phone keeps 5 px padding. The laptop is hidden below 620 px as before.
- The desktop laptop has one frame, all three UI panes, and the selected image hash. The desktop hero reduces fine text, as the existing layout does. Watch gives the same image more width for reading.
- Mouse selects Watch; ArrowRight selects Answer; Home returns to Launch. Tab from the brand reaches the version link. Header navigation and carousel controls remain in their existing order.
- The social composition was visually inspected: all images load and the full paragraph and proof remain inside the canvas.
- The exact final pushed PR head must pass `scripts/ci.sh` with clean before/after receipts and `signoff/site-ci`. Its SHA, complete gate output, native desktop/mobile/social evidence, and status readback belong in the PR handoff.
- The parent commissions independent review. The operator owns merge. No merge or deployment is part of this change.
