#!/usr/bin/env bash
# Renews the Let's Encrypt cert for ayran-lan-streamer.duckdns.org (DNS-01 via
# DuckDNS, no port-forwarding needed) and installs it to every location the
# API reads its cert from, then restarts the running API process so it picks
# up the renewed cert. Safe to run on a schedule - acme.sh only actually
# renews when the cert is close to expiry, otherwise this is a no-op.

set -euo pipefail

DOMAIN="ayran-lan-streamer.duckdns.org"
DEPLOY_CERTS_DIR="/c/Users/victo/AppData/Roaming/Ayran/Apps/Bin/lan-streamer/certs"
DEPLOY_DIR="/c/Users/victo/AppData/Roaming/Ayran/Apps/Bin/lan-streamer"

export DuckDNS_Token="592aa43a-a12c-464c-bc40-dde8e310d17b"

"$HOME/.acme.sh/acme.sh" --cron --home "$HOME/.acme.sh" 2>&1

"$HOME/.acme.sh/acme.sh" --install-cert -d "$DOMAIN" \
  --fullchain-file "$DEPLOY_CERTS_DIR/dev-cert.pem" \
  --key-file "$DEPLOY_CERTS_DIR/dev-key.pem" \
  --home "$HOME/.acme.sh"

echo "Restarting the LAN Streamer API so it picks up the current cert..."
taskkill //F //FI "WINDOWTITLE eq lan-streamer-api*" >/dev/null 2>&1 || true
# Fall back to matching by command line if the window title approach misses it.
for pid in $(wmic process where "CommandLine like '%bundle.cjs%'" get ProcessId 2>/dev/null | tr -d '\r' | grep -E '^[0-9]+$'); do
  taskkill //F //PID "$pid" >/dev/null 2>&1 || true
done

cd "$DEPLOY_DIR"
PORT=9443 nohup node dist/bundle.cjs > "$DEPLOY_DIR/api.log" 2>&1 &
disown
echo "API restarted (pid $!)."
