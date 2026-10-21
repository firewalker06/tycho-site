# Tycho Site

Landing page and documentation for [Tycho](https://github.com/firewalker06/tycho).

## Stack

- Astro + Starlight
- pnpm
- Static output for Cloudflare Pages

## Development

Use Node 22.20.0 from `.mise.toml` and the pnpm version pinned in `package.json`.

```bash
corepack pnpm install
corepack pnpm dev
```

## Local CI

```bash
scripts/ci.sh
```

This runs the frozen install, full build, and generated link checks. Follow the
[local CI signoff instructions](https://github.com/firewalker06/tycho-site/blob/main/docs/LOCAL_CI.md)
for exact-head verification and the required `signoff/site-ci` status.

## Release updates

Follow the [site release checklist](https://github.com/firewalker06/tycho-site/blob/main/docs/RELEASING.md) for each published Tycho release. Keep the product release, documentation, and screenshot audit in one reviewed site PR.

## Cloudflare Pages

The Cloudflare Pages project is `tycho-site`.

Production URL: `https://usetycho.com`

Manual deploy:

```bash
cp .env.deploy.example .env.deploy
# Add CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN to .env.deploy.
corepack pnpm deploy
```

The token needs `Cloudflare Pages: Edit` access for the account that owns
`tycho-site`. `.env.deploy` is gitignored. You can also pass another environment
file to `scripts/deploy-pages.sh`.

If switching to Cloudflare's Git integration later, use these settings:

- Framework preset: Astro
- Build command: `pnpm build`
- Build output directory: `dist`
- Production branch: `main`

Cloudflare owns DNS for `usetycho.com`, and Pages manages the production custom-domain binding.

## Content Direction

Primary promise: "Supervise coding agents across projects."

Feature pillars: Supervise, Switch, Loop.

Docs nav: Getting Started, Concept, Configuration, Reference.
