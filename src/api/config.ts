import querystring from 'query-string'
import format from 'string-format'

import { AUTH_API_PREFIX, DATA_API_PREFIX, SERVER_URL } from 'environment'


const getPathWithParams = (path: string, urlOptions?: UrlOptions) => {
  if (!urlOptions) {
    return path
  }
  let generatedPath = path
  if (urlOptions.pathParams) {
    generatedPath = escape(format(path, ...urlOptions.pathParams))
  }
  return urlOptions.urlParams ?
    `${generatedPath}?${querystring.stringify(urlOptions.urlParams)}` :
    generatedPath
}


export interface UrlOptions {
  urlParams?: any
  pathParams?: string[]
}

export const urlGenerator = (apiRoot?: string, apiSuffix?: string) => (path: string) => (options?: UrlOptions) =>
  `${apiRoot || SERVER_URL}${apiSuffix || DATA_API_PREFIX}${getPathWithParams(path, options)}`

export const getSecurityUrl = urlGenerator(SERVER_URL, AUTH_API_PREFIX)

export const HttpMethods = {
  POST: 'POST',
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE',
}

export type BodyType = 'x-www-form-urlencoded' | 'json'

export const getApiServerUrl = () => SERVER_URL
