---
title: Install and Run
description: Install Tycho and supervise your first agent session from the terminal or Remote UI.
---

This path gets you from an empty Tycho installation to one supervised agent session. Start in the Welcome Sandbox, then add a real project when you are ready.

## Requirements

- v0.16.0 targets Apple Silicon macOS and Linux Homebrew bottles. Bottle publication is separate from the Tycho source release. Check the [v0.16.0 Homebrew release](https://github.com/firewalker06/homebrew-tycho/releases/tag/tycho-0.16.0) before you install.
- Intel macOS: v0.11.0 is the final bottle. Use a source install for v0.16.0.
- For a source install: Ruby 4.0.9 or newer, Bundler, Git, Go, native build tools, and Bash 5 or newer on `PATH`. Source installs also work in Linux-style environments and Windows 11 through WSL2.
- At least one installed and authenticated coding-agent CLI: Codex, Claude, OpenCode, Pi, or a compatible custom harness profile.

On macOS 15 (Sequoia) or other platforms without a published bottle, use [Install from Source](#install-from-source). A source build was tested on macOS 15 (Sequoia). No bottle was poured on that platform.

## Install with Homebrew

When the [v0.16.0 Homebrew bottles](https://github.com/firewalker06/homebrew-tycho/releases/tag/tycho-0.16.0) are published for your platform, install with:

```bash
brew tap firewalker06/tycho
brew install tycho
```

Before an upgrade to v0.16.0, stop all TUI, server, scheduler, and other writers together. Back up the complete logs directory. Queue storage migrates on first lifecycle load. Do not run an older writer against migrated state. See the [upgrade and recovery guide](https://github.com/firewalker06/tycho/blob/v0.16.0/docs/UPGRADING.md#0160).

Existing Homebrew users can then upgrade with:

```bash
tycho update
```

`tycho update` is for Homebrew installs and safely restarts any running local Remote UI server or scheduler daemon. Source checkouts update with Git; rerun `bin/setup` if its dependency check asks you to.

After installing or upgrading, verify that `tycho --version` reports `0.16.0`:

```bash
tycho --version
tycho --help
tycho doctor
tycho project list
tycho schedule list
```

v0.16.0 requires Ruby 4.0.9 or newer. Run `bundle install` for the new `chunky_png` and `fiddle` dependencies. It adds Focus, native DeepSeek Harness support, project creation and deletion in Remote UI, schedule archives, and custom themes and backdrops. See the [v0.16.0 release notes](https://github.com/firewalker06/tycho/releases/tag/v0.16.0) and [upgrade guide](https://github.com/firewalker06/tycho/blob/v0.16.0/docs/UPGRADING.md#0160).

Before upgrading, stop all TUI, server, scheduler, and other writers together. Back up the complete logs directory. Queue storage migrates automatically on first lifecycle load. Never run an older writer against migrated state, restore only one state file, or delete the queue store to retry. A downgrade needs a coordinated restore of the complete pre-upgrade backup. Existing sessions, credentials, schedules, and attachments are retained.
Projects must be created explicitly: use `tycho project create my-project [options]`. Use `tycho project show my-project` to inspect one. If you upgrade from a release before v0.13.0, update each Tycho-owned skill in **Settings → Skills**, then restart its harness if needed. Tycho will not overwrite an unmarked or locally changed skill.

Existing custom profiles remain supported. New profiles can use the `codex`, `claude`, `opencode`, `pi`, or `dsh` adapter. The built-in keys `agy` and `dsh` are reserved; rename a conflicting custom profile. Remove automation that calls the removed `tycho github login`, `tycho github status`, or `tycho github logout` commands. Read-only agent pull-request diffs use an authenticated local `gh` CLI.

v0.14.1 requires Ruby 4.0.9 or newer and added the optional `quick_agent.default_project_key` setting. It groups delegated agents under their parents in the Agents list and shows harness marks beside harness names. No manual data migration was required. See the [v0.14.1 release notes](https://github.com/firewalker06/tycho/releases/tag/v0.14.1) and [upgrade guide](https://github.com/firewalker06/tycho/blob/v0.14.1/docs/UPGRADING.md#0141).

v0.14.0 adds the local offline `tycho harness list` catalog, inquiry draft persistence, and improved Summary attachment previews. Context replacement transfers recurring schedule ownership and archives the source at its safe lifecycle point. Manual archive has different queue and inquiry outcomes; read [Agent Session Lifecycle](/docs/concept/lifecycle/#context-pressure-and-handoffs) before using it. No manual data migration or credential reset is required. The old experimental FRED automation and configuration remain removed; v0.16.0 uses FRED only as a Now empty-state mascot.

Use `tycho serve restart` and `tycho schedule restart` in automation. The old `tycho restart` and `tycho schedule reload` forms are deprecated. `tycho metrics backfill` no longer runs; use `tycho metrics query`. See the [v0.14.0 release notes](https://github.com/firewalker06/tycho/releases/tag/v0.14.0) and [CLI compatibility notes](/docs/reference/#removed-and-deprecated-commands).

## Install from Source

Use a source checkout when you want to contribute or Homebrew is not suitable. On macOS, put Bash 5 or newer on `PATH` first: the released setup script fails with the default Bash 3.2 when no profile is selected. WSL2 users run the commands inside their Linux distribution.

```bash
git clone --branch v0.16.0 https://github.com/firewalker06/tycho.git
cd tycho
bin/setup --check
bin/setup
bin/tycho
```

`bin/setup --check` reports missing requirements without installing gems or creating config files. `bin/setup` installs dependencies, creates the user config files under `~/.tycho`, and runs `tycho doctor` as a smoke check.

The remaining commands use the Homebrew executable, `tycho`. For a source checkout, replace it with `bin/tycho`. On WSL2, run Tycho and the harness inside Linux; open localhost from your Windows browser. See [Microsoft’s WSL networking guide](https://learn.microsoft.com/en-us/windows/wsl/networking#accessing-linux-networking-apps-from-windows-localhost) if your local network setup differs.

## Choose a Control Surface

Tycho offers to create a safe Welcome Sandbox when it starts without any projects. The sandbox lives at `~/tycho-projects/welcome` and contains a small `README.md` and `notes.md`.

Choose the terminal or Remote UI for your first run. Both paths create the same sandbox and run the same task.

Before you start, confirm the selected harness is installed and authenticated. The harness—not Tycho—ultimately enforces model access, approval, and sandbox behavior. The Welcome Sandbox keeps this first write away from a real repository; review [Harness Safety](/docs/configuration/harnesses/#harness-and-workspace-safety) before registering one.

### Terminal

Open the TUI:

```bash
tycho
```

1. Choose **Create Welcome Sandbox**.
2. On the Projects screen, keep **Welcome Sandbox** selected and press `n`.
3. Enter this prompt:

   ```text
   Read README.md and notes.md.
   Add one practical next step to notes.md, then summarize the change.
   ```

4. Choose **Create and Run Agent**.

Tycho switches to the Agents screen and opens the session chat. You can watch the conversation there.

Once the sandbox exists, you can run the same task from the CLI instead:

```bash
tycho agent create welcome \
  "Read README.md and notes.md. Add one practical next step to notes.md, then summarize the change." \
  --run
```

Use the key returned by that command to inspect the session:

```bash
tycho agent status <agent-key>
tycho agent logs <agent-key> --type conversation
```

### Remote UI

Start Tycho on localhost:

```bash
tycho serve --host 127.0.0.1 --port 7373
```

The initial registry is empty. The built-in Welcome Sandbox is set up when you select its button; no manual project registration is needed. Keep that terminal open, then open [http://127.0.0.1:7373](http://127.0.0.1:7373) in your browser.

1. Choose **Create Welcome Sandbox**.
2. Open **Welcome Sandbox**, then choose **New agent**.
3. In **Options → Advanced**, choose your installed, authenticated harness, then enter the same prompt:

   ```text
   Read README.md and notes.md.
   Add one practical next step to notes.md, then summarize the change.
   ```

4. Choose **Create and Run**.

Remote UI records and displays the same agent session state as the TUI and CLI.

See [Remote UI](/docs/getting-started/remote-ui/) for live conversations, queued follow-ups, localhost and tailnet safety, schedules, and multiserver ownership.

## Continue the Loop

When the agent finishes, ask why it chose that next step.

In the TUI or Remote UI, send the follow-up from the session chat. From the CLI:

```bash
tycho agent send <agent-key> "Explain why you chose that next step."
```

You have now completed Tycho's core loop: create work, watch it, respond when useful, and keep the session record durable.

For agent-led operation, open **Settings → Skills** in Remote UI. Tycho can install its bundled `tycho` skill for Codex, Claude Code, OpenCode, or Pi after confirmation. Verify the row reads **Installed**, then invoke `$tycho` in Codex or OpenCode, `/tycho` in Claude Code, or `/skill:tycho` in Pi. See [Harnesses](/docs/configuration/harnesses/#install-the-tycho-skill) for ownership and update safety.

## Add a Real Project

Tycho stores registered projects in `~/.tycho/config/hq.yml`. Choose one of these methods to add a local repository.

### From the TUI

1. Open `tycho` and press `2` for Projects.
2. Press `N` to open the New Project form.
3. Enter the local project path first. Tycho suggests paths and derives the project key and name.
4. Choose the default harness, then select **Create Project**.

### From the CLI

Run this from any directory:

```bash
tycho project create my-workspace \
  --path ~/Code/my-workspace \
  --name "My Workspace" \
  --group Personal \
  --harness codex
```

See the [CLI Reference](/docs/reference/) for project update and archive commands.

### From Remote UI

Use **New project** to create a project under the Tycho server user's home. The server checks directory ownership, permissions, ACLs, and the local filesystem. Rejected forms keep your input. Exact request retries prevent duplicate registration. This boundary trusts same-user and root processes. Use the CLI to register an existing path outside this browser creation flow. See [project creation](https://github.com/firewalker06/tycho/blob/v0.16.0/docs/REMOTE_SERVER.md#manual-project-creation).

Open the project's **Files** view to search and browse bounded listings, preview supported text files, and make guarded plain-text edits. It stays inside the registered project and excludes sensitive, generated, binary, oversized, and unsafe paths. See [Projects and Agents](/docs/configuration/#inspect-a-project-workspace) for the boundary.

Once one agent session is coordinating several bounded tasks, continue with [Delegating Work Between Agents](/docs/concept/delegation/).

For the full create, send, run, stop, clone, and archive behavior, see [Agent Session Lifecycle](/docs/concept/lifecycle/). To run recurring work in one durable session, see [Schedules](/docs/configuration/schedules/).

## Optional: Open Remote UI on Your Tailnet

Localhost is the safest first run. Before exposing Remote UI on Tailscale or another non-loopback address, set an access token:

```bash
TYCHO_REMOTE_TOKEN_VALUE="$(ruby -rsecurerandom -e 'puts SecureRandom.hex(24)')"
export TYCHO_REMOTE_TOKEN="$TYCHO_REMOTE_TOKEN_VALUE"
printf %s "$TYCHO_REMOTE_TOKEN_VALUE" | pbcopy
tycho serve
```

The named variable keeps the generated value available, while `pbcopy` copies it without printing it. When Remote UI asks for authentication, paste that same value into **Remote token** and save it. On WSL, replace `pbcopy` with `clip.exe`; on Linux with Wayland, use `wl-copy`. Keep the token private, do not put its literal value in shell history, and run `unset TYCHO_REMOTE_TOKEN_VALUE TYCHO_REMOTE_TOKEN` after the server stops.

When Tailscale is available, Tycho prints its MagicDNS URL and a terminal QR code. Use that URL from another device on your tailnet.
