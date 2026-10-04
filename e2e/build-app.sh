#!/usr/bin/env bash
set -euo pipefail
# shellcheck source=e2e/lib.sh
source "$(cd "$(dirname "$0")" && pwd)/lib.sh"
configure_android_serial
require_cmd node
require_cmd corepack

abi="$(detect_android_abi)"
export E2E_ANDROID_ABI="$abi"

if [[ "${E2E_SKIP_APP_BUILD:-0}" == "1" ]]; then
  [[ -f "$E2E_APK" ]] || die "E2E_SKIP_APP_BUILD=1 but APK not found at $E2E_APK"
  exit 0
fi

node - <<'NODE'
const [major, minor, patch] = process.versions.node.split('.').map(Number);
if (major < 20 || (major === 20 && (minor < 19 || (minor === 19 && patch < 4)))) {
  console.error(`[e2e] Node >=20.19.4 required; found ${process.versions.node}`);
  process.exit(1);
}
NODE

cd "$ROOT_DIR"
# Invoke Corepack directly; never modify a developer's global Node installation.
YARN_ENABLE_IMMUTABLE_INSTALLS=true corepack yarn install --immutable
E2E_BACKEND_URL="$E2E_BACKEND_URL" node "$ROOT_DIR/e2e/verify-babel-e2e-url.cjs"
: "${JAVA_HOME:?Set JAVA_HOME to JDK 17 or newer}"

log "Building devDebug APK for ABI $abi"
(
  cd "$ROOT_DIR/android"
  E2E_ANDROID_ABI="$abi" ./gradlew --no-daemon --max-workers="${E2E_GRADLE_WORKERS:-2}" -PreactNativeArchitectures="$abi" assembleDevDebug
)

apk="$ROOT_DIR/android/app/build/outputs/apk/dev/debug/app-dev-debug.apk"
if [[ ! -f "$apk" ]]; then
  apk="$(find "$ROOT_DIR/android/app/build/outputs/apk" -type f -name '*dev*debug*.apk' | head -n 1 || true)"
fi
[[ -n "$apk" && -f "$apk" ]] || die "Could not find the devDebug APK."
cp -f "$apk" "$E2E_APK"
log "APK ready: $E2E_APK"
