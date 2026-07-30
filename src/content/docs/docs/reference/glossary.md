---
title: Glossary
description: Shared terms for the Tycho website and documentation.
---

## Agent Session

The public term for one durable unit of supervised agent work. It includes the prompt, harness, status, logs, conversation, attachments, and run history.

## Managed Agent

The internal Tycho object behind an agent session. Use this term in technical reference when matching the codebase or CLI output.

## Harness

The adapter Tycho uses to run a coding agent, such as Codex, Claude, OpenCode, or a custom Claude-compatible wrapper.

## Operator Loop

The repeated workflow of starting work, watching status, reading output, answering questions, sending follow-ups, re-running, scheduling, and archiving.

## Remote UI

Tycho's browser UI for checking and controlling agent sessions from localhost, local network, or tailnet.

## Local-First

Tycho keeps project config, runtime state, logs, prompts, and agent history under local user-controlled paths by default.
