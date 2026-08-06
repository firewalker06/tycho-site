---
title: Projects and Agents
description: Configure Tycho projects, harnesses, response style, and runtime paths.
---

Tycho configuration lives under `~/.tycho` by default.

| Purpose | Default |
| --- | --- |
| Project registry | `~/.tycho/config/hq.yml` |
| System prompts | `~/.tycho/config/system_prompts.yml` |
| Response style policy | `~/.tycho/config/response_style.md` |
| Schedules | `~/.tycho/config/schedules.yml` |
| Runtime state and logs | `~/.tycho/logs/` |

## Project Registry

Minimal project config:

```yaml
projects:
  - key: my-workspace
    name: My Workspace
    group: Personal
    path: /Users/you/Code/my-workspace
    agent: codex
```

The `agent` field is the default harness. You can override it per session:

```bash
tycho agent create my-workspace "Try the alternate implementation" --harness claude --run
```

Tycho includes Codex, Claude, and OpenCode harnesses. See [Harnesses](/docs/configuration/harnesses/) for prerequisites, executable overrides, and custom Claude-compatible wrappers.

## Response Style

Tycho appends `~/.tycho/config/response_style.md` to cold and resumed agent prompts by default.

Set a project-level `response_style` to replace it, or set `response_style: false` to disable it for that project.

## Runtime Overrides

Use `TYCHO_` environment variables when you need a temporary profile or test run:

| Variable | Purpose |
| --- | --- |
| `TYCHO_HOME` | Override the default `~/.tycho` root. |
| `TYCHO_CONFIG_PATH` | Override the project registry path. |
| `TYCHO_LOGS_ROOT` | Override runtime state and logs. |
| `TYCHO_CODEX_BIN` | Override Codex executable lookup. |
| `TYCHO_CLAUDE_BIN` | Override Claude executable lookup. |
| `TYCHO_OPENCODE_BIN` | Override OpenCode executable lookup. |

Keep secrets, real config files, and generated agent artifacts out of committed repos.
