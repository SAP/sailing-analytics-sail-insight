import { isString } from 'lodash'
import querystring from 'query-string'

import { Signer, tokenSigner } from 'api/authorization'
import { BodyType, HttpMethods } from 'api/config'
import { DEV_MODE, isPlatformAndroid } from 'environment'
import Logger from 'helpers/Logger'


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
}

const getBody = (type: BodyType, body: any) => {
  switch (type) {
    case 'x-www-form-urlencoded':
      return querystring.stringify(body)
    default:
      return JSON.stringify(body)
  }
}

const getHeaders = async (url: string, method: string, body: any, bodyType: BodyType, signer?: Signer) => {
  const headers = {
    ...DEFAULT_HEADERS,
    'Content-Type': bodyType === 'x-www-form-urlencoded' ?
      'application/x-www-form-urlencoded;charset=UTF-8' :
      'application/json',
  }
  return signer ? await signer({ body, url, method, headers }) : headers
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
    timeout = 5000,
  } = options

  const data = body && { body: getBody(bodyType, body) }
  const fetchOptions = {
    method,
    timeout,
    headers: await getHeaders(url, method, body, bodyType, signer),
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
