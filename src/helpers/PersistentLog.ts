import { Buffer } from 'buffer'
import { Platform } from 'react-native'

export type PersistentLogLevel = 'INFO' | 'WARN' | 'ERROR'
const MAX_LINE_BYTES = 16 * 1024
const RETENTION_DAYS = 14
const MAX_TOTAL_BYTES = 25 * 1024 * 1024
const MAX_COPY_BYTES = 256 * 1024
const MAX_PENDING_BYTES = 512 * 1024
const DAY_MS = 24 * 60 * 60 * 1000
const OWN_FILE = /^sail-insight-\d{4}-\d{2}-\d{2}\.log$/
let rnfs: any
const getRNFS = () => {
  if (!rnfs) {
    const module = require('react-native-fs')
    rnfs = module.default || module
  }
  return rnfs
}
// Android: app-specific external storage (Android/data/<app id>/files), reachable over USB
// without any permission. iOS: Documents, shown in the Files app (UIFileSharingEnabled).
const baseDirectory = (): string => (Platform.OS === 'android' && getRNFS().ExternalDirectoryPath) ||
  getRNFS().DocumentDirectoryPath
export const persistentLogDirectory = () => `${baseDirectory()}/sail-insight-logs`
const directory = persistentLogDirectory
let queue: Promise<any> = Promise.resolve()
let initialized = false
let writesSinceCleanup = 0
let pendingBytes = 0
let nativeBusy = false

const prefix = (source: string, bytes: number): string => {
  const buffer = Buffer.from(source, 'utf8')
  if (buffer.length <= bytes) return source
  let end = bytes
  while (end > 0 && (buffer[end] & 0xc0) === 0x80) end--
  return Buffer.from(buffer.subarray(0, end)).toString('utf8')
}
const tail = (source: string, bytes: number): string => {
  const buffer = Buffer.from(source, 'utf8')
  let start = Math.max(0, buffer.length - bytes)
  while (start < buffer.length && (buffer[start] & 0xc0) === 0x80) start++
  return Buffer.from(buffer.subarray(start)).toString('utf8')
}
const fileTime = (file: any): number => {
  const datedName = new Date(file.name.slice('sail-insight-'.length, -4)).getTime()
  const modified = new Date(file.mtime || datedName).getTime()
  return Number.isFinite(datedName) ? Math.min(datedName, modified) : modified
}
const expired = (file: any): boolean => fileTime(file) < Date.now() - RETENTION_DAYS * DAY_MS
const ownedFiles = async (): Promise<any[]> => (await getRNFS().readDir(directory()))
  .filter((file: any) => file.isFile() && OWN_FILE.test(file.name))

// Disk cleanup is best effort: failures must neither break the app nor count as deleted bytes.
const cleanup = async () => {
  try {
    for (const file of await ownedFiles()) {
      if (expired(file)) await getRNFS().unlink(file.path).catch(() => undefined)
    }
    const files = (await ownedFiles()).sort((a, b) => fileTime(a) - fileTime(b))
    let total = files.reduce((size, file) => size + Number(file.size || 0), 0)
    for (const file of files) {
      if (total <= MAX_TOTAL_BYTES) break
      try {
        await getRNFS().unlink(file.path)
        total -= Number(file.size || 0)
      } catch (_) { /* Keep trying other files; this file still occupies disk space. */ }
    }
  } catch (_) { /* Diagnostics must never affect app behavior. */ }
}

const initialize = async (): Promise<boolean> => {
  if (initialized) return true
  try {
    await getRNFS().mkdir(directory(), Platform.OS === 'ios' ? { NSURLIsExcludedFromBackupKey: true } : undefined)
    await cleanup()
    initialized = true
    return true
  } catch (_) { return false }
}

