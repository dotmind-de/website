#!/usr/bin/env bash
# Build the standalone Next.js bundle on this Mac and ship it to the netcup VPS.
# Usage: scripts/deploy.sh            (needs the "dotmind" host in ~/.ssh/config)
# Each deploy lands in /srv/dotmind/releases/<timestamp>; "current" points to the live one.
# Roll back: ssh dotmind 'ln -sfn /srv/dotmind/releases/<older> /srv/dotmind/current && systemctl restart dotmind'
set -euo pipefail

HOST="${DEPLOY_HOST:-dotmind}"
APP_DIR=/srv/dotmind
KEEP=3
RELEASE="$(date +%Y%m%d-%H%M%S)"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo "→ Building"
rm -rf .next
npm run build

echo "→ Assembling bundle"
STANDALONE=.next/standalone
cp -R public/. "$STANDALONE/public/"
mkdir -p "$STANDALONE/.next"
cp -R .next/static "$STANDALONE/.next/static"

# The build traces sharp's macOS binaries; the server needs the Linux x64 (glibc) ones.
SHARP_VERSION="$(node -p "require('./node_modules/sharp/package.json').version")"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
echo '{"private":true}' > "$TMP/package.json"
npm install --prefix "$TMP" --no-audit --no-fund --os=linux --cpu=x64 --libc=glibc \
  "sharp@$SHARP_VERSION" >/dev/null
rm -rf "$STANDALONE"/node_modules/@img/sharp-*darwin*
cp -R "$TMP"/node_modules/@img/sharp-linux-x64 "$TMP"/node_modules/@img/sharp-libvips-linux-x64 "$STANDALONE/node_modules/@img/"

echo "→ Uploading release $RELEASE"
ssh "$HOST" "mkdir -p $APP_DIR/releases/$RELEASE"
rsync -az --delete "$STANDALONE/" "$HOST:$APP_DIR/releases/$RELEASE/"

echo "→ Switching to release $RELEASE"
ssh "$HOST" "set -e
  chown -R dotmind:dotmind $APP_DIR/releases/$RELEASE
  ln -sfn $APP_DIR/releases/$RELEASE $APP_DIR/current
  systemctl restart dotmind
  for i in \$(seq 1 30); do
    curl -fsS -o /dev/null http://127.0.0.1:3000/en 2>/dev/null && break
    sleep 1
  done
  curl -fsS -o /dev/null http://127.0.0.1:3000/en || { journalctl -u dotmind -n 30 --no-pager; exit 1; }
  ls -1dt $APP_DIR/releases/*/ | tail -n +$((KEEP + 1)) | xargs -r rm -rf"

echo "✓ Live: release $RELEASE"
