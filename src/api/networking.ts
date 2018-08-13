
import { DEV_MODE } from 'helpers/environment'
import Logger from 'helpers/Logger'


const DEFAULT_HEADERS = {
  // Accept: 'application/json',
  'Content-Type': 'application/json',
  // 'Cache-Control': 'no-cache',
}

const defaultSignedHeaders = (url: string, method: string, headers: any, body?: any) => headers

// eslint-disable-next-line import/prefer-default-export
export const request = async (url: any, { method = 'GET', signer = defaultSignedHeaders, body = null } = {}) => {
  const data = body ? { body: JSON.stringify(body) } : {}
  const fetchOptions = {
    method,
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
