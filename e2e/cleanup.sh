#!/usr/bin/env bash
set -euo pipefail
# shellcheck source=e2e/lib.sh
source "$(cd "$(dirname "$0")" && pwd)/lib.sh"
stop_owned_process "$E2E_METRO_PID_FILE"
stop_owned_process "$E2E_EMULATOR_PID_FILE"
rm -f "$E2E_ANDROID_SERIAL_FILE"
# An existing/reused backend is never ours, including on interrupted startup.
# backend.sh writes this ownership marker only when it starts Compose itself.
if [[ "${E2E_USE_EXISTING_BACKEND:-0}" != "1" && -f "$E2E_BACKEND_OWNER_FILE" ]]; then
  "$ROOT_DIR/e2e/backend.sh" stop || true
fi
