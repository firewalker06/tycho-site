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
- Primary promise: "Supervise coding agents across projects."
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

## Local CI

- Run `scripts/ci.sh` with Node 22.20.0 and Corepack. It runs the frozen install,
  full build, and generated link checks. See [local CI instructions](https://github.com/firewalker06/tycho-site/blob/main/docs/LOCAL_CI.md).
- Keep gh-signoff pinned to v0.4.1. Test the exact pushed PR head after the final
  push. Post `signoff/site-ci` success only after the full gate passes; post
  `gh signoff fail --commit <tested-sha> site-ci` if it fails. Repeat after every commit.
- Verify the live required status and head SHA. Never use bare signoff, `-f`,
  merge, or admin bypass as a gate test. Preserve deployment automation.
