---
title: "ADR 001: Website Direction"
description: Landing page and docs decisions from the initial Tycho grilling session.
---

## Status

Accepted.

## Context

Tycho needs a public landing page and documentation for developers who already use coding agents across multiple repos. The site should explain why Tycho exists, help users install it, and lead them to their first supervised agent session.

## Decision

- Build a separate public repo: `firewalker06/tycho-site`.
- Use Astro + Starlight.
- Deploy with Cloudflare Pages.
- Use `https://usetycho.com` as the canonical site.
- Lead the homepage with: "Supervise many AI coding sessions across projects."
- Use "agent sessions" in public copy.
- Use "Supervise, Switch, Loop" as the homepage feature pillars.
- Treat local-first as a primary proof point under the hero, not the headline.
- Use a new composed TUI + Remote UI screenshot as the hero visual.
- Structure docs as Getting Started, Concept, Configuration, and Reference.

## Consequences

The website can evolve independently from the Tycho product repo while still copying screenshots and product facts from it. Cloudflare Pages keeps deployment aligned with the domain registrar and DNS provider. Starlight keeps the docs maintainable without building a custom documentation system.
