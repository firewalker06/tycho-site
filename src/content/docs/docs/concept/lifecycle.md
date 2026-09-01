---
title: Agent Session Lifecycle
description: Understand durable sessions, runs, attention states, follow-ups, stopping, cloning, and archives.
---

An agent session is the durable container Tycho supervises. A run is one harness process inside that session. Follow-ups normally reuse the harness's native session ID, while Tycho keeps its own conversation and run history under `~/.tycho`.

## Create and Inspect

Create a session without starting it, or add `--run` to start immediately:

```bash
tycho agent create my-project "Inspect the failing test"
tycho agent create my-project "Inspect the failing test" --run
```

Use the returned key for later commands:

```bash
tycho agent status <agent-key>
tycho agent logs <agent-key> --type conversation
tycho agent logs <agent-key> --follow
```

`status --json` is the stable automation surface. `logs` is local-only and can show `raw`, `conversation`, or `system` output.

## Run and Follow Up

Start or re-run an idle session with:

```bash
tycho agent run <agent-key>
```

Send a new user message and start the next run with:

```bash
tycho agent send <agent-key> "Try the smaller reproduction"
```

In Remote UI, the conversation updates while the harness runs. Follow-ups submitted during a run enter a durable ordered queue and start continuation runs after the current run stops. An unresolved structured inquiry blocks that queue until the inquiry is answered, dismissed, or replaced by an allowed parent action.

## Status and Attention

Tycho separates process state from the structured result returned by the harness.

| Operator state | Meaning | Typical next action |
| --- | --- | --- |
| Running | A harness process is active. | Watch the live conversation or queue a follow-up. |
| Needs input | The result is `input_required` with a structured inquiry. | Answer it in the TUI or Remote UI. |
| Succeeded | The result is `success` or `no_action_needed`. | Review the summary or send a follow-up. |
| Partial | Useful work completed, but required work remains. | Send the missing direction or start another run. |
| Failed | The run or structured-result correction failed. | Inspect the summary and logs, then retry. |
| Blocked | Progress requires an external change. | Resolve the dependency, then send or run again. |
| Stopped | An operator or scheduler stopped the process. | Inspect partial output before restarting. |

`no_action_needed` is a quiet success for an observational or recurring check that found no new condition. It does not mark the session unread or send a push notification. Completed changes, answers, commits, reviews, and deliverables use `success` even when nothing remains afterward.

Remote UI can dismiss an inquiry without rewriting conversation history, then restore it later. Dismissal removes the immediate attention state; it does not answer the question.

## Stop, Clone, and Archive

Stop a running harness without deleting its session:

```bash
tycho agent stop <agent-key>
```

Clone a local session when new work should start from a copied durable context instead of continuing the same identity:

```bash
tycho agent clone <agent-key>
tycho agent clone <agent-key> --run
```

Archive finished work to move it out of active lists and polling:

```bash
tycho agent archive <agent-key>
tycho agent list --archived
tycho agent list --include-archived
```

Archives retain the transcript, artifacts, run metadata, and delegation references. Typed delegation links and direct archived-agent routes remain readable, but archived sessions do not resume automatically.

## Remote Lifecycle

`create`, `list`, `status`, `run`, `send`, `stop`, and `archive` accept `--server <key>` for a configured peer. `logs` and `clone` remain local-only. Every mutation runs on the server that owns the project and session; Remote UI combining several servers does not merge their state.

See [Delegating Work Between Agents](/docs/concept/delegation/) for child ownership and callbacks, [Schedules](/docs/configuration/schedules/) for recurring runs, and the [CLI Reference](/docs/reference/) for command forms.
