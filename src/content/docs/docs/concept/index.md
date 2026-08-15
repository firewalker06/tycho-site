---
title: Mental Model
description: The core nouns behind Tycho's operator workflow.
---

Tycho is a local-first operator console for agent sessions.

It does not replace Codex, Claude, OpenCode, or custom harnesses. It gives you one control surface around them so you can supervise work across projects without rebuilding your workflow for each agent.

## Project

A project is a registered workspace. It has a key, name, path, group, and default agent harness.

Projects normally point at local repos. Tycho uses the project path as the working directory for agent sessions.

## Agent Session

An agent session is one durable unit of supervised work.

It includes the starting prompt, harness, model override if any, status, run count, logs, conversation history, attachments, and follow-up messages. In the Tycho codebase this is often called a managed agent.

An agent session can delegate work to child sessions. Tycho records that relationship, returns each terminal child report to the parent, and keeps the links available in archived history. Delegation stays within one Tycho server.

## Harness

A harness is the command adapter Tycho uses to run a coding agent.

Tycho includes harnesses for Codex, Claude, and OpenCode. Different projects can use different harnesses, and each agent session can override its project's default. The Tycho workflow stays the same: create a session, monitor it, read logs, answer questions, and continue the loop. Authentication, permissions, models, and other CLI behavior remain specific to the selected harness.

See [Harnesses](/docs/configuration/harnesses/) for setup, selection, and custom Claude-compatible wrappers.

## Remote Server

A remote server is one Tycho installation that owns its registered projects, agent sessions, logs, and actions.

Remote UI can combine resources from Local and configured peers into one operator view. Each project and agent session keeps its server owner, so reads and mutations return to the Tycho server that owns the resource. A temporary peer failure can leave a stale last-good snapshot visible without moving ownership or copying the underlying agent state.

The CLI can target a configured peer with `--server`. Project reads and agent-session commands then use that server while commands without `--server` continue to use local state.

<div class="multiserver-screenshots">
  <figure>
    <a href="/assets/web-delegation-v0.10.0.png">
      <img src="/assets/web-delegation-v0.10.0.png" alt="Tycho v0.10.0 Remote UI showing a parent agent session with delegated children and a returned report" />
    </a>
    <figcaption>A parent session keeps child starts and terminal reports in one durable conversation.</figcaption>
  </figure>
  <figure>
    <a href="/assets/web-workspace-v0.10.0.png">
      <img src="/assets/web-workspace-v0.10.0.png" alt="Tycho v0.10.0 Remote UI showing a read-only text preview in a project workspace" />
    </a>
    <figcaption>Registered project files can be listed and previewed without changing the workspace.</figcaption>
  </figure>
</div>

## Usage Metrics

Tycho normalizes finalized run and native-session usage across supported harnesses. Metrics queries can group or filter tokens and estimated cost without treating unavailable provider telemetry or pricing as zero.

## Operator Loop

Tycho's core loop is:

1. Start an agent session.
2. Watch status and attention state.
3. Inspect logs or conversation output.
4. Answer questions or send a follow-up.
5. Resume, re-run, schedule, or archive the session.

This is why the product pillars are Supervise, Switch, and Loop.

## Local-First

Tycho coordinates local tools, local repos, local logs, and local agent history. Remote UI is still local-first: it exposes your Tycho server over localhost, local network, or tailnet instead of moving the control plane into hosted SaaS. Its workspace browser is read-only and limits listings and text previews to the registered project boundary.
