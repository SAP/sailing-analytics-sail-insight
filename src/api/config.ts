import querystring from 'query-string'
import format from 'string-format'

import { AUTH_API_PREFIX, DATA_API_PREFIX, DATA_API_V2_PREFIX, RACE_API_PREFIX, SERVER_URL } from 'environment'


export const getPathWithParams = (path: string, urlOptions?: UrlOptions) => {
  if (!urlOptions) {
    return path
  }
  let generatedPath = path
  if (urlOptions.pathParams) {
    for (let key in urlOptions.pathParams) {
      urlOptions.pathParams[key] = encodeURIComponent(urlOptions.pathParams[key])
    }
    generatedPath = format(path, ...urlOptions.pathParams)
  }
  return urlOptions.urlParams ?
    `${generatedPath}?${querystring.stringify(urlOptions.urlParams)}` :
    generatedPath
}


export interface UrlOptions {
  urlParams?: any
  pathParams?: string[]
}

export const urlGenerator = (apiRoot: string, apiSuffix: string) => (path: string) => (options?: UrlOptions) =>
  `${apiRoot}${apiSuffix}${getPathWithParams(path, options)}`

export const getDataApiGenerator = (serverUrl?: string) => urlGenerator(serverUrl || SERVER_URL, DATA_API_PREFIX)
export const getDataApiV2Generator = (serverUrl: string) => urlGenerator(serverUrl || SERVER_URL, DATA_API_V2_PREFIX)
export const getRaceApiGenerator = (serverUrl: string) => urlGenerator(serverUrl || SERVER_URL, RACE_API_PREFIX)
export const getAssetApiGenerator = (serverUrl?: string) => urlGenerator(serverUrl || SERVER_URL, '')

export const getSecurityUrl = urlGenerator(SERVER_URL, AUTH_API_PREFIX)


export const HttpMethods = {
  POST: 'POST',
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE',
}

export type BodyType = 'x-www-form-urlencoded' | 'json'

export const getApiServerUrl = () => SERVER_URL
