#!/usr/bin/env bash
# Shared variables/arrays are consumed by scripts sourcing this file.
# shellcheck disable=SC2034
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
# Optional developer-local defaults. This file is ignored by Git and is not
# needed on standard Android installations or in CI.
if [[ -f "$ROOT_DIR/e2e/.env.local" ]]; then
  # shellcheck source=/dev/null
  source "$ROOT_DIR/e2e/.env.local"
fi
E2E_WORK_DIR="${E2E_WORK_DIR:-$ROOT_DIR/e2e/work}"
E2E_ARTIFACTS_DIR="${E2E_ARTIFACTS_DIR:-$ROOT_DIR/e2e/artifacts}"
E2E_BACKEND_URL="${E2E_BACKEND_URL:-http://127.0.0.1:8888}"
E2E_BACKEND_IMAGE="${E2E_BACKEND_IMAGE:-ghcr.io/sap/sailing-analytics:main-202609252301}"
E2E_COMPOSE_PROJECT="${E2E_COMPOSE_PROJECT:-sail-insight-e2e}"
E2E_BACKEND_SERVER_NAME="${E2E_BACKEND_SERVER_NAME:-sail-insight-e2e}"
E2E_APP_ID="${E2E_APP_ID:-org.sailyachtresearch.sailinsight}"
E2E_ANDROID_API="${E2E_ANDROID_API:-36}"
E2E_ANDROID_ABI="${E2E_ANDROID_ABI:-}"
E2E_ANDROID_TARGET="${E2E_ANDROID_TARGET:-}"
E2E_MAESTRO_VERSION="${E2E_MAESTRO_VERSION:-2.10.0}"
export E2E_ADB_SERVER_PORT="${E2E_ADB_SERVER_PORT:-${ANDROID_ADB_SERVER_PORT:-5037}}"
export ANDROID_ADB_SERVER_PORT="$E2E_ADB_SERVER_PORT"
E2E_APK="${E2E_APK:-$E2E_WORK_DIR/sail-insight-e2e.apk}"
E2E_METRO_PID_FILE="$E2E_WORK_DIR/metro.pid"
E2E_EMULATOR_PID_FILE="$E2E_WORK_DIR/emulator.pid"
E2E_ANDROID_SERIAL_FILE="$E2E_WORK_DIR/android.serial"
E2E_BACKEND_OWNER_FILE="$E2E_WORK_DIR/backend.owner"
# Maestro state stays project-local by default. A custom home can provide
# existing .android/adbkey credentials for a direct device connection.
E2E_MAESTRO_HOME="${E2E_MAESTRO_HOME:-$E2E_WORK_DIR/maestro-home}"
export MAESTRO_OPTS="${MAESTRO_OPTS:-} -Duser.home=\"$E2E_MAESTRO_HOME\""
export MAESTRO_CLI_ANALYSIS_NOTIFICATION_DISABLED=true
mkdir -p "$E2E_MAESTRO_HOME/.maestro"

log() { printf '[e2e] %s\n' "$*"; }
die() { printf '[e2e] ERROR: %s\n' "$*" >&2; exit 1; }
require_cmd() { command -v "$1" >/dev/null 2>&1 || die "Missing required command: $1"; }

[[ "$E2E_ADB_SERVER_PORT" =~ ^[0-9]{1,5}$ ]] || die "Invalid E2E_ADB_SERVER_PORT."
E2E_ADB_SERVER_PORT="$((10#$E2E_ADB_SERVER_PORT))"
(( E2E_ADB_SERVER_PORT >= 1 && E2E_ADB_SERVER_PORT <= 65535 )) || die "Invalid E2E_ADB_SERVER_PORT."
export ANDROID_ADB_SERVER_PORT="$E2E_ADB_SERVER_PORT"

