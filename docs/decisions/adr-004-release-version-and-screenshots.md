# ADR 004: Release Version and Screenshot Policy

## Status

Accepted.

## Context

The public site needs to show which Tycho release its claims and screenshots describe. The homepage previously had no version marker, no direct changelog path, and screenshots whose fixture content still referred to v0.2.0 after Tycho v0.9.0 shipped.

Fetching GitHub's latest release during every site build would make the displayed version change without a corresponding review of copy or screenshots. Recapturing every image for every release would create unnecessary churn when a release does not alter the pictured UI or invalidate its fixture story.

Tycho v0.9.0 also introduced persistent multiserver Agents and Projects in Remote UI. Public screenshots need to show that model without exposing real server URLs, project paths, prompts, or operational state.

## Decision

- Store the current public version as an explicit homepage constant.
- Link the version badge to the exact GitHub release.
- Link **Changelog** in the homepage header to the full GitHub Releases page.
- Place the version badge beside the Tycho wordmark.
- Treat a version bump as a required screenshot audit.
- Recapture an image when the UI changed materially, its fixture content names an older release, or it no longer supports the surrounding claim.
- Use the exact release tag as the capture source.
- Use synthetic fixture data for public screenshots.
- Model Host, VPS, and AtasGG as synthetic server owners with varied but balanced agent and project states.
- Keep the homepage screenshot story focused on supervision and follow-up.
- Put paired multiserver Agents and Projects screenshots on the Concept page.

## Consequences

The homepage version, release notes, and screenshots move together through an intentional documentation update. Site builds remain deterministic and do not depend on GitHub availability.

Screenshot audits are mandatory for release updates, while full recapture remains conditional. Synthetic fixtures make the multiserver model concrete without publishing live peer data or credentials.
