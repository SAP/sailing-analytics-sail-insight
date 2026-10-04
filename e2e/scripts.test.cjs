// Shell regression tests: no SDK, servers, downloads or emulator required.
const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { spawnSync, spawn } = require('node:child_process')
const { once } = require('node:events')
const { test } = require('node:test')

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'sail-e2e-shell-'))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  const e2e = path.join(root, 'e2e'), bin = path.join(root, 'bin')
  fs.mkdirSync(e2e); fs.mkdirSync(bin)
  for (const file of ['lib.sh', 'android.sh', 'cleanup.sh', 'start-emulator.sh', 'run-on-device.sh']) {
    fs.copyFileSync(path.join(__dirname, file), path.join(e2e, file))
    fs.chmodSync(path.join(e2e, file), 0o755)
  }
  const env = { ...process.env }
  for (const key of Object.keys(env)) {
    if (/^(E2E_|ANDROID_|MAESTRO_)/.test(key)) delete env[key]
  }
  Object.assign(env, { PATH: `${bin}:${process.env.PATH}`, HOME: root,
    E2E_WORK_DIR: path.join(root, 'work'), E2E_ARTIFACTS_DIR: path.join(root, 'artifacts'),
    E2E_CLEANUP_WAIT_SECONDS: '1', CALLS: path.join(root, 'calls'), DEVICES: path.join(root, 'devices') })
  fs.writeFileSync(env.DEVICES, '')
  const executable = (file, body) => fs.writeFileSync(file, `#!/usr/bin/env bash\nset -eu\n${body}\n`, { mode: 0o755 })
  const mock = (name, body) => executable(path.join(bin, name), body)
  const script = (name, body) => executable(path.join(e2e, name), body)
  mock('adb', `printf 'adb serial=%s %s\\n' "\${ANDROID_SERIAL:-}" "$*" >>"$CALLS"
if [[ "\${1:-}" == devices ]]; then printf 'List of devices attached\\n'; cat "$DEVICES"; exit; fi
serial="\${ANDROID_SERIAL:-}"; if [[ "\${1:-}" == -s ]]; then serial="$2"; shift 2; fi
case "\${1:-}" in
get-state) awk -v serial="$serial" '$1==serial && $2=="device" {print "device";found=1} END {exit !found}' "$DEVICES" ;;
shell) case "\${3:-}" in sys.boot_completed) echo 1 ;; ro.product.cpu.abi) echo x86_64 ;; ro.build.version.sdk) echo 36 ;; esac ;;
esac`)
  mock('curl', 'printf "curl %s\\n" "$*" >>"$CALLS"; exit "${CURL_STATUS:-0}"')
  mock('maestro', 'printf "maestro %s\\n" "$*" >>"$CALLS"; exit "${MAESTRO_STATUS:-0}"')
  for (const name of ['install-maestro.sh', 'start-metro.sh', 'prepare.sh', 'backend.sh']) script(name, `printf '${name} %s\\n' "$*" >>"$CALLS"`)
  const run = (body, extra = {}) => spawnSync('bash', ['-c', body], { cwd: root, env: { ...env, ...extra }, encoding: 'utf8', timeout: 8000 })
  return { root, e2e, env, run, mock, script, source: `source '${e2e}/lib.sh'`,
    calls: () => fs.existsSync(env.CALLS) ? fs.readFileSync(env.CALLS, 'utf8') : '',
    devices: value => fs.writeFileSync(env.DEVICES, value) }
}
const ok = result => assert.equal(result.status, 0, result.stderr || result.stdout || String(result.error))

