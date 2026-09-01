---
title: Remote UI
description: Supervise local and remote Tycho sessions from a browser without moving ownership into the browser.
---

Remote UI is Tycho's browser control surface. It uses the same local project registry, agent store, schedules, logs, and lifecycle rules as the TUI and CLI. The browser does not become the owner of that state.

## Start Locally

Bind explicitly to localhost for the safest first run:

```bash
tycho serve --host 127.0.0.1 --port 7373
```

Open [http://127.0.0.1:7373](http://127.0.0.1:7373). Use `tycho serve daemon` when you want the server to continue in the background; its request and lifecycle output continues in `~/.tycho/logs/remote_server_daemon.log` and `~/.tycho/logs/hq.log`.

Remote UI can create the Welcome Sandbox on an empty installation. It cannot register an arbitrary host directory. Register real project paths from the TUI or CLI, or ask a Welcome Sandbox agent to run an exact `tycho project` command.

## Supervise a Session

The **Agents** view combines projects and sessions. Open a conversation to:

- watch sequenced assistant messages, tool activity, and results while the harness runs;
- queue ordered follow-ups without waiting for the current run to stop;
- answer, dismiss, or restore a structured inquiry;
- inspect concise previews and ordered rich summary sections;
- open run attachments, usage details, saved pull-request diffs, and durable history;
- run, stop, clone, archive, schedule, or delegate work when that action is valid.

The **Now** view keeps attention work and schedules compact. `no_action_needed` runs stay quiet; input-required, blocked, failed, stopped, partial, and normal successful outcomes keep their distinct lifecycle meaning. See [Agent Session Lifecycle](/docs/concept/lifecycle/).

## Browse a Project Safely

Each registered project has a read-only **Files** view. The server accepts relative paths inside that project and rejects traversal, unsafe symlinks, VCS and generated directories, secret-shaped names or content, binary files, and oversized previews. This boundary protects browsing; it does not restrict what a launched harness can access. Review [Harnesses](/docs/configuration/harnesses/#harness-and-workspace-safety) before running an agent.

## Protect Non-Local Access

Without `TYCHO_REMOTE_TOKEN`, Remote UI and its API are appropriate only on localhost. Set a bearer token before binding to Tailscale or another non-loopback address:

```bash
TYCHO_REMOTE_TOKEN_VALUE="$(ruby -rsecurerandom -e 'puts SecureRandom.hex(24)')"
export TYCHO_REMOTE_TOKEN="$TYCHO_REMOTE_TOKEN_VALUE"
printf %s "$TYCHO_REMOTE_TOKEN_VALUE" | pbcopy
tycho serve
```

This keeps the generated value in the named shell variable and copies it to the macOS clipboard without printing it. When Remote UI asks for authentication, paste that same value into **Remote token** and save it. On WSL, replace `pbcopy` with `clip.exe`; on Linux with Wayland, use `wl-copy`. Do not print the token, put its literal value in shell history, or paste it anywhere else. Run `unset TYCHO_REMOTE_TOKEN_VALUE TYCHO_REMOTE_TOKEN` after the server stops.

When Tailscale is available, `tycho serve` can auto-bind to its IPv4 address and print a MagicDNS URL and QR code. Prefer Tailscale Serve HTTPS when you need service workers or push notifications. Passing `--host` disables Tailscale auto-binding.

## Combine Tycho Servers

Configure peers under `remote_servers` in `~/.tycho/config/hq.yml`, then enroll each bearer token with `tycho server login <key>`. The UI-serving Tycho instance brokers requests and keeps one server-qualified catalog; the browser does not send one peer's credential to another.

Projects, agent sessions, and delegation graphs remain owned by one server. Schedules, setup, GitHub, push notifications, skills, and restart controls apply to the Tycho server serving the UI. Resource health remains visible when a peer is offline, stale, or needs a token.

See [Projects and Agents](/docs/configuration/#configure-a-remote-server) for peer configuration and the [CLI Reference](/docs/reference/#remote-servers) for direct `--server` commands.
