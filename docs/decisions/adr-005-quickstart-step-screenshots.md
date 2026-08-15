# ADR 005: Contextual Quickstart Screenshots

## Status

Proposed. Do not merge the homepage change until all four final assets are present and visual QA passes.

## Context

The homepage quickstart currently pairs four numbered actions with one Remote UI run-summary image. The image only supports the durable-record claim in the fourth action. It does not show launch, live supervision, or an operator answering the agent.

The checked-in assets cannot form a coherent replacement set:

- `remote-new-agent.png` shows the Welcome Sandbox instead of the registered-project path named in the homepage step, uses a 1280x900 frame, and is not release-versioned.
- `tui-agents-v0.10.0.png` shows idle agents rather than a running session, live activity, or an attention state.
- `web-delegation-v0.10.0.png` shows delegation and a generic composer, not a first-session question or follow-up, and uses a 4:3 frame.
- `web-summary-v0.10.0.png` shows run-summary navigation and an attachment, but no resume or send action. Its visible "Run #2" and "Total Runs 0" state is not suitable for a first-session sequence.
- `web-workspace-v0.10.0.png` supports workspace browsing, not the quickstart loop.

## Decision

Show four vertically ordered step rows. Each row owns one screenshot and keeps the current copy adjacent to the UI state it describes. Do not use tabs, a carousel, hover replacement, automatic rotation, or scroll-triggered image swapping. All four states are primary content; keeping them visible makes the sequence understandable without JavaScript and avoids hiding steps from keyboard, touch, reduced-motion, and assistive-technology users.

At 900px and wider, each row uses a 4/8 text-to-image grid with the number and copy on the left and a 16:10 screenshot on the right. Below 900px, the image stacks immediately after its step copy. Keep the same left-to-right order for every desktop row rather than alternating it. Give the ordered list its native semantics, keep each screenshot in the corresponding `li`, and use one heading for each step. The existing **Read the quickstart** link follows the list.

Each image is a link to its original PNG so small-screen users can inspect the full-size UI. The link receives a visible `Open full-size screenshot` label; do not make the image the only indication that it is interactive. Do not open a new window. Use a precise `alt` on the image and do not repeat it in a figcaption. Provide a visible keyboard focus ring. The layout and content must remain complete with JavaScript disabled.

Use `loading="lazy"`, `decoding="async"`, and explicit `width="1440"` and `height="900"` attributes. Keep the screenshot frame at `aspect-ratio: 8 / 5`; do not use `object-fit: cover` or CSS positioning to repair a mismatched capture. Preserve the whole delivered frame.

## Required assets

All four assets must come from the exact `v0.10.0` Tycho tag and one deterministic synthetic Remote UI fixture. Capture the browser viewport at 1440x900 CSS pixels, device scale factor 1, and 100% zoom. Capture page pixels only: no browser chrome, cursor, selection highlight, devtools, notifications, QR code, token, server URL, or post-capture annotation. Deliver sRGB PNGs at exactly 1440x900. Do not resize or crop after capture.

Keep the app shell, sidebar width, project name, agent name, and theme identical across the set. Use the dark theme and the local server label `Host`. Use the synthetic registered project `Web`, agent name `Quickstart notes`, harness `codex`, and workspace display path `~/.tycho/workspaces/web`. The four images should read as consecutive states of one session, not four unrelated demos.

### 1. `quickstart-launch-v0.10.0.png`

Open **New agent** for the registered `Web` project. Show:

- Name: `Quickstart notes`
- Workspace: `~/.tycho/workspaces/web`, with the `Project path` badge
- Advanced collapsed, with the authentic v0.10.0 summary showing Custom / Global / codex / Default / Default
- Prompt: `Read README.md and docs/quickstart.md. Add one concrete next step to docs/quickstart.md, then summarize the change.`
- The complete `Create and run` action and `More options` control

Keep the form top, project context, full prompt, and primary action in frame. This must be an authentic populated form before submission, not edited artwork.

Alt text: `Tycho v0.10.0 New agent form for the Web project, ready to create and run the Quickstart notes session.`

### 2. `quickstart-watch-v0.10.0.png`

Submit the first form and open the new agent conversation while its first run is genuinely active. The deterministic harness should have emitted a completed read command for `docs/quickstart.md` and remain running long enough to capture. Show:

- Header: `Quickstart notes`, `Running / Web / Host`
- The operator prompt in conversation history
- One authentic command/tool activity block for reading `docs/quickstart.md`; its output must contain only synthetic fixture text
- The running indicator and `Stop agent` action

Do not fabricate a log panel in the screenshot. Use the conversation rendering produced by Tycho's Codex event parser.

Alt text: `Tycho v0.10.0 Remote UI showing the Quickstart notes session running with its prompt and live file-reading activity.`

### 3. `quickstart-answer-v0.10.0.png`

