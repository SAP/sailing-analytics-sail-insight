#!/usr/bin/env bash
set -euo pipefail
# shellcheck source=e2e/lib.sh
source "$(cd "$(dirname "$0")" && pwd)/lib.sh"
require_cmd curl
require_cmd unzip
require_cmd java
# Install within the project, without modifying shell profiles or ~/.maestro.
export PATH="$E2E_WORK_DIR/maestro/bin:$PATH"
export MAESTRO_DISABLE_UPDATE_CHECK=true MAESTRO_CLI_NO_ANALYTICS=true
current=""
if command -v maestro >/dev/null 2>&1; then current="$(maestro --version 2>/dev/null | tr -d '\r' || true)"; fi
if [[ "$current" == "$E2E_MAESTRO_VERSION" ]]; then log "Using Maestro $E2E_MAESTRO_VERSION"; exit 0; fi
[[ "$E2E_MAESTRO_VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]] || die "Invalid Maestro version."
log "Installing pinned Maestro $E2E_MAESTRO_VERSION"
archive="$E2E_WORK_DIR/maestro.zip"
curl -fL --retry 3 --connect-timeout 15 --max-time 300 "https://github.com/mobile-dev-inc/maestro/releases/download/cli-$E2E_MAESTRO_VERSION/maestro.zip" -o "$archive"
unzip -tq "$archive" >/dev/null
rm -rf "$E2E_WORK_DIR/maestro"
unzip -qo "$archive" -d "$E2E_WORK_DIR"
rm -f "$archive"
current="$(maestro --version 2>/dev/null | tr -d '\r' || true)"
[[ "$current" == "$E2E_MAESTRO_VERSION" ]] || die "Expected Maestro $E2E_MAESTRO_VERSION, got: $current"
