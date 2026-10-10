/* tslint:disable:no-console no-empty */
import { DEV_MODE } from 'environment'
import { serializeDiagnostic } from './diagnosticsRedaction'
import { writePersistentLog } from './PersistentLog'

const log = (level: 'INFO' | 'WARN' | 'ERROR', method: (...args: any[]) => void, persist: boolean) => (...args: any[]) => {
  try {
    const safe = args.slice(0, 32).map(serializeDiagnostic)
    if (persist) void writePersistentLog(level, ...safe)
    if (DEV_MODE || level === 'INFO' && persist) method(...safe)
  } catch (_) { /* Diagnostics must not interrupt application work. */ }
}

export default {
  log: log('INFO', console.log, true),
  warn: log('WARN', console.warn, true),
  error: log('ERROR', console.error, true),
  debug: DEV_MODE ? log('INFO', console.log, false) : () => {},
}
