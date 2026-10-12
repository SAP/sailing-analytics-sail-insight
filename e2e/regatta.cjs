#!/usr/bin/env node
// Server side of the two-device regatta E2E (e2e/regatta.sh).
//   invite  REGATTA_NAME  prints the invitation deep link the organizer's QR code encodes
//   verify  REGATTA_NAME  waits until the server has tracked R1 with both boats and prints a summary
//   sail    SERIAL:SPEED  [SERIAL:SPEED ...]  moves each emulator's GPS along the R1 course in real time
//   hold    SERIAL [SERIAL ...]   keeps the emulators' GPS south of the start line (until killed)
// Uses the organizer's own account (the E2E run's account) and public REST endpoints only.

const base = (process.env.E2E_BACKEND_URL || 'http://127.0.0.1:8888').replace(/\/$/, '')
const scheme = process.env.E2E_APP_SCHEME || 'orgsailyachtresearchsailinsight'

const call = async (path, { token, method = 'GET', form } = {}) => {
  const headers = {}
  let body
  if (token) headers.Authorization = `Bearer ${token}`
  if (form) { headers['Content-Type'] = 'application/x-www-form-urlencoded'; body = new URLSearchParams(form).toString() }
  const response = await fetch(`${base}${path}`, { method, headers, body })
  const text = await response.text()
  if (!response.ok) throw new Error(`${method} ${path}: HTTP ${response.status} ${text.slice(0, 200)}`)
  return text ? JSON.parse(text) : undefined
}

const login = async () => {
  const { access_token: token } = await call('/security/api/restsecurity/access_token', {
    method: 'POST', form: { username: process.env.E2E_USERNAME, password: process.env.E2E_PASSWORD },
  })
  return token
}

const trackedEvent = async (token, name) => {
  const { trackedEvents } = await call('/sailingserver/api/v1/trackedevents?includeArchived=true', { token })
  const event = trackedEvents.find(e => e.leaderboardName === name)
  if (!event) throw new Error(`Event ${name} not found among the organizer's events`)
  return event
}

