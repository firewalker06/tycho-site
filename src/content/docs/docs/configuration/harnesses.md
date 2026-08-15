---
title: Harnesses
description: Run Codex, Claude, OpenCode, or a custom Claude-compatible wrapper through Tycho.
---

A harness is the command adapter Tycho uses to run a coding-agent CLI.

Tycho includes harnesses for Codex, Claude, and OpenCode. Each one uses the same Tycho operator workflow: launch an agent session, monitor its state, read its output, send follow-ups, and resume its native session. The underlying CLI still owns authentication, permissions, models, and provider-specific behavior.

## Built-in Harnesses

| Harness | Executable | Override |
| --- | --- | --- |
| Codex | `codex` | `TYCHO_CODEX_BIN` |
| Claude | `claude` | `TYCHO_CLAUDE_BIN` |
| OpenCode | `opencode` | `TYCHO_OPENCODE_BIN` |

Install and authenticate the CLI you plan to use before starting its first agent session. A missing harness executable does not stop Tycho itself, but a session that uses it cannot run.

Tycho parses each built-in harness's native output, records conversation and run history, preserves its native session ID, and maps configured model and reasoning-effort values to that CLI's arguments. This creates a consistent supervision workflow, not identical behavior across the three CLIs.

## Install the Tycho Skill

Remote UI **Settings → Skills** manages Tycho's bundled agent skill for the supported harnesses:

| Harness | Personal install path | Invocation |
| --- | --- | --- |
| Codex | `~/.agents/skills/tycho/SKILL.md` | `$tycho` |
| Claude Code | `~/.claude/skills/tycho/SKILL.md` | `/tycho` |
| OpenCode | `~/.config/opencode/skills/tycho/SKILL.md` | `$tycho` |

**Install** and **Update** require confirmation. Tycho adds an ownership marker and checksums its managed files. It updates only an unmodified Tycho-owned installation; an unmarked directory, local edits, an invalid marker, or a symlink produces **Blocked** instead of an overwrite. Updates stage and atomically replace managed files while preserving extra files in the owned directory.

After installation, verify the row reads **Installed** and invoke the skill from the harness. Restart the harness if it does not discover a new top-level skill. `TYCHO_SKILLS_HOME` changes the home prefix for isolated profiles; normal installs should leave it unset.

## Choose a Project Default

Set `agent` on a project in `~/.tycho/config/hq.yml`:

```yaml
projects:
  - key: my-workspace
    name: My Workspace
    group: Personal
    path: /Users/you/Code/my-workspace
    agent: codex
```

The TUI and Remote UI expose the same choice when you create or edit a project.

## Override One Agent Session

Choose another harness when you create a session without changing the project default:

```bash
tycho agent create my-workspace \
  "Review the failing tests and suggest a fix" \
  --harness opencode \
  --run
```

The selected harness becomes part of that durable agent session. Follow-ups and resumed runs continue through the same harness.

## Override Executable Lookup

Tycho normally resolves each built-in executable from `PATH`. Set its environment override when the binary lives elsewhere:

```bash
export TYCHO_CODEX_BIN=/opt/homebrew/bin/codex
export TYCHO_CLAUDE_BIN=/Users/you/.local/bin/claude
export TYCHO_OPENCODE_BIN=/Users/you/.local/bin/opencode
```

Only set the override for the harnesses you use. The value must point to an executable file.

## Add a Custom Claude-Compatible Wrapper

Custom harnesses support wrappers that accept Claude's non-interactive CLI contract. Define a unique key and execution command:

```yaml
custom_harnesses:
  - key: claude-wrapper
    adapter: claude
    execution_command: /Users/you/bin/claude-wrapper

projects:
  - key: my-workspace
    name: My Workspace
    group: Personal
    path: /Users/you/Code/my-workspace
    agent: claude-wrapper
```

`execution_command` may be a shell string or an argument list:

```yaml
custom_harnesses:
  - key: bedrock-claude
    adapter: claude
    execution_command:
      - env
      - CLAUDE_CODE_USE_BEDROCK=1
      - /Users/you/bin/claude
```

Tycho currently accepts only `adapter: claude` for custom harnesses. The command must accept the Claude flags Tycho adds for streaming JSON, structured results, model and effort selection, and native session resume. Tycho validates the configuration and executable, but the wrapper remains responsible for its provider credentials and runtime dependencies.

A custom key cannot be `codex`, `claude`, or `opencode`, because those names belong to the built-in harnesses.

## Structured Result Validation

Tycho validates a managed agent's final result against `~/.tycho/config/schemas/agent_result.json` before accepting success. If Codex or a Claude-compatible harness returns malformed JSON or violates the schema, Tycho sends safe error details to the same native session and asks for one complete replacement payload. Error feedback contains codes, schema paths, expected types, and allowed enum values, not rejected field values.

The default is two correction attempts after the initial response. Set `TYCHO_STRUCTURED_OUTPUT_CORRECTION_LIMIT=0` to keep validation but disable correction, or choose up to `5`. If correction is exhausted, the run fails with an actionable summary. Tycho keeps the final invalid response in an owner-readable `*.invalid_structured_output.json` diagnostic file and does not expose it as a successful result.

OpenCode cold prompts use the same canonical result schema, but bounded same-session correction applies only to Codex and Claude-compatible adapters. The Remote UI shows each validation attempt as a collapsed Tycho system event without copying rejected values into the conversation.

## Keep Harness Behavior Explicit

Tycho standardizes supervision, not the coding agents themselves. When switching harnesses, expect differences in:

- authentication and provider access;
- model names and reasoning-effort values;
- permission and sandbox behavior;
- skill discovery and native configuration;
- error messages and CLI release behavior.

Configure and test each CLI directly when a difference comes from the harness rather than Tycho.
