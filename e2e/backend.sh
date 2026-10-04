#!/usr/bin/env bash
set -euo pipefail
# shellcheck source=e2e/lib.sh
source "$(cd "$(dirname "$0")" && pwd)/lib.sh"
cmd="${1:-start}"

start_backend() {
  require_cmd curl
  if [[ "${E2E_USE_EXISTING_BACKEND:-0}" == "1" ]]; then
    wait_http "$E2E_BACKEND_URL/gwt/status" 30 || die "Existing backend is not healthy."
    return
  fi
  require_cmd docker
  log "Starting pinned backend: $E2E_BACKEND_IMAGE"
  printf '%s\n' "$E2E_COMPOSE_PROJECT" >"$E2E_BACKEND_OWNER_FILE"
  compose down -v --remove-orphans >/dev/null 2>&1 || true
  docker pull "$E2E_BACKEND_IMAGE"
  compose up -d
  if ! wait_http "$E2E_BACKEND_URL/gwt/status" "${E2E_BACKEND_WAIT_SECONDS:-240}"; then
    compose ps >"$E2E_ARTIFACTS_DIR/backend-compose-ps.txt" 2>&1 || true
    compose logs --no-color >"$E2E_ARTIFACTS_DIR/backend-compose.log" 2>&1 || true
    die "Backend did not become healthy at $E2E_BACKEND_URL/gwt/status"
  fi
  log "Backend is healthy: $E2E_BACKEND_URL/gwt/status"
}

stop_backend() {
  command -v docker >/dev/null 2>&1 || return
  [[ "${E2E_USE_EXISTING_BACKEND:-0}" != "1" ]] || return
  [[ -f "$E2E_BACKEND_OWNER_FILE" ]] || return
  [[ "$(<"$E2E_BACKEND_OWNER_FILE")" == "$E2E_COMPOSE_PROJECT" ]] || die "Backend ownership project mismatch."
  compose ps >"$E2E_ARTIFACTS_DIR/backend-compose-ps.txt" 2>&1 || true
  compose logs --no-color >"$E2E_ARTIFACTS_DIR/backend-compose.log" 2>&1 || true
  compose down -v --remove-orphans >"$E2E_ARTIFACTS_DIR/backend-compose-down.log" 2>&1 || return
  rm -f "$E2E_BACKEND_OWNER_FILE"
}

case "$cmd" in start) start_backend ;; stop) stop_backend ;; *) die "Usage: $0 start|stop" ;; esac
