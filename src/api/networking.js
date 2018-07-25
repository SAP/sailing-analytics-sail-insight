
import Logger from 'helpers/Logger'
import { DEV_MODE } from 'helpers/environment'


const DEFAULT_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'Cache-Control': 'no-cache',
}

const defaultSignedHeaders = (url, method, headers) => headers

// eslint-disable-next-line import/prefer-default-export
export const request = async (url, { method = 'GET', signer = defaultSignedHeaders, body } = {}) => {
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
        `${response?.status || 'ERR'}: ${fetchOptions.method} ${url}`,
        {
          method: fetchOptions.method,
          headers: fetchOptions.headers,
          body,
          response,
        },
      )
    }
  }
  return response
}
