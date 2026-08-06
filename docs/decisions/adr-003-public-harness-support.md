# ADR 003: Public Harness Support

## Status

Accepted.

## Context

Tycho supports multiple coding-agent CLIs, but the public site did not give that support a clear, discoverable contract. The homepage named the supported harnesses inside the Switch pillar, while Concept, Configuration, and Glossary each carried only part of the explanation.

Readers need to know which harnesses Tycho supports, how to select one, and where Tycho's responsibility ends. The documentation must not imply that different CLIs have identical authentication, permissions, models, or runtime behavior.

Custom harness support also has a narrower boundary than a general plugin system. Tycho currently accepts custom Claude-compatible wrappers through the `claude` adapter.

## Decision

- Add a compact homepage compatibility line near the hero.
- State that Codex, Claude, and OpenCode are built-in harnesses.
- Add a dedicated **Configuration → Harnesses** guide.
- Lead the guide with built-in support and present custom wrappers as an advanced extension.
- Define the shared promise as one Tycho operator workflow across supported harnesses: launch, monitor, follow up, resume, and retain history.
- State that authentication, permissions, models, and CLI behavior remain harness-specific.
- Document project defaults, per-session overrides, executable overrides, and custom wrapper configuration.
- Describe custom harnesses as Claude-compatible wrappers, not a general adapter API.
- Link the guide from the homepage, Concept, and Projects and Agents pages.

## Consequences

Harness support becomes visible before a reader enters the documentation and actionable once they do. The public claim matches the current Tycho harness registry and command builders.

Future built-in harnesses require updates to the homepage compatibility line, Harnesses guide, glossary, and this support contract. A future general adapter API would require a new decision rather than silently broadening the meaning of custom harness.
