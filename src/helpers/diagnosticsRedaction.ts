const REDACTED = '[REDACTED]'

// Only credentials and actual personal/device fields. Event, race, boat and
// regatta identifiers remain useful support context; GPS exports are separate.
const sensitiveKey = /^(?:password|passwd|access_?token|refresh_?token|token|authorization|cookie|set-cookie|secret|api_?key|username|email|fullName|firstName|lastName|phone|device_?(?:id|uuid)|user_?(?:id|uuid))$/i

const sanitizeDiagnosticText = (text: string): string => text
  .replace(/([a-z][a-z0-9+.-]*:\/\/)[^\s/@]+@/gi, `$1${REDACTED}@`)
  .replace(/((?:["']?)(?:password|passwd|access_?token|refresh_?token|token|authorization|cookie|secret|api_?key|username|email|fullName|device_?(?:id|uuid)|user_?(?:id|uuid))(?:["']?)\s*[:=]\s*)(?:"(?:[^"\\]|\\.)*"|'[^']*'|[^\s,;&}\n]+)/gi,
    `$1"${REDACTED}"`)
  .replace(/\b(Basic|Bearer)\s+[^\s,"'\\]+/gi, `$1 ${REDACTED}`)
  .replace(/\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g, REDACTED)
  .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, REDACTED)
  .replace(/([?&])([^=&#\s]+)=([^&#\s]*)/g, (match, separator, key) => {
    let decoded = key
    try { decoded = decodeURIComponent(key) } catch (_) { /* Keep malformed URL keys. */ }
    return sensitiveKey.test(decoded) ? `${separator}${key}=${REDACTED}` : match
  })

/** Detach and sanitize at diagnostic boundaries, not at every UI/copy step. */
export const sanitizeDiagnostic = (input: any): any => {
  const seen = new WeakSet<object>()
  const visit = (value: any, depth = 0): any => {
    if (depth > 8) return '[Diagnostic limit]'
    if (typeof value === 'string') {
      const text = value.slice(0, 64 * 1024)
      // Backend exceptions sometimes contain a JSON response as their message.
      if (/^\s*[\[{]/.test(text)) {
        try { return visit(JSON.parse(text), depth + 1) } catch (_) { /* Plain text below. */ }
      }
      return sanitizeDiagnosticText(text)
    }
    if (!value || typeof value !== 'object') return value
    if (seen.has(value)) return '[Circular]'
    seen.add(value)
    const result: any = Array.isArray(value) ? [] : {}
    if (value instanceof Error) {
      result.name = value.name
      result.message = visit(value.message, depth + 1)
      result.stack = visit(value.stack, depth + 1)
    }
    Object.keys(value).slice(0, 100).forEach(key => {
      if (key === '__proto__' || key === 'constructor' || key === 'toJSON') return
      result[key] = sensitiveKey.test(key) ? REDACTED : visit(value[key], depth + 1)
    })
    return result
  }
  try { return visit(input) } catch (_) { return '[Unavailable diagnostic]' }
}

export const serializeDiagnostic = (value: any): string => {
  // API bodies/messages may echo user input. Logs/Crashlytics need request
  // context only; the UI formats the original response through getErrorDetails.
  if (value instanceof Error && (value as any).status) {
    const error = value as any
    value = { name: error.name, status: error.status, method: error.method, url: error.url }
  }
  const safe = sanitizeDiagnostic(value)
  if (typeof safe === 'string') return safe
  try { return JSON.stringify(safe) || String(safe) } catch (_) { return '[Unavailable diagnostic]' }
}
