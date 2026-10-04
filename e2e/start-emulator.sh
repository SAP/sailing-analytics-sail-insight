#!/usr/bin/env bash
set -euo pipefail
# shellcheck source=e2e/lib.sh
source "$(cd "$(dirname "$0")" && pwd)/lib.sh"
configure_android_serial
require_cmd adb
if has_android_device; then
  # Reusing a device never makes it ours to shut down.
  rm -f "$E2E_EMULATOR_PID_FILE"
  printf '%s\n' "$E2E_ANDROID_SERIAL" >"$E2E_ANDROID_SERIAL_FILE"
  log "Using already-connected Android device/emulator $E2E_ANDROID_SERIAL."
  exit 0
fi
sdk_root="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-}}"
[[ -n "$sdk_root" ]] || die "Set ANDROID_HOME or ANDROID_SDK_ROOT to the Android SDK directory."
export ANDROID_HOME="$sdk_root" ANDROID_SDK_ROOT="$sdk_root"
abi="$(detect_android_abi)"
if [[ -z "$E2E_ANDROID_TARGET" ]]; then
  E2E_ANDROID_TARGET=google_apis
  if [[ ! -f "$sdk_root/system-images/android-${E2E_ANDROID_API}/google_apis/${abi}/package.xml" && -f "$sdk_root/system-images/android-${E2E_ANDROID_API}/google_apis_playstore/${abi}/package.xml" ]]; then
    E2E_ANDROID_TARGET=google_apis_playstore
  fi
fi
export E2E_ANDROID_TARGET
case "$E2E_ANDROID_TARGET" in google_apis|google_apis_playstore) ;; *) die "E2E_ANDROID_TARGET must be google_apis or google_apis_playstore." ;; esac
avd="sail-insight-e2e-api${E2E_ANDROID_API}-${E2E_ANDROID_TARGET}-${abi}"
image="system-images;android-${E2E_ANDROID_API};${E2E_ANDROID_TARGET};${abi}"
packages=()
[[ -f "$sdk_root/platform-tools/adb" ]] || packages+=("platform-tools")
[[ -f "$sdk_root/emulator/emulator" ]] || packages+=("emulator")
[[ -f "$sdk_root/platforms/android-${E2E_ANDROID_API}/android.jar" ]] || packages+=("platforms;android-${E2E_ANDROID_API}")
[[ -d "$sdk_root/build-tools/36.0.0" ]] || packages+=("build-tools;36.0.0")
[[ -f "$sdk_root/system-images/android-${E2E_ANDROID_API}/${E2E_ANDROID_TARGET}/${abi}/package.xml" ]] || packages+=("$image")
if (( ${#packages[@]} > 0 )); then
  require_cmd sdkmanager
  yes | sdkmanager --sdk_root="$sdk_root" --licenses >/dev/null 2>&1 || true
  sdkmanager --sdk_root="$sdk_root" "${packages[@]}" >/dev/null
fi
require_cmd avdmanager
require_cmd emulator
if ! avdmanager list avd | grep -Fq "Name: $avd"; then
  echo no | avdmanager create avd --force --name "$avd" --package "$image" --device pixel_6 >/dev/null
fi
port="${E2E_EMULATOR_PORT:-5554}"
[[ "$port" =~ ^[0-9]+$ ]] || die "Invalid E2E_EMULATOR_PORT."
port=$((10#$port))
(( port >= 5554 && port <= 5682 && port % 2 == 0 )) || die "Emulator port must be even and between 5554 and 5682."
# Select a particular new emulator, never an unrelated device which connects
# while we are booting. Occupied/offline emulator slots are not reusable.
devices="$(run_with_timeout 5 adb devices)"
while printf '%s\n' "$devices" | awk -v serial="emulator-$port" '$1==serial {found=1} END {exit !found}'; do
  [[ -z "${E2E_EMULATOR_PORT:-}" ]] || die "Emulator port $port is already in use."
  port=$((port + 2))
  (( port <= 5682 )) || die "No free emulator port."
done
export E2E_ANDROID_SERIAL="emulator-$port" ANDROID_SERIAL="emulator-$port"
# Disable Vulkan: SwiftShader Vulkan can fail allocating color buffers on macOS.
opts=(-avd "$avd" -port "$port" -no-snapshot -no-boot-anim -no-audio -gpu "${E2E_EMULATOR_GPU:-swiftshader_indirect}" -feature -Vulkan -camera-back none -camera-front none)
[[ "${E2E_HEADLESS:-0}" != "1" ]] || opts+=(-no-window)
# On failure/signals stop only the process this invocation started. A successful
# standalone startup deliberately leaves it alive for run-on-device.sh.
cleanup_failed_start() { local status=$?; if (( status != 0 )); then stop_owned_process "$E2E_EMULATOR_PID_FILE"; fi; }
trap cleanup_failed_start EXIT
trap 'exit 130' INT
trap 'exit 143' TERM
nohup emulator "${opts[@]}" >"$E2E_ARTIFACTS_DIR/emulator.log" 2>&1 &
pid=$!
printf '%s\n' "$pid" >"$E2E_EMULATOR_PID_FILE"
wait_android_device "${E2E_DEVICE_WAIT_SECONDS:-120}" "$pid" || die "Emulator exited or did not connect; see $E2E_ARTIFACTS_DIR/emulator.log."
wait_android_boot "${E2E_BOOT_WAIT_SECONDS:-240}" "$pid" || die "Android emulator exited or did not finish booting; see $E2E_ARTIFACTS_DIR/emulator.log."
printf '%s\n' "$E2E_ANDROID_SERIAL" >"$E2E_ANDROID_SERIAL_FILE"
adb -s "$E2E_ANDROID_SERIAL" shell settings put global window_animation_scale 0 || true
adb -s "$E2E_ANDROID_SERIAL" shell settings put global transition_animation_scale 0 || true
adb -s "$E2E_ANDROID_SERIAL" shell settings put global animator_duration_scale 0 || true
log "Android ${E2E_ANDROID_API} emulator $E2E_ANDROID_SERIAL is ready."
