---
title: CLI Reference
description: Common Tycho commands for projects, agent sessions, and schedules.
---

## Projects

```bash
tycho project my-project
tycho project create my-project --path ~/Code/my-project --name "My Project"
tycho project show my-project
tycho project update my-project --group Personal --harness codex
tycho project archive my-project
```

## Agent Sessions

```bash
tycho agent create my-project "Refactor the auth module" --run
tycho agent list
tycho agent list my-project
tycho agent status my-project-agent-3
tycho agent logs my-project-agent-3 --type conversation
tycho agent send my-project-agent-3 "The tests still fail. Try a smaller change."
tycho agent stop my-project-agent-3
tycho agent archive my-project-agent-3
tycho agent clone my-project-agent-3 --run
```

Create an explicit child session:

```bash
tycho agent create my-project "Check the API boundary" \
  --parent-agent my-project-agent-3 \
  --run
```

Tycho never infers a parent from `TYCHO_AGENT_KEY`. A managed agent must pass `--parent-agent "$TYCHO_AGENT_KEY"` explicitly. Omitting it creates an unrelated root; `--root` makes that intent explicit.

The same relationship can be attached to an idle existing session before its next run:

```bash
tycho agent send child-agent-key "Continue the delegated check" \
  --parent-agent parent-agent-key
tycho agent run child-agent-key --parent-agent parent-agent-key
```

`--parent-agent` and `--root` are mutually exclusive. A managed session that creates work with `--server` must choose one explicitly. Both parent and child must exist on that target server. See [Delegating Work Between Agents](/docs/concept/delegation/).

Inspect archived sessions without mixing them into active polling:

```bash
tycho agent list --archived
tycho agent list --include-archived
```

## Schedules

```bash
tycho schedule list
tycho schedule validate
tycho schedule run weekly-review
tycho schedule pause weekly-review
tycho schedule resume weekly-review
tycho schedule reload
tycho schedule daemon
tycho schedule daemon --once
tycho schedule daemon --dry-run
```

The dedicated daemon owns the clock; the TUI and Remote UI only manage it. See [Schedules](/docs/configuration/schedules/).

## Remote UI

```bash
tycho serve
tycho serve daemon
```

When Tailscale is available, Tycho can expose a MagicDNS URL and terminal QR code for checking agent state from another device on your tailnet.

See [Remote UI](/docs/getting-started/remote-ui/) for localhost, bearer-token, tailnet, multiserver, and browser workspace boundaries.

## Second Brain Memory Handoffs

```bash
tycho memory handoffs
tycho memory handoffs --server vps --json
```

Successful runs may return a semantic `memory_handoff`. Tycho stores it with run-owned provenance and exposes it locally or from one configured peer. This command does not search raw conversations or failed runs.

## Remote Servers

After adding a server under `remote_servers` in `~/.tycho/config/hq.yml`, store and verify its credential without placing the token on the command line:

```bash
tycho server login vps
tycho server status vps
tycho server verify vps
tycho server logout vps
tycho server migrate vps
tycho server migrate --all
```

`login` verifies before saving unless `--no-verify` is set. `status` reports metadata and never prints the token. `migrate` moves legacy inline `hq.yml` tokens into the private credential store.

Target that server with the same project and agent commands:

```bash
tycho project list --server vps
tycho project show my-project --server vps --json
tycho agent list my-project --server vps
tycho agent status my-project-agent-3 --server vps --json
tycho agent create my-project "Inspect the failing build" --server vps
tycho agent run my-project-agent-3 --server vps
tycho agent send my-project-agent-3 "Try the smaller reproduction" --server vps
tycho agent stop my-project-agent-3 --server vps
tycho agent archive my-project-agent-3 --server vps
```

Project `list` and `show`, the remote agent lifecycle above, and metrics support `--json`. Local-only `agent logs` and `agent clone` do not accept `--server`.

## Usage Metrics

```bash
tycho metrics backfill --timezone Asia/Jakarta --json
tycho metrics query \
  --from 2026-08-01 \
  --to 2026-08-16 \
  --timezone Asia/Jakarta
tycho metrics query --server vps --from 2026-08-01 --to 2026-08-16 --timezone UTC --json
```

The range starts at `--from` and ends before `--to`. Offset-free boundaries use the named IANA timezone; values with `Z` or an explicit offset are absolute. Query filters accept comma-separated `--group`, `--project`, `--agent`, `--harness`, `--model`, and `--status` values.

Tycho normalizes finalized managed runs and native sessions across harnesses. Missing telemetry, session baselines, models, or prices remain unknown rather than becoming zero; costs are estimates, not invoices. Agent and project archives mark matching records as archived without moving them out of the global query path.

Backfill is best-effort and idempotent. Use `--durable-only` to read active and archived manifests without inspecting legacy raw telemetry:

```bash
tycho metrics backfill --durable-only --json
```

When legacy run headers have no offset, pass `--timezone`. Repeating a completed backfill leaves the same stable records unchanged.
