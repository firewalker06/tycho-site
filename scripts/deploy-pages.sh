#!/bin/sh

set -eu

script_dir=$(CDPATH='' cd -- "$(dirname -- "$0")" && pwd)
project_dir=$(dirname -- "$script_dir")
env_file=${1:-"$project_dir/.env.deploy"}

if [ ! -f "$env_file" ]; then
  echo "Missing deployment environment file: $env_file" >&2
  echo "Copy .env.deploy.example to .env.deploy and add your Cloudflare credentials." >&2
  exit 1
fi

cd "$project_dir"
corepack pnpm build

set -a
# shellcheck disable=SC1090
. "$env_file"
set +a

if [ -z "${CLOUDFLARE_ACCOUNT_ID:-}" ]; then
  echo "CLOUDFLARE_ACCOUNT_ID is missing from $env_file" >&2
  exit 1
fi

if [ -z "${CLOUDFLARE_API_TOKEN:-}" ]; then
  echo "CLOUDFLARE_API_TOKEN is missing from $env_file" >&2
  exit 1
fi

corepack pnpm exec wrangler whoami
corepack pnpm exec wrangler pages deploy dist \
  --project-name tycho-site \
  --branch main
