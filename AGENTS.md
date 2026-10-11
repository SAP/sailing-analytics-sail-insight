# AGENTS.md

Do not create worktrees, alternate checkouts, or symlink node_modules unless explicitly requested.
Operate in the current checkout and preserve unrelated untracked/unstaged files.
After switching branches or when dependency/native versions may differ,
run yarn install --immutable before diagnosing Gradle or React Native compatibility failures.

## Android / React Native

This repo runs in a preconfigured Android sandbox. Use the sandbox environment as-is.
Do not hardcode SDK paths, override Android/ADB/Gradle environment variables, edit
`android/local.properties`, or change Gradle/SDK/NDK versions to bypass an environment problem.

Known dev target:
- app id: `org.sailyachtresearch.sailinsight`
- activity: `.MainActivity`
- Metro port: `8081`
- dev APK: `android/app/build/outputs/apk/dev/debug/app-dev-debug.apk`

### Default development flow

1. Run `adb devices -l`. Reuse a connected device in state `device`.
   If it is temporarily `offline`/`unauthorized`, wait and retry before treating it as a failure.
   If no emulator is running, list/start an existing sandbox AVD with
   `android emulator list` / `android emulator start <name>`. If multiple devices are connected,
   choose the intended serial and use `adb -s <serial>` consistently.
2. Reuse Metro if `curl -fsS http://127.0.0.1:8081/status` reports it running.
   Otherwise start it in the background with
   `nohup yarn start --port 8081 >/tmp/sail-insight-metro.log 2>&1 &`. If Yarn cannot resolve
   the RN binary, use the repo-local `./node_modules/.bin/react-native start --port 8081`.
3. Run `adb reverse tcp:8081 tcp:8081` before launching the app.
4. For JS/TS-only changes, reuse a compatible installed dev APK and relaunch the app;
   Metro serves the current checkout, so a fresh APK is not required.
5. Rebuild/reinstall `devDebug` only when native Android code/config/resources, native
   dependencies, or the native runtime changed, or when no compatible dev APK is installed.

Do not guess a `.dev` application-id suffix. Build failure is not emulator failure; if the
blocked build is not required for the requested verification, continue with Metro and the
compatible installed app.

Do not run SDK package management merely to launch an existing AVD. Use `android sdk` only
when a required SDK/system-image package is actually missing. Prefer the current `android`
CLI; `sdkmanager` and `avdmanager` are legacy tools.

Stop only emulators started by this task. Do not modify or delete user/personal AVDs.

See [emulator lifecycle and SDK provisioning](docs/android-emulator.md) and
[native build/install troubleshooting](docs/android-build.md) for non-routine work.
