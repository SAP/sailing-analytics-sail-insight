# Android E2E tests

Real scenarios against a real, freshly created backend; no API mocks or pre-created test accounts. Flows live in `.maestro/` (`config.yaml` sets the order):

- `auth-register-login` registers the run's account (the backend rate-limits sign-ups per IP, so all other flows log in with it), then logs out and in again.
- `events-empty-state`, `auth-login-validation`, `auth-login-offline`, `auth-password-reset-offline`: empty and error states, offline via airplane mode.
- `create-event-validation`, `create-event-offline`, `create-event-error-details` (duplicate event name: friendly message for everyone, expandable technical details for pro users).
- `define-races` (destructive race removal must be confirmed), `define-course` (mark placed at the device's GPS position, persisted).
- `mark-inventory`, `my-boats`, `competitor-boat-validation`: deletion/reload, saved boat deletion after an unsaved rename, and required-field validation.
- `competitor-tracking`, `leaderboard`, `archive-event`: join/start/stop, leaderboard controls, archive and restore.
- `expert-local-diagnostics`: a rejected login creates real diagnostic history; expert controls persist the GPS logging switch and must successfully copy that history.
- `invitation-join`: a sailor without an account opens an organizer's invitation link (the content of the event's QR code), joins with a new boat and sees the event and races read-only.
- `auth-password-reset`, `account-settings`, `qr-scanner-permission`: reset confirmation (known and unknown account), settings switches that survive a restart, Expedition server switch, camera permission denied/granted.
- `course-editing`, `race-scoring`, `mark-tracking`, `handicap-edit-competitor`, `organizer-results-end-event`, `tracking-switch`, `join-boat-picker`: typed mark positions (invalid ones rejected), adding/deleting marks and the copy-course question, discards stored on the server, the SAP Sailing Analytics race page, the phone as mark tracker, editing a competitor's handicap, result editing, ending an event, switching tracking between events, and choosing one of several boats.

After the flows, `run-on-device.sh` reads the app's log folder (`Android/data/<app id>/files/sail-insight-logs`): it must exist, record API calls and contain neither the run's password nor its e-mail address.

## Two-device regatta

```bash
./e2e/regatta.sh   # after backend, Metro and device A are up (e.g. via android.sh or the individual steps)
```

Device A (organizer who also sails) creates the event, places start line and windward mark with simulated GPS, starts R1 and tracks. Device B — `E2E_REGATTA_SERIAL_B`, or a disposable second emulator created and deleted by the script — opens the organizer's invitation link without an account, joins with a new boat and tracks. Both boats then sail R1 at the same time (`travel` with different speeds). `e2e/regatta.cjs verify` waits until the server has scored R1 for both boats with the faster boat first, and device A's leaderboard must list both. Flows live in `.maestro/regatta/` and are not part of the normal suite. Account sign-ups are limited per IP by the server, so the regatta uses one account (registered through the app) plus an anonymous sailor.

### Backend provisioning

`e2e/backend.sh start` provisions every backend it starts (and an existing one with `E2E_USE_EXISTING_BACKEND=1`) via `e2e/provision-backend.cjs`: a fresh server lets new users only view, so the script grants `SERVER:CREATE_OBJECT` to all users through a role on the server's user group, using the fresh container's built-in admin account (`E2E_BACKEND_ADMIN_USER`/`E2E_BACKEND_ADMIN_PASSWORD`, default `admin`/`admin`). It is idempotent and verifies the result; the run fails if provisioning fails. Nothing has to be configured by hand.

## Local

Prerequisites: Docker with Compose, Node >=20.19.4 with Corepack, JDK 17 (`JAVA_HOME`), Android SDK API 36/build-tools 36.0.0/NDK 27.1.12297006/CMake 3.22.1. Put `adb`, `emulator`, `sdkmanager` and `avdmanager` on PATH and set `ANDROID_HOME`.

```bash
./e2e/android.sh
# Or without an emulator window:
E2E_HEADLESS=1 ./e2e/android.sh
```

