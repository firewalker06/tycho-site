---
title: Mental Model
description: The core nouns behind Tycho's operator workflow.
---

Tycho is a local-first operator console for agent sessions. It does not replace Codex, Claude, OpenCode, or custom harnesses; it gives them one supervision workflow.

## Project

A project is a registered workspace with a key, name, path, group, and default harness. Tycho runs agent sessions from the project path.

## Agent Session

An agent session is one durable unit of supervised work. It keeps the starting prompt, harness, status, runs, conversation, logs, attachments, and follow-ups. Tycho's code and CLI often call this a managed agent.

An agent session can create bounded child work and receive a durable report when that work reaches a terminal state. See [Agent Session Lifecycle](/docs/concept/lifecycle/) for run and attention states, and [Delegating Work Between Agents](/docs/concept/delegation/) for explicit parent ownership, callbacks, privacy, archives, and the same-server boundary.

## Harness

A harness is the adapter Tycho uses to run a coding-agent CLI. Codex, Claude, OpenCode, and Pi are built in; custom harnesses are Claude-compatible wrappers. Tycho standardizes the operator loop, while authentication, permissions, models, and runtime behavior remain harness-specific. See [Harnesses](/docs/configuration/harnesses/).

## Remote Server

A remote server is one Tycho installation that owns its projects, agent sessions, logs, credentials, and actions. Remote UI can combine Local and configured peers in one view, but every read or mutation routes back to the resource owner. The CLI targets a configured peer with `--server`.

## Operator Loop

Start work, watch status and attention, inspect output, respond, then resume, re-run, schedule, delegate, or archive. Tycho keeps this loop local by default: project configuration, runtime state, logs, prompts, and history stay under user-controlled paths.
