#!/usr/bin/env bash
set -euo pipefail
# shellcheck source=e2e/lib.sh
source "$(cd "$(dirname "$0")" && pwd)/lib.sh"
trap 'exit 130' INT
trap 'exit 143' TERM
require_cmd adb
require_cmd curl
configure_android_serial
[[ -n "${E2E_ANDROID_SERIAL:-}" ]] || die "No Android device connected. Run ./e2e/start-emulator.sh first."
[[ -f "$E2E_APK" ]] || die "APK missing at $E2E_APK. Run ./e2e/build-app.sh first."
wait_http "$E2E_BACKEND_URL/gwt/status" 30 || die "Backend is not healthy before device test."
rm -f "$E2E_ARTIFACTS_DIR/failure.png" "$E2E_ARTIFACTS_DIR/success.png" "$E2E_ARTIFACTS_DIR/maestro-junit.xml"

export PATH="$E2E_WORK_DIR/maestro/bin:$PATH"
export MAESTRO_DISABLE_UPDATE_CHECK=true
export MAESTRO_CLI_NO_ANALYTICS=true
"$ROOT_DIR/e2e/install-maestro.sh"
"$ROOT_DIR/e2e/start-metro.sh"

wait_android_device "${E2E_DEVICE_WAIT_SECONDS:-120}" || die "Selected Android device $E2E_ANDROID_SERIAL did not become ready."
adb reverse "tcp:$E2E_BACKEND_PORT" "tcp:$E2E_BACKEND_PORT"
adb reverse tcp:8081 tcp:8081
adb uninstall "$E2E_APP_ID" >/dev/null 2>&1 || true
adb install -r "$E2E_APK"
adb logcat -c >/dev/null 2>&1 || true

run_id="${GITHUB_RUN_ID:-$(date +%s)$$}${GITHUB_RUN_ATTEMPT:-0}"
run_id="${run_id//[^0-9A-Za-z]/}"
export E2E_USERNAME="${E2E_USERNAME:-e2e${run_id}}"
export E2E_EMAIL="${E2E_EMAIL:-${E2E_USERNAME}@example.test}"
export E2E_PASSWORD="${E2E_PASSWORD:-E2e-${run_id}!Aa9qZ}"

maestro_device_args
# E2E_FLOWS: space-separated flow files/dirs (default: all flows via .maestro/config.yaml).
read -r -a flows <<<"${E2E_FLOWS:-$ROOT_DIR/.maestro}"
tag_args=()
[[ -z "${E2E_INCLUDE_TAGS:-}" ]] || tag_args+=(--include-tags "$E2E_INCLUDE_TAGS")
[[ -z "${E2E_EXCLUDE_TAGS:-}" ]] || tag_args+=(--exclude-tags "$E2E_EXCLUDE_TAGS")
log "Running E2E flows (${flows[*]}) as $E2E_USERNAME on Android $(adb shell getprop ro.build.version.sdk | tr -d '\r')"
set +e
# Device/endpoint options belong to Maestro's root command.
maestro "${MAESTRO_DEVICE_ARGS[@]}" test \
  -e APP_ID="$E2E_APP_ID" \
  -e E2E_USERNAME="$E2E_USERNAME" \
  -e E2E_EMAIL="$E2E_EMAIL" \
  -e E2E_PASSWORD="$E2E_PASSWORD" \
  --debug-output "$E2E_ARTIFACTS_DIR/maestro-debug" \
  --test-output-dir "$E2E_ARTIFACTS_DIR/maestro-results" \
  --format junit \
  --output "$E2E_ARTIFACTS_DIR/maestro-junit.xml" \
  ${tag_args[@]+"${tag_args[@]}"} \
  "${flows[@]}"
status=$?
set -e
adb logcat -d >"$E2E_ARTIFACTS_DIR/android-logcat.txt" 2>&1 || true
adb shell dumpsys package "$E2E_APP_ID" >"$E2E_ARTIFACTS_DIR/app-package.txt" 2>&1 || true
if (( status != 0 )); then
  adb exec-out screencap -p >"$E2E_ARTIFACTS_DIR/failure.png" 2>/dev/null || true
  exit "$status"
fi
adb exec-out screencap -p >"$E2E_ARTIFACTS_DIR/success.png" 2>/dev/null || true
log "E2E flows passed."