// At most one SDK call is outstanding. A stalled SDK cannot block files, export or clearing,
// and cannot accumulate a native promise/line for every app log. Its retention is independent.
const deliverNative = (level: PersistentLogLevel, line: string) => {
  if (nativeBusy) return
  nativeBusy = true
  void Promise.resolve().then(() => {
    const module = require('react-native-background-geolocation')
    const logger = (module.default || module).logger
    const method = logger && logger[level.toLowerCase()]
    return method ? method.call(logger, line) : undefined
  }).catch(() => undefined).then(() => { nativeBusy = false })
}

// Logger supplies sanitized strings; storage does not sanitize them again.
export const writePersistentLog = (level: PersistentLogLevel, ...args: string[]): Promise<void> => {
  // A bounded queue drops diagnostics, never application work, when storage cannot keep up.
  if (pendingBytes >= MAX_PENDING_BYTES) return Promise.resolve()
  const timestamp = new Date().toISOString()
  let line = `${timestamp} [${level}]`
  for (let i = 0; i < Math.min(args.length, 32); i++) {
    line += ` ${args[i]}`
    if (Buffer.byteLength(line, 'utf8') >= MAX_LINE_BYTES) break
  }
  const marker = ' [TRUNCATED]'
  if (args.length > 32 || Buffer.byteLength(line, 'utf8') + 1 > MAX_LINE_BYTES) {
    line = prefix(line, MAX_LINE_BYTES - Buffer.byteLength(marker, 'utf8') - 1) + marker
  }
  const bytes = Buffer.byteLength(line, 'utf8') + 1
  if (pendingBytes + bytes > MAX_PENDING_BYTES) return Promise.resolve()
  pendingBytes += bytes
  deliverNative(level, line)
  queue = queue.then(async () => {
    try {
      if (!(await initialize())) return
      const path = `${directory()}/sail-insight-${timestamp.slice(0, 10)}.log`
      await getRNFS().appendFile(path, `${line}\n`, 'utf8')
      if (++writesSinceCleanup >= 200) {
        writesSinceCleanup = 0
        await cleanup()
      }
    } catch (_) { /* Non-fatal and intentionally silent. */ }
    finally { pendingBytes -= bytes }
  }).catch(() => undefined)
  return queue
}

const readTail = async (file: any, budget: number): Promise<{ text: string, bytes: number }> => {
  let size = Number(file.size)
  if (!Number.isFinite(size) && getRNFS().stat) size = Number((await getRNFS().stat(file.path)).size)
  if (!Number.isFinite(size) || size < 0) return { text: '[Diagnostic tail unavailable]\n', bytes: budget }
  const bytes = Math.min(size, budget)
  const offset = Math.max(0, size - bytes)
  let text: string
  if (getRNFS().read) {
    const data = await getRNFS().read(file.path, bytes, offset, 'base64')
    text = Buffer.from(Buffer.from(data, 'base64').subarray(0, bytes)).toString('utf8')
  } else return { text: '[Diagnostic tail unavailable]\n', bytes: budget }
  if (offset > 0) {
    // Omit the whole partial record, including multiline credentials whose
    // key may precede the tail. App records begin with a dated level marker.
    const record = /(?:^|\n)(\d{4}-\d\d-\d\dT[^\s]+ \[(?:INFO|WARN|ERROR)\])/.exec(text)
    text = record ? text.slice(record.index + (text[record.index] === '\n' ? 1 : 0)) : '[Partial diagnostic omitted]\n'
  }
  return { text: tail(text, budget), bytes }
}

/** Recent app-owned diagnostics, UTF-8 capped. Disk deletion is best effort. */
export const readPersistentLogs = async (): Promise<string> => {
  await queue
  if (!(await initialize())) throw new Error('Diagnostic log storage is unavailable')
  await cleanup()
  const files = (await ownedFiles()).filter(file => !expired(file)).sort((a, b) => b.name.localeCompare(a.name))
  const chunks: string[] = []
  let bytes = 0
  for (const file of files) {
    const remaining = MAX_COPY_BYTES - bytes
    if (remaining <= 0) break
    const chunk = await readTail(file, remaining)
    chunks.unshift(chunk.text)
    bytes += chunk.bytes
  }
  return tail(chunks.join(''), MAX_COPY_BYTES)
}