// Same link as the organizer's QR code (SessionDetail qrCodeLink), with the app's URL scheme
// so it opens the installed dev app directly instead of the Branch web page.
const inviteLink = (event) => {
  const query = new URLSearchParams({ event_id: event.eventId, leaderboard_name: event.leaderboardName, secret: event.regattaSecret })
  const checkinUrl = `${base}/tracking/checkin?${query.toString()}`
  return `${scheme}://open?checkinUrl=${encodeURIComponent(checkinUrl)}`
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const leaderboard = (token, name) =>
  call(`/sailingserver/api/v2/leaderboards/${encodeURIComponent(name)}?raceDetails=ALL`, { token })

// R1 must be scored for both boats: both have a rank, and with WINNER (if set) first.
const verify = async (token, name, { timeoutMs = 300000, winner = process.env.E2E_REGATTA_WINNER } = {}) => {
  const deadline = Date.now() + timeoutMs
  let summary
  while (Date.now() < deadline) {
    const board = await leaderboard(token, name)
    summary = (board.competitors || []).map(c => {
      const r1 = (c.columns || {}).R1 || {}
      return {
        name: c.name, sailId: c.sailID, rank: r1.rank, trackedRank: r1.trackedRank,
        points: r1.totalPoints, finished: r1.finished, data: r1.data,
      }
    })
    const ranked = summary.filter(c => c.rank != null || c.trackedRank != null)
    if (summary.length >= 2 && ranked.length === summary.length && summary.every(c => c.finished)) {
      const first = [...summary].sort((a, b) => (a.rank ?? a.trackedRank) - (b.rank ?? b.trackedRank))[0]
      if (winner && first.name !== winner) throw new Error(`Expected ${winner} to win R1: ${JSON.stringify(summary)}`)
      return { race: 'R1', competitors: summary }
    }
    await sleep(5000)
  }
  throw new Error(`R1 was not scored for both boats in time: ${JSON.stringify(summary)}`)
}

// --- simulated sailing ----------------------------------------------------
// R1: from south of the start line (54.348 N) up to the windward mark W
// (54.356 N, 10.1515 E), round it and back across the line.
// Boats start and finish side by side (offset) but round W the same way: west of
// it going up, across its north side, east of it going down.
const course = (offset) => [
  [54.3460, 10.1505 + offset], [54.3500, 10.1512], [54.3565, 10.1512],
  [54.3566, 10.1520], [54.3500, 10.1518], [54.3460, 10.1518 + offset],
]
const metersBetween = ([lat1, lon1], [lat2, lon2]) => {
  const rad = Math.PI / 180
  const x = (lon2 - lon1) * rad * Math.cos(((lat1 + lat2) / 2) * rad)
  return Math.hypot(x, (lat2 - lat1) * rad) * 6371000
}

// The emulator console (localhost:<even port>) sets the device's own GPS, which the
// tracking library uses. Its greeting names the auth token file.
const consoleFor = async (serial) => {
  const net = require('net')
  const fs = require('fs')
  const port = Number(String(serial).replace(/^emulator-/, ''))
  if (!Number.isInteger(port)) throw new Error(`Not an emulator serial: ${serial}`)
  const socket = net.connect(port, '127.0.0.1')
  let buffer = ''
  socket.on('data', (data) => { buffer += data.toString() })
  await new Promise((resolve, reject) => { socket.once('connect', resolve); socket.once('error', reject) })
  for (let i = 0; i < 50 && !/OK\r?\n/.test(buffer); i++) await sleep(100)
  const tokenFile = (buffer.match(/'([^']*emulator_console_auth_token)'/) || [])[1]
  if (tokenFile) socket.write(`auth ${fs.readFileSync(tokenFile, 'utf8').trim()}\r\n`)
  return {
    fix: ([lat, lon], knots) => socket.write(`geo fix ${lon.toFixed(6)} ${lat.toFixed(6)} 0 8 ${knots.toFixed(1)}\r\n`),
    close: () => socket.end('quit\r\n'),
  }
}

const sailBoat = async (serial, speed, offset) => {
  const emulator = await consoleFor(serial)
  const points = course(offset)
  const knots = speed * 1.943844
  for (let i = 0; i < points.length - 1; i++) {
    const [from, to] = [points[i], points[i + 1]]
    const steps = Math.max(1, Math.round(metersBetween(from, to) / speed))
    for (let step = 0; step < steps; step++) {
      const t = step / steps
      emulator.fix([from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t], knots)
      await sleep(1000)
    }
  }
  // Stay a little beyond the finish so the last fixes are uploaded.
  for (let i = 0; i < 20; i++) { emulator.fix(points[points.length - 1], 0); await sleep(1000) }
  emulator.close()
}

const main = async () => {
  const [command, name, ...more] = process.argv.slice(2)
  if (!name) throw new Error('Usage: regatta.cjs invite|verify|dump REGATTA_NAME | sail SERIAL:SPEED...')
  if (command === 'hold') {
    // Before tracking starts the device must already be near the course: the tracking
    // library rejects later fixes as a "teleport" from the emulator's default location.
    const consoles = await Promise.all([name, ...more].map(consoleFor))
    for (;;) {
      consoles.forEach((emulator, i) => emulator.fix(course(i * 0.0006)[0], 0))
      await sleep(2000)
    }
  }
  if (command === 'sail') {
    await Promise.all([name, ...more].map((arg, i) => {
      const [serial, speed] = arg.split(':')
      return sailBoat(serial, Number(speed), i * 0.0006)
    }))
    return
  }
  const token = await login()
  if (command === 'invite') console.log(inviteLink(await trackedEvent(token, name)))
  else if (command === 'verify') console.log(JSON.stringify(await verify(token, name), null, 2))
  else if (command === 'dump') console.log(JSON.stringify(await leaderboard(token, name), null, 2))
  else throw new Error(`Unknown command ${command}`)
}

if (require.main === module) {
  main().catch((error) => { console.error(`[e2e] regatta: ${error.message}`); process.exit(1) })
}

module.exports = { inviteLink }
