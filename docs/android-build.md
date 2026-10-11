# React Native Metro and native Android builds

Use this guide when deciding whether a native rebuild is required, when installing a fresh
`devDebug` APK, or when a build fails. Routine JS development should use the shorter flow in
`AGENTS.md`.

## 1. Metro is the normal JS/TS development path

Check whether Metro is already running before starting another copy:

```bash
curl -fsS http://127.0.0.1:8081/status
```

If it is not running:

```bash
nohup yarn start --port 8081 >/tmp/sail-insight-metro.log 2>&1 &
```

If Yarn cannot resolve the React Native binary, use the repo-local binary:

```bash
nohup ./node_modules/.bin/react-native start --port 8081 \
  >/tmp/sail-insight-metro.log 2>&1 &
```

Then connect the emulator and launch the installed dev app:

```bash
adb reverse tcp:8081 tcp:8081
adb shell am force-stop org.sailyachtresearch.sailinsight
adb shell am start -n org.sailyachtresearch.sailinsight/.MainActivity
```

The dev flavor's package is `org.sailyachtresearch.sailinsight`; do not append `.dev`.

## 2. When a fresh APK is actually required

Do not rebuild just because JS/TS source changed. Metro serves the current checkout's JS.

Rebuild when any of these apply:

- `android/**`, manifest, native resources, Gradle config, or native Java/Kotlin changed.
- React Native/native-module versions or autolinked native dependencies changed.
- the installed APK is missing, from an incompatible native checkout, or fails before Metro
  can load because its native runtime does not match the current source/dependencies.
- the task explicitly requires validating the native build/install itself.

## 3. Proven `devDebug` build/install path

Use the repository Gradle wrapper and the sandbox Gradle state:

```bash
android/gradlew -p android :app:assembleDevDebug
adb install -r android/app/build/outputs/apk/dev/debug/app-dev-debug.apk
adb reverse tcp:8081 tcp:8081
adb shell am start -n org.sailyachtresearch.sailinsight/.MainActivity
```

`yarn android` is a convenience command, not the authority. If its React Native binary lookup
fails, do not infer that the emulator is broken. For a CLI-driven native install, the repo-local
binary may be used with the configured task, for example:

```bash
./node_modules/.bin/react-native run-android --tasks installDevDebug --no-packager
```

## 4. Interpreting failures correctly

Keep the layers separate:

- ADB/emulator failure: `adb` cannot reach a ready device.
- Metro failure: port/server/bundle resolution problem.
- native build failure: Gradle/AGP/Kotlin/NDK/SDK/project configuration problem.
- sandbox denial: an otherwise valid operation tried to read/write an ungranted path.

A native build failure does not mean Metro or the emulator cannot be used. For JS-only work,
continue with an already-installed compatible dev APK when possible. For a task that truly
requires native verification, stop that portion and report the actual build/provisioning error.

Do not change Gradle, AGP, Kotlin, SDK, NDK, SDK roots, `local.properties`, Android home, or
ADB variables merely to make a failing checkout build. Diagnose the checkout/environment
mismatch instead.

## 5. Useful verification

```bash
adb shell cmd package resolve-activity --brief org.sailyachtresearch.sailinsight
adb shell dumpsys package org.sailyachtresearch.sailinsight | grep -m1 -E 'versionName|versionCode'
adb shell dumpsys activity activities | grep -E 'topResumedActivity|ResumedActivity' | head
curl -fsS http://127.0.0.1:8081/status
```

For runtime debugging, prefer Metro logs plus targeted `adb logcat` over unnecessary rebuilds.
