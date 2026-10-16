# v0.14.0 bottle copy correction

This content-only correction follows [card 324](https://fizzy.startkit.tech/1/cards/324). It supersedes the pending-bottle statements in the [historical PR 10 audit](https://github.com/firewalker06/tycho-site/blob/main/docs/audits/2026-10-16-v0.14.0.md). It does not change that audit's historical findings.

## Verified publication

Read-only GitHub checks on 2026-10-16 confirmed:

- [Published product v0.14.0](https://github.com/firewalker06/tycho/releases/tag/v0.14.0), source commit [8d813dca497fe9e106d0a679ee2f74849239c54c](https://github.com/firewalker06/tycho/commit/8d813dca497fe9e106d0a679ee2f74849239c54c), remains the documented version.
- [Immutable tap commit abd944d155f1c13654979f642d3f42c16dc35759](https://github.com/firewalker06/homebrew-tycho/commit/abd944d155f1c13654979f642d3f42c16dc35759) is also the current tap main head. Its formula lists revision 0 bottles for `arm64_tahoe` and `x86_64_linux`.
- [Published bottle release](https://github.com/firewalker06/homebrew-tycho/releases/tag/tycho-0.14.0) is neither draft nor prerelease. It was published at 2026-10-16T06:55:14Z. Both assets are uploaded. Their SHA-256 digests match the formula: `70c3bf7977a8f5f317e1c5fe44c8d4b8f7cbc0b8c9cc5f5391883e5c20eda578` (Apple Silicon Tahoe) and `51e2a96eb53d81ebfd1e1014670a23e7eb37ecbfc5c39c294663c317f283b696` (x86_64 Linux).
- [macOS 15 compatibility PR 30](https://github.com/firewalker06/homebrew-tycho/pull/30) is still OPEN and unmerged, head `1955fe6a492959f6beb954bf504e320648875915`. No revision 1 bottle is in the published release. This correction does not claim host validation or macOS 15 bottle support.

The guide now names Apple Silicon macOS 26 or newer and x86_64 Linux. It offers source installation for macOS 15 and other unsupported bottle targets. Intel macOS has no v0.14.0 bottle; the prior v0.11.0 final-bottle note remains.

## Scope and validation

The clean main baseline was `77e46b098383f8a36b93a2c68387057578c2e481`. Main was current after a fast-forward-only pull. There were no open site PRs, other active site agents, or site schedules. A fresh scoped branch was created in the existing checkout.

A repository search covered source pages, scripts, and reports. The four current stale statements were all in Install and Run. The old audit is now explicitly marked as historical. No app code, dependency, design, platform, hosting, or social changes are included. Existing public screenshots are retained because the change only affects installation prose.

[Production Install and Run](https://usetycho.com/docs/getting-started/) returned HTTP 200 before the change and contained “bottle publication is still pending”, “bottles are not yet published”, and a separate website-delivery statement. The published bottle release and immutable tap commit URLs both returned HTTP 200.

Node 22.20.0 and Corepack pnpm 11.18.0 were used. Frozen install, build, the internal link check across 12 generated pages, and `git diff --check` passed. The existing Astro build emits “Entry docs → 404 was not found” while still completing successfully; this copy change does not alter routing.

Real installed Google Chrome 155.0.8059.80 was used through standalone Playwright because the browser plugin execution tool is not exposed in this session. Desktop 1440×900 and mobile 390×844 checks cover the guide's text, source anchor, Homebrew code copy, horizontal overflow, and homepage exact-version and Changelog links. Review images are temporary files outside the checkout and are attached to the draft PR as native GitHub images. No product screenshots were recaptured.

Merge, deployment, and tap publication are outside this change. Independent review must check the final pushed head before the operator merge/deploy step.
