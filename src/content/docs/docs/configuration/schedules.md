---
title: Schedules
description: Run recurring work in one durable agent session with explicit daemon and failure policies.
---

Tycho schedules recurring prompts against one persistent agent session. The first due run creates the schedule-owned session; later runs add a user message and resume the same native Codex, Claude, OpenCode, or Pi session when available.

The dedicated `tycho schedule daemon` owns the clock. The TUI and Remote UI manage schedules and the daemon, but neither interactive surface performs scheduler ticks itself.

## Define a Schedule

Definitions live in `~/.tycho/config/schedules.yml`. A schedule targets one registered project and uses standard five-field cron syntax:

```yaml
schedules:
  - key: weekday-maintenance
    name: Weekday maintenance
    enabled: true
    cron: "0 9 * * 1-5"
    timezone: local
    target:
      type: agent
      project_key: tycho
      name: Tycho scheduled maintenance
      system_message: |
        You are the long-lived maintenance agent for Tycho.
        Keep context across runs and ask for human input when needed.
      message: |
        Run the weekday maintenance check and report the outcome.
```

`timezone` defaults to the local machine. `system_message` seeds the session once; `message` is sent on every run. Legacy `message_file` definitions still load, but saving one in Remote UI converts the run message to inline text.

Tycho schedules agent work only. Shell targets, template selection, arbitrary existing-agent targets, and clone targets are not supported. A Remote UI **Loop session** action can adopt one eligible idle session as a temporary schedule with an end time.

## Validate and Run the Daemon

Validate all definitions before starting the clock:

```bash
tycho schedule validate
tycho schedule list
tycho schedule daemon
```

For diagnostics or service integration:

```bash
tycho schedule daemon --once
tycho schedule daemon --dry-run
tycho schedule daemon --interval 30
```

Runtime state is separate from config: schedule state lives in `~/.tycho/logs/schedules.json`, and daemon heartbeat state lives in `~/.tycho/logs/scheduler_daemon.json`.

## Operate a Schedule

```bash
tycho schedule run weekday-maintenance
tycho schedule pause weekday-maintenance
tycho schedule resume weekday-maintenance
tycho schedule reload
```

Remote UI exposes the same run, pause, resume, edit, and daemon controls. Removing a schedule detaches its active session but keeps that session, transcript, attachments, and native history as ordinary agent work.

## Runtime Policy

- If a prior run is still active when the next time is due, Tycho skips that occurrence and computes the next one.
- If Tycho starts late, it runs at most once for missed work, then computes the next future time.
- A direct operator message to the schedule-owned session stops automatic work until the operator resumes the schedule.
- `paused` is an intentional operator hold. `stopped` means Tycho halted the schedule because continuing is unsafe, such as a partial, failed, blocked, input-required, or start-error outcome.
- Resuming keeps the schedule-owned session and waits for the next due time.
- `no_action_needed` records a quiet successful check without unread state or success push notifications.

Tycho sends a success notification only for the first successful run and the first recovery after a failure. A failed, blocked, or input-required run stops the schedule and can notify the operator through Web Push.

See [Agent Session Lifecycle](/docs/concept/lifecycle/) for result meanings and [CLI Reference](/docs/reference/#schedules) for the command list.
