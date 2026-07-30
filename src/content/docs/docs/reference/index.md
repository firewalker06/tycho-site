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