Let the first synthetic run finish with a valid structured `input_required` result. Open the same agent and show the real inquiry dock with:

- Header status: `Needs input / Web / Host`
- Inquiry message: `Which control surface should the quickstart lead with?`
- Required select field labeled `First path`
- Options supplied by the result: `Terminal UI` and `Remote UI`
- The optional feedback field and authentic `Send answer` action

Leave the select unchosen so the decision and validation state are clear. Do not enter an answer just for the capture.

Alt text: `Tycho v0.10.0 Remote UI showing the Quickstart notes session waiting for a required Terminal UI or Remote UI decision.`

### 4. `quickstart-resume-v0.10.0.png`

Choose `Remote UI`, submit the inquiry with `start: true`, and let the second synthetic run succeed. Return to the same agent conversation and type, but do not send, this follow-up: `Add the equivalent Terminal UI command as an alternative.` Show:

- Header: `Quickstart notes`, stopped or idle, `Web / Host`
- The recorded structured answer
- A successful Run #2 summary stating that `docs/quickstart.md` now leads with Remote UI
- The follow-up text in the composer and the authentic `Send prompt` action

The screenshot must make both durable history and same-session continuation visible. Do not use the focused Summary page because it hides the follow-up action.

Alt text: `Tycho v0.10.0 Remote UI showing two recorded Quickstart notes runs and a follow-up ready to resume the same session.`

## Safe fixture state

Build the fixture in a disposable root created with `mktemp -d`. Set `HOME` to a home directory inside that root; create the registered project at `$HOME/.tycho/workspaces/web`; and point `TYCHO_CONFIG_PATH`, `TYCHO_SYSTEM_PROMPTS_PATH`, `TYCHO_RESPONSE_STYLE_PATH`, and `TYCHO_LOGS_ROOT` into the same root. Bind `tycho serve` only to `127.0.0.1` on an unused port. Do not set or display a remote token.

The workspace should contain only:

- `README.md`: a short synthetic description of the Web fixture.
- `docs/quickstart.md`: a short synthetic two-paragraph quickstart.

Use a disposable Codex-compatible executable through `TYCHO_CODEX_BIN`; do not call a live model. Its first invocation must emit normal v0.10.0 Codex JSON events for a thread, a completed `command_execution` that reads `docs/quickstart.md`, and then pause briefly while step 2 is captured. It then writes a valid structured result with `status: input_required`, the exact inquiry above, and no attachments. Its resumed invocation emits a `file_change` for `docs/quickstart.md`, a concise assistant message, token usage with clearly synthetic small values, and this structured result:

```json
{
  "status": "success",
  "summary": "Updated docs/quickstart.md to lead with Remote UI and kept the first supervised session concrete.",
  "inquiry": null,
  "attachments": null
}
```

Let Tycho create and persist the agent, runs, inquiry, memory, and native session through its normal UI/API paths. Do not hand-edit HTML, browser storage, screenshot pixels, production config, real `~/.tycho` data, or tracked Tycho files. A temporary harness is acceptable because it produces deterministic inputs to the real v0.10.0 parser and state machine rather than fake UI.

Check out the capture source in a detached disposable worktree at tag `v0.10.0` (`fa526ff26b3d13142f89803bd926264c28a154aa`). Remove the disposable worktree and fixture root after the PNGs have been copied to the site branch.

## Capture-agent handoff

1. Work from the exact tag and disposable environment described above. Reuse the isolation pattern in `bin/remote-ui-smoke`; do not reuse its success-only fixture state or write into a developer's real Tycho home.
2. Start the fixture Remote UI and capture the four states in order at 1440x900 / DPR 1. Use the real form, create/run action, parsed activity, inquiry form, inquiry answer endpoint, second run, and composer.
3. Verify every visible label against v0.10.0. Inspect all four PNGs at original size and confirm there is no real path, project, prompt, transcript, URL, credential, QR code, notification, cursor, or browser chrome.
4. Copy the files with the exact names above into `public/assets/` on the site implementation branch. Report byte size and SHA-256 for each file.
5. Stop. Do not edit homepage code, merge, open a deployment, or replace the existing homepage image. Hand the four assets and checksums back to the site agent.

## Integration and QA gate

After the assets arrive, implement the four native ordered rows, remove the generic workflow image, and build with `corepack pnpm build`. Visual QA must cover 1440x900, 1024x768, 768x1024, and 390x844; keyboard focus on every full-size link; 200% zoom; images disabled; JavaScript disabled; and `prefers-reduced-motion: reduce`. At each width, every screenshot must remain paired with the correct numbered copy with no horizontal page scroll. Confirm the PNGs are not stretched, cropped, or upscaled and that their UI text remains useful at the rendered desktop size.

Do not merge or deploy until all four final assets are present, the build passes, and visual QA passes.
