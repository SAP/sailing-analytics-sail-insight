#!/usr/bin/env bash
set -euo pipefail
# shellcheck source=e2e/lib.sh
source "$(cd "$(dirname "$0")" && pwd)/lib.sh"
cleanup_on_exit() {
  local status=$?
  trap - EXIT
  "$ROOT_DIR/e2e/cleanup.sh" || true
  exit "$status"
}
trap cleanup_on_exit EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
configure_android_serial
if has_android_device; then
  export E2E_ANDROID_ABI="${E2E_ANDROID_ABI:-$(adb shell getprop ro.product.cpu.abi | tr -d '\r')}"
else
  export E2E_ANDROID_ABI="${E2E_ANDROID_ABI:-$(detect_android_abi)}"
fi
"$ROOT_DIR/e2e/prepare.sh"
"$ROOT_DIR/e2e/start-emulator.sh"
# Child scripts cannot export into this shell; preserve the exact selected or
# newly launched device, even if another device connects during startup.
E2E_ANDROID_SERIAL="$(<"$E2E_ANDROID_SERIAL_FILE")"
export E2E_ANDROID_SERIAL ANDROID_SERIAL="$E2E_ANDROID_SERIAL"
"$ROOT_DIR/e2e/run-on-device.sh"
