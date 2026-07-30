# Repository Guidelines

This is the public landing page and documentation site for Tycho.

## Stack

- Astro + Starlight.
- pnpm through Corepack.
- Static deployment through Cloudflare Pages.

## Commands

- `corepack pnpm install`
- `corepack pnpm dev`
- `corepack pnpm build`
- `corepack pnpm preview`

## Content Direction

- Primary audience: solo developers and technical leads managing many coding-agent sessions.
- Primary promise: "Supervise many AI coding sessions across projects."
- Supporting sentence: "Tycho helps you see which agent sessions deserve your attention."
- Feature pillars: Supervise, Switch, Loop.
- Use "agent sessions" in public copy; define "managed agent" in reference material.
- Treat local-first as a primary proof point under the hero.

## Documentation

- Top-level docs nav: Getting Started, Concept, Configuration, Reference.
- Getting Started should optimize for installing Tycho and supervising a first agent.
- Keep docs factual and tied to the current Tycho product repo.

## Deployment

Cloudflare Pages should build with `pnpm build` and publish `dist`.
