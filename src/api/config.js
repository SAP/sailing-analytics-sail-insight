import Logger from 'helpers/Logger'


let apiRoot = 'https://d-labs.sapsailing.com'
const ApiSuffix = '/sailingserver/api/v1'


export const getUrl = path => `${apiRoot}${ApiSuffix}${path}`

export const setApiRoot = (url) => {
  apiRoot = url
  Logger.debug(`SET TO ${url}`)
}
