# Local CI signoff

Run `scripts/ci.sh` for the complete site gate. It uses Node **22.20.0** from
`.mise.toml`, enables Corepack, checks the pnpm version pinned in `package.json`
(currently **11.18.0**), installs with `--frozen-lockfile`, builds the full site,
and runs `check:links`. Any failed step stops the script with a nonzero exit.
Use `mise install` and `mise exec -- scripts/ci.sh` if Node is not active.

This replaces the four command steps in the former
[Site workflow](https://github.com/firewalker06/tycho-site/blob/af516fc069998f4dfa6d99bd935752918178f338/.github/workflows/site.yml).
The workflow selected Node 22; local CI pins the repository's Node 22 patch.
The link check covers generated internal files, fragments, and release links.
It does not fetch external web pages. The wrapper does not deploy or post statuses.

## Tool

Use [basecamp/gh-signoff v0.4.1](https://github.com/basecamp/gh-signoff/tree/v0.4.1).
Install or replace the extension with this exact release:

```bash
gh extension install basecamp/gh-signoff --pin v0.4.1 --force
gh signoff version
# gh-signoff 0.4.1
```

Use documented command words. `help` is not a help command; an unknown word can
become a status context. Do not post bare signoffs or use `-f`.

## Check the pushed PR head

Start with a clean checkout. Push the final commit, then run the full gate.
Record the SHA and keep its log outside the checkout. This sequence posts a red
status if any check fails, and posts success only after all checks pass:

```bash
git push
sha=$(git rev-parse HEAD)
test -z "$(git status --porcelain)" || exit 1
test "$sha" = "$(gh pr view --json headRefOid --jq .headRefOid)" || exit 1
if scripts/ci.sh; then
  test "$sha" = "$(git rev-parse HEAD)" || exit 1
  test -z "$(git status --porcelain)" || exit 1
  test "$sha" = "$(gh pr view --json headRefOid --jq .headRefOid)" || exit 1
  gh signoff --commit "$sha" site-ci
else
  gh signoff fail --commit "$sha" site-ci --description "scripts/ci.sh failed; see local log"
  exit 1
fi
gh signoff status --commit "$sha"
gh pr view --json headRefOid,mergeStateStatus,statusCheckRollup
```

In v0.4.1, `status` also displays a missing bare `signoff` even when the rule
requires only `signoff/site-ci`. Do not create a bare status to clear that line.
Confirm the actual required context with `contexts` and check its state directly:

```bash
gh api "repos/firewalker06/tycho-site/commits/$sha/status" \
  --jq '.statuses[] | select(.context == "signoff/site-ci") | .state'
# success
```

Every new commit needs a complete run and a new signoff, including documentation
or workflow changes. Another trusted maintainer can fetch and check out the
exact published SHA, run the same gate in a clean checkout, and sign that SHA.
Never attest to a commit from tests on a different tree or only a subset of checks.

## Required merge gate

The enforced default-branch `signoff` ruleset requires `signoff/site-ci` and
blocks deletion and non-fast-forward updates. The owner installs it once:

```bash
gh signoff install site-ci
gh signoff check --branch main site-ci
gh signoff contexts --branch main
gh api repos/firewalker06/tycho-site/rules/branches/main
```

Missing or failed signoff blocks actors without bypass permission. Repository
administrators have an always-on bypass. This is a trusted maintainer attestation;
GitHub does not run the local tests or prove that they ran. The rule does not
require an up-to-date branch. Draft PRs also have a separate draft merge block.
Do not test by merging or by using bypass.

## Deployment and rollback

Keep `scripts/deploy-pages.sh`, the `deploy` package command, and Cloudflare Pages
settings unchanged. Pages builds with `pnpm build` and publishes `dist`.
No deployment is part of local CI.

For rollback, restore `.github/workflows/site.yml` from the workflow link above
in a reviewed PR. Keep the signoff rule until hosted checks pass on the new head.
Only then may an authorized owner run `gh signoff uninstall site-ci`.
This removes this context, not unrelated rules. Inspect rules before and after.
