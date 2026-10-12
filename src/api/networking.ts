import { isString } from 'lodash'
import querystring from 'query-string'
import { mergeRight } from 'ramda'

import { Signer, tokenSigner } from 'api/authorization'
import { BodyType, HttpMethods } from 'api/config'
import NetworkTimeoutException from 'api/NetworkTimeoutException'
import { DEV_MODE, isPlatformAndroid } from 'environment'
import Logger from 'helpers/Logger'
import { serializeDiagnostic } from 'helpers/diagnosticsRedaction'
import crashlytics from '@react-native-firebase/crashlytics'

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Cache-Control': 'no-cache',
}

/**
 * Platform specific headers update because RN appends charset in Android HTTP client,
 * the charset has to be appended before signing otherwise SignatureDoesNotMatch occurs
 *
 * https://github.com/facebook/react-native/issues/14445
 * @param {http headers} headers
 */
const getPlatformHeaders = (headers: any = {}) => {
  const contentType = headers && headers['Content-Type']
  if (isPlatformAndroid || !isString(contentType) || contentType.includes('charset')) {
    return headers
  }
  return {
    ...headers,
    'Content-Type': `${contentType}; charset=utf-8`,
  }
}

export interface RequestOptions {
  method?: string
  signer?: Signer
  body?: any,
  bodyType?: BodyType,
  timeout?: number,
  headers?: any
}

const getBody = (type: BodyType, body: any) => {
  switch (type) {
    case 'x-www-form-urlencoded':
      return querystring.stringify(body)
    case 'image':
      return body
    default:
      return JSON.stringify(body)
  }
}

const getHeaders = async (url: string, method: string, body: any, bodyType: BodyType, signer?: Signer) => {
  let contentType = 'application/json'
  if (bodyType === 'x-www-form-urlencoded') {
    contentType = 'application/x-www-form-urlencoded;charset=UTF-8'
  } else if (bodyType === 'image') {
    contentType = 'image/jpeg'
  }
  const headers = {
    ...DEFAULT_HEADERS,
    'Content-Type': contentType,
  }
  return signer ? await signer({ body, url, method, headers }) : headers
}

const timeoutPromise = (
  promise: Promise<Response>,
  timeout: number,
  error: string,
  controller?: AbortController,
) => {
  return new Promise((resolve, reject) => {
    // A typed exception (not a plain string) so getErrorDisplayMessage can
    // recognize timeouts and show the network alert instead of plain "Oops".
    const timer = setTimeout(() => {
      reject(NetworkTimeoutException.create(error))
      // stop the abandoned request instead of letting it run in the background
      controller && controller.abort()
    }, timeout)
    promise.then(resolve, reject).finally(() => clearTimeout(timer))
  })
}

const isGpsFixUpload = (url: any) => isString(url) && /\/api\/v1\/gps_fixes(?:\?|$)/.test(url)

export const request = async (
  url: any,
  options: RequestOptions = {},
  ) => {
  const {
    method = HttpMethods.GET,
    body = null,
    bodyType = 'json',
    signer = tokenSigner,
    timeout = 10000,
  } = options

  const data = body && { body: getBody(bodyType, body) }

  const startedAt = Date.now()
  let response: Response
  try {
    const headers = await getHeaders(url, method, body, bodyType, signer)
    const controller = new AbortController()
    const fetchOptions = {
      method,
      signal: controller.signal,
      timeout,
      headers: mergeRight(headers, options.headers),
      credentials: 'omit',
      ...data,
    }
    response = await timeoutPromise(fetch(url, fetchOptions), timeout, 'Server request timeout', controller) as Response
  } catch (error) {
    Logger.error('Network request failed', {
      failureType: error instanceof Error ? error.name : 'NetworkError', method, url, durationMs: Date.now() - startedAt,
    })
    throw error
  }

  if (response.ok) {
    // Every API call is logged for support; successful GPS fix uploads are too frequent
    // and are covered by the separate GPS log.
    if (!isGpsFixUpload(url)) {
      Logger.log(`API ${method} ${url} ${response.status} ${Date.now() - startedAt}ms`)
    }
  } else {
    Logger.error('HTTP request failed', {
      failureType: 'HttpError', status: response.status, method, url: response.url || url,
      durationMs: Date.now() - startedAt,
    })
    if (!DEV_MODE && [400, 404, 405].includes(response.status)) {
      // Crashlytics SDK calls may reject asynchronously; diagnostics must not create an
      // unhandled rejection or interfere with the request's HTTP response.
      void Promise.resolve().then(async () => {
        await crashlytics().setAttribute('status', String(response.status))
        await crashlytics().setAttribute('url', serializeDiagnostic(response.url || url))
        await crashlytics().recordError(new Error(`HTTP ${response.status}`))
      }).catch(() => undefined)
    }
  }
  return response
}
