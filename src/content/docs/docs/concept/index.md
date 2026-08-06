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

## Harness

A harness is the command adapter Tycho uses to run a coding agent.

Tycho includes harnesses for Codex, Claude, and OpenCode. Different projects can use different harnesses, and each agent session can override its project's default. The Tycho workflow stays the same: create a session, monitor it, read logs, answer questions, and continue the loop. Authentication, permissions, models, and other CLI behavior remain specific to the selected harness.

See [Harnesses](/docs/configuration/harnesses/) for setup, selection, and custom Claude-compatible wrappers.

## Remote Server

A remote server is one Tycho installation that owns its registered projects, agent sessions, logs, and actions.

Remote UI can combine resources from Local and configured peers into one operator view. Each project and agent session keeps its server owner, so reads and mutations return to the Tycho server that owns the resource. A temporary peer failure can leave a stale last-good snapshot visible without moving ownership or copying the underlying agent state.

<div class="multiserver-screenshots">
  <figure>
    <a href="/assets/web-agents-multiserver.png">
      <img src="/assets/web-agents-multiserver.png" alt="Tycho v0.9.0 Remote UI listing agents from Host, VPS, and AtasGG with running, blocked, unread, failed, succeeded, answer-required, and idle states" />
    </a>
    <figcaption>Agent sessions from three servers in one list, with ownership and attention state kept visible.</figcaption>
  </figure>
  <figure>
    <a href="/assets/web-projects-multiserver.png">
      <img src="/assets/web-projects-multiserver.png" alt="Tycho v0.9.0 Remote UI grouping agents by projects owned by Host, VPS, and AtasGG servers" />
    </a>
    <figcaption>Project-grouped supervision across Host, VPS, and AtasGG.</figcaption>
  </figure>
</div>

## Operator Loop

Tycho's core loop is:

1. Start an agent session.
2. Watch status and attention state.
3. Inspect logs or conversation output.
4. Answer questions or send a follow-up.
5. Resume, re-run, schedule, or archive the session.

This is why the product pillars are Supervise, Switch, and Loop.

## Local-First

Tycho coordinates local tools, local repos, local logs, and local agent history. Remote UI is still local-first: it exposes your Tycho server over localhost, local network, or tailnet instead of moving the control plane into hosted SaaS.
