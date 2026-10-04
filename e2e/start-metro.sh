#!/usr/bin/env bash
set -euo pipefail
# shellcheck source=e2e/lib.sh
source "$(cd "$(dirname "$0")" && pwd)/lib.sh"
require_cmd curl

if curl -fsS http://127.0.0.1:8081/status 2>/dev/null | grep -q 'packager-status:running'; then
  [[ "${E2E_ALLOW_EXISTING_METRO:-0}" == "1" ]] || die "Metro already runs on :8081. Stop it so E2E_BACKEND_URL is guaranteed to be applied."
  rm -f "$E2E_METRO_PID_FILE"
  log "Using explicitly allowed existing Metro on :8081"
  exit 0
fi

log "Starting Metro with E2E_BACKEND_URL=$E2E_BACKEND_URL"
cd "$ROOT_DIR"
# Run the CLI directly so the recorded PID is Metro, not a Yarn parent.
nohup env E2E_BACKEND_URL="$E2E_BACKEND_URL" node node_modules/react-native/cli.js start --port 8081 --reset-cache >"$E2E_ARTIFACTS_DIR/metro.log" 2>&1 &
printf '%s\n' "$!" >"$E2E_METRO_PID_FILE"
if ! wait_http http://127.0.0.1:8081/status 120; then
  tail -n 200 "$E2E_ARTIFACTS_DIR/metro.log" >&2 || true
  die "Metro did not start."
fi
