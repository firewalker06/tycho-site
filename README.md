# Tycho Site

Landing page and documentation for [Tycho](https://github.com/firewalker06/tycho).

## Stack

- Astro + Starlight
- pnpm
- Static output for Cloudflare Pages

## Development

```bash
corepack pnpm install
corepack pnpm dev
```

## Build

```bash
corepack pnpm build
```

## Cloudflare Pages

Use these settings:

- Framework preset: Astro
- Build command: `pnpm build`
- Build output directory: `dist`
- Production branch: `main`
- Custom domain: `usetycho.com`

Cloudflare owns DNS for `usetycho.com`, so Pages should manage the production custom-domain binding.

## Content Direction

Primary promise: "Supervise many AI coding sessions across projects."

Feature pillars: Supervise, Switch, Loop.

Docs nav: Getting Started, Concept, Configuration, Reference.
