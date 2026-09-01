---
title: Install and Run
description: Install Tycho and supervise your first agent session from the terminal or Remote UI.
---

This path gets you from an empty Tycho installation to one supervised agent session. Start in the Welcome Sandbox, then add a real project when you are ready.

## Requirements

- macOS with Homebrew for the packaged install.
- For a source install: Ruby 3.2 or newer, Bundler, Go, and native build tools. Source installs also work in Linux-style environments and Windows 11 through WSL.
- At least one installed and authenticated coding-agent CLI: Codex, Claude, OpenCode, Pi, or a custom Claude-compatible harness.

## Install with Homebrew

```bash
brew tap firewalker06/tycho
brew install tycho
```

Existing Homebrew users can upgrade with:

```bash
brew update
brew upgrade tycho
```

After upgrading, restart any running `tycho serve` process so the API and browser assets come from the same build.

## Install from Source

Use a source checkout when you want to contribute or Homebrew is not suitable:

```bash
git clone https://github.com/firewalker06/tycho.git
cd tycho
bin/setup --check
bin/setup
bin/tycho
```

`bin/setup --check` reports missing requirements without installing gems or creating config files. `bin/setup` installs dependencies, creates the user config files under `~/.tycho`, and runs `tycho doctor` as a smoke check.

The remaining commands use the Homebrew executable, `tycho`. For a source checkout, replace it with `bin/tycho`.

## Choose a Control Surface

Tycho offers to create a safe Welcome Sandbox when it starts without any projects. The sandbox lives at `~/.tycho/workspaces/welcome` and contains a small `README.md` and `notes.md`.

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

Keep that terminal open, then open [http://127.0.0.1:7373](http://127.0.0.1:7373) in your browser.

1. Choose **Create Welcome Sandbox**.
2. Open **Welcome Sandbox**, then choose **New agent**.
3. Enter the same prompt:

   ```text
   Read README.md and notes.md.
   Add one practical next step to notes.md, then summarize the change.
   ```

4. Choose **Create and run**.

![The Tycho Remote UI New agent form for the Welcome Sandbox](/assets/remote-new-agent.png)

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
tycho project my-workspace \
  --path ~/Code/my-workspace \
  --name "My Workspace" \
  --group Personal \
  --harness codex
```

See the [CLI Reference](/docs/reference/) for project update and archive commands.

### Ask an Agent from Remote UI

Remote UI cannot register an arbitrary local directory. It can browse files only inside an already registered project, using bounded read-only listings and text previews. To register a new path from the browser, ask an agent in the Welcome Sandbox to run the project command for you.

Create another Welcome Sandbox agent and give it the exact existing path:

```text
Use the Tycho CLI to register /Users/you/Code/my-workspace as a project.
Use project key my-workspace, display name "My Workspace", group Personal,
and Codex as the default harness.
Run `tycho project show my-workspace` afterward and report the result.
```

The new project appears in Remote UI after Tycho refreshes its project registry.

Open the project's **Files** view to browse bounded directory listings and preview supported text files. This view is read-only and stays inside the registered project; it excludes sensitive, generated, binary, oversized, and unsafe paths. See [Projects and Agents](/docs/configuration/#inspect-a-project-workspace) for the boundary.

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
