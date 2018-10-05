import querystring from 'query-string'
import format from 'string-format'


const SERVER_URL = 'https://d-labs.sapsailing.com'
const API_SUFFIX_SECURITY = '/security/api/restsecurity'
const API_SUFFIX = '/sailingserver/api/v1'

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
  `${apiRoot || SERVER_URL}${apiSuffix || API_SUFFIX}${getPathWithParams(path, options)}`

export const getSecurityUrl = urlGenerator(SERVER_URL, API_SUFFIX_SECURITY)

export const HttpMethods = {
  POST: 'POST',
  GET: 'GET',
  PUT: 'PUT',
  DELETE: 'DELETE',
}

export type BodyType = 'x-www-form-urlencoded' | 'json'

export const getApiServerUrl = () => SERVER_URL
