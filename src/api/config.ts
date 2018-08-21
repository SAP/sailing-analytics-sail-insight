import Logger from 'helpers/Logger'


let apiRoot = 'https://d-labs.sapsailing.com'
const ApiSuffix = '/sailingserver/api/v1'


export const getUrl = (path: string) => `${apiRoot}${ApiSuffix}${path}`

export const setApiRoot = (url: string) => {
  apiRoot = url
  Logger.debug(`SET TO ${url}`)
}
