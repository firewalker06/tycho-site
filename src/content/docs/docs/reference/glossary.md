---
title: Glossary
description: Shared terms for the Tycho website and documentation.
---

## Agent Session

The public term for one durable unit of supervised agent work. It includes the prompt, harness, status, logs, conversation, attachments, and run history.

## Managed Agent

The internal Tycho object behind an agent session. Use this term in technical reference when matching the codebase or CLI output.

## Harness

The command adapter Tycho uses to run a coding agent. Codex, Claude, OpenCode, and Pi are built in. A compatible custom profile declares one of those native adapters plus its own key and execution command.

## Operator Loop

The repeated workflow of starting work, watching status, reading output, answering questions, sending follow-ups, re-running, scheduling, and archiving.

## Remote UI

Tycho's browser UI for creating, checking, and controlling agent sessions from localhost, local network, or tailnet. It can create the Welcome Sandbox on an empty installation and search, preview, and make guarded plain-text edits inside registered projects. Existing workspaces remain read-only on mobile. It cannot register an arbitrary server path.

## Remote Server

One Tycho installation that owns its registered projects, agent sessions, logs, and actions. Remote UI can combine server-qualified resources from Local and configured peers, but each operation returns to the server that owns the resource.

## Delegation

A durable parent-child relationship between agent sessions on the same Tycho server. Terminal child reports return to the parent, and both directions remain navigable after archive.

## Structured Result

The final schema-validated status, summary, inquiry, and attachment payload returned by a managed agent. Invalid results are not accepted as success; supported harnesses can retry a bounded correction in the same native session.

## Workspace Browser

The Remote UI view for bounded file search, directory listings, Markdown and image previews, and guarded plain-text editing inside a registered project. Existing workspaces remain read-only on mobile. The server rejects traversal, unsafe symlinks, VCS and generated paths, secret-shaped names or content, binary files, and oversized previews.

## Usage Metrics

Normalized records for finalized runs and native sessions, including tokens and estimated cost when the harness and pricing data provide them. Unknown values remain unknown rather than becoming zero.

## Welcome Sandbox

A safe starter project at `~/.tycho/workspaces/welcome`. On an empty installation, the TUI and Remote UI offer to create it so the operator can run an agent session before registering a real repository.

## Agent-Assisted Project Registration

A Remote UI workflow where an agent in the Welcome Sandbox receives an exact local path and runs the Tycho project CLI for the operator. The agent registers the project; the browser cannot choose an arbitrary unregistered path itself.

## Local-First

Tycho keeps project config, runtime state, logs, prompts, and agent history under local user-controlled paths by default.