# The app uses the same host URL through adb reverse. Reject paths, remote
# hosts, credentials, query strings, and TLS rather than silently misrouting it.
if [[ "$E2E_BACKEND_URL" =~ ^http://(127\.0\.0\.1|localhost)(:([0-9]{1,5}))?/?$ ]]; then
  E2E_BACKEND_PORT="${BASH_REMATCH[3]:-80}"
  E2E_BACKEND_PORT="$((10#$E2E_BACKEND_PORT))"
  (( E2E_BACKEND_PORT >= 1 && E2E_BACKEND_PORT <= 65535 )) || die "Invalid backend port."
  E2E_BACKEND_URL="${E2E_BACKEND_URL%/}"
else
  die "E2E_BACKEND_URL must be a root http://127.0.0.1[:port] or http://localhost[:port] URL."
fi
export E2E_BACKEND_URL E2E_BACKEND_PORT E2E_BACKEND_IMAGE E2E_COMPOSE_PROJECT E2E_BACKEND_SERVER_NAME
export E2E_ANDROID_API E2E_ANDROID_ABI E2E_ANDROID_TARGET E2E_MAESTRO_VERSION
mkdir -p "$E2E_WORK_DIR" "$E2E_ARTIFACTS_DIR"

compose() {
  if docker compose version >/dev/null 2>&1; then
    docker compose -p "$E2E_COMPOSE_PROJECT" -f "$ROOT_DIR/e2e/docker-compose.yml" "$@"
  elif command -v docker-compose >/dev/null 2>&1; then
    docker-compose -p "$E2E_COMPOSE_PROJECT" -f "$ROOT_DIR/e2e/docker-compose.yml" "$@"
  else
    die "Docker Compose is required."
  fi
}

# Bound even a stuck adb client; unlike `adb wait-for-device`, polling cannot
# wait forever. Run in a subshell so its temporary traps never affect callers.
run_with_timeout() (
  local timeout="$1" pid deadline status
  shift
  deadline=$((SECONDS + timeout))
  "$@" & pid=$!
  trap 'kill -TERM "$pid" 2>/dev/null || true; kill -KILL "$pid" 2>/dev/null || true' EXIT
  trap 'exit 130' INT
  trap 'exit 143' TERM
  while kill -0 "$pid" 2>/dev/null; do
    if (( SECONDS >= deadline )); then return 124; fi
    sleep 0.1
  done
  if wait "$pid"; then status=0; else status=$?; fi
  trap - EXIT
  return "$status"
)

wait_http() {
  local url="$1" timeout="${2:-120}" deadline remaining
  deadline=$((SECONDS + timeout))
  while (( SECONDS < deadline )); do
    remaining=$((deadline - SECONDS))
    if curl -fsS --connect-timeout "$remaining" --max-time "$remaining" "$url" >/dev/null 2>&1; then return 0; fi
    (( SECONDS < deadline )) || break
    sleep 1
  done
  return 1
}

configure_android_serial() {
  local requested="${E2E_ANDROID_SERIAL:-${ANDROID_SERIAL:-}}" devices serial count state
  if ! command -v adb >/dev/null 2>&1; then
    [[ -z "$requested" ]] || die "adb is required to validate Android device $requested."
    return 0
  fi
  devices="$(run_with_timeout 5 adb devices)" || die "Could not list Android devices."
  if [[ -n "$requested" ]]; then
    state="$(printf '%s\n' "$devices" | awk -v serial="$requested" '$1==serial {print $2}')"
    [[ "$state" == "device" ]] || die "Requested Android device $requested is not ready (state: ${state:-missing})."
    serial="$requested"
  else
    count="$(printf '%s\n' "$devices" | awk 'NR>1 && $2=="device" {count++} END {print count+0}')"
    (( count <= 1 )) || die "Multiple Android devices connected. Set E2E_ANDROID_SERIAL."
    (( count == 1 )) || return 0
    serial="$(printf '%s\n' "$devices" | awk 'NR>1 && $2=="device" {print $1}')"
  fi
  export E2E_ANDROID_SERIAL="$serial" ANDROID_SERIAL="$serial"
}

has_android_device() {
  local serial="${E2E_ANDROID_SERIAL:-${ANDROID_SERIAL:-}}"
  [[ -n "$serial" ]] && command -v adb >/dev/null 2>&1 || return 1
  [[ "$(run_with_timeout 5 adb -s "$serial" get-state 2>/dev/null)" == "device" ]]
}

wait_android_device() {
  local timeout="${1:-120}" pid="${2:-}" deadline remaining probe
  [[ -n "${E2E_ANDROID_SERIAL:-}" ]] || die "No Android device selected."
  deadline=$((SECONDS + timeout))
  while (( SECONDS < deadline )); do
    if [[ -n "$pid" ]] && ! kill -0 "$pid" 2>/dev/null; then
      log "Emulator process exited before the device was ready." >&2
      return 1
    fi
    remaining=$((deadline - SECONDS)); probe="$remaining"
    (( probe <= 5 )) || probe=5
    if [[ "$(run_with_timeout "$probe" adb -s "$E2E_ANDROID_SERIAL" get-state 2>/dev/null)" == "device" ]]; then return 0; fi
    (( SECONDS < deadline )) || break
    sleep 1
  done
  return 1
}

wait_android_boot() {
  local timeout="${1:-240}" pid="${2:-}" deadline remaining probe
  deadline=$((SECONDS + timeout))
  while (( SECONDS < deadline )); do
    [[ -z "$pid" ]] || kill -0 "$pid" 2>/dev/null || return 1
    remaining=$((deadline - SECONDS)); probe="$remaining"
    (( probe <= 5 )) || probe=5
    if [[ "$(run_with_timeout "$probe" adb -s "$E2E_ANDROID_SERIAL" shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')" == "1" ]]; then return 0; fi
    (( SECONDS < deadline )) || break
    sleep 1
  done
  return 1
}

# PID files are written only for processes started by these scripts. Reused
# services never get a PID file. Use one invocation per work directory.
stop_owned_process() {
  local file="$1" pid deadline
  [[ -f "$file" ]] || return 0
  pid="$(<"$file")"
  if [[ "$pid" =~ ^[0-9]+$ ]] && (( pid > 1 )); then
    kill -TERM "$pid" 2>/dev/null || true
    deadline=$((SECONDS + ${E2E_CLEANUP_WAIT_SECONDS:-5}))
    while kill -0 "$pid" 2>/dev/null && (( SECONDS < deadline )); do sleep 0.1; done
    kill -0 "$pid" 2>/dev/null && kill -KILL "$pid" 2>/dev/null || true
  fi
  rm -f "$file"
}

maestro_device_args() {
  MAESTRO_DEVICE_ARGS=(--device "$E2E_ANDROID_SERIAL")
  # A custom host ADB server need not use 5037: connect directly to the
  # selected emulator's adbd using Maestro's built-in (hidden) CLI options.
  local port="${E2E_MAESTRO_ADB_PORT:-}"
  if [[ -z "$port" && "$E2E_ADB_SERVER_PORT" != 5037 ]]; then
    [[ "$E2E_ANDROID_SERIAL" =~ ^emulator-([0-9]+)$ ]] || die "Custom ADB server with a physical device: set E2E_MAESTRO_ADB_PORT to its forwarded adbd port."
    port="$((BASH_REMATCH[1] + 1))"
  fi
  if [[ -n "$port" ]]; then
    if [[ ! "$port" =~ ^[0-9]{1,5}$ ]]; then die "Invalid E2E_MAESTRO_ADB_PORT."; fi
    port=$((10#$port))
    if (( port < 1 || port > 65535 )); then die "Invalid E2E_MAESTRO_ADB_PORT."; fi
    # Direct connections have a host:port identity, not the adb server's
    # emulator-N serial. The explicit endpoint already selects one device.
    MAESTRO_DEVICE_ARGS=(--host "${E2E_MAESTRO_ADB_HOST:-127.0.0.1}" --port "$port")
  fi
}

detect_android_abi() {
  if [[ -n "${E2E_ANDROID_ABI:-}" ]]; then printf '%s\n' "$E2E_ANDROID_ABI"; return; fi
  if has_android_device; then adb -s "$E2E_ANDROID_SERIAL" shell getprop ro.product.cpu.abi | tr -d '\r'; return; fi
  case "$(uname -m)" in arm64|aarch64) printf 'arm64-v8a\n' ;; *) printf 'x86_64\n' ;; esac
}
