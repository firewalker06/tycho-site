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

Inside a managed Tycho session, a new agent inherits the current parent automatically. Use `--root` only when the new session should be unrelated.

## Schedules

```bash
tycho schedule list
tycho schedule validate
tycho schedule run weekly-review
tycho schedule pause weekly-review
tycho schedule resume weekly-review
tycho schedule reload
```

## Remote UI

```bash
tycho serve
```

When Tailscale is available, Tycho can expose a MagicDNS URL and terminal QR code for checking agent state from another device on your tailnet.

## Remote Servers

After adding a server under `remote_servers` in `~/.tycho/config/hq.yml`, store and verify its credential without placing the token on the command line:

```bash
tycho server login vps
tycho server status vps
tycho server verify vps
tycho server logout vps
```

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

## Usage Metrics

```bash
tycho metrics backfill --timezone Asia/Jakarta --json
tycho metrics query \
  --from 2026-08-01 \
  --to 2026-08-16 \
  --timezone Asia/Jakarta
tycho metrics query --server vps --from 2026-08-01 --to 2026-08-16 --timezone UTC --json
```

The range starts at `--from` and ends before `--to`. Unknown telemetry and prices remain unknown.
