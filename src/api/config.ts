import * as _ from 'lodash'
import querystring from 'query-string'
import format from 'string-format'

import { AUTH_API_PREFIX, DATA_API_PREFIX, DATA_API_V2_PREFIX, RACE_API_PREFIX, SHARED_DATA_API_PREFIX } from 'environment'
import { DEFAULT_SERVER_URL } from '../environment/init'
import { getServerUrlSetting } from '../selectors/settings'
import { getStore } from '../store'


// This override is deliberately unavailable to production bundles.
const getE2EBackendUrl = () => {
  const backendUrl = __DEV__ ? process.env.E2E_BACKEND_URL : undefined
  if (!backendUrl) {
    return undefined
  }

  const normalizedUrl = backendUrl.replace(/\/+$/, '')
  if (!/^http:\/\/(127\.0\.0\.1|localhost|10\.0\.2\.2)(:\d+)?$/.test(normalizedUrl)) {
    throw new Error(`E2E_BACKEND_URL must point to a loopback HTTP server, got: ${backendUrl}`)
  }
  return normalizedUrl
}

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

  const urlParams = _.omitBy(urlOptions.urlParams, _.isUndefined)
  if (urlParams && !_.isEmpty(urlParams)) {
    return `${generatedPath}?${querystring.stringify(urlParams)}`
  }
  return generatedPath
}


export interface UrlOptions {
  urlParams?: any
  pathParams?: string[]
}

export const urlGenerator = (apiRoot: string, apiSuffix: string) => (path: string) => (options?: UrlOptions) =>
  `${apiRoot}${apiSuffix}${getPathWithParams(path, options)}`

export const getDataApiGenerator = (serverUrl: string) => urlGenerator(serverUrl , DATA_API_PREFIX)
export const getSharedDataApiGenerator = (serverUrl: string) => urlGenerator(serverUrl , SHARED_DATA_API_PREFIX)
export const getDataApiV2Generator = (serverUrl: string) => urlGenerator(serverUrl, DATA_API_V2_PREFIX)
export const getRaceApiGenerator = (serverUrl: string) => urlGenerator(serverUrl, RACE_API_PREFIX)
export const getAssetApiGenerator = (serverUrl: string) => urlGenerator(serverUrl, '')

export const getSecurityGenerator = (serverUrl: string) => urlGenerator(serverUrl, AUTH_API_PREFIX)


export const HttpMethods = {
  POST: 'POST',
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE',
}

export type BodyType = 'x-www-form-urlencoded' | 'json' | 'image'

export const getApiServerUrl = () => {
  const e2eBackendUrl = getE2EBackendUrl()
  if (e2eBackendUrl) {
    return e2eBackendUrl
  }

  let serverUrl = getServerUrlSetting(getStore().getState())
  if (!serverUrl) {
    serverUrl = DEFAULT_SERVER_URL
  }
  return serverUrl
}
