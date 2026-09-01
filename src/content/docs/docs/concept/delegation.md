---
title: Delegating Work Between Agents
description: Create bounded child sessions and keep their reports connected to the parent.
---

Delegation is useful when one agent session should keep ownership of a larger outcome while independent child sessions investigate or implement bounded parts. Good child prompts name one deliverable, one project, and a clear stopping condition. Use separate root sessions when the work has no reporting relationship.

Tycho records delegation explicitly. It never guesses a parent from prompts, session names, or logs, and it never joins sessions across Tycho servers.

## Parent and Child Sessions

A parent and child are ordinary durable agent sessions with one added relationship. The child stores an immutable parent reference; the parent exposes its delegated children. References include the owning server identity and agent keys, plus the parent's originating managed run, run number, and native session when available.

One child can have only one parent. Tycho accepts repeated attachment to that same parent, but rejects self-parenting, cycles, an unknown parent, re-parenting to a different session, or a mismatched server identity.

![Tycho Remote UI showing a parent session, delegated children, and a returned report](/assets/web-delegation-v0.10.0.png)

## Create Child Work

An operator or managed agent can create a child explicitly:

```bash
tycho agent create my-project \
  "Reproduce the API failure and return the smallest failing case." \
  --parent-agent parent-agent-key \
  --run
```

You can also attach an existing idle session before its next run:

```bash
tycho agent send child-agent-key \
  "Verify the fix against the failing case." \
  --parent-agent parent-agent-key

tycho agent run child-agent-key --parent-agent parent-agent-key
```

Tycho never infers a parent from the environment. A managed agent must pass its own key explicitly:

```bash
# Inside a managed Tycho session: explicitly linked to this session.
tycho agent create my-project "Check the migration path." \
  --parent-agent "${TYCHO_AGENT_KEY:?Missing TYCHO_AGENT_KEY}" \
  --run
```

Use `--root` when the new work is intentionally unrelated:

```bash
tycho agent create my-project "Independent maintenance task." --root --run
```

Omitting the parent creates an unrelated root; `--root` makes that intent explicit. `--parent-agent` and `--root` are mutually exclusive. The same rule applies locally and with `--server`:

```bash
tycho agent create my-project "Inspect the remote build." \
  --server vps \
  --parent-agent remote-parent-key \
  --run
```

Both parent and child must live on `vps` in this example. Remote UI may show several servers together, but each server has its own independent delegation graph.

## Delegation, Takeover, and Reclaim

The recorded edge has an owner. A prompt sent with the recorded `--parent-agent` key preserves parent ownership. A direct user prompt without that key enters **Takeover** before Tycho stores the prompt: pending reports and queued parent resumes are canceled, and the resulting user-owned run cannot report upward later.

A later prompt declared with the recorded parent key restores delegation for later work. It does not make a user-owned run reportable after the fact. Parent reclaim also cancels an unresolved child inquiry before storing the new prompt. Remote UI links the relationship in both directions and shows **Takeover** while the edge is user-owned.

Remote UI can disconnect the callback edge without deleting its history. Runs completed while disconnected do not report to the parent and are not replayed after reconnection; only later eligible runs report.

## Lifecycle and Attention

The child uses the normal agent-session lifecycle. It can run, wait for input, succeed, report no action, finish partially, fail, stop, or block. Each terminal child run—including `input_required`, failed, stopped, and blocked runs—produces one durable report. The parent and child remain independently inspectable, so an operator can answer or retry the child without losing the larger thread.

Use the child status for immediate attention. Use the report in the parent to decide whether the parent can continue, should wait for another child, or needs an operator decision.

## Terminal Reports and Parent Resume

A terminal report contains the child identity, run identity and number, native session ID when available, status, concise summary, inquiry, and allowed attachments. Tycho appends it to the parent as a typed user message.

If the parent is stopped and active, Tycho resumes it automatically. Resume is deliberately conservative:

- reports are queued before the parent starts, so several children can return before one parent resume;
- a running parent receives the durable report and resumes again after its current run stops;
- Tycho waits while another agent is running in the parent's workspace, avoiding concurrent worktree writes;
- an archived parent receives the report in read-only history but is never restored or resumed;
- a missing parent stays recorded in the delegation ledger.

The detached child runner finalizes the run and delivers callbacks even when Remote UI and the original parent process are not running. Server polling provides a recovery path. If writing the callback fails, the report remains queued; processing retries it rather than marking it delivered. Each relationship-and-run pair has one report, so retrying delivery does not duplicate the callback.

A failed or blocked child still reports. Fix the child with `tycho agent send` or start another run; each later terminal run returns its own report to the same parent.

## Attachments, Provenance, and Privacy

Delegation reports pass only sanitized HTTP or HTTPS link attachments. Tycho removes URL credentials, query strings, and fragments. Local file attachments and paths stay with the child session.

Reports exclude raw logs, commands, environment data, credentials, tool inputs, and tool output. Tycho also redacts secret-shaped text from the summary. The typed relationship metadata—not arbitrary text in a prompt or message—drives Remote UI links, which prevents untrusted prose from becoming a session reference.

## Archives and History

Archiving either session preserves the relationship ledger and callback history. Direct links and typed parent/child references still open archived detail and conversation views on the owning server, regardless of archive order.

The CLI can discover archived sessions with:

```bash
tycho agent list --archived
tycho agent list --include-archived
```

Remote UI does not add the unbounded archive to the normal Agents browser or active polling. Navigate through a typed delegation link or a direct archived-agent route instead.

## Operator Patterns

- Delegate independent research branches, then let the parent compare terminal reports.
- Give implementation and verification to separate children when they can work in separate workspaces or at different times.
- Keep shared-worktree changes sequential. Tycho delays the parent's automatic resume, but a precise prompt and project boundary still matter.
- Use `--root` for maintenance that should not wake or influence the current session.
- Treat `input_required` and failure reports as useful outcomes. Answer or retry the child, then let its next report return to the same parent.
- Check `tycho agent status <key> --json` when automation needs stable `delegation.parent` and `delegation.children` data.

See the [CLI Reference](/docs/reference/#agent-sessions) for the full command surface and [Projects and Agents](/docs/configuration/) for server ownership and local state paths.
