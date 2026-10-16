# Release the Tycho site

Use this checklist for each published Tycho release. The product release workflow must link to this stable checklist: [Site release checklist](https://github.com/firewalker06/tycho-site/blob/main/docs/RELEASING.md). A draft product release is not a published release. Do not publish site claims for unmerged work.

This checklist implements [ADR 004](https://github.com/firewalker06/tycho-site/blob/main/docs/decisions/adr-004-release-version-and-screenshots.md).

## 1. Establish the released source

- [ ] Record the published release URL, tag, and full commit SHA. Read its release notes and changes since the site's last reviewed release. Check release status directly; do not use an unreleased product branch as evidence.
- [ ] Check live agents, schedules, Git status, default branch, and open site PRs. Preserve unfinished work. On the clean actual default branch, pull with `git pull --ff-only`, then create a scoped branch. Do not stash, reset, discard, or make a new clone or worktree to bypass occupied work.
- [ ] Record source release, Homebrew publication, and website delivery separately. Do not claim bottles are available before tap publication and installed/bottle checks confirm that version.
- [ ] Set `currentVersion` in `src/pages/index.astro`. Its badge must link to that exact tag. Keep Changelog linked to [all Tycho releases](https://github.com/firewalker06/tycho/releases). Verify version and release URLs in installation and upgrade guidance, image text, alt text, and social previews agree.

## 2. Audit docs and every public screenshot

- [ ] Audit installation, upgrade and platform support, concepts, configuration, all registered CLI commands and help, deprecated and removed commands, and relevant feature pages against the exact release source. Top-level help can omit registered subcommands. Record source paths and full source SHA in the audit.
- [ ] Inventory every public screenshot, including unused files and the social preview. Record its route or use, provenance, fixture story, and a keep, replace, or remove decision with a reason.
- [ ] Recapture only when UI changed materially, fixture content names an old release, or the image cannot support its surrounding claim. A filename with an old version is not by itself a reason to recapture. Retention needs explicit evidence. Do not require a full recapture when the audit supports retention.
- [ ] Use the exact release tag for product captures. If a product checkout is occupied, export an immutable tag archive outside checkouts. Use synthetic fixtures and isolated state, config, logs, credentials, and harness executables. Never capture personal sessions, hosts, tokens, or config. Record capture commands, fixture changes, viewport, browser version, and output hashes. Do not alter product source to make the UI look different.
- [ ] Preserve the site's visual identity, the promise “Supervise coding agents across projects,” and the local-first proof. Use “agent sessions” in public copy. Keep multiserver images paired where that story is shown.

## 3. Install, build, and inspect

- [ ] Use Node from `.mise.toml` and the pnpm version pinned in `package.json` through Corepack. Record actual Node and pnpm versions; preserve the lockfile unless a dependency change is required.

```sh
corepack pnpm install --frozen-lockfile
corepack pnpm build
corepack pnpm check:links
git diff --check
```

- [ ] The `check:links` command also checks that the rendered version badge and exact release links agree. Check the generated badge and exact release URL, docs release links, and social image. External release/source links need a separate HTTP check; the internal link checker does not verify remote URLs.
- [ ] Start a local preview. Use real Chrome on desktop and mobile sizes to check each affected route and each changed image. Inspect image loading, text fit, navigation, carousel mouse and keyboard controls, mobile menu, anchors, and horizontal overflow. Save review screenshots outside the checkout. Record viewport and browser version plus any failures and fixes.

## 4. Review and merge

- [ ] Commit shipped public assets. Keep temporary review-only screenshots and capture output outside the checkout.
- [ ] For a new update, open a draft site PR with What, Why, How, and Screenshots. Link the work card, exact product release and source SHA, screenshot audit, check results, and durable evidence.
- [ ] Add native GitHub image evidence. Verify that the PR renders the images and that the URLs are durable. Only then remove temporary review-only image files. Do not treat unaccepted uploads or local paths as native evidence.
- [ ] Obtain independent review on the exact pushed head. Resolve findings and rerun affected checks. The operator merges the approved PR. A prepared draft PR is not permission to merge or deploy.

For a continuation of an existing ready PR, preserve its ready state and approved history. Update its scope and evidence, then obtain fresh independent review on the new exact head.

## 5. Deploy and verify production

- [ ] After operator merge and deployment approval, use the supported Cloudflare Pages deployment path in the README. Build with `pnpm build` and publish `dist`. Do not change platform configuration or introduce a new hosting tool as part of a copy update. Load the Cloudflare and Wrangler skills before related commands.
- [ ] Record the merged commit, deployment ID/URL, prior production deployment, and operator approval. A preview or merged commit is not proof of production deployment.
- [ ] Verify production HTTP success at [Tycho](https://usetycho.com/) and every affected route. Verify the displayed release, exact badge destination, Changelog, install path, new assets, image dimensions and hashes, and important internal and external links. Check desktop and mobile rendering from production. Account for cache propagation and check again if the served version is stale.
- [ ] Save durable evidence with full URLs: PR/head, independent review, commands and results, screenshot decisions, accepted native images, deployment, production HTTP/version/assets/links, and any limits. Report deployment status explicitly.

## Rollback

Before merge, close or revise the draft PR. After merge but before deploy, stop publication and prepare a reviewed revert if needed. After deployment, use the existing Pages rollback path to the recorded prior good deployment with operator approval. Recheck production HTTP, version, assets, and links, then follow with a reviewed source revert so the next deploy cannot restore the bad build. Do not move a published product tag. Record the rollback deployment and reason with the release evidence.