for (const [url, port] of [['http://127.0.0.1:8888', '8888'], ['http://localhost:9999/', '9999'], ['http://localhost', '80']]) {
  test(`backend URL exports reverse port: ${url}`, t => {
    const f = fixture(t), result = f.run(`${f.source}; printf '%s' "$E2E_BACKEND_PORT"`, { E2E_BACKEND_URL: url })
    ok(result); assert.equal(result.stdout, port)
  })
}
for (const url of ['https://localhost:8888', 'http://10.0.2.2:8888', 'http://example.com', 'http://localhost.evil', 'http://user:pass@localhost', 'http://localhost/api', 'http://localhost?x=1', 'http://localhost#x', 'http://localhost:0', 'http://localhost:65536']) {
  test(`rejects unsupported backend URL: ${url}`, t => assert.equal(fixture(t).run(`source e2e/lib.sh`, { E2E_BACKEND_URL: url }).status, 1))
}
test('automatically loads ignored local defaults while explicit overrides win', t => {
  const f = fixture(t)
  fs.writeFileSync(path.join(f.e2e, '.env.local'), 'E2E_BACKEND_URL="${E2E_BACKEND_URL:-http://localhost:9001}"\n')
  const body = `${f.source}; printf '%s' "$E2E_BACKEND_URL"`
  const local = f.run(body); ok(local); assert.equal(local.stdout, 'http://localhost:9001')
  const explicit = f.run(body, { E2E_BACKEND_URL: 'http://localhost:9002' })
  ok(explicit); assert.equal(explicit.stdout, 'http://localhost:9002')
})
test('selects and exports the unique ready device', t => {
  const f = fixture(t); f.devices('usb\tdevice\nother\toffline\n')
  const result = f.run(`${f.source}; configure_android_serial; has_android_device; printf '%s|%s' "$E2E_ANDROID_SERIAL" "$ANDROID_SERIAL"`)
  ok(result); assert.equal(result.stdout, 'usb|usb')
})
test('multiple devices require an explicit selection', t => {
  const f = fixture(t); f.devices('one\tdevice\ntwo\tdevice\n')
  assert.equal(f.run(`${f.source}; configure_android_serial`).status, 1)
  ok(f.run(`${f.source}; configure_android_serial; has_android_device`, { E2E_ANDROID_SERIAL: 'two' }))
})
for (const state of ['missing', 'offline', 'unauthorized']) test(`rejects selected ${state} device despite another ready device`, t => {
  const f = fixture(t); f.devices(`other\tdevice\n${state === 'missing' ? '' : `wanted\t${state}\n`}`)
  assert.equal(f.run(`${f.source}; configure_android_serial`, { E2E_ANDROID_SERIAL: 'wanted' }).status, 1)
})
test('device wait is bounded', t => {
  const f = fixture(t), start = Date.now()
  assert.equal(f.run(`${f.source}; wait_android_device 1`, { E2E_ANDROID_SERIAL: 'missing' }).status, 1)
  assert.ok(Date.now() - start < 3000); assert.doesNotMatch(f.calls(), /wait-for-device/)
})
test('stuck commands are terminated at their deadline', t => {
  const f = fixture(t), start = Date.now()
  assert.equal(f.run(`${f.source}; run_with_timeout 1 sleep 30`).status, 124)
  assert.ok(Date.now() - start < 3000)
})
test('HTTP wait counts request time and bounds curl', t => {
  const f = fixture(t); f.mock('curl', 'printf "%s\\n" "$*" >>"$CALLS"; sleep 1; exit 1')
  const start = Date.now(); assert.equal(f.run(`${f.source}; wait_http http://localhost 2`).status, 1)
  assert.ok(Date.now() - start < 3500); assert.match(f.calls(), /--connect-timeout [12] --max-time [12]/)
})
for (const [extra, args] of [
  [{}, '--device emulator-5556'],
  [{ E2E_ADB_SERVER_PORT: '12345' }, '--host 127.0.0.1 --port 5557'],
  [{ E2E_MAESTRO_ADB_PORT: '6000' }, '--host 127.0.0.1 --port 6000'],
]) test(`Maestro selects exactly the requested device: ${args}`, t => {
  const f = fixture(t); f.devices('emulator-5554\tdevice\nemulator-5556\tdevice\n')
  const apk = path.join(f.root, 'test.apk'); fs.writeFileSync(apk, '')
  ok(f.run(`e2e/run-on-device.sh`, { ...extra, E2E_ANDROID_SERIAL: 'emulator-5556', E2E_APK: apk, E2E_BACKEND_URL: 'http://localhost:9999' }))
  assert.ok(f.calls().includes(`maestro ${args} test `)); assert.match(f.calls(), /reverse tcp:9999 tcp:9999/)
})
test('device test preserves Maestro failure status', t => {
  const f = fixture(t); f.devices('usb\tdevice\n'); const apk = path.join(f.root, 'test.apk'); fs.writeFileSync(apk, '')
  assert.equal(f.run('e2e/run-on-device.sh', { E2E_APK: apk, MAESTRO_STATUS: '7' }).status, 7)
})
test('cleanup terminates an owned process, but leaves reused services alone', async t => {
  const f = fixture(t), child = spawn(process.execPath, ['-e', 'console.log("ready"); setInterval(()=>{},1000)'], { stdio: ['ignore', 'pipe', 'ignore'] })
  t.after(() => child.kill('SIGKILL')); await once(child.stdout, 'data'); const exited = once(child, 'exit')
  ok(f.run(`${f.source}; printf '%s' '${child.pid}' >"$E2E_METRO_PID_FILE"; e2e/cleanup.sh`))
  await exited; assert.equal(fs.existsSync(path.join(f.env.E2E_WORK_DIR, 'metro.pid')), false)
  assert.doesNotMatch(f.calls(), /backend.sh stop|emu kill/)
})
test('cleanup only stops an owned backend, never an explicitly reused backend', t => {
  const f = fixture(t)
  ok(f.run(`${f.source}; touch "$E2E_BACKEND_OWNER_FILE"; e2e/cleanup.sh`, { E2E_USE_EXISTING_BACKEND: '1' }))
  assert.doesNotMatch(f.calls(), /backend.sh stop/); ok(f.run('e2e/cleanup.sh')); assert.match(f.calls(), /backend.sh stop/)
})
test('reusing a connected device does not acquire shutdown ownership', t => {
  const f = fixture(t); f.devices('usb\tdevice\n'); ok(f.run('e2e/start-emulator.sh; e2e/cleanup.sh'))
  assert.equal(fs.existsSync(path.join(f.env.E2E_WORK_DIR, 'emulator.pid')), false)
})
for (const [signal, status] of [['SIGTERM', 143], ['SIGINT', 130]]) test(`wrapper exits ${status} on ${signal} and cleans up once`, async t => {
  const f = fixture(t); f.devices('usb\tdevice\n'); const ready = path.join(f.root, 'ready')
  f.script('prepare.sh', `touch '${ready}'; sleep 0.4`); f.script('cleanup.sh', 'echo cleanup >>"$CALLS"')
  const child = spawn(path.join(f.e2e, 'android.sh'), [], { env: f.env, stdio: 'ignore' })
  t.after(() => child.kill('SIGKILL')); const exited = once(child, 'exit')
  for (let i = 0; i < 100 && !fs.existsSync(ready); i++) await new Promise(resolve => setTimeout(resolve, 20))
  assert.ok(fs.existsSync(ready)); child.kill(signal); assert.equal((await exited)[0], status)
  assert.equal((f.calls().match(/cleanup\n/g) || []).length, 1)
})
