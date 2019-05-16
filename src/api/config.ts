import * as _ from 'lodash'
import querystring from 'query-string'
import format from 'string-format'

import { AUTH_API_PREFIX, DATA_API_PREFIX, DATA_API_V2_PREFIX, RACE_API_PREFIX } from 'environment'
import { DEFAULT_SERVER_URL } from '../environment/init'
import { getServerUrlSetting } from '../selectors/settings'
import { getStore } from '../store'


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
  let serverUrl = getServerUrlSetting(getStore().getState())
  if (!serverUrl) {
    serverUrl = DEFAULT_SERVER_URL
  }
  return serverUrl
}
