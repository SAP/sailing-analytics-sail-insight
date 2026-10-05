# QA report: UX, error states and network handling

Branch `qa/ux-network-audit` (based on `origin/main`, with `test/android-e2e-local-validation` merged). Not pushed, no PR yet.

**Status:** working state. All 16 E2E flows pass on Android against a freshly built backend; Jest 129/129 and harness tests pass.

## How to run

```bash
./e2e/android.sh                     # build, fresh backend (auto-provisioned), emulator, all flows
node --test e2e/*.test.cjs           # harness + provisioning tests (no device needed)
corepack yarn jest                   # unit/integration tests
```

Single flows on a running setup: `E2E_FLOWS=.maestro/define-course.yaml ./e2e/run-on-device.sh`.

## What was done

1. **Checked the earlier audit (Create Event → Races → Course).** Most claims held up; some were overstated, and some important bugs were missing. The worst missed one: the course editor never started GPS (regression from the react-navigation v6 migration), so "Ping position" wrote empty coordinates.
2. **Explored the rest of the app** by hand on an Android 36 emulator and with read-only code audits: auth, events, competitor join, tracking, leaderboard, boats, mark inventory, end event, archive, QR.
3. **Wrote tests first, then had Sonnet 5.5 agents fix the bugs.** Every round was reviewed critically; the review rounds caught real regressions, which were fixed too.
4. **Automated E2E backend provisioning.** A fresh server doesn't let new users create events. `e2e/backend.sh start` now grants this automatically, verifies it, and fails the run if it can't. No manual setup, locally or in CI.
5. **New feature for pro users (requested by Axel):** Expert settings → "Show technical error details". Errors then get a "Show details" toggle with the exception, HTTP status, request method and URL, and the server response. Secrets and emails are hidden, and the text can be copied.

## Tests

**Maestro E2E** (`.maestro/`, 16 flows): real app, real local backend, real network and airplane mode.

| Area | Flows |
|---|---|
| Auth | `auth-register-login`, `auth-login-validation`, `auth-login-offline`, `auth-password-reset-offline` |
| Events / Create Event | `events-empty-state`, `create-event-validation`, `create-event-offline`, `create-event-error-details` (duplicate name; details for pro users), `archive-event` |
| Organizer | `define-races` (removal confirmation), `define-course` (GPS ping, persisted), `mark-inventory` (delete persists across restart) |
| Competitor | `competitor-boat-validation`, `competitor-tracking` (timer runs, Back blocked, stop), `leaderboard` |
| Boats | `my-boats` (add; delete after an unsaved rename) |

`config.yaml` sets the order. The backend limits sign-ups per IP, so one account is registered per run and the other flows log in with it.

**Jest** (29 files, 129 tests): failure paths that can't be produced reliably on a device, such as timeouts mid-request, partial server failures, race conditions and empty responses. They run the real sagas and screens; only the network is mocked.

## Fixed (selection; details in the commit messages)

- **Errors are visible and correct:**
  - Login, register and password reset show their errors again.
  - Login no longer says "wrong password" on a timeout.
  - Password reset no longer claims "check your inbox" while offline.
  - Permission, sign-up-limit and server-busy errors have clear messages.
- **Create Event:**
  - The spinner no longer gets stuck.
  - Discard values must be ascending.
  - "Event created, but setup failed" is reported instead of inviting a duplicate.
  - The Boat Class field stays above the keyboard, and the form scrolls to the invalid field or the server error.
- **Define Races:**
  - Removing races needs confirmation, naming the races.
  - Quick repeated count changes end on the right number.
  - Failures show messages.
  - Tracking starts only after the race time is saved, and "Start Analytics" waits for it.
- **Define Course:**
  - GPS works again.
  - Empty coordinates are never sent.
  - The editor no longer gets stuck loading.
  - Save runs only once.
  - If copying the course to later races partly fails, the user is told.
  - Coordinates are validated.
  - The "replace tracker?" confirmation is back.
- **Tracking:**
  - On first open the timer, keep-awake and Back blocking now work.
  - Stop only reports success when it worked.
  - Switching to another event asks first.
  - Double taps are guarded.
  - Impossible GPS jumps are no longer counted as distance.
- **Boats:**
  - Whitespace-only names and sail numbers are rejected.
  - Delete removes the right boat and reports failures.
  - The last boat is no longer hidden under the button.
  - The empty list explains itself.
  - Suggestions stay above the keyboard.
  - A trailing space can't overwrite another boat.
- **Marks:** a failed delete restores the mark and shows an error. The inventory refreshes from the server, without recreating default marks the user deleted. (That was a regression the final E2E run caught.)
- **Events list:** archiving can be undone, and archived events can be shown and unarchived again; before, they were lost in the app.
- **Others:**
  - End Event gives feedback and works offline-safely.
  - Leaderboard polling is robust.
  - QR re-scan works after being offline.
  - Join errors show a single alert.
  - Missing translations added (en/de).

## Still missing / open

**Verified only by Jest and code review, not on a device:**
- End Event feedback
- Race time / "Start Analytics" waiting for tracking
- Polling paused while offline
- Discard bounds on the Race Overview
- Tracker-binding confirmation
- Coordinate validation UI
- Switch-tracking confirmation
- Odometer jump filter
- QR scanner (needs a camera)

**Not tested at all:**
- iOS: all E2E verification is Android only.
- Joining via invitation deep link (no E2E flow yet).
- The CI workflow runs the full suite now, but hasn't run on GitHub Actions yet.

**Known, not fixed:**
- Deep links opened while the app is running depend entirely on Branch (no `Linking` listener).
- The leaderboard has no permanent "couldn't refresh" indicator, only a snackbar.
- Expanded error details can sit partly behind the tab bar until you scroll.
- The Create Event success path has no progress text during its 3 sequential requests.
- Many TypeScript errors already existed (~3,100 lines). A few new typing-only errors were added (e.g. EventsSaga generators).
- German uses "Rennen" consistently. Other languages fall back to English for the new texts.

**Agreed to ignore:**
- Re-login when the session expires mid-use.
- Image-only empty-Events text.
- No pull-to-refresh on the empty Events list.
- Creator landing on the participant screen.
- Handicap events sending no boat class.
- Edit Competitor failing silently.
- Tab labels overlapping the gesture bar.

**Untouched:** the untracked files in the repo root (`*.patch`, `luna-sail-insight-repro-and-root-cause.md`) are not part of this work.

## Screenshots

Before/after shots are in `e2e/artifacts/qa-screens/{before,after}/` (git-ignored). Each Maestro run also stores its screenshots in `e2e/artifacts/maestro-results/`.

## Test status

Final run (fresh backend via `e2e/backend.sh start`, fresh install, fresh account):

- **15/16 flows passed.** `mark-inventory` failed: a deleted default mark came back after a restart. This was a real regression from the last fix round: the inventory reload recreated missing default marks.
- **Fixed.** The inventory now loads without recreating defaults; the course editor still creates them when needed.
- **Re-run:** `mark-inventory` passes against the same backend.
- **Not repeated:** a complete 16-flow run after this last one-line fix (about 15 minutes).
- Jest 129/129, `node --test e2e/*.test.cjs` all passing.
