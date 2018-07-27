let apiRoot = 'https://d-labs.sapsailing.com/sailingserver'
const ApiSuffix = '/api/v1'


export const getUrl = path => `${apiRoot}${ApiSuffix}${path}`

export const setApiRoot = (url) => {
  apiRoot = url
}
