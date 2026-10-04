# Android E2E smoke test

Real scenario: fresh app → register → load authenticated user data → skip optional boat setup → logout → login with the same account → load authenticated user data again. No API mocks or pre-created test accounts.

## Local

Prerequisites: Docker with Compose, Node >=20.19.4 with Corepack, JDK 17 (`JAVA_HOME`), Android SDK API 36/build-tools 36.0.0/NDK 27.1.12297006/CMake 3.22.1. Put `adb`, `emulator`, `sdkmanager` and `avdmanager` on PATH and set `ANDROID_HOME`.

```bash
./e2e/android.sh
# Or without an emulator window:
E2E_HEADLESS=1 ./e2e/android.sh
```

Builds `devDebug` before starting fresh backend/Mongo/RabbitMQ containers, reuses one connected Android device or starts an API 36 emulator, starts Metro, installs the APK, then runs pinned Maestro 2.10.0. Existing API 36 Google APIs or Play Store images are reused; otherwise Google APIs is installed. The flow expects English UI and network connectivity (the app's existing NetInfo gate requires it).

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
./e2e/cleanup.sh
```

Backend URLs must be root loopback HTTP URLs (`127.0.0.1` or `localhost`). The port is published/reversed consistently. The backend image and Compose project can be overridden with `E2E_BACKEND_IMAGE` and `E2E_COMPOSE_PROJECT`. `E2E_ALLOW_EXISTING_METRO=1` is an explicit opt-in: that Metro must already serve this project with the correct backend URL.

## GitHub Actions

`.github/workflows/e2e-android.yml` runs on pull requests and manual dispatch: Node 20.19.4, JDK 17, Android API 36 x86_64, pinned backend tag, fresh databases, the same build/device scripts, and Maestro flow. Build precedes backend startup to limit memory contention. No application secrets are required. Cleanup and artifact upload run even on failure.

Artifacts in `e2e/artifacts/` include JUnit results, Maestro command traces/hierarchy/screenshots, Android logcat, Metro output and backend logs. `e2e/work/` and artifacts are ignored by Git.

## Fast checks

```bash
node --test e2e/*.test.cjs
corepack yarn test --runInBand
E2E_BACKEND_URL=http://127.0.0.1:8888 node e2e/verify-babel-e2e-url.cjs
```

Stable native `testID`s are forwarded through custom buttons/inputs. Babel inlines only `E2E_BACKEND_URL`; the app accepts it only in development bundles and only for loopback HTTP. Production routing is unchanged. Transparent onboarding headers use floating mode so Skip is exposed to Android accessibility. Clipboard paste avoids dropped keystrokes in controlled Redux forms; all assertions still check real UI and authenticated server data.
