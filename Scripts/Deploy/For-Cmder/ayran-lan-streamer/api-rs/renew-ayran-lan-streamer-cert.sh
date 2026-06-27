#!/usr/bin/env bash
# Renews the Let's Encrypt cert for ayran-lan-streamer.duckdns.org (DNS-01 via
# DuckDNS, no port-forwarding needed) and installs it to the Rust API's own
# certs directory, then restarts the running API process so it picks up the
# renewed cert. Safe to run on a schedule - acme.sh only actually renews when
# the cert is close to expiry, otherwise this is a no-op.
#
# Separate from the Node deployment's renew script - api-rs/ has its own
# certs/ directory (not shared with the Node deployment's), so it needs its
# own --install-cert destination and its own process to restart.

set -euo pipefail

DOMAIN="ayran-lan-streamer.duckdns.org"
DEPLOY_DIR="/c/Users/victo/AppData/Roaming/Ayran/Apps/Bin/lan-streamer/api-rs"
DEPLOY_CERTS_DIR="$DEPLOY_DIR/certs"

export DuckDNS_Token="592aa43a-a12c-464c-bc40-dde8e310d17b"

"$HOME/.acme.sh/acme.sh" --cron --home "$HOME/.acme.sh" 2>&1

"$HOME/.acme.sh/acme.sh" --install-cert -d "$DOMAIN" \
  --fullchain-file "$DEPLOY_CERTS_DIR/dev-cert.pem" \
  --key-file "$DEPLOY_CERTS_DIR/dev-key.pem" \
  --home "$HOME/.acme.sh"

echo "Restarting the LAN Streamer API (Rust) so it picks up the current cert..."
for pid in $(wmic process where "CommandLine like '%lan-streamer-api.exe%'" get ProcessId 2>/dev/null | tr -d '\r' | grep -E '^[0-9]+$'); do
  taskkill //F //PID "$pid" >/dev/null 2>&1 || true
done

cd "$DEPLOY_DIR"
PORT=9443 nohup ./bins/lan-streamer-api.exe > "$DEPLOY_DIR/api.log" 2>&1 &
disown
echo "API restarted (pid $!)."
