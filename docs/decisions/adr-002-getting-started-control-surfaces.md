# ADR 002: Getting Started Across Control Surfaces

## Status

Accepted.

## Context

The original Getting Started path assumed that operators would register projects and create agent sessions through the CLI. Tycho also has two interactive control surfaces: the TUI and Remote UI.

An empty Tycho installation can offer a Welcome Sandbox at `~/.tycho/workspaces/welcome`. This gives operators a safe project for their first agent session without requiring a real repository.

Remote UI can create the Welcome Sandbox and agent sessions for registered projects. It cannot browse the server filesystem or directly register an arbitrary local project. An agent running from the Welcome Sandbox can register a known path through Tycho's CLI.

## Decision

- Start Getting Started with the Welcome Sandbox instead of requiring a real project.
- Require the operator to choose **Create Welcome Sandbox**; do not describe the workspace as automatic.
- Present Terminal and Remote UI as peer first-run paths.
- Let the Terminal path combine the TUI's interactive onboarding with CLI equivalents for agent operations.
- Run the same small, verifiable `notes.md` task through both paths.
- Show a current Remote UI New agent screenshot for the Welcome Sandbox task.
- Teach real-project registration after the first supervised session.
- Present three real-project methods together: TUI folder selection, a direct CLI command, and agent-assisted registration from Remote UI.
- Describe agent-assisted registration as an indirect workflow. The agent receives an exact path and runs the CLI; the browser never browses the filesystem.
- Use localhost for the primary Remote UI path.
- Keep tailnet access optional and require `TYCHO_REMOTE_TOKEN` guidance for non-loopback access.

## Consequences

New operators can experience Tycho's supervision loop before configuring a repository. Terminal and Remote UI receive equal treatment without claiming they have identical filesystem capabilities.

Project registration remains explicit and local-first. TUI users can select a directory, CLI users can provide a path, and Remote UI users can delegate the same CLI operation to an agent when they already know the path.

The documentation must track the first-run UI labels and refresh the New agent screenshot when that form changes materially.
