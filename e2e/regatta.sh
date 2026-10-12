#!/usr/bin/env bash
# Two-device regatta E2E: device A (organizer, also sails) creates the event,
# places the marks, starts R1 and tracks; device B (sailor without account)
# joins through the organizer's invitation link and tracks. Both sail R1 with
# simulated GPS; the result is checked in the app and on the server.
#
# Needs the backend, Metro and device A like run-on-device.sh. Device B is
# E2E_REGATTA_SERIAL_B, or a disposable emulator started (and removed) here.
set -euo pipefail
# shellcheck source=e2e/lib.sh
source "$(cd "$(dirname "$0")" && pwd)/lib.sh"
require_cmd adb
require_cmd node
configure_android_serial
[[ -n "${E2E_ANDROID_SERIAL:-}" ]] || die "Device A missing. Run ./e2e/start-emulator.sh first."
serial_a="$E2E_ANDROID_SERIAL"
art="$E2E_ARTIFACTS_DIR/regatta"
mkdir -p "$art/a" "$art/b"

run_id="${GITHUB_RUN_ID:-$(date +%s)$$}${GITHUB_RUN_ATTEMPT:-0}"
run_id="${run_id//[^0-9A-Za-z]/}"
export E2E_USERNAME="${E2E_USERNAME:-e2e${run_id}}"
export E2E_EMAIL="${E2E_EMAIL:-${E2E_USERNAME}@example.test}"
export E2E_PASSWORD="${E2E_PASSWORD:-E2e-${run_id}!Aa9qZ}"
export MAESTRO_REGATTA_NAME="Regatta ${run_id}"

# --- device B -------------------------------------------------------------
avd_b="sail-insight-e2e-regatta-b"
owned_b=0
cleanup_b() {
  (( owned_b )) || return 0
  adb -s "$serial_b" emu kill >/dev/null 2>&1 || true
  local pid; pid="$(cat "$E2E_WORK_DIR/emulator-b.pid" 2>/dev/null || true)"
  [[ -n "$pid" ]] && kill "$pid" 2>/dev/null || true
  [[ "${E2E_KEEP_REGATTA_AVD:-0}" == "1" ]] || avdmanager delete avd --name "$avd_b" >/dev/null 2>&1 || true
}
trap cleanup_b EXIT

if [[ -n "${E2E_REGATTA_SERIAL_B:-}" ]]; then
  serial_b="$E2E_REGATTA_SERIAL_B"
else
  require_cmd emulator
  require_cmd avdmanager
  abi="$(adb -s "$serial_a" shell getprop ro.product.cpu.abi | tr -d '\r')"
  target="${E2E_ANDROID_TARGET:-google_apis_playstore}"
  image="system-images;android-${E2E_ANDROID_API};${target};${abi}"
  if ! avdmanager list avd | grep -Fq "Name: $avd_b"; then
    echo no | avdmanager create avd --force --name "$avd_b" --package "$image" --device pixel_6 >/dev/null
    # Two emulators and the Maestro driver need more than the default 2 GB.
    sed -i.bak 's/^hw.ramSize=.*/hw.ramSize=4096M/' "${ANDROID_AVD_HOME:-$HOME/.android/avd}/$avd_b.avd/config.ini"
  fi
  port=5556
  while adb devices | grep -q "emulator-$port"; do port=$((port + 2)); done
  serial_b="emulator-$port"
  nohup emulator -avd "$avd_b" -port "$port" -no-snapshot -no-boot-anim -no-audio -no-window \
    -gpu "${E2E_EMULATOR_GPU:-swiftshader_indirect}" -feature -Vulkan >"$art/emulator-b.log" 2>&1 &
  printf '%s\n' "$!" >"$E2E_WORK_DIR/emulator-b.pid"
  owned_b=1
  E2E_ANDROID_SERIAL="$serial_b" wait_android_boot "${E2E_BOOT_WAIT_SECONDS:-300}" "$!" || die "Device B did not boot; see $art/emulator-b.log"
fi
log "Regatta devices: A=$serial_a (organizer) B=$serial_b (sailor)"

# Same app build on both devices: install A's APK on B.
if ! adb -s "$serial_b" shell pm path "$E2E_APP_ID" >/dev/null 2>&1; then
  apk_path="$(adb -s "$serial_a" shell pm path "$E2E_APP_ID" | tr -d '\r' | sed -n 's/^package://p' | head -1)"
  [[ -n "$apk_path" ]] || die "App not installed on device A."
  adb -s "$serial_a" pull "$apk_path" "$art/app.apk" >/dev/null
  adb -s "$serial_b" install -r "$art/app.apk" >/dev/null
fi

# Maestro connects to each emulator's adbd directly; reuse the ADB server's key,
# which every emulator started against this server trusts.
adb_key_home="${E2E_REGATTA_MAESTRO_HOME:-$E2E_WORK_DIR/maestro-home-regatta}"
if [[ ! -f "$adb_key_home/.android/adbkey" ]]; then
  mkdir -p "$adb_key_home/.android"
  for key in "${ANDROID_USER_HOME:-$HOME/.android}/adbkey" "$HOME/.android/adbkey"; do
    if [[ -f "$key" ]]; then cp "$key" "$key.pub" "$adb_key_home/.android/" 2>/dev/null && break; fi
  done
fi

# Two emulators on one host are slow; give Maestro's on-device driver time to start.
export MAESTRO_DRIVER_STARTUP_TIMEOUT="${MAESTRO_DRIVER_STARTUP_TIMEOUT:-180000}"

run_on() { # serial artifacts-dir flow...
  local serial="$1" dir="$2"; shift 2
  E2E_ANDROID_SERIAL="$serial" E2E_ARTIFACTS_DIR="$dir" E2E_MAESTRO_HOME="$adb_key_home" \
    E2E_REUSE_INSTALLED_APP=1 E2E_FLOWS="$*" "$ROOT_DIR/e2e/run-on-device.sh"
}

# --- the regatta ------------------------------------------------------------
# Both phones wait south of the start line until they sail.
node "$ROOT_DIR/e2e/regatta.cjs" hold "$serial_a" "$serial_b" &
hold_pid=$!
trap 'kill "$hold_pid" 2>/dev/null || true; cleanup_b' EXIT
if [[ "${E2E_REGATTA_REGISTER:-1}" == "1" ]]; then
  run_on "$serial_a" "$art/a" "$ROOT_DIR/.maestro/auth-register-login.yaml"
fi
run_on "$serial_a" "$art/a" "$ROOT_DIR/.maestro/regatta/organizer-setup.yaml"
MAESTRO_INVITE_LINK="$(node "$ROOT_DIR/e2e/regatta.cjs" invite "$MAESTRO_REGATTA_NAME")"
export MAESTRO_INVITE_LINK
run_on "$serial_b" "$art/b" "$ROOT_DIR/.maestro/regatta/sailor-join.yaml"

# Both boats sail R1 at the same time through the emulators' own GPS (real time,
# one fix per second). A is faster and must win.
kill "$hold_pid" 2>/dev/null || true
node "$ROOT_DIR/e2e/regatta.cjs" sail "$serial_a:9" "$serial_b:6" || die "Sailing R1 failed."

E2E_REGATTA_WINNER="Organizer Boat" node "$ROOT_DIR/e2e/regatta.cjs" verify "$MAESTRO_REGATTA_NAME" | tee "$art/server-result.json"
run_on "$serial_a" "$art/a" "$ROOT_DIR/.maestro/regatta/results.yaml"
run_on "$serial_b" "$art/b" "$ROOT_DIR/.maestro/subflows/stop-tracking.yaml"
log "Regatta passed."
