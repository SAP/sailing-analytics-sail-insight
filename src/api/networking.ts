
import { DEV_MODE } from 'helpers/environment'
import Logger from 'helpers/Logger'
import { isString } from 'lodash'
import { Platform } from 'react-native'


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
  if (Platform.OS !== 'android' || !isString(contentType) || contentType.includes('charset')) {
    return headers
  }
  return {
    ...headers,
    'Content-Type': `${contentType}; charset=utf-8`,
  }
}

const defaultSignedHeaders = (url: string, method: string, headers: any, body?: any) => headers

// eslint-disable-next-line import/prefer-default-export
export const request = async (url: any, { method = 'GET', signer = defaultSignedHeaders, body = null } = {}) => {
  const data = body ? { body: JSON.stringify(body) } : {}
  const fetchOptions = {
    method,
    // headers: getPlatformHeaders(await signer(url, method, DEFAULT_HEADERS, data.body)),
    headers: await signer(url, method, DEFAULT_HEADERS, data.body),
    ...data,
  }
  let response
  try {
    // eslint-disable-next-line no-undef
    response = await fetch(
      url,
      fetchOptions,
    )
  } catch (err) {
    throw err
  } finally {
    if (DEV_MODE) {
      Logger.groupedDebug(
        `${(response && response.status) || 'ERR'}: ${fetchOptions.method} ${url}`,
        {
          data,
          body,
          response,
          method: fetchOptions.method,
          headers: fetchOptions.headers,
        },
      )
    }
  }
  return response
}