Builds `devDebug` before starting fresh backend/Mongo/RabbitMQ containers, reuses one connected Android device or starts an API 36 emulator, starts Metro, installs the APK, then runs pinned Maestro 2.10.0. Existing API 36 Google APIs or Play Store images are reused; otherwise Google APIs is installed. The flow expects English UI and network connectivity (the app's existing NetInfo gate requires it). Maestro runs the selected suite once, using `.maestro/config.yaml` for setup ordering and continuing after failed journeys. Screenshots, debug output, logcat and JUnit remain available without custom privacy gates. `E2E_REUSE_INSTALLED_APP=1` skips uninstall/install when reusing a compatible installed app for JS-only changes (default remains uninstall/install).

Maestro is installed under `e2e/work`, without editing global Node tools or shell profiles. On exit (including failure/signals), scripts stop their Metro/emulator/backend. Reused devices/backends/Metro are not stopped. Use one run per work directory; this is a disposable development APK/backend, not a production device test.

### Optional local configuration

Standard installations and GitHub Actions need no local configuration. If you want persistent overrides, copy `e2e/.env.example` to `e2e/.env.local` and uncomment the relevant settings. Every script automatically reads `.env.local`; it is ignored by Git. The example uses `${VARIABLE:-default}` assignments so explicit command-line environment settings take precedence.

For nonstandard Android tooling, `E2E_ADB_SERVER_PORT` defaults to `ANDROID_ADB_SERVER_PORT` or **5037**. With a custom server port, Maestro connects directly to the selected emulator's adbd endpoint. `E2E_MAESTRO_HOME` can select a home containing existing `.android/adbkey` credentials; by default, Maestro state stays in `e2e/work/maestro-home`. An explicit endpoint can be supplied with `E2E_MAESTRO_ADB_HOST`/`E2E_MAESTRO_ADB_PORT`. This is an **adbd endpoint**, not the host ADB-server port. No proxy is involved.

### Overrides / individual steps

```bash
E2E_ANDROID_SERIAL=emulator-5554 ./e2e/android.sh
E2E_ANDROID_TARGET=google_apis_playstore ./e2e/android.sh
E2E_SKIP_APP_BUILD=1 ./e2e/android.sh # requires an already built e2e/work APK
E2E_USE_EXISTING_BACKEND=1 E2E_BACKEND_URL=http://127.0.0.1:9000 ./e2e/android.sh

./e2e/build-app.sh
./e2e/backend.sh start
./e2e/start-emulator.sh
./e2e/run-on-device.sh
E2E_REUSE_INSTALLED_APP=1 ./e2e/run-on-device.sh # compatible installed app
./e2e/cleanup.sh
```

Backend URLs must be root loopback HTTP URLs (`127.0.0.1` or `localhost`). The port is published/reversed consistently. The backend image and Compose project can be overridden with `E2E_BACKEND_IMAGE` and `E2E_COMPOSE_PROJECT`. `E2E_ALLOW_EXISTING_METRO=1` is an explicit opt-in: that Metro must already serve this project with the correct backend URL.

## GitHub Actions

`.github/workflows/e2e-android.yml` runs on pull requests and manual dispatch: Node 20.19.4, JDK 17, Android API 36 x86_64, pinned backend tag, fresh databases, the same build/device scripts, and Maestro flow. Build precedes backend startup to limit memory contention. No application secrets are required. Cleanup and artifact upload run even on failure.

Artifacts in `e2e/artifacts/` include JUnit results, Maestro command traces/hierarchy/screenshots, Android logcat, Metro output and backend logs. `e2e/work/` and artifacts are ignored by Git.

## Inspect real application diagnostics

For a credential inspection, export known synthetic `E2E_USERNAME`, `E2E_EMAIL`, and `E2E_PASSWORD` before running the registration/login journeys. After the run, collect the app's normal local history from the debug app (or copy it from Expert Settings):

```bash
adb -s "$E2E_ANDROID_SERIAL" exec-out "run-as org.sailyachtresearch.sailinsight sh -c 'cat files/sail-insight-logs/*.log'" > e2e/artifacts/app-diagnostics.txt
grep -F -e "$E2E_USERNAME" -e "$E2E_PASSWORD" -e "$E2E_EMAIL" e2e/artifacts/app-diagnostics.txt
```

Also inspect normal app logcat and the issued test token where available. A missing/empty file is not evidence that an exercised logging path is safe. Investigate matches in application diagnostics and correct production logging; do not redact or withhold the synthetic test artifacts. This is a post-run inspection, not a separate logger or per-flow gate. An absence of the known values establishes only the exercised paths.

## Fast checks

```bash
node --test e2e/*.test.cjs   # includes provisioning against a fake security API
corepack yarn test --runInBand
E2E_BACKEND_URL=http://127.0.0.1:8888 node e2e/verify-babel-e2e-url.cjs
```

Stable native `testID`s are forwarded through custom buttons/inputs. Babel inlines only `E2E_BACKEND_URL`; the app accepts it only in development bundles and only for loopback HTTP. Production routing is unchanged. Transparent onboarding headers use floating mode so Skip is exposed to Android accessibility. Clipboard paste avoids dropped keystrokes in controlled Redux forms; all assertions still check real UI and authenticated server data.
