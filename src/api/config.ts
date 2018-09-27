import querystring from 'query-string'


const API_ROOT = 'https://my.sapsailing.com'
const API_SUFFIX_SECURITY = '/security/api/restsecurity'
const API_SUFFIX = '/sailingserver/api/v1'

const getPathWithParams = (path: string, params?: any) => {
  if (!params) {
    return path
  }
  return `${path}?${querystring.stringify(params)}`
}


export const urlGenerator = (apiRoot?: string, apiSuffix?: string) => (path: string, params?: any) =>
  `${apiRoot || API_ROOT}${apiSuffix || API_SUFFIX}${getPathWithParams(path, params)}`

export const getSecurityUrl = urlGenerator(API_ROOT, API_SUFFIX_SECURITY)
