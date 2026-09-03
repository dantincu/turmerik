#!/usr/bin/env bash
# One-time issuance of the Let's Encrypt cert for ayran-lan-streamer.duckdns.org
# (DNS-01 via DuckDNS, no port-forwarding needed). Run this once per machine/
# user account before the api/ and api-rs/ renew-ayran-lan-streamer-cert
# scripts can install a cert - they only renew and deploy an existing cert,
# they don't issue a new one.

set -euo pipefail

DOMAIN="ayran-lan-streamer.duckdns.org"

source "$(dirname "${BASH_SOURCE[0]}")/duckdns-token.sh"

"$HOME/.acme.sh/acme.sh" --issue --dns dns_duckdns -d "$DOMAIN" --home "$HOME/.acme.sh"
