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
if [[ "${E2E_REUSE_INSTALLED_APP:-0}" != "1" ]]; then
  [[ -f "$E2E_APK" ]] || die "APK missing at $E2E_APK. Run ./e2e/build-app.sh first."
fi
wait_http "$E2E_BACKEND_URL/gwt/status" 30 || die "Backend is not healthy before device test."
rm -f "$E2E_ARTIFACTS_DIR/failure.png" "$E2E_ARTIFACTS_DIR/success.png" "$E2E_ARTIFACTS_DIR/maestro-junit.xml"

export PATH="$E2E_WORK_DIR/maestro/bin:$PATH"
export MAESTRO_DISABLE_UPDATE_CHECK=true
export MAESTRO_CLI_NO_ANALYTICS=true
"$ROOT_DIR/e2e/install-maestro.sh"
"$ROOT_DIR/e2e/start-metro.sh"

wait_android_device "${E2E_DEVICE_WAIT_SECONDS:-120}" || die "Selected Android device $E2E_ANDROID_SERIAL did not become ready."
adb -s "$E2E_ANDROID_SERIAL" reverse "tcp:$E2E_BACKEND_PORT" "tcp:$E2E_BACKEND_PORT"
adb -s "$E2E_ANDROID_SERIAL" reverse tcp:8081 tcp:8081
if [[ "${E2E_REUSE_INSTALLED_APP:-0}" == "1" ]]; then
  adb -s "$E2E_ANDROID_SERIAL" shell pm path "$E2E_APP_ID" >/dev/null 2>&1 || die "Compatible installed app required."
else
  adb -s "$E2E_ANDROID_SERIAL" uninstall "$E2E_APP_ID" >/dev/null 2>&1 || true
  adb -s "$E2E_ANDROID_SERIAL" install -r "$E2E_APK"
fi
adb -s "$E2E_ANDROID_SERIAL" logcat -c >/dev/null 2>&1 || true

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
log "Running E2E flows (${flows[*]}) as $E2E_USERNAME on Android $(adb -s "$E2E_ANDROID_SERIAL" shell getprop ro.build.version.sdk | tr -d '\r')"
set +e
# Device/endpoint options belong to Maestro's root command.
(cd "$ROOT_DIR" && maestro "${MAESTRO_DEVICE_ARGS[@]}" test \
  -e APP_ID="$E2E_APP_ID" \
  -e E2E_USERNAME="$E2E_USERNAME" \
  -e E2E_EMAIL="$E2E_EMAIL" \
  -e E2E_PASSWORD="$E2E_PASSWORD" \
  --debug-output "$E2E_ARTIFACTS_DIR/maestro-debug" \
  --test-output-dir "$E2E_ARTIFACTS_DIR/maestro-results" \
  --format junit \
  --output "$E2E_ARTIFACTS_DIR/maestro-junit.xml" \
  ${tag_args[@]+"${tag_args[@]}"} \
  "${flows[@]}")
status=$?
set -e
adb -s "$E2E_ANDROID_SERIAL" logcat -d >"$E2E_ARTIFACTS_DIR/android-logcat.txt" 2>&1 || true

# The app log must be where support looks for it (Android/data/<app id>/files/sail-insight-logs),
# record API calls, and never contain the run's credentials.
app_log="$E2E_ARTIFACTS_DIR/app-log.txt"
adb -s "$E2E_ANDROID_SERIAL" shell "cat /sdcard/Android/data/$E2E_APP_ID/files/sail-insight-logs/*.log" >"$app_log" 2>&1 || true
if ! grep -q '\[INFO\] API ' "$app_log"; then
  log "App log in Android/data/$E2E_APP_ID/files/sail-insight-logs is missing or has no API calls."
  status=1
elif grep -qF -e "$E2E_PASSWORD" -e "$E2E_EMAIL" "$app_log"; then
  # The username is not checked: E2E event names contain it on purpose.
  log "App log contains the test account's password or e-mail address."
  status=1
else
  log "App log found with $(grep -c '\[INFO\] API ' "$app_log") API calls; no password or e-mail address."
fi
adb -s "$E2E_ANDROID_SERIAL" shell dumpsys package "$E2E_APP_ID" >"$E2E_ARTIFACTS_DIR/app-package.txt" 2>&1 || true
if (( status != 0 )); then
  adb -s "$E2E_ANDROID_SERIAL" exec-out screencap -p >"$E2E_ARTIFACTS_DIR/failure.png" 2>/dev/null || true
  exit "$status"
fi
adb -s "$E2E_ANDROID_SERIAL" exec-out screencap -p >"$E2E_ARTIFACTS_DIR/success.png" 2>/dev/null || true
log "E2E flows passed."
