import { isString } from 'lodash'
import querystring from 'query-string'
import { compose, includes, prop, __, when, mergeRight } from 'ramda'

import { Signer, tokenSigner } from 'api/authorization'
import { BodyType, HttpMethods } from 'api/config'
import { DEV_MODE, isPlatformAndroid } from 'environment'
import Logger from 'helpers/Logger'
import crashlytics from '@react-native-firebase/crashlytics'

const responseHasFatalError = compose(
  includes(__, [400, 404, 405]),
  prop('status'))

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

const timeoutPromise = (promise: Promise<Response>, timeout: number, error: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => { reject(error) }, timeout)
    promise.then(resolve, reject)
  })
}

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

  let headers = await getHeaders(url, method, body, bodyType, signer)

  const fetchOptions = {
    method,
    timeout,
    headers: mergeRight(headers, options.headers),
    credentials: 'omit',
    ...data,
  }
  let response
  try {
    response = await timeoutPromise(fetch(url, fetchOptions), timeout, 'Server request timeout');
  } catch (err) {
    throw err
  } finally {
    if (DEV_MODE) {
      const headers = fetchOptions.headers
      Logger.groupedDebug(
        `${(response && response.status) || 'ERR'}: ${fetchOptions.method} ${url}`,
        {
          data,
          headers,
          method,
          body,
          response,
        },
      )
    } else {
      when(responseHasFatalError, async (response: any) => {
        const error = await response.clone().text()
        crashlytics().setAttribute('status', response.status.toString())
        crashlytics().setAttribute('url', response.url)
        crashlytics().recordError(new Error(error))
      })(response)
    }
  }
  return response
}
