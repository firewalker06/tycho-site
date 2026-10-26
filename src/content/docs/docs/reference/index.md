---
title: CLI Reference
description: Tycho v0.14.0 commands, queue recovery, server controls, and compatibility notes.
---

This reference describes [Tycho v0.14.0](https://github.com/firewalker06/tycho/releases), commit `8d813dca497fe9e106d0a679ee2f74849239c54c`. Command forms were checked against that tag's help and command registry. Run `tycho <group> <command> --help` for command-specific options; the top-level help omits some registered commands.

## General Commands

```bash
tycho
tycho --help
tycho --version
tycho -v
tycho doctor
tycho doctor --claude
tycho doctor --claude --run-agent
tycho update
tycho doctor --server vps --json
tycho update --server vps --json
```

Running `tycho` without a command opens the TUI. `doctor --claude --run-agent` creates a disposable diagnostic agent; plain `doctor` inspects readiness. `update` upgrades a Homebrew install and restarts running local services. Update source installs through Git and `bin/setup`.

## Local Harness Catalogs

```bash
tycho harness list [--harness KEY] [--model MODEL] [--discover] [--json]
tycho harness list --harness claude --model claude-opus-5-5 --json
```

This command is local-only: no `--server` or remote forwarding. The offline default reads built-in fallbacks and configured `harness_catalogs`, including custom harnesses, without tool execution, authentication checks, or provider contact. Both filters are exact and case-sensitive. A missing model is absent from the catalog; provider availability is not checked.

`--discover` runs local catalog commands used by Settings. They can need tools, credentials, and network/provider access. `catalog_source` records the source or fallback. Tycho adds no provider API query or authentication check of its own. Discovery does not prove live entitlement or validate a model/reasoning pair.

Unknown defaults are JSON `null` or text `unknown; harness decides`. Harness suggestions do not prove model effort support. For `claude-opus-5-5`, `low`, `medium`, `high`, `xhigh`, and `max` are harness suggestions; model support and defaults remain unknown. Model-specific lists appear only with source evidence. Project/template overrides are not listed. See [Harness Catalogs](/docs/configuration/harnesses/#inspect-local-model-and-reasoning-catalogs).

## Projects

```bash
tycho project create my-project --path ~/Code/my-project --name "My Project"
tycho project list
tycho project show my-project
tycho project update my-project --group Personal --harness codex
tycho project archive my-project
```

Create and update accept `--name`, `--group`, `--harness` (`--agent` is an alias), `--model`, `--reasoning-effort`, `--response-style`, `--pr-url`, `--hidden`, and `--json`. Create also accepts `--path`. Update accepts empty strings to clear optional group, model, effort, and PR URL values. Archive archives the project and its sessions.

Projects must be created explicitly. `tycho project my-project` no longer creates one and fails without changing the registry.

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
tycho agent clone my-project-agent-3 --handoff --run
```

Create accepts `--harness`, `--model`, `--name`, `--template`, and `--run`. Clone supports `--handoff` for concise source context. Ordinary CLI clones retain their source; Remote UI context replacement archives its source and transfers schedule ownership at its safe lifecycle point. Logs support `--type raw|conversation|system` and `--follow`.

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

`--parent-agent` and `--root` are mutually exclusive. Both parent and child must exist on that target server. See [Delegating Work Between Agents](/docs/concept/delegation/).

For CLI manual archive, stop a running session first. Manual archive cancels unresolved inquiries and records queued work without executing it: undelivered user work is declined with a reason, protected reports are superseded with a reason in read-only history, and delivered or in-flight work is marked aborted with uncertainty. Context replacement has different guards; see [Lifecycle](/docs/concept/lifecycle/#context-pressure-and-handoffs).

Inspect archived sessions without mixing them into active polling:

```bash
tycho agent list --archived
tycho agent list --include-archived
```

## Schedules

```bash
tycho schedule create weekday-maintenance \
  --cron "0 9 * * 1-5" --timezone local --project-key my-project \
  --agent-name "Weekday maintenance" --message "Run the maintenance check."
tycho schedule update weekday-maintenance --agent codex --model gpt-6-astra --reasoning-effort medium
tycho schedule list
tycho schedule validate
tycho schedule run weekly-review
tycho schedule pause weekly-review
tycho schedule resume weekly-review
tycho schedule restart
tycho schedule daemon
tycho schedule daemon --once
tycho schedule daemon --dry-run
tycho schedule daemon --interval 30
```

Create and update accept `--name`, `--cron`, `--timezone` (`local` or `UTC`), `--project-key`, `--agent-name`, `--agent-key`, `--agent`, `--model`, `--reasoning-effort`, `--system-message`, `--message`, `--ends-at`, `--server`, and `--json`. Adopt an existing session with `--agent-key`.

The dedicated daemon owns the clock; the TUI and Remote UI only manage it. See [Schedules](/docs/configuration/schedules/).

## Remote UI

```bash
tycho serve
tycho serve --host 127.0.0.1 --port 7373
tycho serve daemon
tycho serve restart
tycho serve restart --server vps --json
tycho schedule restart --server vps --json
```

Check the installed version with `tycho --version` or `tycho -v`. `tycho update` upgrades a Homebrew installation and restarts running local services through their stable launcher; source checkouts update through Git instead.

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
tycho metrics query \
  --from 2026-08-01 \
  --to 2026-08-16 \
  --timezone Asia/Jakarta
tycho metrics query --server vps --from 2026-08-01 --to 2026-08-16 --timezone UTC --json
```

The range starts at `--from` and ends before `--to`. Offset-free boundaries use the named IANA timezone; values with `Z` or an explicit offset are absolute. Query filters accept comma-separated `--group`, `--project`, `--agent`, `--harness`, `--model`, and `--status` values.

Tycho normalizes finalized managed runs and native sessions across harnesses. Missing telemetry, session baselines, models, or prices remain unknown rather than becoming zero; costs are API list-price equivalents, not subscription charges or invoices. The embedded GPT-6 rate card includes cache-write accounting; cache writes replace the corresponding ordinary input cost. Missing rates or token counts remain explicitly unpriced. Agent and project archives mark matching records as archived without moving them out of the global query path.

Qualified custom Codex model names such as `openai.gpt-5.4` use the canonical OpenAI price table when known. Unknown models keep token telemetry and remain unpriced.

## Queue Work and Recovery

```bash
tycho agent send <agent-key> "Continue after the external check" --delay 60
tycho queue <agent-key> --json
tycho queue-work complete <agent-key> <batch-id> --dispositions-json '<outcomes-json>'
tycho queue-work discard <agent-key> --reason "The failed work is obsolete"
tycho queue-work process <agent-key> --entry-ids <id-1,id-2> --expected-entry-ids <fifo-snapshot-ids>
tycho queue-work remove <agent-key> --entry-ids <id-1> --expected-entry-ids <fifo-snapshot-ids> --reason "Obsolete request"
```

All queue commands accept `--server <key>` and `--json`. `queue` consumes pending entries into one durable batch; repeated reads return that same open batch. It is not a read-only queue preview. `agent status --json` reports queue count and dispatch errors. Use the Remote UI queue controls to inspect entry IDs and the exact snapshot before an operator recovery action.

Process and remove require comma-separated stable IDs and the exact FIFO snapshot. To act on all entries, pass every ID in that snapshot. Stale snapshots fail without applying the requested action. Remove records an audited disposition and cannot remove protected delegation callbacks. Discard applies to an eligible failed claimed batch; retry protected callbacks instead.

For `complete`, replace `<outcomes-json>` with a JSON array containing every entry's `entry_id` and `outcome`. User outcomes are `completed`, `needs_input`, or `declined_with_reason`. Report outcomes are `incorporated` or `superseded_with_reason`. Reason outcomes require `reason`. Identical completion is idempotent; missing, unknown, duplicate, or conflicting entries keep the batch open.

Success, no-action success, and Partial automatically settle delivered work with `completed` and `incorporated`. Failed, blocked, and input-required results keep unresolved work. See [Agent Session Lifecycle](/docs/concept/lifecycle/#durable-queue-work).

## Pull-Request Diff Catalogs

```bash
tycho agent pr-diff add <agent-key> https://github.com/example/project/pull/123
tycho agent pr-diff remove <agent-key> https://github.com/example/project/pull/123
```

Both commands accept `--server <key>` and `--json`. Remove accepts a catalog ID or PR URL. Detach preserves source attachments and shared immutable snapshots. Diff reads use the local authenticated `gh` credential.

## Store Recovery and Finalization

```bash
tycho agent store backups --json
tycho agent store restore /absolute/path/to/validated-backup.json --json
tycho agent finalize <agent-key>
```

These commands are local-only. Backups lists validated rolling snapshots with time, record count, hash, and path. Restore validates the snapshot and retains a pre-restore safety artifact. Review the selected backup before restoring state. The detached runner normally calls `finalize`; it finalizes a completed run and delivers eligible delegation callbacks.

## Removed and Deprecated Commands

| Old form | v0.14.0 behavior and replacement |
| --- | --- |
| `tycho project <key>` | Unsupported; use explicit `project create` or `project show`. |
| `tycho github login`, `status`, `logout` | Removed; use an authenticated local `gh` CLI for PR diff reads. |
| `tycho restart` | Deprecated alias for `tycho serve restart`. |
| `tycho schedule reload` | Deprecated alias for `tycho schedule restart`. |
| `tycho metrics backfill` | Deprecated and no longer runs; use `tycho metrics query`. |
| `tycho debug claude [--run-agent]` | Deprecated; use `tycho doctor --claude [--run-agent]`. |

FRED and its experimental configuration were removed in v0.12.0. Legacy records stay hidden. Do not add it to new configurations.
