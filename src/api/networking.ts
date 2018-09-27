import { isString } from 'lodash'

import { DEV_MODE, isPlatformAndroid } from 'helpers/environment'
import Logger from 'helpers/Logger'


const DEFAULT_HEADERS = {
  // Accept: 'application/json',
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

export interface SignerOptions {
  url?: string,
  method?: string,
  headers?: any,
  body?: any
}
export interface RequestOptions {
  method?: string
  signer?: Signer
  body?: any,
}
export type Signer = (data: SignerOptions) => any

const defaultSignedHeaders: Signer = (options: SignerOptions) => options.headers

export const request = async (
  url: any,
  { method = 'GET', signer = defaultSignedHeaders, body = null }: RequestOptions = {},
) => {
  const data = body ? { body: JSON.stringify(body) } : {}
  const fetchOptions = {
    method,
    // headers: getPlatformHeaders(await signer(url, method, DEFAULT_HEADERS, data.body)),
    headers: await signer({ url, method, headers: DEFAULT_HEADERS, body: data.body }),
    ...data,
  }
  let response
  try {
    response = await fetch(
      url,
      fetchOptions,
    )
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
    }
  }
  return response
}
