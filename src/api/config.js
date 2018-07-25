let apiRoot = 'https://dev.sapsailing.com'
const ApiSuffix = '/api/v1'


export const getUrl = path => `${apiRoot}${ApiSuffix}${path}`

export const setApiRoot = (url) => {
  apiRoot = url
}
