---
title: Install and Run
description: Install Tycho, register a project, and supervise your first agent session.
---

This path gets you from zero to one supervised agent session.

## Requirements

- macOS with Homebrew for the packaged install.
- Ruby 3.2 or newer for source installs.
- At least one coding-agent CLI you want Tycho to supervise, such as Codex, Claude, OpenCode, or a custom Claude-compatible harness.

## Install with Homebrew

```bash
brew tap firewalker06/tycho
brew install tycho
tycho
```

## Register a Project

Tycho reads project definitions from `~/.tycho/config/hq.yml`. You can create one from the CLI:

```bash
tycho project my-workspace \
  --path ~/Code/my-workspace \
  --name "My Workspace" \
  --group Personal \
  --harness codex
```

## Start an Agent Session

Create and run an agent session against that project:

```bash
tycho agent create my-workspace "Review the failing tests and suggest a fix" --run
```

Tycho records the session, its harness, status, logs, and conversation history. Open the TUI with `tycho`, or check the session from the CLI:

```bash
tycho agent list my-workspace
tycho agent status my-workspace-agent-1
tycho agent logs my-workspace-agent-1 --type conversation
```

## Continue the Loop

When the agent needs direction, send a follow-up:

```bash
tycho agent send my-workspace-agent-1 "Use the smaller change and add a regression test."
```

The goal of the first run is not just to launch an agent. The goal is to see Tycho's loop: create work, watch it, respond when useful, and keep the session record durable.
