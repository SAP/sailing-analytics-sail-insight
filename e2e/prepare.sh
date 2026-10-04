#!/usr/bin/env bash
set -euo pipefail
# shellcheck source=e2e/lib.sh
source "$(cd "$(dirname "$0")" && pwd)/lib.sh"
# Build before starting backend containers to keep Gradle's memory footprint isolated.
"$ROOT_DIR/e2e/build-app.sh"
"$ROOT_DIR/e2e/backend.sh" start
