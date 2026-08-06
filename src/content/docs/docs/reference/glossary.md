---
title: Glossary
description: Shared terms for the Tycho website and documentation.
---

## Agent Session

The public term for one durable unit of supervised agent work. It includes the prompt, harness, status, logs, conversation, attachments, and run history.

## Managed Agent

The internal Tycho object behind an agent session. Use this term in technical reference when matching the codebase or CLI output.

## Harness

The command adapter Tycho uses to run a coding agent. Codex, Claude, and OpenCode are built in. A custom harness is currently a Claude-compatible wrapper configured with its own key and execution command.

## Operator Loop

The repeated workflow of starting work, watching status, reading output, answering questions, sending follow-ups, re-running, scheduling, and archiving.

## Remote UI

Tycho's browser UI for creating, checking, and controlling agent sessions from localhost, local network, or tailnet. It can create the Welcome Sandbox on an empty installation, but it does not browse the server filesystem or directly register arbitrary local projects.

## Remote Server

One Tycho installation that owns its registered projects, agent sessions, logs, and actions. Remote UI can combine server-qualified resources from Local and configured peers, but each operation returns to the server that owns the resource.

## Welcome Sandbox

A safe starter project at `~/.tycho/workspaces/welcome`. On an empty installation, the TUI and Remote UI offer to create it so the operator can run an agent session before registering a real repository.

## Agent-Assisted Project Registration

A Remote UI workflow where an agent in the Welcome Sandbox receives an exact local path and runs the Tycho project CLI for the operator. The agent registers the project; the browser does not access the filesystem directly.

## Local-First

Tycho keeps project config, runtime state, logs, prompts, and agent history under local user-controlled paths by default.
