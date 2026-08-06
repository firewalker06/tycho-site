---
title: Install and Run
description: Install Tycho and supervise your first agent session from the terminal or Remote UI.
---

This path gets you from an empty Tycho installation to one supervised agent session. Start in the Welcome Sandbox, then add a real project when you are ready.

## Requirements

- macOS with Homebrew for the packaged install.
- Ruby 3.2 or newer for source installs.
- At least one coding-agent CLI you want Tycho to supervise, such as Codex, Claude, OpenCode, or a custom Claude-compatible harness.

## Install with Homebrew

```bash
brew tap firewalker06/tycho
brew install tycho
```

## Install from Source

Use a source checkout when you want to contribute or Homebrew is not suitable:

```bash
git clone https://github.com/firewalker06/tycho.git
cd tycho
bin/setup
bin/tycho
```

The remaining commands use the Homebrew executable, `tycho`. For a source checkout, replace it with `bin/tycho`.

## Choose a Control Surface

Tycho offers to create a safe Welcome Sandbox when it starts without any projects. The sandbox lives at `~/.tycho/workspaces/welcome` and contains a small `README.md` and `notes.md`.

Choose the terminal or Remote UI for your first run. Both paths create the same sandbox and run the same task.

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

## Continue the Loop

When the agent finishes, ask why it chose that next step.

In the TUI or Remote UI, send the follow-up from the session chat. From the CLI:

```bash
tycho agent send <agent-key> "Explain why you chose that next step."
```

You have now completed Tycho's core loop: create work, watch it, respond when useful, and keep the session record durable.

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

Remote UI cannot browse the server filesystem or directly register an arbitrary local directory. It can ask an agent in the Welcome Sandbox to run the project command for you.

Create another Welcome Sandbox agent and give it the exact existing path:

```text
Use the Tycho CLI to register /Users/you/Code/my-workspace as a project.
Use project key my-workspace, display name "My Workspace", group Personal,
and Codex as the default harness.
Run `tycho project show my-workspace` afterward and report the result.
```

The new project appears in Remote UI after Tycho refreshes its project registry.

## Optional: Open Remote UI on Your Tailnet

Localhost is the safest first run. Before exposing Remote UI on Tailscale or another non-loopback address, set an access token:

```bash
TYCHO_REMOTE_TOKEN="$(ruby -rsecurerandom -e 'puts SecureRandom.hex(24)')" tycho serve
```

When Tailscale is available, Tycho prints its MagicDNS URL and a terminal QR code. Keep the token private and use the printed URL from another device on your tailnet.
