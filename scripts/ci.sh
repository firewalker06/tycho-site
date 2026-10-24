#!/usr/bin/env bash
# Keep the full site gate in one command. This script never posts a signoff.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

expected_node=v22.23.4
actual_node=$(node --version)
if [[ "$actual_node" != "$expected_node" ]]; then
  echo "Local CI requires Node ${expected_node#v}; run mise install and mise exec -- scripts/ci.sh." >&2
  exit 1
fi

corepack enable
expected_pnpm=$(node --input-type=module -e 'import p from "./package.json" with { type: "json" }; console.log(p.packageManager.match(/^pnpm@([^+]+)/)[1])')
actual_pnpm=$(corepack pnpm --version)
if [[ "$actual_pnpm" != "$expected_pnpm" ]]; then
  echo "Corepack must use pnpm $expected_pnpm from package.json." >&2
  exit 1
fi

corepack pnpm install --frozen-lockfile
corepack pnpm build
corepack pnpm check:links
