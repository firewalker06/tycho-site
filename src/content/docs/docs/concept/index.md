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

Different projects can use different harnesses. The public workflow stays the same: create a session, monitor it, read logs, answer questions, and continue the loop.

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
