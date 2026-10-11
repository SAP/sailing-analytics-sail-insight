# Android emulator lifecycle and SDK provisioning

Use this guide when ADB is not ready, no emulator is running, a new AVD is required, or an
SDK/system image is genuinely missing. Routine Metro development belongs in `AGENTS.md`.

## 1. Decide what state you are in

Start with:

```bash
adb devices -l
```

- `device`: reuse it. Do not start another emulator unless the task requires another device.
- `offline` / `unauthorized`: treat this as potentially transient during emulator startup.
- no emulator: start an existing sandbox AVD before considering creation of a new one.

Do not inventory or install SDK packages just because ADB is not ready.

## 2. ADB is temporarily offline or unauthorized

The sandbox uses its own ADB configuration. Do not override `ADB_*`, Android home variables,
or vendor keys, and do not immediately kill/recreate the ADB server.

Wait briefly for the existing transport to settle:

```bash
for i in $(seq 1 15); do
  state="$(adb get-state 2>/dev/null || true)"
  [ "$state" = device ] && break
  sleep 2
done
adb devices -l
```

When a device becomes available, verify Android has booted:

```bash
adb shell getprop sys.boot_completed
```

If it remains unauthorized/offline after a reasonable retry, report the ADB/sandbox problem
as such. Do not convert it into an SDK-installation problem unless a later command explicitly
reports a missing SDK/image.

## 3. No emulator is running: start an existing AVD

Prefer the current Android CLI:

```bash
android emulator list
android emulator start <avd-name>
adb devices -l
```

`android emulator start` waits until the selected emulator is booted and ready. Reuse an AVD
from the sandbox location; do not start or modify personal AVDs outside the configured
`$ANDROID_AVD_HOME`.

If this task started the emulator, stop it when finished:

```bash
android emulator stop <emulator-serial>
```

Do not stop an emulator that was already running when the task began.

## 4. Create a new disposable AVD only when needed

Creation is appropriate for isolation, a required API/system image, or when no suitable
sandbox AVD exists. Prefer `android emulator create` for ordinary creation:

```bash
android emulator create --list-profiles
android emulator create medium_phone
android emulator list
```

If the task requires an exact API/image/name and the current Android CLI does not expose the
needed selector, the legacy `avdmanager` can be used as a compatibility fallback. Keep the
AVD under the sandbox-provided AVD home and give it a run-specific name.

Example for the Android 16 / Play Store / arm64 image used by this project:

```bash
name="sail-agent-$(date +%Y%m%d-%H%M%S)"
image="system-images;android-36;google_apis_playstore;arm64-v8a"
echo no | avdmanager create avd -n "$name" -k "$image" -d medium_phone
android emulator start "$name"
```

If creation says the system image is missing, then provision it as described below. Do not
install packages pre-emptively.

## 5. SDK/system-image provisioning

Yes, SDK installation can be necessary in the future. It is needed when the requested build
or AVD requires a package that is not installed. It is not part of normal emulator startup.

Use the current Android CLI rather than deprecated `sdkmanager`:

```bash
android sdk list
android sdk install system-images/android-36/google_apis_playstore/arm64-v8a
```

For native builds, derive required versions from the checked-out `android/build.gradle`,
Gradle files, and CI workflow rather than assuming a global version. The repo has used
Android 36 / Build Tools 36.0.0 / NDK 27.1.12297006 / CMake 3.22.1, but the checkout is the
source of truth.

SDK package installation writes to the SDK. If the sandbox exposes that SDK read-only and a
required package is genuinely missing, that is a real provisioning/permission issue. Report
or diagnose that exact path; do not switch to a personal SDK root or rewrite project config.

## 6. Cleanup

Stop emulators started by the task. Remove an AVD only if this task created it and it is meant
to be disposable. Never delete an existing/user AVD merely to recover from ADB startup noise.
